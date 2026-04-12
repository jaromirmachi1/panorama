import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type PointerEvent,
  type SVGProps,
} from "react";
import styled from "styled-components";
import { gsap, stOnce } from "../../lib/gsap";
import { Container, Section } from "../Section";
import { Eyebrow, H2 } from "../TextBlock";
import { useLang } from "../../i18n/LanguageContext";
import { t } from "../../i18n/dictionary";
import {
  IconBath,
  IconDoor,
  IconElectrical,
  IconKitchen,
} from "./InteriorStandardsIcons";

const CATEGORY_VISUALS: ReadonlyArray<{
  src: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  { src: "/velkyBytKuchyne_11zon.webp", Icon: IconKitchen },
  { src: "/garsonkaObyvak.webp", Icon: IconElectrical },
  { src: "/velkyBytKoupelna_11zon.webp", Icon: IconBath },
  { src: "/loznice.webp", Icon: IconDoor },
];

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function InteriorStandards() {
  const rootRef = useRef<HTMLElement | null>(null);
  const { lang } = useLang();
  const copy = t.interiorStandards;
  const reduceMotion = usePrefersReducedMotion();
  const isMobileRail = useMatchMedia("(max-width: 820px)");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;

      const blocks = gsap.utils.toArray<HTMLElement>(
        "[data-interior-block]",
        root,
      );
      gsap.fromTo(
        blocks,
        { opacity: 0, y: reduceMotion ? 0 : 28 },
        {
          opacity: 1,
          y: 0,
          duration: reduceMotion ? 0.35 : 0.95,
          ease: "power3.out",
          stagger: reduceMotion ? 0 : 0.1,
          force3D: true,
          scrollTrigger: stOnce(root, "top 78%"),
        },
      );

      if (!reduceMotion) {
        const reveals = gsap.utils.toArray<HTMLElement>(
          "[data-interior-reveal]",
          root,
        );
        reveals.forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(10% 5% 10% 5%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.05,
              ease: "power3.out",
              scrollTrigger: stOnce(el, "top 88%"),
            },
          );
        });
      }

      const closing = root.querySelector("[data-interior-closing]");
      if (closing) {
        gsap.fromTo(
          closing,
          { opacity: 0, y: reduceMotion ? 0 : 12 },
          {
            opacity: 1,
            y: 0,
            duration: reduceMotion ? 0.3 : 0.85,
            ease: "power3.out",
            scrollTrigger: stOnce(closing as HTMLElement, "top 90%"),
          },
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <SectionShell
      ref={rootRef}
      tone="light"
      aria-label={copy.eyebrow[lang]}
      id="interior-standards"
    >
      <SectionBackdrop aria-hidden="true" />
      <Container>
        <Head>
          <Eyebrow>{copy.eyebrow[lang]}</Eyebrow>
          <H2>{copy.title[lang]}</H2>
        </Head>

        <ScrollRegion>
          <MobileScrollHint
            id="interior-standards-scroll-hint"
            aria-hidden={isMobileRail ? undefined : true}
          >
            <HintChevrons aria-hidden="true">
              <span>‹</span>
              <span>‹</span>
            </HintChevrons>
            <HintText>{copy.mobileScrollHint[lang]}</HintText>
            <HintChevrons aria-hidden="true" $mirror>
              <span>›</span>
              <span>›</span>
            </HintChevrons>
          </MobileScrollHint>

          <Grid
            aria-describedby={
              isMobileRail ? "interior-standards-scroll-hint" : undefined
            }
          >
            {copy.groups.map((group, idx) => {
              const visual = CATEGORY_VISUALS[idx];
              if (!visual) return null;
              return (
                <StandardCard
                  key={group.title[lang]}
                  group={group}
                  idx={idx}
                  lang={lang}
                  src={visual.src}
                  Icon={visual.Icon}
                  reduceMotion={reduceMotion}
                />
              );
            })}
          </Grid>
        </ScrollRegion>

        <Closing data-interior-closing>{copy.closing[lang]}</Closing>
      </Container>
    </SectionShell>
  );
}

type StandardCardProps = {
  group: (typeof t.interiorStandards.groups)[number];
  idx: number;
  lang: "cz" | "en";
  src: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  reduceMotion: boolean;
};

function StandardCard({
  group,
  idx,
  lang,
  src,
  Icon,
  reduceMotion,
}: StandardCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (reduceMotion) return;
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);

      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = py * -5;
      const ry = px * 5;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    },
    [reduceMotion],
  );

  const onPointerLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "42%");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  const alt = `${group.title[lang]} — Panorama Žabiny`;

  return (
    <Block
      ref={cardRef}
      data-interior-block
      data-cursor="hover"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        ["--mx" as string]: "50%",
        ["--my" as string]: "42%",
        ["--rx" as string]: "0deg",
        ["--ry" as string]: "0deg",
      }}
    >
      <VisualShell data-interior-reveal>
        <VisualInner>
          <CardImg
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
          />
          <VisualScrim aria-hidden="true" />
          <VisualGlow aria-hidden="true" />
          <IconWatermark aria-hidden="true">
            <Icon />
          </IconWatermark>
          <VisualGrain aria-hidden="true" />
        </VisualInner>
      </VisualShell>

      <BlockBody>
        <BlockIndex aria-hidden="true">
          {String(idx + 1).padStart(2, "0")}
        </BlockIndex>
        <TitleRow>
          <TitleIcon aria-hidden="true">
            <Icon />
          </TitleIcon>
          <BlockTitle>{group.title[lang]}</BlockTitle>
        </TitleRow>
        <List>
          {group.bullets.map((bullet) => (
            <Item key={bullet[lang]}>{bullet[lang]}</Item>
          ))}
        </List>
      </BlockBody>
    </Block>
  );
}

const SectionShell = styled(Section)`
  position: relative;
  overflow: hidden;
`;

const SectionBackdrop = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.45;
  background:
    radial-gradient(
      ellipse 80% 50% at 10% 0%,
      rgba(165, 135, 70, 0.07),
      transparent 55%
    ),
    radial-gradient(
      ellipse 70% 45% at 92% 100%,
      rgba(10, 10, 10, 0.04),
      transparent 50%
    ),
    repeating-linear-gradient(
      -18deg,
      transparent,
      transparent 1px,
      rgba(10, 10, 10, 0.025) 1px,
      rgba(10, 10, 10, 0.025) 2px
    );
`;

const Head = styled.div`
  position: relative;
  z-index: 1;
  color: rgba(10, 10, 10, 0.92);
  margin-bottom: clamp(28px, 5vw, 48px);
  max-width: 72ch;
`;

const ScrollRegion = styled.div`
  position: relative;
  z-index: 1;
`;

const MobileScrollHint = styled.p`
  display: none;

  @media (max-width: 820px) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px 14px;
    margin: 0 0 clamp(14px, 4vw, 18px);
    margin-inline: auto;
    max-width: min(100%, 420px);
    padding: 12px 18px;
    border-radius: 999px;
    border: 1px solid rgba(10, 10, 10, 0.1);
    background: rgba(255, 255, 255, 0.92);
    box-shadow:
      0 12px 36px rgba(10, 10, 10, 0.07),
      0 1px 0 rgba(255, 255, 255, 1) inset;
    text-align: center;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(10, 10, 10, 0.58);
    line-height: 1.45;
  }
`;

const HintChevrons = styled.span<{ $mirror?: boolean }>`
  display: inline-flex;
  gap: 1px;
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
  color: rgba(165, 135, 70, 0.92);
  animation: interior-hint-nudge 1.2s ease-in-out infinite alternate;

  ${(p) =>
    p.$mirror
      ? `
    animation-name: interior-hint-nudge-rev;
  `
      : ""}

  @keyframes interior-hint-nudge {
    from {
      transform: translateX(-5px);
      opacity: 0.55;
    }
    to {
      transform: translateX(4px);
      opacity: 1;
    }
  }

  @keyframes interior-hint-nudge-rev {
    from {
      transform: translateX(4px);
      opacity: 1;
    }
    to {
      transform: translateX(-5px);
      opacity: 0.55;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.88;
  }
`;

const HintText = styled.span`
  flex: 1 1 200px;
  min-width: min(100%, 220px);
`;

const Grid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(18px, 3.5vw, 28px);

  @media (max-width: 820px) {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: ${({ theme }) => theme.layout.gutter}px;
    gap: clamp(14px, 4vw, 20px);
    margin-inline: calc(-1 * ${({ theme }) => theme.layout.gutter}px);
    padding-inline: ${({ theme }) => theme.layout.gutter}px;
    padding-bottom: 10px;
    -webkit-overflow-scrolling: touch;

    scrollbar-width: thin;
    scrollbar-color: rgba(165, 135, 70, 0.35) transparent;
  }
`;

const Block = styled.article`
  position: relative;
  min-width: 0;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(10, 10, 10, 0.08);
  box-shadow:
    0 22px 56px rgba(10, 10, 10, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.85) inset;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  transition:
    border-color 0.45s ease,
    box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 820px) {
    flex: 0 0 min(88vw, 400px);
    scroll-snap-align: start;
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none !important;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: rgba(165, 135, 70, 0.28);
      box-shadow:
        0 28px 70px rgba(10, 10, 10, 0.09),
        0 0 0 1px rgba(165, 135, 70, 0.12),
        0 1px 0 rgba(255, 255, 255, 0.9) inset;
    }
  }

  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    transform: perspective(1100px) rotateX(var(--rx, 0deg))
      rotateY(var(--ry, 0deg)) translateZ(0);
  }
`;

const VisualShell = styled.div`
  position: relative;
  margin: -1px -1px 0;
  border-radius: 22px 22px 0 0;
  overflow: hidden;
`;

const VisualInner = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.06) translateZ(0);
  transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transform: scale(1.03);
  }

  ${Block}:hover & {
    transform: scale(1.12) translateZ(0);

    @media (prefers-reduced-motion: reduce) {
      transform: scale(1.04);
    }
  }
`;

const VisualScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 10, 0.05) 0%,
    rgba(10, 10, 10, 0.35) 100%
  );
  pointer-events: none;
  z-index: 1;
`;

const VisualGlow = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  mix-blend-mode: soft-light;
  background: radial-gradient(
    120% 90% at var(--mx, 50%) var(--my, 40%),
    rgba(255, 255, 255, 0.35) 0%,
    transparent 55%
  );
  opacity: 0.85;
  transition: opacity 0.4s ease;

  ${Block}:hover & {
    opacity: 1;
  }
`;

const IconWatermark = styled.div`
  position: absolute;
  right: clamp(8px, 2.5vw, 18px);
  bottom: clamp(8px, 2.5vw, 16px);
  z-index: 3;
  width: clamp(72px, 14vw, 104px);
  height: clamp(72px, 14vw, 104px);
  color: rgba(255, 255, 255, 0.22);
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.35));

  svg {
    width: 100%;
    height: 100%;
  }
`;

const VisualGrain = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0.18;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
`;

const BlockBody = styled.div`
  position: relative;
  z-index: 2;
  padding: clamp(20px, 3.2vw, 28px) clamp(22px, 3vw, 28px)
    clamp(24px, 3.8vw, 32px);
`;

const BlockIndex = styled.div`
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(165, 135, 70, 0.88);
  margin-bottom: 12px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: clamp(14px, 2vw, 18px);
`;

const TitleIcon = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  margin-top: 2px;
  color: rgba(165, 135, 70, 0.85);

  svg {
    width: 100%;
    height: 100%;
  }
`;

const BlockTitle = styled.h3`
  margin: 0;
  flex: 1;
  min-width: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: -0.02em;
  font-size: clamp(20px, 2.1vw, 26px);
  line-height: 1.2;
  color: rgba(10, 10, 10, 0.94);
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
`;

const Item = styled.li`
  position: relative;
  padding-left: 1.1em;
  font-size: 14px;
  line-height: 1.65;
  letter-spacing: 0.02em;
  color: rgba(10, 10, 10, 0.78);

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.55em;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(165, 135, 70, 0.55);
  }
`;

const Closing = styled.p`
  position: relative;
  z-index: 1;
  margin: clamp(32px, 5vw, 48px) 0 0;
  max-width: 62ch;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(17px, 1.9vw, 20px);
  font-style: italic;
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.01em;
  color: rgba(10, 10, 10, 0.72);
`;
