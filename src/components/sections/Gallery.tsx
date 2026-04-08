import { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { gsap, stOnce } from "../../lib/gsap";
import { images } from "../../content/images";
import { Section } from "../Section";
import { Eyebrow, H2 } from "../TextBlock";
import { useLang } from "../../i18n/LanguageContext";
import { t } from "../../i18n/dictionary";

export function Gallery() {
  const rootRef = useRef<HTMLElement | null>(null);
  const { lang } = useLang();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;

      const items = gsap.utils.toArray<HTMLElement>(
        "[data-gallery-item]",
        root,
      );
      items.forEach((item) => {
        const img = item.querySelector("img");
        const caption = item.querySelector<HTMLElement>(
          "[data-gallery-caption]",
        );
        if (!img) return;

        /* One-shot rise + settle (no scrub): same section feel, far less scroll-linked work. */
        gsap.fromTo(
          img,
          { y: 28, scale: 1.045 },
          {
            y: 0,
            scale: 1,
            duration: 1.15,
            ease: "power2.out",
            force3D: true,
            scrollTrigger: stOnce(item, "top 86%"),
          },
        );

        gsap.fromTo(
          item,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: stOnce(item, "top 80%"),
          },
        );

        if (caption) {
          gsap.fromTo(
            caption,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              force3D: true,
              scrollTrigger: stOnce(item, "top 82%"),
            },
          );
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      ref={rootRef}
      tone="dark"
      aria-label={t.gallery.eyebrow[lang]}
      id="realisations"
    >
      <HeadOuter>
        <Head>
          <Eyebrow>{t.gallery.eyebrow[lang]}</Eyebrow>
          <H2>{t.gallery.title[lang]}</H2>
        </Head>
      </HeadOuter>
      <Rail>
        {images.gallery.map((img, idx) => (
          <Item key={img.src} data-gallery-item tabIndex={0}>
            <Img
              src={img.src}
              alt={img.alt[lang]}
              loading="lazy"
              decoding="async"
            />
            <Shade aria-hidden="true" />
            <Caption data-gallery-caption>
              <CapLeft>
                <CapKicker>0{idx + 1}</CapKicker>
                <CapTitle>{img.alt[lang]}</CapTitle>
              </CapLeft>
              <CapRule aria-hidden="true" />
            </Caption>
          </Item>
        ))}
      </Rail>
    </Section>
  );
}

const Head = styled.div`
  margin-bottom: clamp(26px, 4vw, 46px);
`;

const HeadOuter = styled.div`
  padding: 0 clamp(18px, 4vw, 38px);
`;

const Rail = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(16px, 2.6vw, 28px);
  padding: 0 clamp(18px, 4vw, 38px);

  @media (max-width: 900px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.figure`
  margin: 0;
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.04);
  outline: none;

  /* Architecture mosaic layout (asymmetric but consistent). */
  grid-column: span 6;
  height: clamp(520px, 78vh, 820px);
  border: 1px solid rgba(255, 255, 255, 0.12);

  &:nth-child(1) {
    grid-column: span 7;
  }
  &:nth-child(2) {
    grid-column: span 5;
  }
  &:nth-child(3) {
    grid-column: span 6;
  }

  @media (max-width: 900px) {
    &:nth-child(1) {
      grid-column: span 6;
    }
    &:nth-child(2) {
      grid-column: span 6;
    }
    &:nth-child(3) {
      grid-column: span 6;
    }
  }

  /* Single-column rail: nth-child(1–3) still had span 6 from the 900px rules
     (higher specificity than plain grid-column: auto), so only the 4th card
     was true full-width. Reset every item to one full track on phones. */
  @media (max-width: 620px) {
    grid-column: 1 / -1;
    width: 100%;
    min-width: 0;
    height: clamp(360px, 50vh, 620px);

    &:nth-child(n) {
      grid-column: 1 / -1;
    }
  }

  &::before {
    content: "";
    position: absolute;
    inset: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    pointer-events: none;
    opacity: 0.9;
    z-index: 2;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate3d(0, 0, 0);
`;

const Shade = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      120% 120% at 20% 10%,
      rgba(255, 255, 255, 0.09),
      transparent 55%
    ),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.26), rgba(0, 0, 0, 0.68)),
    repeating-linear-gradient(
      to right,
      rgba(255, 255, 255, 0.08) 0px,
      rgba(255, 255, 255, 0.08) 1px,
      transparent 1px,
      transparent 96px
    ),
    repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.06) 0px,
      rgba(255, 255, 255, 0.06) 1px,
      transparent 1px,
      transparent 74px
    );
  opacity: 0.75;
  pointer-events: none;
  z-index: 1;

  transition: opacity 450ms ease;

  ${Item}:hover & {
    opacity: 0.9;
  }
`;

const Caption = styled.figcaption`
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 20px;
  z-index: 3;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 450ms ease,
    transform 650ms cubic-bezier(0.22, 1, 0.36, 1);

  pointer-events: none;

  ${Item}:hover &,
  ${Item}:focus-visible & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CapLeft = styled.div`
  display: grid;
  gap: 6px;
`;

const CapKicker = styled.div`
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.72;
`;

const CapTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: -0.01em;
  font-size: 16px;
  line-height: 1.1;
  opacity: 0.95;
`;

const CapRule = styled.div`
  width: 64px;
  height: 1px;
  background: rgba(255, 255, 255, 0.22);
`;
