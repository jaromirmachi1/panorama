import { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from '../../lib/gsap'
import { Container, Section } from '../Section'

export function ContactCTA() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return
      const q = gsap.utils.selector(root)

      gsap.fromTo(
        q('[data-cta]'),
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: root,
            start: 'top 78%',
            once: true,
          },
        },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <Section ref={rootRef} tone="dark" aria-label="Kontakt" id="contact">
      <Container>
        <Center>
          <Label data-cta>Kontakt</Label>
          <Title data-cta>Máte zájem o byt?</Title>
          <Copy data-cta>
            Napište nám. Pošleme dostupnost, půdorysy a standardy v jednom elegantním balíčku.
          </Copy>
          <Actions data-cta>
            <Button data-cursor="hover" href="mailto:info@panorama-zabiny.cz">
              Nezávazně poptat
            </Button>
            <Ghost data-cursor="hover" href="#top">
              Zpět nahoru
            </Ghost>
          </Actions>
        </Center>
      </Container>
    </Section>
  )
}

const Center = styled.div`
  text-align: center;
  padding: clamp(10px, 3vw, 24px) 0;
`

const Label = styled.div`
  font-size: 12px;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.68);
`

const Title = styled.h2`
  margin: 18px 0 14px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: clamp(34px, 4.5vw, 64px);
  line-height: 1.03;
  color: rgba(255, 255, 255, 0.92);
`

const Copy = styled.p`
  margin: 0 auto;
  max-width: 70ch;
  font-size: 15px;
  line-height: 1.9;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.74);
`

const Actions = styled.div`
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  padding: 0 22px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 12px;
  transition: transform 700ms ease, background 700ms ease, border-color 700ms ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.32);
  }
`

const Ghost = styled(Button)`
  background: transparent;
  border-color: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.78);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.24);
  }
`

