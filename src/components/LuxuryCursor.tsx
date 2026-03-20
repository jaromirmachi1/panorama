import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export function LuxuryCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [enabled, setEnabled] = useState(false)
  const hoverRef = useRef(false)

  useEffect(() => {
    const finePointer = window.matchMedia?.('(pointer:fine)').matches ?? false
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    setEnabled(finePointer && !reduce)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      ringRef.current?.style.setProperty('--x', `${x}px`)
      ringRef.current?.style.setProperty('--y', `${y}px`)
    }

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      const el = t.closest?.('[data-cursor="hover"]') as HTMLElement | null
      hoverRef.current = Boolean(el)
      ringRef.current?.style.setProperty('opacity', hoverRef.current ? '0.8' : '0.45')
      ringRef.current?.style.setProperty('--s', hoverRef.current ? '1.2' : '1')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <Ring ref={ringRef} aria-hidden="true" />
    </>
  )
}

const Ring = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  --x: -9999px;
  --y: -9999px;
  --s: 1;
  transform: translate3d(var(--x), var(--y), 0) translate(-50%, -50%) scale(var(--s));
  z-index: 59;
  pointer-events: none;
  opacity: 0.45;
  mix-blend-mode: difference;
`

