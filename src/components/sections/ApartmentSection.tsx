import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { gsap } from '../../lib/gsap'
import flatsJson from '../../content/flats.json'
import { apartmentImages } from '../../content/apartmentImages'

type Flat = {
  id: string
  floor: number
  sizeM2: number
  priceKc: number
}

type Building = {
  id: 'A' | 'B'
  label: string
  apartments: Flat[]
}

type FlatsData = {
  buildings: Building[]
}

type FlatWithBuilding = Flat & { buildingId: Building['id'] }
type Hovered = FlatWithBuilding | null

const flatsData = flatsJson as unknown as FlatsData

function formatKc(value: number) {
  return `${new Intl.NumberFormat('cs-CZ').format(value)} Kč`
}

export function ApartmentSection() {
  const rootRef = useRef<HTMLElement | null>(null)
  const viewerRef = useRef<HTMLDivElement | null>(null)

  const baseImgRef = useRef<HTMLImageElement | null>(null)
  const aImgRef = useRef<HTMLImageElement | null>(null)
  const bImgRef = useRef<HTMLImageElement | null>(null)

  const [hovered, setHovered] = useState<Hovered>(null)

  // Total apartments per page (across both buildings)
  const PAGE_SIZE = 12
  const [page, setPage] = useState(1)

  const allFlats = useMemo(() => {
    const out: FlatWithBuilding[] = []
    flatsData.buildings.forEach((b) => {
      b.apartments.forEach((apt) => {
        out.push({
          ...apt,
          buildingId: b.id,
        })
      })
    })
    return out
  }, [])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(allFlats.length / PAGE_SIZE))
  }, [allFlats.length])

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages])

  const visibleFlats = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return allFlats.slice(start, end)
  }, [allFlats, page])

  const visibleIds = useMemo(() => new Set(visibleFlats.map((f) => f.id)), [visibleFlats])

  useEffect(() => {
    if (!hovered) return
    if (!visibleIds.has(hovered.id)) setHovered(null)
  }, [hovered, visibleIds])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)

      // Scroll in animations
      gsap.fromTo(
        q('[data-flat-row]'),
        { opacity: 0, x: -8 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: root,
            start: 'top 78%',
            once: true,
          },
        },
      )

      gsap.fromTo(
        viewerRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.12,
          scrollTrigger: {
            trigger: root,
            start: 'top 75%',
            once: true,
          },
        },
      )

      // Subtle parallax
      if (viewerRef.current) {
        gsap.to(viewerRef.current, {
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Initial viewer layers
      gsap.set(baseImgRef.current, { opacity: 1, scale: 1, filter: 'brightness(1) contrast(1)' })
      gsap.set(aImgRef.current, { opacity: 0, scale: 1, filter: 'brightness(1) contrast(1)' })
      gsap.set(bImgRef.current, { opacity: 0, scale: 1, filter: 'brightness(1) contrast(1)' })
    })

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    if (!hovered) {
      gsap.to(baseImgRef.current, {
        opacity: 1,
        scale: 1,
        filter: 'brightness(1) contrast(1)',
        duration: 0.6,
        ease: 'power3.out',
      })
      gsap.to([aImgRef.current, bImgRef.current], {
        opacity: 0,
        scale: 1,
        filter: 'brightness(1) contrast(1)',
        duration: 0.6,
        ease: 'power3.out',
      })
      return
    }

    const isA = hovered.buildingId === 'A'
    const active = isA ? aImgRef.current : bImgRef.current
    const inactive = isA ? bImgRef.current : aImgRef.current

    gsap.to(baseImgRef.current, {
      opacity: 0,
      scale: 1.01,
      filter: 'brightness(0.98) contrast(1)',
      duration: 0.5,
      ease: 'power3.out',
    })

    gsap.to(inactive, {
      opacity: 0,
      scale: 1,
      filter: 'brightness(1) contrast(1)',
      duration: 0.55,
      ease: 'power3.out',
    })

    gsap.to(active, {
      opacity: 1,
      scale: 1.05,
      filter: 'brightness(1.06) contrast(1.03)',
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [hovered])

  return (
    <Wrap ref={rootRef} id="apartments" aria-label="Výběr apartmánů">
      <Inner>
        <Left>
          <Head>
            <Eyebrow>Byty</Eyebrow>
            <H2>Aktuální dostupnost</H2>
          </Head>

          <ApartmentList aria-label="Seznam apartmánů">
            {flatsData.buildings.map((b) => {
              const visibleApartments = visibleFlats.filter(
                (f) => f.buildingId === b.id,
              )

              return (
                <ApartmentGroup key={b.id} aria-label={b.label} $building={b.id}>
                  <GroupTitle>{b.label}</GroupTitle>
                  {visibleApartments.length > 0 && (
                    <GroupRows>
                      {visibleApartments.map((apt) => {
                        const floorLabel = `Podlaží ${apt.floor}`
                        return (
                          <ApartmentRow
                            key={apt.id}
                            type="button"
                            data-cursor="hover"
                            data-flat-row
                            $isHovered={hovered?.id === apt.id && hovered?.buildingId === b.id}
                            onMouseEnter={() =>
                              setHovered({
                                ...apt,
                                buildingId: b.id,
                              })
                            }
                            onMouseLeave={() => setHovered(null)}
                            aria-label={`${apt.id}, ${apt.sizeM2} m², ${formatKc(apt.priceKc)}`}
                          >
                            <LeftCol>
                              <AptId>{apt.id}</AptId>
                              <FloorTag>{floorLabel}</FloorTag>
                            </LeftCol>
                            <Size>{apt.sizeM2.toFixed(1)} m²</Size>
                            <Price>{formatKc(apt.priceKc)}</Price>
                          </ApartmentRow>
                        )
                      })}
                    </GroupRows>
                  )}
                </ApartmentGroup>
              )
            })}
          </ApartmentList>

          <Pagination aria-label="Stránkování">
            <PageButton
              type="button"
              data-cursor="hover"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              ←
            </PageButton>
            <PageLabel>
              {page} / {totalPages}
            </PageLabel>
            <PageButton
              type="button"
              data-cursor="hover"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              →
            </PageButton>
          </Pagination>
        </Left>

        <Right>
          <ImageViewer ref={viewerRef} aria-hidden="true" data-viewer>
            <Layer>
              <LayerImg
                ref={baseImgRef}
                src={apartmentImages.base.src}
                alt={apartmentImages.base.alt}
                loading="lazy"
                decoding="async"
              />
            </Layer>
            <Layer>
              <LayerImg
                ref={aImgRef}
                src={apartmentImages.buildingA.src}
                alt={apartmentImages.buildingA.alt}
                loading="lazy"
                decoding="async"
              />
            </Layer>
            <Layer>
              <LayerImg
                ref={bImgRef}
                src={apartmentImages.buildingB.src}
                alt={apartmentImages.buildingB.alt}
                loading="lazy"
                decoding="async"
              />
            </Layer>
          </ImageViewer>
          <HoverInfo>
            <InfoBlock $mode={hovered ? 'active' : 'default'}>
              {hovered ? (
                <>
                  <InfoTitle>{hovered.id}</InfoTitle>
                  <InfoLine>
                    {`Podlaží ${hovered.floor}`} • {hovered.sizeM2.toFixed(1)} m²
                  </InfoLine>
                </>
              ) : (
                <>
                  <InfoTitle>Vyberte podlaží</InfoTitle>
                  <InfoLine>Hoverem přepnete zvýrazněné fotografie</InfoLine>
                </>
              )}
            </InfoBlock>
          </HoverInfo>
        </Right>
      </Inner>
    </Wrap>
  )
}

const Wrap = styled.section`
  width: 100%;
  background: #0a0a0a;
  color: #f5f3ef;
  padding: clamp(72px, 7vw, 120px) 0;
  overflow: hidden;
`

const Inner = styled.div`
  width: min(1320px, calc(100% - 2 * clamp(18px, 4vw, 38px)));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.4fr 0.6fr;
  gap: clamp(22px, 5vw, 72px);

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

const Left = styled.div`
  padding-top: 4px;
`

const Head = styled.div`
  margin-bottom: 26px;
`

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  opacity: 0.64;
  margin-bottom: 14px;
`

const H2 = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: -0.01em;
  font-size: clamp(34px, 4.2vw, 58px);
  line-height: 1.0;
`

const ApartmentList = styled.div`
  display: grid;
  gap: 18px;
`

const ApartmentGroup = styled.div<{ $building: string }>`
  display: grid;
  gap: 10px;
`

const GroupTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: 0.02em;
  font-size: 18px;
  color: rgba(245, 243, 239, 0.92);
`

const GroupRows = styled.div`
  border-top: 1px solid rgba(221, 221, 221, 0.55);
`

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  margin-top: 0;
`

const PageButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: rgba(245, 243, 239, 0.9);
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0.78;
  transition: opacity 450ms ease;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }

  &:not(:disabled):hover {
    opacity: 1;
  }
`

const PageLabel = styled.div`
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.9;
`

const ApartmentRow = styled.button<{ $isHovered: boolean }>`
  appearance: none;
  border: none;
  background: transparent;
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 14px 0 12px;
  display: grid;
  grid-template-columns: 120px 1fr 260px;
  align-items: center;
  justify-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(221, 221, 221, 0.55);

  cursor: pointer;
  color: rgba(245, 243, 239, 0.92);

  /* Background fill animation */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #f5f3ef;
    transform: scaleY(0);
    transform-origin: center;
    transition: transform 750ms cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
    transition:
      color 600ms ease,
      opacity 600ms ease,
      transform 600ms ease;
  }

  opacity: 0.82;
  transform: translateX(0);
  transition:
    opacity 450ms ease,
    transform 600ms ease,
    border-bottom-color 750ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    opacity: 1;
    transform: translateX(5px);
    color: rgba(10, 10, 10, 0.92);
    border-bottom-color: rgba(10, 10, 10, 0.16);
  }

  &:hover::before,
  &:focus-visible::before {
    transform: scaleY(1);
  }

  &:focus-visible {
    outline: none;
    opacity: 1;
    transform: translateX(5px);
    color: rgba(10, 10, 10, 0.92);
    border-bottom-color: rgba(10, 10, 10, 0.16);
  }
`

const LeftCol = styled.div`
  display: grid;
  gap: 8px;
  justify-items: center;
  text-align: center;
`

const AptId = styled.div`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: 0.02em;
  font-size: 14px;
  line-height: 1.1;
`

const FloorTag = styled.div`
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 350ms ease,
    transform 450ms ease;

  ${ApartmentRow}:hover & {
    opacity: 0.62;
    transform: translateY(0);
  }
`

const Size = styled.div`
  font-size: 13px;
  letter-spacing: 0.01em;
  opacity: 0.78;
  text-align: center;
`

const Price = styled.div`
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.01em;
  opacity: 0.82;
  align-self: flex-start;
  margin-top: -6px;
`

const Right = styled.div`
  position: relative;
  min-height: 520px;

  @media (max-width: 980px) {
    min-height: 420px;
  }
`

const ImageViewer = styled.div`
  position: sticky;
  top: 18px;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const Layer = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
`

const LayerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.02);
  will-change: transform, opacity, filter;
  filter: brightness(1) contrast(1);
`

const HoverInfo = styled.div`
  position: absolute;
  z-index: 3;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px clamp(0px, 1vw, 22px);
  pointer-events: none;
  color: rgba(245, 243, 239, 0.92);
`

const InfoBlock = styled.div<{ $mode: 'default' | 'active' }>`
  opacity: ${({ $mode }) => ($mode === 'active' ? 1 : 1)};
  transition: opacity 450ms ease;
`

const InfoTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: 0.02em;
  font-size: 18px;
`

const InfoLine = styled.div`
  margin-top: 8px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.72;
`

