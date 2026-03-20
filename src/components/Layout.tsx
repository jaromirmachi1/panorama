import { type ReactNode } from 'react'
import styled from 'styled-components'
import { useLenis } from '../hooks/useLenis'
import { LuxuryCursor } from './LuxuryCursor'

type LayoutProps = {
  children: ReactNode
  ariaHidden?: boolean
}

export function Layout({ children, ariaHidden }: LayoutProps) {
  useLenis({ enabled: true })

  return (
    <Shell aria-hidden={ariaHidden}>
      <Grain aria-hidden="true" />
      <LuxuryCursor />
      {children}
    </Shell>
  )
}

const Shell = styled.main`
  position: relative;
  isolation: isolate;
`

const Grain = styled.div`
  pointer-events: none;
  position: fixed;
  inset: -40%;
  z-index: 50;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  background-size: 180px 180px;
  transform: translate3d(0, 0, 0);
  animation: grainShift 10s steps(2) infinite;

  @keyframes grainShift {
    0% { transform: translate3d(-2%, -2%, 0); }
    50% { transform: translate3d(2%, 1%, 0); }
    100% { transform: translate3d(-1%, 2%, 0); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

