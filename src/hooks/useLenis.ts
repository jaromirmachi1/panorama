import { useEffect, useMemo, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

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
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      // Lower lerp = smoother, more “weighted” scroll (slower catch-up to target).
      lerp: 0.055,
      smoothWheel: true,
      // Slightly softer wheel steps so motion feels less jumpy.
      wheelMultiplier: 0.88,
      touchMultiplier: 0.95,
      syncTouch: false,
      autoResize: true,
    })
    lenisRef.current = lenis

    // One ScrollTrigger pass per frame, after Lenis advances — avoids running
    // ScrollTrigger.update on every Lenis scroll emit (extra work + micro-hitches).
    const onTick = (time: number) => {
      lenis.raf(time * 1000)
      ScrollTrigger.update()
    }
    gsap.ticker.add(onTick)
    // Default lag smoothing helps when frames slip; lagSmoothing(0) can amplify stutter.

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    // Ensure ScrollTrigger measures after Lenis is ready
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled, prefersReducedMotion])

  return lenisRef
}

