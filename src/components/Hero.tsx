import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";
import { gsap } from "../lib/gsap";
import { images } from "../content/images";
import { useLang } from "../i18n/LanguageContext";
import { t } from "../i18n/dictionary";

const MOBILE_NAV_MAX_PX = 900;

export function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const mobileNavRootRef = useRef<HTMLElement | null>(null);
  const mobileNavEnterTlRef = useRef<gsap.core.Timeline | null>(null);
  const mobileNavExitBusyRef = useRef(false);
  const langBtnRef = useRef<HTMLAnchorElement | null>(null);
  const { lang, setLang } = useLang();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  function closeMobileNavImmediate() {
    setMobileNavOpen(false);
    setLangMenuOpen(false);
    mobileNavExitBusyRef.current = false;
  }

  function playMobileNavExit(onDone: () => void) {
    const root = mobileNavRootRef.current;
    if (prefersReducedMotion || !root) {
      onDone();
      return;
    }
    if (mobileNavExitBusyRef.current) return;
    mobileNavExitBusyRef.current = true;
    mobileNavEnterTlRef.current?.kill();
    mobileNavEnterTlRef.current = null;

    const items = root.querySelectorAll('[data-mnav="item"]');
    const closeEl = root.querySelector('[data-mnav="close"]');
    const langEl = root.querySelector('[data-mnav="lang"]');
    const footerLines = root.querySelectorAll('[data-mnav="footer-line"]');

    const tl = gsap.timeline({
      onComplete: () => {
        mobileNavExitBusyRef.current = false;
        onDone();
      },
    });

    if (items.length) {
      tl.to(items, {
        yPercent: 108,
        opacity: 0,
        duration: 0.32,
        stagger: 0.032,
        ease: "power3.in",
      }, 0);
    }
    if (closeEl) {
      tl.to(
        closeEl,
        { opacity: 0, scale: 0.78, rotate: 10, duration: 0.26, ease: "power3.in" },
        0,
      );
    }
    if (langEl) {
      tl.to(
        langEl,
        { opacity: 0, y: -12, duration: 0.24, ease: "power3.in" },
        0.04,
      );
    }
    if (footerLines.length) {
      tl.to(
        footerLines,
        {
          opacity: 0,
          y: 18,
          duration: 0.28,
          stagger: 0.06,
          ease: "power3.in",
        },
        0.06,
      );
    }
    tl.to(
      root,
      {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.52,
        ease: "power3.inOut",
      },
      0.1,
    );
  }

  function requestCloseMobileNav() {
    playMobileNavExit(closeMobileNavImmediate);
  }

  function scrollFromMobileNav(id: string, e?: MouseEvent<HTMLAnchorElement>) {
    e?.preventDefault();
    playMobileNavExit(() => {
      closeMobileNavImmediate();
      requestAnimationFrame(() => scrollToSection(id, e));
    });
  }

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") requestCloseMobileNav();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileNavOpen]);

  useLayoutEffect(() => {
    if (!mobileNavOpen || !mobileNavRootRef.current || prefersReducedMotion) {
      return;
    }

    const root = mobileNavRootRef.current;
    const items = root.querySelectorAll('[data-mnav="item"]');
    const closeEl = root.querySelector('[data-mnav="close"]');
    const langEl = root.querySelector('[data-mnav="lang"]');
    const footerLines = root.querySelectorAll('[data-mnav="footer-line"]');

    const tl = gsap.timeline();
    mobileNavEnterTlRef.current = tl;

    gsap.set(root, {
      clipPath: "inset(0 0 100% 0)",
      opacity: 1,
    });
    if (closeEl) gsap.set(closeEl, { opacity: 0, scale: 0.82, rotate: -14 });
    if (items.length) gsap.set(items, { yPercent: 110, opacity: 0 });
    if (langEl) gsap.set(langEl, { opacity: 0, y: 20 });
    if (footerLines.length) gsap.set(footerLines, { opacity: 0, y: 22 });

    tl.to(root, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.72,
      ease: "power3.out",
    }, 0);

    if (closeEl) {
      tl.to(
        closeEl,
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.52,
          ease: "back.out(1.35)",
        },
        0.14,
      );
    }
    if (items.length) {
      tl.to(
        items,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.58,
          stagger: 0.065,
          ease: "power3.out",
        },
        0.16,
      );
    }
    if (langEl) {
      tl.to(
        langEl,
        { opacity: 1, y: 0, duration: 0.48, ease: "power3.out" },
        0.42,
      );
    }
    if (footerLines.length) {
      tl.to(
        footerLines,
        {
          opacity: 1,
          y: 0,
          duration: 0.52,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.48,
      );
    }

    return () => {
      tl.kill();
      if (mobileNavEnterTlRef.current === tl) {
        mobileNavEnterTlRef.current = null;
      }
    };
  }, [mobileNavOpen, prefersReducedMotion]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      gsap.set(q('[data-hero="wordmark"]'), { opacity: 0, y: -14 });
      gsap.set(q('[data-hero="nav"]'), { opacity: 0, y: -10 });
      gsap.set(q('[data-hero="mobile-menu"]'), { opacity: 0, y: -10 });

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

      gsap.to(q('[data-hero="mobile-menu"]'), {
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

        <MobileHeaderRule aria-hidden="true" />
        <MobileMenuRow>
          <MobileMenuTrigger
            type="button"
            data-hero="mobile-menu"
            data-cursor="hover"
            aria-expanded={mobileNavOpen}
            aria-controls="hero-mobile-nav"
            onClick={() => setMobileNavOpen(true)}
          >
            <MenuTriggerPlus aria-hidden="true">+</MenuTriggerPlus>
            <MenuTriggerLabel>{t.nav.menu[lang]}</MenuTriggerLabel>
          </MobileMenuTrigger>
        </MobileMenuRow>

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

      {typeof document !== "undefined" &&
        mobileNavOpen &&
        createPortal(
          <MobileNav
            ref={mobileNavRootRef}
            id="hero-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.mobileNavAria[lang]}
          >
            <MobileNavClose
              type="button"
              data-mnav="close"
              data-cursor="hover"
              aria-label={t.nav.closeMenuAria[lang]}
              onClick={requestCloseMobileNav}
            >
              <span aria-hidden="true">×</span>
            </MobileNavClose>

            <MobileNavInner>
              <MobileNavList>
                <MobileNavItem>
                  <MobileNavItemTrack>
                    <MobileNavLink
                      data-mnav="item"
                      data-cursor="hover"
                      href="#agency"
                      onClick={(e) => scrollFromMobileNav("agency", e)}
                    >
                      +&nbsp;{t.nav.project[lang]}
                    </MobileNavLink>
                  </MobileNavItemTrack>
                </MobileNavItem>
                <MobileNavItem>
                  <MobileNavItemTrack>
                    <MobileNavLink
                      data-mnav="item"
                      data-cursor="hover"
                      href="#apartments"
                      onClick={(e) => scrollFromMobileNav("apartments", e)}
                    >
                      +&nbsp;{t.nav.apartments[lang]}
                    </MobileNavLink>
                  </MobileNavItemTrack>
                </MobileNavItem>
                <MobileNavItem>
                  <MobileNavItemTrack>
                    <MobileNavLink
                      data-mnav="item"
                      data-cursor="hover"
                      href="#features"
                      onClick={(e) => scrollFromMobileNav("features", e)}
                    >
                      +&nbsp;{t.nav.benefits[lang]}
                    </MobileNavLink>
                  </MobileNavItemTrack>
                </MobileNavItem>
                <MobileNavItem>
                  <MobileNavItemTrack>
                    <MobileNavLink
                      data-mnav="item"
                      data-cursor="hover"
                      href="#contact"
                      onClick={(e) => scrollFromMobileNav("contact", e)}
                    >
                      +&nbsp;{t.nav.contact[lang]}
                    </MobileNavLink>
                  </MobileNavItemTrack>
                </MobileNavItem>
                <MobileNavItem>
                  <MobileNavItemTrack>
                    <MobileNavExternal
                      data-mnav="item"
                      data-cursor="hover"
                      href="https://lvlreality.cz/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={requestCloseMobileNav}
                    >
                      +&nbsp;{t.nav.lvl[lang]}
                    </MobileNavExternal>
                  </MobileNavItemTrack>
                </MobileNavItem>
                <MobileNavItem>
                  <MobileNavItemTrack>
                    <MobileNavExternal
                      data-mnav="item"
                      data-cursor="hover"
                      href="https://www.instagram.com/lvlreality.cz/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={requestCloseMobileNav}
                    >
                      +&nbsp;{t.nav.instagram[lang]}
                    </MobileNavExternal>
                  </MobileNavItemTrack>
                </MobileNavItem>
              </MobileNavList>

              <MobileNavLangRow data-mnav="lang">
                <MobileNavLangBtn
                  type="button"
                  data-cursor="hover"
                  $active={lang === "cz"}
                  onClick={() => setLang("cz")}
                >
                  +&nbsp;{t.nav.langCz[lang]}
                </MobileNavLangBtn>
                <MobileNavLangBtn
                  type="button"
                  data-cursor="hover"
                  $active={lang === "en"}
                  onClick={() => setLang("en")}
                >
                  +&nbsp;{t.nav.langEn[lang]}
                </MobileNavLangBtn>
              </MobileNavLangRow>
            </MobileNavInner>

            <MobileNavFooter>
              <MobileNavFooterRule aria-hidden="true" />
              <MobileNavFooterMark>
                <MobileNavFooterLine data-mnav="footer-line">
                  Panorama
                </MobileNavFooterLine>
                <MobileNavFooterLineSub data-mnav="footer-line">
                  Žabiny
                </MobileNavFooterLineSub>
              </MobileNavFooterMark>
            </MobileNavFooter>
          </MobileNav>,
          document.body,
        )}
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

  @media (max-width: ${MOBILE_NAV_MAX_PX}px) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-top: clamp(12px, 3vw, 20px);
  }
`;

const Wordmark = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
  gap: 0px;

  @media (max-width: ${MOBILE_NAV_MAX_PX}px) {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: clamp(2px, 1vw, 8px);
    text-align: center;
  }
`;

const Word = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  line-height: 0.8;
  font-size: clamp(78px, 12.2vw, 210px);
  color: rgba(255, 255, 255, 0.88);

  @media (max-width: ${MOBILE_NAV_MAX_PX}px) {
    line-height: 0.85;
    font-size: clamp(42px, 14vw, 72px);
    letter-spacing: 0.2em;
    text-align: center;
    width: 100%;
  }
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

  @media (max-width: ${MOBILE_NAV_MAX_PX}px) {
    text-align: center;
    padding-bottom: 0;
    font-size: clamp(22px, 6.2vw, 34px);
    letter-spacing: 0.26em;
    width: 100%;
  }
`;

const MobileHeaderRule = styled.div`
  display: none;

  @media (max-width: ${MOBILE_NAV_MAX_PX}px) {
    display: block;
    width: 100%;
    height: 1px;
    margin-top: clamp(14px, 3.5vw, 22px);
    background: rgba(255, 255, 255, 0.28);
  }
`;

const MobileMenuRow = styled.div`
  display: none;

  @media (max-width: ${MOBILE_NAV_MAX_PX}px) {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: clamp(10px, 2.5vw, 16px);
  }
`;

const MobileMenuTrigger = styled.button`
  display: none;

  @media (max-width: ${MOBILE_NAV_MAX_PX}px) {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    padding: 10px 16px;
    border: none;
    border-radius: 0;
    background: ${({ theme }) => theme.colors.ink};
    color: rgba(255, 255, 255, 0.92);
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
`;

const MenuTriggerPlus = styled.span`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1;
  opacity: 0.95;
`;

const MenuTriggerLabel = styled.span`
  line-height: 1;
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

  @media (max-width: ${MOBILE_NAV_MAX_PX}px) {
    display: none;
  }

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

const MobileNav = styled.aside`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.paper};
  color: ${({ theme }) => theme.colors.ink};
  padding: clamp(16px, 4vw, 28px);
  padding-top: clamp(72px, 14vw, 100px);
  will-change: clip-path;
`;

const MobileNavClose = styled.button`
  position: absolute;
  top: clamp(14px, 3vw, 22px);
  right: clamp(14px, 3vw, 22px);
  width: 48px;
  height: 48px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: ${({ theme }) => theme.colors.ink};
  color: rgba(255, 255, 255, 0.95);
  font-size: 28px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  -webkit-tap-highlight-color: transparent;
`;

const MobileNavInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding: 0 clamp(8px, 2vw, 12px);
`;

const MobileNavList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 4.5vw, 28px);
`;

const MobileNavItem = styled.li`
  margin: 0;
`;

const MobileNavItemTrack = styled.span`
  display: block;
  overflow: hidden;
`;

const mobileNavLinkBase = css`
  display: block;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(22px, 6.2vw, 34px);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.ink};
  line-height: 1.15;
  -webkit-tap-highlight-color: transparent;
`;

const MobileNavLink = styled.a`
  ${mobileNavLinkBase}
`;

const MobileNavExternal = styled.a`
  ${mobileNavLinkBase}
`;

const MobileNavLangRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(14px, 4vw, 22px);
  margin-top: clamp(36px, 8vw, 52px);
  padding-top: clamp(8px, 2vw, 14px);
`;

const MobileNavLangBtn = styled.button<{ $active: boolean }>`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.ink : "rgba(10, 10, 10, 0.45)"};
  -webkit-tap-highlight-color: transparent;
`;

const MobileNavFooter = styled.div`
  flex-shrink: 0;
  padding: clamp(20px, 5vw, 32px) 0 clamp(12px, 3vw, 20px);
`;

const MobileNavFooterRule = styled.div`
  height: 1px;
  width: 100%;
  background: rgba(10, 10, 10, 0.85);
  margin-bottom: clamp(18px, 4vw, 28px);
`;

const MobileNavFooterMark = styled.div`
  text-align: center;
`;

const MobileNavFooterLine = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  font-size: clamp(11px, 3.2vw, 14px);
  letter-spacing: 0.55em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ink};
`;

const MobileNavFooterLineSub = styled.div`
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 300;
  font-size: clamp(10px, 2.8vw, 12px);
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.55);
`;
