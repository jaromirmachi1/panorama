import { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap, stOnce } from '../../lib/gsap'
import { images } from '../../content/images'
import { Container, Section } from '../Section'
import { Eyebrow, H2, P } from '../TextBlock'
import { ImageBlock } from '../ImageBlock'

export function About() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return
      const q = gsap.utils.selector(root)

      gsap.fromTo(
        q('[data-reveal]'),
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 1.05,
          ease: 'power3.out',
          stagger: 0.12,
          force3D: true,
          scrollTrigger: stOnce(root, 'top 75%'),
        },
      )

      const img = q('[data-about-parallax] img')[0] as HTMLImageElement | undefined
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.06, opacity: 0.94 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: stOnce(root, 'top 72%'),
          },
        )
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <Section ref={rootRef} tone="light" id="about">
      <Container>
        <Grid>
          <Left>
            <Eyebrow data-reveal>Koncept</Eyebrow>
            <H2 data-reveal>Prostor, světlo, ticho.</H2>
            <P data-reveal>
              Exkluzivní rezidenční projekt navržený pro moderní životní styl. Precizní
              architektura, čisté linie a promyšlené detaily vytvářejí nadčasový domov.
            </P>
            <Meta data-reveal>
              <MetaItem>
                <MetaLabel>Standard</MetaLabel>
                <MetaValue>prémiové materiály</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Atmosféra</MetaLabel>
                <MetaValue>minimalistická, klidná</MetaValue>
              </MetaItem>
            </Meta>
          </Left>
          <Right data-reveal data-about-parallax>
            <ImageBlock src={images.about.src} alt={images.about.alt} sizes="(max-width: 900px) 100vw, 46vw" />
          </Right>
        </Grid>
      </Container>
    </Section>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: clamp(28px, 5vw, 80px);
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Left = styled.div`
  color: rgba(10, 10, 10, 0.9);
`

const Right = styled.div`
  height: clamp(360px, 52vw, 640px);

  & > figure {
    height: 100%;
  }
`

const Meta = styled.div`
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding-top: 22px;
  border-top: 1px solid rgba(10, 10, 10, 0.14);

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

const MetaItem = styled.div``

const MetaLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  opacity: 0.7;
`

const MetaValue = styled.div`
  margin-top: 8px;
  font-size: 15px;
  letter-spacing: 0.02em;
  opacity: 0.92;
`
