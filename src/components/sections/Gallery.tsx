import { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from '../../lib/gsap'
import { images } from '../../content/images'
import { Container, Section } from '../Section'
import { Eyebrow, H2 } from '../TextBlock'

export function Gallery() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return

      const items = gsap.utils.toArray<HTMLElement>('[data-gallery-item]', root)
      items.forEach((item) => {
        const img = item.querySelector('img')
        if (!img) return

        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 6,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )

        gsap.fromTo(
          item,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              once: true,
            },
          },
        )
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <Section ref={rootRef} tone="dark" aria-label="Galerie" id="realisations">
      <Container>
        <Head>
          <Eyebrow>Galerie</Eyebrow>
          <H2>Světlo v pohybu</H2>
        </Head>
      </Container>

      <Rail>
        {images.gallery.map((img) => (
          <Item key={img.src} data-gallery-item>
            <Img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            <Shade aria-hidden="true" />
          </Item>
        ))}
      </Rail>
    </Section>
  )
}

const Head = styled.div`
  margin-bottom: clamp(26px, 4vw, 46px);
`

const Rail = styled.div`
  display: grid;
  gap: clamp(18px, 2.6vw, 28px);
`

const Item = styled.figure`
  margin: 0;
  position: relative;
  height: clamp(520px, 78vh, 820px);
  overflow: hidden;
  border-radius: 22px;
  width: min(1400px, calc(100% - 2 * 28px));
  margin-left: auto;
  margin-right: auto;
  background: rgba(255, 255, 255, 0.05);
`

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  filter: saturate(0.96) contrast(1.02);
`

const Shade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.62));
  pointer-events: none;
`

