import { type HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

type Tone = 'dark' | 'light'

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: Tone
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { tone = 'dark', children, ...rest },
  ref,
) {
  return (
    <Wrap ref={ref} $tone={tone} {...rest}>
      {children}
    </Wrap>
  )
})

const Wrap = styled.section<{ $tone: Tone }>`
  position: relative;
  padding: clamp(80px, 10vw, 140px) 0;
  background: ${({ theme, $tone }) =>
    $tone === 'dark' ? theme.colors.ink : theme.colors.paper};
  color: ${({ $tone }) => ($tone === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(10,10,10,0.9)')};
`

export const Container = styled.div`
  width: min(${({ theme }) => theme.layout.max}px, calc(100% - 2 * ${({ theme }) => theme.layout.gutter}px));
  margin: 0 auto;
`

