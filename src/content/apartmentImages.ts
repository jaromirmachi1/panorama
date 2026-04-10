import floorSketch1 from "../assets/public-images/1patroNakres.png";
import floorSketch2 from "../assets/public-images/2patroNakres.png";

const flatOverlayImages = import.meta.glob("../assets/public-images/*flat.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const apartmentImages = {
  base: {
    src: "/panorama.webp",
    alt: "Panorama Žabiny",
  },
} as const;

/**
 * Základní pohled v sekci bytů: 1. / 2. patro → náčrty, výš → celopatrový plán (fallback).
 */
export function getApartmentBaseSketchSrc(floor: number): string {
  const f = Math.floor(floor);
  if (f <= 1) return floorSketch1;
  if (f === 2) return floorSketch2;
  return "/2patro.webp";
}

/** Vedoucí číslice z id bytu, např. "111 1+kk" → "111". */
export function parseFlatNumericId(id: string): string | null {
  const m = id.trim().match(/^(\d+)/);
  return m ? m[1] : null;
}

/**
 * Obrázek při hoveru řádku: 1. patro /101–114, 2. patro /201–211 … podle čísla v id.
 * Jiná podlaží — celopatrový plán (webp).
 */
export function getFlatHoverOverlaySrc(flat: { id: string; floor: number }): string {
  const n = parseFlatNumericId(flat.id);
  const f = Math.floor(flat.floor);
  if (n && (f === 1 || f === 2)) {
    const src = flatOverlayImages[`../assets/public-images/${n}flat.png`];
    if (src) return src;
  }
  return getFloorPlanSrc(flat.floor);
}

/**
 * Patrový plán podle podlaží (assets v /public).
 * 1. patro → 1patro.webp, 2. a vyšší → 2patro.webp
 */
export function getFloorPlanSrc(floor: number): string {
  const f = Math.floor(floor);
  if (f <= 1) return "/1patro.webp";
  return "/2patro.webp";
}

export function getFloorPlanAlt(
  floor: number,
  buildingId: "A" | "B",
  lang: "cz" | "en",
): string {
  const label =
    lang === "cz"
      ? buildingId === "A"
        ? "Kroftova"
        : "Budova B"
      : buildingId === "A"
        ? "Building A"
        : "Building B";
  const floorWord = lang === "cz" ? "podlaží" : "floor";
  return `Panorama Žabiny — ${label}, ${floorWord} ${floor}`;
}

export function getApartmentBaseSketchAlt(
  floor: number,
  buildingId: "A" | "B",
  lang: "cz" | "en",
): string {
  const f = Math.floor(floor);
  if (f === 1 || f === 2) {
    const base = getFloorPlanAlt(floor, buildingId, lang);
    return lang === "cz" ? `${base}, náčrt patra` : `${base}, floor sketch`;
  }
  return getFloorPlanAlt(floor, buildingId, lang);
}
