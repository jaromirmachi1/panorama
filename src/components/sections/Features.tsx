import { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from '../../lib/gsap'
import { Container, Section } from '../Section'
import { Eyebrow, H2, P } from '../TextBlock'

import { useLang } from '../../i18n/LanguageContext'
import { t } from '../../i18n/dictionary'

export function Features() {
  const rootRef = useRef<HTMLElement | null>(null)
  const { lang } = useLang()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return

      const cards = gsap.utils.toArray<HTMLElement>('[data-feature]', root)
      gsap.fromTo(
        cards,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: root,
            start: 'top 75%',
            once: true,
          },
        },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <Section
      ref={rootRef}
      tone="light"
      aria-label={t.features.eyebrow[lang]}
      id="features"
    >
      <Container>
        <Head>
          <Eyebrow>{t.features.eyebrow[lang]}</Eyebrow>
          <H2>{t.features.title[lang]}</H2>
          <Lead>
            {t.features.lead[lang]}
          </Lead>
        </Head>

        <Grid>
          {[
            t.features.cards.locality,
            t.features.cards.architecture,
            t.features.cards.quality,
            t.features.cards.investment,
          ].map((f) => (
            <Card key={f.title[lang]} data-feature>
              <CardTitle>{f.title[lang]}</CardTitle>
              <CardBody>{f.body[lang]}</CardBody>
              <Line aria-hidden="true" />
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

const Head = styled.div`
  color: rgba(10, 10, 10, 0.9);
  margin-bottom: clamp(24px, 4vw, 46px);
`

const Lead = styled(P)`
  max-width: 68ch;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  position: relative;
  padding: 24px 22px 22px;
  border-radius: 18px;
  background: rgba(10, 10, 10, 0.04);
  color: rgba(10, 10, 10, 0.9);
  overflow: hidden;
  transform: translateZ(0);
  transition: transform 600ms ease, background 600ms ease;

  &:hover {
    transform: translateY(-6px);
    background: rgba(10, 10, 10, 0.06);
  }
`

const CardTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 20px;
  margin-bottom: 10px;
`

const CardBody = styled.div`
  font-size: 14px;
  line-height: 1.75;
  letter-spacing: 0.02em;
  opacity: 0.82;
  padding-right: 8px;
`

const Line = styled.div`
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 16px;
  height: 1px;
  background: rgba(10, 10, 10, 0.12);
  transform: scaleX(0.6);
  transform-origin: left;
  transition: transform 700ms ease, opacity 700ms ease;
  opacity: 0.6;

  ${Card}:hover & {
    transform: scaleX(1);
    opacity: 0.9;
  }
`

