export const apartmentImages = {
  base: {
    src: "/panorama.webp",
    alt: "Panorama Žabiny",
  },
} as const;

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
