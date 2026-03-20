import { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from '../../lib/gsap'
import { images } from '../../content/images'

export function ProjectIntro() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return
      const q = gsap.utils.selector(root)

      gsap.set(q('[data-pi]'), { opacity: 0, y: 16 })
      gsap.set(q('[data-pi-img]'), { opacity: 0, y: 14, scale: 1.01 })

      gsap.to(q('[data-pi]'), {
        opacity: 1,
        y: 0,
        duration: 1.05,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          once: true,
        },
      })

      gsap.to(q('[data-pi-img]'), {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.15,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 75%',
          once: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <Wrap ref={rootRef} id="agency" aria-label="O projektu">
      <Ornament aria-hidden="true" />
      <Top>
        <Title data-pi>O&nbsp;projektu</Title>
        <TextCol data-pi>
          <Body>
            Panorama Žabiny je komorní rezidenční dům navržený s důrazem na proporce,
            světlo a akustický klid. Architektura pracuje s dlouhými liniemi, jemnými
            stíny a materiály v neutrálním spektru — tak, aby výhled a prostor byly
            tím hlavním.
          </Body>
          <Body>
            Standard bytů stojí na jednoduché myšlence: každodenní komfort bez okázalosti.
            Velkoformátová okna, čisté detaily, promyšlené dispozice a nadčasová paleta
            vytvářejí interiér, který neomrzí ani za deset let.
          </Body>
        </TextCol>
      </Top>

      <ImageFrame data-pi-img>
        <Image
          src={images.hero.src}
          alt="Vizualizace projektu Panorama Žabiny"
          loading="lazy"
          decoding="async"
        />
      </ImageFrame>

      <Bottom data-pi>
        <Plus aria-hidden="true">+</Plus>
        <Meta>
          Komorní projekt v Žabinách, navržený pro klidné městské bydlení.
          <br />
          <Small>Brno • 2026 • 48 jednotek • energetický standard A</Small>
        </Meta>
      </Bottom>
    </Wrap>
  )
}

const Wrap = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.paper};
  color: rgba(10, 10, 10, 0.9);
  padding: clamp(70px, 9vw, 120px) clamp(18px, 4vw, 38px) clamp(80px, 10vw, 140px);
  overflow: hidden;
`

const Ornament = styled.div`
  position: absolute;
  inset: -30%;
  pointer-events: none;
  opacity: 0.55;
  background:
    radial-gradient(circle at 70% 30%, transparent 58%, rgba(10,10,10,0.08) 59%, transparent 60%),
    radial-gradient(circle at 78% 44%, transparent 66%, rgba(10,10,10,0.06) 67%, transparent 68%),
    radial-gradient(circle at 62% 56%, transparent 72%, rgba(10,10,10,0.05) 73%, transparent 74%);
`

const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: clamp(18px, 4vw, 56px);
  align-items: start;
  max-width: 1320px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 0.95;
  font-size: clamp(46px, 6.6vw, 104px);
`

const TextCol = styled.div`
  max-width: 62ch;
  padding-top: clamp(8px, 1.2vw, 18px);
`

const Body = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.85;
  letter-spacing: 0.01em;
  color: rgba(10, 10, 10, 0.78);

  & + & {
    margin-top: 18px;
  }
`

const ImageFrame = styled.figure`
  margin: clamp(28px, 5vw, 54px) auto 0;
  width: min(860px, 100%);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(10, 10, 10, 0.06);
  box-shadow: rgba(0, 0, 0, 0.18) 0 30px 60px -40px;
`

const Image = styled.img`
  display: block;
  width: 100%;
  height: auto;
  transform: scale(1.01);
  will-change: transform;
`

const Bottom = styled.div`
  max-width: 1320px;
  margin: 18px auto 0;
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 16px;
  align-items: end;
  padding-top: 22px;
`

const Plus = styled.div`
  font-size: 18px;
  line-height: 1;
  opacity: 0.75;
`

const Meta = styled.div`
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.6);
`

const Small = styled.span`
  display: inline-block;
  margin-top: 10px;
  opacity: 0.8;
  letter-spacing: 0.22em;
`

