import { useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "../lib/gsap";
import {
  getDesktopLenisOptions,
  LENIS_MOBILE_MAX_WIDTH_PX,
} from "../lib/lenisConfig";
import { isWebKitWithoutBlink } from "../lib/webkit";

type UseLenisOptions = {
  enabled?: boolean;
};

/**
 * Desktop-only Lenis (&gt; {@link LENIS_MOBILE_MAX_WIDTH_PX}px). WebKit: lower `lerp` via
 * {@link getDesktopLenisOptions}; `html[data-webkit]` + GlobalStyle lighten heavy CSS.
 *
 * Performance: native `requestAnimationFrame` drives `lenis.raf` (no GSAP ticker skew).
 * `ScrollTrigger.update` is coalesced to at most once per frame. Breakpoint transitions
 * use a single deferred `refresh()` to avoid redundant layout passes.
 */
export function useLenis({ enabled = true }: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const webKit = isWebKitWithoutBlink(navigator.userAgent);
    document.documentElement.toggleAttribute("data-webkit", webKit);

    if (prefersReducedMotion) {
      return () => document.documentElement.removeAttribute("data-webkit");
    }

    const narrowMq = window.matchMedia(
      `(max-width: ${LENIS_MOBILE_MAX_WIDTH_PX}px)`,
    );

    let lenis: Lenis | null = null;
    let rafId: number | null = null;
    let scrollTriggerUpdateRaf: number | null = null;
    let scrollTriggerUpdatePending = false;

    const scheduleScrollTriggerUpdate = () => {
      if (scrollTriggerUpdatePending) return;
      scrollTriggerUpdatePending = true;
      scrollTriggerUpdateRaf = requestAnimationFrame(() => {
        scrollTriggerUpdatePending = false;
        scrollTriggerUpdateRaf = null;
        ScrollTrigger.update();
      });
    };

    const cancelScheduledScrollTriggerUpdate = () => {
      if (scrollTriggerUpdateRaf !== null) {
        cancelAnimationFrame(scrollTriggerUpdateRaf);
        scrollTriggerUpdateRaf = null;
      }
      scrollTriggerUpdatePending = false;
    };

    const onLenisScroll = () => {
      scheduleScrollTriggerUpdate();
    };

    const stopRafLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const stopLenis = () => {
      stopRafLoop();
      cancelScheduledScrollTriggerUpdate();
      if (lenis) {
        lenis.off("scroll", onLenisScroll);
        lenis.destroy();
        lenis = null;
      }
      lenisRef.current = null;
    };

    const startLenis = () => {
      lenis = new Lenis({
        ...getDesktopLenisOptions(webKit),
      });
      lenisRef.current = lenis;

      lenis.on("scroll", onLenisScroll);

      const loop = (time: DOMHighResTimeStamp) => {
        if (!lenis) return;
        lenis.raf(time);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);

      scheduleScrollTriggerUpdate();
    };

    let lastInnerWidth = window.innerWidth;

    const onWindowResize = () => {
      const w = window.innerWidth;
      if (w === lastInnerWidth) return;
      lastInnerWidth = w;
      ScrollTrigger.refresh();
    };

    const shouldUseLenis = () => !narrowMq.matches;

    const syncLenisToViewport = () => {
      const useLenisHere = shouldUseLenis();
      if (useLenisHere && !lenis) {
        startLenis();
      } else if (!useLenisHere && lenis) {
        stopLenis();
      }
      lastInnerWidth = window.innerWidth;
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    syncLenisToViewport();
    window.addEventListener("resize", onWindowResize);
    narrowMq.addEventListener("change", syncLenisToViewport);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      narrowMq.removeEventListener("change", syncLenisToViewport);
      stopLenis();
      document.documentElement.removeAttribute("data-webkit");
    };
  }, [enabled, prefersReducedMotion]);

  return lenisRef;
}
