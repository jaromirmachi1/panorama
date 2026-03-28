import { useLayoutEffect, useMemo, useRef, type SVGProps } from 'react'
import styled from 'styled-components'
import { gsap } from '../../lib/gsap'
import { Container, Section } from '../Section'
import { Eyebrow, H2, P } from '../TextBlock'

import { useLang } from '../../i18n/LanguageContext'
import { t } from '../../i18n/dictionary'

export function Features() {
  const rootRef = useRef<HTMLElement | null>(null)
  const { lang } = useLang()
  const address = 'Kroftova 2191/80, 679 04 Brno'
  const mapSrc = useMemo(
    () =>
      `https://www.google.com/maps?q=${encodeURIComponent(
        address,
      )}&output=embed`,
    [],
  )

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
      style={{ background: '#ffffff' }}
    >
      <Container>
        <Head>
          <Eyebrow>{t.features.eyebrow[lang]}</Eyebrow>
          <H2>{t.features.title[lang]}</H2>
          <Lead>
            {t.features.lead[lang]}
          </Lead>
        </Head>

        <Main>
          <Grid>
            {[
              {
                icon: <PinIcon aria-hidden="true" />,
                ...t.features.cards.locality,
              },
              {
                icon: <BuildingIcon aria-hidden="true" />,
                ...t.features.cards.architecture,
              },
              {
                icon: <SparkIcon aria-hidden="true" />,
                ...t.features.cards.quality,
              },
              {
                icon: <CoinIcon aria-hidden="true" />,
                ...t.features.cards.investment,
              },
            ].map((f) => (
              <Card key={f.title[lang]} data-feature>
                <CardIconWrap>{f.icon}</CardIconWrap>
                <CardTitle>{f.title[lang]}</CardTitle>
                <CardBody>{f.body[lang]}</CardBody>
              </Card>
            ))}
          </Grid>

          <MapWrap>
            <MapFrame
              title={t.features.mapLabel[lang]}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSrc}
            />
            <MapMeta>
              <MapAddressPrimary>{t.features.mapAddress[lang]}</MapAddressPrimary>
              <MapLabelSecondary>{t.features.mapLabel[lang]}</MapLabelSecondary>
            </MapMeta>
          </MapWrap>
        </Main>
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
  grid-template-columns: 1fr;
  gap: 10px;
`

const Card = styled.div`
  position: relative;
  padding: 16px 16px 14px;
  border-radius: 0px;
  background: rgba(10, 10, 10, 0.02);
  color: rgba(10, 10, 10, 0.92);
  overflow: hidden;
  transform: translateZ(0);
  transition: transform 600ms ease, background 600ms ease;
  min-height: 118px;

  &:hover {
    transform: translateY(-6px);
    background: rgba(10, 10, 10, 0.04);
  }
`

const CardTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 16px;
  margin-bottom: 6px;
`

const CardBody = styled.div`
  font-size: 13px;
  line-height: 1.55;
  letter-spacing: 0.02em;
  opacity: 0.84;
  padding-right: 2px;
`

const CardIconWrap = styled.div`
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 2px;
  background: rgba(10, 10, 10, 0.03);
  margin-bottom: 10px;
  transition:
    transform 600ms ease,
    background 600ms ease,
    opacity 600ms ease;

  ${Card}:hover & {
    transform: translateY(-2px);
    background: rgba(232, 215, 176, 0.18);
  }
`

const BaseIcon = styled.svg`
  display: block;
  width: 14px;
  height: 14px;
  stroke: rgba(165, 135, 70, 0.92);
  fill: none;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
`

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon viewBox="0 0 24 24" {...props}>
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <path d="M12 10.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z" />
    </BaseIcon>
  )
}

function BuildingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon viewBox="0 0 24 24" {...props}>
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M9 20v-6h6v6" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </BaseIcon>
  )
}

function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon viewBox="0 0 24 24" {...props}>
      <path d="M12 2l1.4 5.2L18.6 9 13.4 10.4 12 15.6 10.6 10.4 5.4 9l5.2-1.8L12 2z" />
      <path d="M19 14l.8 2.6L22 17.4l-2.2.8L19 21l-.8-2.8L16 17.4l2.2-.8L19 14z" />
    </BaseIcon>
  )
}

function CoinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon viewBox="0 0 24 24" {...props}>
      <path d="M20 12c0 4-4 6-8 6s-8-2-8-6 4-6 8-6 8 2 8 6z" />
      <path d="M4 12c0 4 4 6 8 6s8-2 8-6" />
      <path d="M12 8v8" />
    </BaseIcon>
  )
}

const Main = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(18px, 4vw, 42px);
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`

const MapWrap = styled.div`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(10, 10, 10, 0.12);
  padding: 0;
`

const MapFrame = styled.iframe`
  width: 100%;
  height: 340px;
  border: 0;
  display: block;
`

const MapMeta = styled.div`
  padding: clamp(18px, 2.2vw, 22px) clamp(20px, 2.4vw, 24px)
    clamp(20px, 2.4vw, 24px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(10, 10, 10, 0.1);
  background: rgba(255, 255, 255, 1);
`

/* Serif primary (like “Vyberte podlaží”) — address on light section */
const MapAddressPrimary = styled.div`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 400;
  font-size: clamp(17px, 1.45vw, 22px);
  line-height: 1.38;
  letter-spacing: 0.02em;
  color: rgba(22, 22, 20, 0.94);
`

/* Sans secondary, all caps + wide tracking (like “HOVEREM…”) */
const MapLabelSecondary = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  line-height: 1.5;
  color: rgba(110, 108, 102, 0.92);
`

