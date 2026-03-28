import { useEffect, useMemo, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { isDesktopSafariNativeScroll, isWebKitWithoutBlink } from '../lib/webkit'

/** Lenis off at this width and below (mobile + tablet); aligns with App.css / index.css. */
const LENIS_DISABLED_MAX_WIDTH_PX = 1024

type UseLenisOptions = {
  enabled?: boolean
}

export function useLenis({ enabled = true }: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null)

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  useEffect(() => {
    if (!enabled) return

    const webKit = isWebKitWithoutBlink(navigator.userAgent)
    document.documentElement.toggleAttribute('data-webkit', webKit)

    if (prefersReducedMotion) {
      return () => document.documentElement.removeAttribute('data-webkit')
    }

    const narrowMq = window.matchMedia(
      `(max-width: ${LENIS_DISABLED_MAX_WIDTH_PX}px)`,
    )

    let lenis: Lenis | null = null
    let onTick: ((time: number) => void) | null = null

    const stopLenis = () => {
      if (onTick) {
        gsap.ticker.remove(onTick)
        onTick = null
      }
      if (lenis) {
        lenis.destroy()
        lenis = null
      }
      lenisRef.current = null
    }

    const startLenis = () => {
      lenis = new Lenis({
        // ~0.075–0.09: smooth frame-to-frame blend (too-low lerp feels sticky, not silky).
        lerp: 0.082,
        smoothWheel: true,
        wheelMultiplier: 0.72,
        touchMultiplier: 0.95,
        syncTouch: false,
        autoResize: true,
      })
      lenisRef.current = lenis

      // One ScrollTrigger pass per frame, after Lenis advances — avoids running
      // ScrollTrigger.update on every Lenis scroll emit (extra work + micro-hitches).
      onTick = (time: number) => {
        lenis!.raf(time * 1000)
        ScrollTrigger.update()
      }
      gsap.ticker.add(onTick)
    }

    let lastInnerWidth = window.innerWidth

    const onWindowResize = () => {
      const w = window.innerWidth
      // Height-only changes (iOS Safari chrome, Android toolbar) must not run refresh —
      // ScrollTrigger.refresh() is expensive and causes visible scroll jank.
      if (w === lastInnerWidth) return
      lastInnerWidth = w
      ScrollTrigger.refresh()
    }

    const shouldUseLenis = () =>
      !narrowMq.matches && !isDesktopSafariNativeScroll()

    const syncLenisToViewport = () => {
      const useLenisHere = shouldUseLenis()
      if (useLenisHere && !lenis) {
        startLenis()
      } else if (!useLenisHere && lenis) {
        stopLenis()
      }
      lastInnerWidth = window.innerWidth
      ScrollTrigger.refresh()
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    syncLenisToViewport()
    window.addEventListener('resize', onWindowResize)
    narrowMq.addEventListener('change', syncLenisToViewport)

    return () => {
      window.removeEventListener('resize', onWindowResize)
      narrowMq.removeEventListener('change', syncLenisToViewport)
      stopLenis()
      document.documentElement.removeAttribute('data-webkit')
    }
  }, [enabled, prefersReducedMotion])

  return lenisRef
}
