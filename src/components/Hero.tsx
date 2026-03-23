import { useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import styled from "styled-components";
import { gsap } from "../lib/gsap";
import { images } from "../content/images";
import { useLang } from "../i18n/LanguageContext";
import { t } from "../i18n/dictionary";

export function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const langBtnRef = useRef<HTMLAnchorElement | null>(null);
  const { lang, setLang } = useLang();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  function scrollToSection(id: string, e?: MouseEvent<HTMLAnchorElement>) {
    // Stop the browser's native hash-jump so the scroll feels consistent.
    e?.preventDefault();

    const el = document.getElementById(id);
    if (!el) return;

    // Use native smooth scrolling (plays nicer with ScrollTrigger).
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    // Update the hash without causing a second scroll.
    // (ReplaceState doesn't trigger scrolling, but keeps URL consistent.)
    window.history.replaceState({}, "", `#${id}`);
  }

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
      <Bg
        data-hero="bg"
        role="img"
        aria-label={t.hero.wordmarkAria[lang]}
      />
      <Overlay aria-hidden="true" />

      <Top>
        <Wordmark data-hero="wordmark" aria-label="Panorama Žabiny">
          <Word>Panorama</Word>
          <WordSub>Žabiny</WordSub>
        </Wordmark>

        <Nav data-hero="nav" aria-label="Hlavní navigace">
          <NavGroup>
            <NavLink data-cursor="hover" href="#agency">
              +&nbsp;{t.nav.project[lang]}
            </NavLink>
            <NavLink
              data-cursor="hover"
              href="#apartments"
              onClick={(e) => scrollToSection("apartments", e)}
            >
              +&nbsp;{t.nav.apartments[lang]}
            </NavLink>
            <NavLink
              data-cursor="hover"
              href="#features"
              onClick={(e) => scrollToSection("features", e)}
            >
              +&nbsp;{t.nav.benefits[lang]}
            </NavLink>
            <NavLink
              data-cursor="hover"
              href="#contact"
              onClick={(e) => scrollToSection("contact", e)}
            >
              +&nbsp;{t.nav.contact[lang]}
            </NavLink>
          </NavGroup>
          <NavGroup>
            <NavMetaLink
              data-cursor="hover"
              href="https://lvlreality.cz/"
              target="_blank"
              rel="noreferrer"
            >
              +&nbsp;{t.nav.lvl[lang]}
            </NavMetaLink>
            <NavMetaLink
              data-cursor="hover"
              href="https://www.instagram.com/lvlreality.cz/"
              target="_blank"
              rel="noreferrer"
            >
              +&nbsp;{t.nav.instagram[lang]}
            </NavMetaLink>
          </NavGroup>
          <LangCluster>
            <Lang
              data-cursor="hover"
              href="#top"
              ref={langBtnRef}
              onClick={(e) => {
                e.preventDefault()
                // Slide down the alternative language instead of switching immediately.
                setLangMenuOpen((v) => !v)
              }}
            >
                <LangSign aria-hidden="true">+</LangSign>
                <LangText>{t.nav.lang[lang]}</LangText>
            </Lang>

            <LangMenu $open={langMenuOpen} aria-hidden={!langMenuOpen}>
              {lang === 'cz' ? (
                <LangMenuItem
                  data-cursor="hover"
                  type="button"
                  onClick={() => {
                    setLang('en')
                    setLangMenuOpen(false)
                  }}
                >
                    {t.nav.lang.en}
                </LangMenuItem>
              ) : (
                <LangMenuItem
                  data-cursor="hover"
                  type="button"
                  onClick={() => {
                    setLang('cz')
                    setLangMenuOpen(false)
                  }}
                >
                    {t.nav.lang.cz}
                </LangMenuItem>
              )}
            </LangMenu>
          </LangCluster>
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
  width: 100%;
  gap: 0px;
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

const NavMetaLink = styled.a`
  opacity: 0.72;
  transition: opacity 450ms ease;
  color: rgba(255, 255, 255, 0.76);

  &:hover {
    opacity: 1;
  }
`;

const Lang = styled.a`
  justify-self: end;
  opacity: 0.9;
  transition: opacity 450ms ease;
  color: rgba(255, 255, 255, 0.76);
  display: inline-flex;
  align-items: baseline;
  gap: 10px;

  &:hover {
    opacity: 1;
  }
`;

const LangSign = styled.span`
  display: inline-block;
`;

const LangText = styled.span`
  display: inline-block;
`;

const LangCluster = styled.div`
  justify-self: end;
  display: grid;
  align-items: start;
  grid-auto-flow: row;
  position: relative;
`;

const LangMenu = styled.div<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  /* Offset so the 2nd option aligns under the language text (not under '+'). */
  left: 1.1em;
  overflow: hidden;
  opacity: ${({ $open }) => ($open ? '1' : '0')};
  transform: translateY(${({ $open }) => ($open ? '0px' : '-6px')});
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition:
    opacity 180ms ease,
    transform 240ms ease;
`;

const LangMenuItem = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.76);
  font: inherit;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  opacity: 0.72;
  transition: opacity 450ms ease;

  &:hover {
    opacity: 1;
  }
`;
