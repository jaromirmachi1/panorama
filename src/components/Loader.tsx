import { useLayoutEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { gsap } from "../lib/gsap";

type LoaderProps = {
  onComplete: () => void;
};

export function Loader({ onComplete }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

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
      <Sub>LVL Reality</Sub>
    </Wrap>
  );
}

const Wrap = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.black};
  pointer-events: none;
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  font-size: clamp(40px, 6vw, 88px);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
  display: inline-flex;
  gap: 0.02em;
`;

const Sub = styled.div`
  position: absolute;
  bottom: 48px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
`;
