import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { gsap } from "../../lib/gsap";
import flatsJson from "../../content/flats.json";
import {
  apartmentImages,
  getFloorPlanAlt,
  getFloorPlanSrc,
} from "../../content/apartmentImages";
import { useLang, type Lang } from "../../i18n/LanguageContext";
import { t } from "../../i18n/dictionary";
import { FlatInquiryModal } from "../FlatInquiryModal";
import { IoArrowForwardSharp } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";

type FlatStatus = "available" | "reserved" | "sold";

type Flat = {
  id: string;
  floor: number;
  sizeM2: number;
  priceKc: number;
  status: FlatStatus;
};

type Building = {
  id: "A" | "B";
  label: string;
  apartments: Flat[];
};

type FlatsData = {
  buildings: Building[];
};

type FlatWithBuilding = Flat & { buildingId: Building["id"] };
type Hovered = FlatWithBuilding | null;

const flatsData = flatsJson as unknown as FlatsData;

function formatKc(value: number) {
  return `${new Intl.NumberFormat("cs-CZ").format(value)} Kč`;
}

function flatStatusLabel(status: FlatStatus, lang: Lang): string {
  switch (status) {
    case "available":
      return t.apartments.statusAvailable[lang];
    case "reserved":
      return t.apartments.statusReserved[lang];
    case "sold":
      return t.apartments.statusSold[lang];
    default:
      return t.apartments.statusAvailable[lang];
  }
}

export function ApartmentSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const baseImgRef = useRef<HTMLImageElement | null>(null);
  /** Jedna vrstva patrového plánu — mění se podle podlaží (a budovy v alt). */
  const floorPlanImgRef = useRef<HTMLImageElement | null>(null);
  const listGroupRef = useRef<HTMLDivElement | null>(null);
  /** Set only from pagination arrows so list motion matches next/prev. */
  const pageNavDirectionRef = useRef<"next" | "prev" | null>(null);
  const skipListIntroRef = useRef(true);

  const [hovered, setHovered] = useState<Hovered>(null);
  const [selectedFlat, setSelectedFlat] = useState<FlatWithBuilding | null>(
    null,
  );
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const { lang } = useLang();
  // Total apartments per page
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const allFlats = useMemo(() => {
    return flatsData.buildings.flatMap((b) =>
      b.apartments.map((apt) => ({
        ...apt,
        buildingId: b.id,
      })),
    );
  }, []);

  const floorNumbers = useMemo(() => {
    const s = new Set<number>();
    allFlats.forEach((f) => s.add(f.floor));
    return Array.from(s).sort((a, b) => a - b);
  }, [allFlats]);

  const [activeFloor, setActiveFloor] = useState<number>(1);

  const safeActiveFloor = floorNumbers.includes(activeFloor)
    ? activeFloor
    : (floorNumbers[0] ?? 1);

  useEffect(() => {
    if (!floorNumbers.includes(activeFloor)) {
      setActiveFloor(floorNumbers[0] ?? 1);
    }
  }, [floorNumbers, activeFloor]);

  useEffect(() => {
    setPage(1);
    setHovered(null);
    setInquiryOpen(false);
  }, [activeFloor]);

  const flatsOnFloor = useMemo(
    () => allFlats.filter((f) => f.floor === safeActiveFloor),
    [allFlats, safeActiveFloor],
  );

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(flatsOnFloor.length / PAGE_SIZE));
  }, [flatsOnFloor.length]);

  const safePage = useMemo(() => {
    return Math.min(Math.max(1, page), totalPages);
  }, [page, totalPages]);

  const visibleFlats = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return flatsOnFloor.slice(start, end);
  }, [flatsOnFloor, safePage]);

  const defaultBuildingId = allFlats[0]?.buildingId ?? "A";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      // Scroll in animations
      gsap.fromTo(
        q("[data-flat-row]"),
        { opacity: 0, x: -8 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.05,
          force3D: true,
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        viewerRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.12,
          force3D: true,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            once: true,
          },
        },
      );

      gsap.set(baseImgRef.current, {
        opacity: 1,
        scale: 1,
      });
      gsap.set(floorPlanImgRef.current, {
        opacity: 0,
        scale: 1,
      });
    });

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const el = listGroupRef.current;
    if (!el) return;

    if (skipListIntroRef.current) {
      skipListIntroRef.current = false;
      return;
    }

    const dir = pageNavDirectionRef.current;
    pageNavDirectionRef.current = null;

    gsap.killTweensOf(el);

    if (dir === "next") {
      gsap.fromTo(
        el,
        { opacity: 0.78, x: 12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.78,
          ease: "power3.out",
          overwrite: true,
        },
      );
    } else if (dir === "prev") {
      gsap.fromTo(
        el,
        { opacity: 0.78, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.78,
          ease: "power3.out",
          overwrite: true,
        },
      );
    } else {
      gsap.fromTo(
        el,
        { opacity: 0.88, y: 4 },
        {
          opacity: 1,
          y: 0,
          duration: 0.52,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }
  }, [safePage, safeActiveFloor]);

  useLayoutEffect(() => {
    const base = baseImgRef.current;
    const floorPlan = floorPlanImgRef.current;
    if (base || floorPlan) {
      gsap.killTweensOf([base, floorPlan]);
    }

    if (!hovered) {
      gsap.to(baseImgRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        force3D: true,
        overwrite: "auto",
      });
      gsap.to(floorPlanImgRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        force3D: true,
        overwrite: "auto",
      });
      return;
    }

    const nextSrc = getFloorPlanSrc(hovered.floor);
    const nextAlt = getFloorPlanAlt(hovered.floor, hovered.buildingId, lang);
    if (floorPlanImgRef.current) {
      floorPlanImgRef.current.src = nextSrc;
      floorPlanImgRef.current.alt = nextAlt;
    }

    gsap.to(baseImgRef.current, {
      opacity: 0,
      scale: 1.02,
      duration: 0.5,
      ease: "power3.out",
      force3D: true,
      overwrite: "auto",
    });

    gsap.to(floorPlanImgRef.current, {
      opacity: 1,
      scale: 1.05,
      duration: 0.6,
      ease: "power3.out",
      force3D: true,
      overwrite: "auto",
    });
  }, [hovered, lang]);

  return (
    <Wrap
      ref={rootRef}
      id="apartments"
      aria-label={t.apartments.title[lang]}
      data-selected-flat={selectedFlat?.id ?? ""}
    >
      <Inner>
        <Left>
          <Head>
            <Eyebrow>{t.apartments.eyebrow[lang]}</Eyebrow>
            <H2>{t.apartments.title[lang]}</H2>
          </Head>

          <FloorTabs aria-label={t.apartments.floorPickerAria[lang]}>
            {floorNumbers.map((f) => (
              <FloorTabButton
                key={f}
                type="button"
                data-cursor="hover"
                $active={safeActiveFloor === f}
                aria-pressed={safeActiveFloor === f}
                onClick={() => setActiveFloor(f)}
              >
                {t.apartments.floorTabWord[lang]} {f}
              </FloorTabButton>
            ))}
          </FloorTabs>

          <ApartmentList aria-label={t.apartments.listAria[lang]}>
            <GroupRows ref={listGroupRef}>
              {visibleFlats.map((apt) => {
                const sold = apt.status === "sold";
                return (
                  <ApartmentRow
                    key={`${apt.buildingId}-${apt.id}`}
                    type="button"
                    data-cursor="hover"
                    data-flat-row
                    disabled={sold}
                    $sold={sold}
                    $isHovered={
                      hovered?.id === apt.id &&
                      hovered?.buildingId === apt.buildingId
                    }
                    onPointerEnter={() => setHovered(apt)}
                    onPointerLeave={() => setHovered(null)}
                    onClick={() => {
                      if (sold) return;
                      setSelectedFlat(apt);
                      setInquiryOpen(true);
                    }}
                    aria-label={`${apt.id}, ${flatStatusLabel(apt.status, lang)}, ${apt.sizeM2} m², ${formatKc(apt.priceKc)}`}
                  >
                    <AptMeta>
                      <LeftCol>
                        <AptId>{apt.id}</AptId>
                      </LeftCol>
                      <Size>{apt.sizeM2.toFixed(1)} m²</Size>
                    </AptMeta>
                    <StatusBadge $status={apt.status} aria-hidden="true">
                      {flatStatusLabel(apt.status, lang)}
                    </StatusBadge>
                    <Price>
                      <PriceRow>
                        {formatKc(apt.priceKc)}
                        <ArrowSlot aria-hidden="true">
                          <StandbyArrow size={16} />
                          <HoverArrow size={16} />
                        </ArrowSlot>
                      </PriceRow>
                    </Price>
                  </ApartmentRow>
                );
              })}
            </GroupRows>
          </ApartmentList>

          <Pagination aria-label={t.apartments.paginationAria[lang]}>
            <PageButton
              type="button"
              data-cursor="hover"
              onClick={() => {
                setHovered(null);
                setInquiryOpen(false);
                pageNavDirectionRef.current = "prev";
                setPage((p) => Math.max(1, p - 1));
              }}
              disabled={safePage <= 1}
            >
              ←
            </PageButton>
            <PageLabel>
              {safePage} / {totalPages}
            </PageLabel>
            <PageButton
              type="button"
              data-cursor="hover"
              onClick={() => {
                setHovered(null);
                setInquiryOpen(false);
                pageNavDirectionRef.current = "next";
                setPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={safePage >= totalPages}
            >
              →
            </PageButton>
          </Pagination>
        </Left>

        <Right>
          <ImageViewer ref={viewerRef} aria-hidden="true" data-viewer>
            <Layer $zIndex={1}>
              <LayerImg
                ref={baseImgRef}
                src={apartmentImages.base.src}
                alt={apartmentImages.base.alt}
                loading="lazy"
                decoding="async"
              />
            </Layer>
            <Layer $zIndex={2}>
              <LayerImg
                ref={floorPlanImgRef}
                src={getFloorPlanSrc(safeActiveFloor)}
                alt={getFloorPlanAlt(safeActiveFloor, defaultBuildingId, lang)}
                loading="lazy"
                decoding="async"
              />
            </Layer>
          </ImageViewer>
          <HoverInfo>
            <InfoBlock $mode={hovered ? "active" : "default"}>
              {hovered ? (
                <>
                  <InfoTitle>{hovered.id}</InfoTitle>
                  <InfoLine>{hovered.sizeM2.toFixed(1)} m²</InfoLine>
                </>
              ) : (
                <>
                  <InfoTitle>{t.apartments.infoDefaultTitle[lang]}</InfoTitle>
                  <InfoLine>{t.apartments.infoDefaultLine[lang]}</InfoLine>
                </>
              )}
            </InfoBlock>
          </HoverInfo>
        </Right>
      </Inner>

      {inquiryOpen && selectedFlat ? (
        <FlatInquiryModal
          flat={selectedFlat}
          buildingLabel={
            selectedFlat.buildingId === "A"
              ? t.apartments.buildingA[lang]
              : t.apartments.buildingB[lang]
          }
          lang={lang}
          onClose={() => {
            setInquiryOpen(false);
            setSelectedFlat(null);
          }}
        />
      ) : null}
    </Wrap>
  );
}

const Wrap = styled.section`
  width: 100%;
  background: #0a0a0a;
  color: #f5f3ef;
  padding: clamp(72px, 7vw, 120px) 0;
  overflow: hidden;
`;

const Inner = styled.div`
  width: min(1320px, calc(100% - 2 * clamp(18px, 4vw, 38px)));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.4fr 0.6fr;
  gap: clamp(22px, 5vw, 72px);
  min-width: 0;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  padding-top: 4px;
  min-width: 0;
  width: 100%;
`;

const Head = styled.div`
  margin-bottom: 26px;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  opacity: 0.64;
  margin-bottom: 14px;
`;

const H2 = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: -0.01em;
  font-size: clamp(34px, 4.2vw, 58px);
  line-height: 1;
`;

const FloorTabs = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
  padding: 6px 0 18px;
`;

const FloorTabButton = styled.button<{ $active: boolean }>`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;

  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;

  color: rgba(245, 243, 239, ${({ $active }) => ($active ? 0.98 : 0.7)});
  opacity: ${({ $active }) => ($active ? 1 : 0.82)};

  position: relative;
  transition:
    opacity 450ms ease,
    color 450ms ease,
    transform 450ms ease;

  &:hover {
    opacity: 1;
    color: rgba(245, 243, 239, 0.95);
    transform: translateY(-2px);
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 1px;
    background: rgba(232, 215, 176, ${({ $active }) => ($active ? 0.95 : 0.0)});
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0.08)});
    transform-origin: left;
    transition:
      opacity 450ms ease,
      transform 450ms ease,
      background 450ms ease;
  }
`;

const ApartmentList = styled.div`
  display: grid;
  gap: 18px;
  min-width: 0;
  width: 100%;
  overflow: hidden;
`;

const GroupRows = styled.div`
  border-top: 1px solid rgba(221, 221, 221, 0.55);
  min-width: 0;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  margin-top: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

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
  padding: 6px 10px;
  margin: -6px -10px;
  border-radius: 4px;
  transition:
    opacity 450ms ease,
    transform 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }

  &:not(:disabled):hover {
    opacity: 1;
  }

  &:not(:disabled):active {
    transform: scale(0.94);
    opacity: 1;
    background: rgba(232, 215, 176, 0.12);
    box-shadow: inset 0 0 0 1px rgba(232, 215, 176, 0.35);
  }
`;

const PageLabel = styled.div`
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.9;
`;

const ApartmentRow = styled.button<{ $isHovered: boolean; $sold?: boolean }>`
  appearance: none;
  border: none;
  background: transparent;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 14px 0 12px;
  display: grid;
  grid-template-columns: minmax(0, 1.85fr) minmax(104px, 1fr) minmax(0, 1.2fr);
  align-items: center;
  justify-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(221, 221, 221, 0.55);

  cursor: pointer;
  color: rgba(245, 243, 239, 0.92);

  @media (max-width: 980px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.2fr);
    grid-template-rows: auto auto;
    justify-items: center;
    align-items: center;
    row-gap: 8px;
    column-gap: 12px;
    padding-right: 2px;
  }

  ${({ $sold }) =>
    $sold &&
    css`
      cursor: not-allowed;
      opacity: 0.78;

      &:hover {
        transform: none;
        color: rgba(245, 243, 239, 0.88);
      }

      &:hover::before,
      &:focus-visible::before {
        transform: scaleY(0);
      }
    `}

  /* Background fill animation */
  &::before {
    content: "";
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

  &:hover:not(:disabled) {
    opacity: 1;
    transform: translateX(5px);
    color: rgba(10, 10, 10, 0.92);
    border-bottom-color: rgba(10, 10, 10, 0.16);
  }

  &:hover:not(:disabled)::before,
  &:focus-visible:not(:disabled)::before {
    transform: scaleY(1);
  }

  &:focus-visible:not(:disabled) {
    outline: none;
    opacity: 1;
    transform: translateX(5px);
    color: rgba(10, 10, 10, 0.92);
    border-bottom-color: rgba(10, 10, 10, 0.16);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span<{ $status: FlatStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
  white-space: nowrap;
  max-width: 100%;
  box-sizing: border-box;
  line-height: 1.2;

  @media (max-width: 980px) {
    grid-row: 1;
    grid-column: 3;
    justify-self: center;
    align-self: center;
    font-size: 8px;
    padding: 0 8px;
    min-height: 26px;
  }

  ${({ $status }) =>
    $status === "available" &&
    css`
      background: #f5f3ef;
      color: rgba(10, 10, 10, 0.9);
    `}

  ${({ $status }) =>
    $status === "reserved" &&
    css`
      background: rgba(232, 215, 176, 0.95);
      color: rgba(10, 10, 10, 0.92);
    `}

  ${({ $status }) =>
    $status === "sold" &&
    css`
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.48);
      color: rgba(245, 243, 239, 0.95);
    `}

  ${ApartmentRow}:hover:not(:disabled) & {
    ${({ $status }) =>
      $status === "available" &&
      css`
        background: #f5f3ef;
        color: rgba(10, 10, 10, 0.94);
        box-shadow: 0 0 0 1px rgba(10, 10, 10, 0.08);
      `}

    ${({ $status }) =>
      $status === "reserved" &&
      css`
        background: rgba(232, 215, 176, 1);
        color: rgba(10, 10, 10, 0.94);
      `}

    ${({ $status }) =>
      $status === "sold" &&
      css`
        border-color: rgba(10, 10, 10, 0.35);
        color: rgba(10, 10, 10, 0.9);
      `}
  }
`;

const AptMeta = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, 1.1fr) minmax(0, 0.75fr);
  align-items: center;
  justify-items: center;
  justify-self: stretch;
  gap: 10px;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 980px) {
    display: contents;
  }
`;

const LeftCol = styled.div`
  display: grid;
  gap: 8px;
  justify-items: center;
  text-align: center;
  min-width: 0;

  @media (max-width: 980px) {
    grid-row: 1 / span 2;
    grid-column: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    min-width: 0;
  }
`;

const AptId = styled.div`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: 0.02em;
  font-size: 16px;
  line-height: 1.15;

  @media (max-width: 980px) {
    font-size: 14px;
    letter-spacing: 0;
  }
`;

const Size = styled.div`
  font-size: 13px;
  letter-spacing: 0.01em;
  opacity: 0.78;
  text-align: center;
  min-width: 0;

  @media (max-width: 980px) {
    grid-row: 1 / span 2;
    grid-column: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    min-width: 0;
  }
`;

const Price = styled.div`
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.01em;
  opacity: 0.82;
  min-width: 0;

  @media (max-width: 980px) {
    grid-row: 2;
    grid-column: 3;
    justify-self: center;
    text-align: center;
    font-size: 12px;
    letter-spacing: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
`;

const PriceRow = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-width: 0;
  max-width: 100%;

  @media (max-width: 980px) {
    justify-content: center;
    gap: 8px;
  }
`;

const ArrowSlot = styled.span`
  position: relative;
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
`;

const StandbyArrow = styled(MdArrowOutward)`
  position: absolute;
  inset: 0;
  width: 16px;
  height: 16px;
  opacity: 1;
  transition: opacity 250ms ease;
  color: rgba(245, 243, 239, 0.92);

  ${ApartmentRow}:hover:not(:disabled) &,
  ${ApartmentRow}:focus-visible:not(:disabled) & {
    opacity: 0;
  }
`;

const HoverArrow = styled(IoArrowForwardSharp)`
  position: absolute;
  inset: 0;
  width: 16px;
  height: 16px;
  opacity: 0;
  transform: translateX(0) rotate(180deg);
  transition:
    opacity 250ms ease,
    transform 300ms ease;
  color: rgba(245, 243, 239, 0.92);

  ${ApartmentRow}:hover:not(:disabled) &,
  ${ApartmentRow}:focus-visible:not(:disabled) & {
    opacity: 1;
    transform: translateX(3px) rotate(180deg);
  }
`;

const Right = styled.div`
  position: relative;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 980px) {
    min-height: 0;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
  }
`;

const ImageViewer = styled.div`
  position: relative;
  width: min(660px, 100%);
  height: clamp(320px, 46vh, 560px);
  margin-top: 0px;
  overflow: hidden;

  @media (max-width: 980px) {
    align-self: center;
    width: 100%;
  }
`;

const Layer = styled.div<{ $zIndex?: number }>`
  position: absolute;
  inset: 0;
  opacity: 1;
  z-index: ${({ $zIndex }) => $zIndex ?? 1};
`;

const LayerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: translate3d(0, 0, 0) scale(1.02);
`;

const HoverInfo = styled.div`
  position: absolute;
  left: 50%;
  right: auto;
  transform: translateX(-50%);
  width: min(660px, 100%);
  bottom: 0;
  padding: 18px clamp(0px, 1vw, 22px);
  pointer-events: none;
  color: rgba(245, 243, 239, 0.92);
  z-index: 3;

  @media (max-width: 980px) {
    position: static;
    left: auto;
    transform: none;
    bottom: auto;
    width: 100%;
    max-width: 100%;
    padding: 18px 0 0;
    z-index: auto;
    text-align: left;
  }
`;

const InfoBlock = styled.div<{ $mode: "default" | "active" }>`
  opacity: ${({ $mode }) => ($mode === "active" ? 1 : 1)};
  transition: opacity 450ms ease;
`;

const InfoTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: 0.02em;
  font-size: 18px;
`;

const InfoLine = styled.div`
  margin-top: 8px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.72;
`;
