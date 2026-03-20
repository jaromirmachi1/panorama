import { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { gsap } from "../lib/gsap";
import { images } from "../content/images";

export function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      gsap.set(q('[data-hero="wordmark"]'), { opacity: 0, y: -14 });
      gsap.set(q('[data-hero="nav"]'), { opacity: 0, y: -10 });

      gsap.to(q('[data-hero="wordmark"]'), {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.1,
      });

      gsap.to(q('[data-hero="nav"]'), {
        opacity: 1,
        y: 0,
        duration: 1.05,
        ease: "expo.out",
        delay: 0.18,
      });

      gsap.fromTo(
        q('[data-hero="bg"]'),
        { scale: 1.08 },
        { scale: 1.02, duration: 2.2, ease: "power3.out" },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Wrap ref={rootRef} id="top">
      <Bg data-hero="bg" role="img" aria-label={images.hero.alt} />
      <Overlay aria-hidden="true" />

      <Top>
        <Wordmark data-hero="wordmark" aria-label="Panorama Žabiny">
          <Word>Panorama</Word>
          <WordSub>Žabiny</WordSub>
        </Wordmark>

        <Nav data-hero="nav" aria-label="Hlavní navigace">
          <NavGroup>
            <NavLink data-cursor="hover" href="#agency">
              +&nbsp;Projekt
            </NavLink>
            <NavLink data-cursor="hover" href="#realisations">
              +&nbsp;Galerie
            </NavLink>
            <NavLink data-cursor="hover" href="#features">
              +&nbsp;Benefity
            </NavLink>
            <NavLink data-cursor="hover" href="#contact">
              +&nbsp;Kontakt
            </NavLink>
          </NavGroup>
          <NavGroup>
            <NavMeta>+&nbsp;News</NavMeta>
            <NavMeta>+&nbsp;Réseaux</NavMeta>
          </NavGroup>
          <Lang data-cursor="hover" href="#top">
            CZ
          </Lang>
        </Nav>
      </Top>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  height: 100svh;
  min-height: 720px;
  background: ${({ theme }) => theme.colors.ink};
  overflow: hidden;
`;

const Bg = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("${images.hero.src}");
  background-size: cover;
  background-position: center;
  transform-origin: center;
  filter: saturate(0.95) contrast(1.02);
  will-change: transform;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.62),
      rgba(0, 0, 0, 0.35) 40%,
      rgba(0, 0, 0, 0.7)
    ),
    radial-gradient(
      120% 120% at 20% 10%,
      rgba(255, 255, 255, 0.08),
      transparent 55%
    );
`;

const Top = styled.div`
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 3;
  padding: 0 clamp(18px, 4vw, 38px);
`;

const Wordmark = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
`;

const Word = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  line-height: 0.8;
  font-size: clamp(78px, 12.2vw, 210px);
  color: rgba(255, 255, 255, 0.88);
`;

const WordSub = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: clamp(34px, 4.6vw, 72px);
  color: rgba(255, 255, 255, 0.76);
  padding-bottom: 0.1em;
  text-align: right;
`;

const Nav = styled.nav`
  margin-top: clamp(6px, 1.2vw, 14px);
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 20px;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.76);

  @media (max-width: 820px) {
    grid-template-columns: 1fr auto;
    row-gap: 13px;
  }
`;

const NavGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
`;

const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.76);
  transition: opacity 450ms ease;
  opacity: 0.92;

  &:hover {
    opacity: 1;
  }
`;

const NavMeta = styled.div`
  opacity: 0.72;
`;

const Lang = styled.a`
  justify-self: end;
  opacity: 0.9;
  transition: opacity 450ms ease;
  color: rgba(255, 255, 255, 0.76);

  &:hover {
    opacity: 1;
  }
`;
