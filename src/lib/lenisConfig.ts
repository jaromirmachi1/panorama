import type { LenisOptions } from "lenis";

/** Same breakpoint as layout CSS: Lenis off at this width and below. */
export const LENIS_MOBILE_MAX_WIDTH_PX = 1024;

type DesktopLenisPick = Pick<
  LenisOptions,
  | "lerp"
  | "wheelMultiplier"
  | "smoothWheel"
  | "touchMultiplier"
  | "syncTouch"
  | "autoResize"
>;

/**
 * Base desktop profile (Chromium, etc.).
 *
 * - **lerp ~0.09**: smooth easing without feeling sticky.
 * - **wheelMultiplier ~0.94**: light damping for consistent wheel/trackpad feel.
 */
export const desktopLenisOptions: DesktopLenisPick = {
  lerp: 0.092,
  wheelMultiplier: 0.94,
  smoothWheel: true,
  touchMultiplier: 1,
  syncTouch: false,
  autoResize: true,
};

/**
 * WebKit-only: slightly lower lerp so each frame moves a bit closer to the target.
 * Fewer overlapping smooth-scroll corrections per frame → less main-thread work during
 * inertia on Safari while keeping a similar perceived softness.
 */
const WEBKIT_LERP = 0.08;

/** Desktop Lenis options, optionally tuned for WebKit without duplicating the base map. */
export function getDesktopLenisOptions(isWebKit: boolean): DesktopLenisPick {
  if (!isWebKit) return desktopLenisOptions;
  return { ...desktopLenisOptions, lerp: WEBKIT_LERP };
}
