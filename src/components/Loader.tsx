import { useLayoutEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { gsap } from "../lib/gsap";
import { t } from "../i18n/dictionary";
import { useLang } from "../i18n/LanguageContext";

type LoaderProps = {
  onComplete: () => void;
};

export function Loader({ onComplete }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { lang } = useLang();

  const letters = useMemo(() => Array.from("Panorama Žabiny"), []);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  useLayoutEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (prefersReducedMotion) {
      const t = window.setTimeout(onComplete, 300);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = prevOverflow;
      };
    }

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;

      const chars = root.querySelectorAll("[data-letter]");
      gsap.set(chars, { opacity: 0, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete,
      });

      tl.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.045,
      })
        .to({}, { duration: 0.25 })
        .to(
          root,
          {
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
          },
          ">-0.05",
        );
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = prevOverflow;
    };
  }, [onComplete, prefersReducedMotion]);

  return (
    <Wrap ref={rootRef}>
      <Title aria-label="Panorama Žabiny">
        {letters.map((ch, i) => (
          <span key={`${ch}-${i}`} data-letter>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </Title>
      <Sub>
        <LvlLogo
          src="/lvlogo.webp"
          alt={t.loader.lvlLogoAlt[lang]}
          loading="eager"
          decoding="async"
        />
      </Sub>
    </Wrap>
  );
}

const Wrap = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
  background: ${({ theme }) => theme.colors.black};
  pointer-events: none;
`;

const Title = styled.h1`
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  /* Avoid a high px floor (e.g. 40px) — it overflows on narrow Android viewports */
  font-size: clamp(0.875rem, 3.6vw + 1.75vmin, 5.5rem);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 0.02em;
  text-align: center;

  @media (max-width: 520px) {
    font-size: clamp(0.75rem, 5.2vw + 1.25vmin, 2.75rem);
    letter-spacing: 0.05em;
  }
`;

const Sub = styled.div`
  position: absolute;
  bottom: 48px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LvlLogo = styled.img`
  display: block;
  height: clamp(28px, 4.5vw, 42px);
  width: auto;
  max-width: min(260px, 88vw);
  object-fit: contain;
  object-position: center;
`;
