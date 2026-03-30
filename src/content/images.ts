export const images = {
  hero: {
    src: "/panorama.webp",
    alt: "Panorama Žabiny — vizualizace projektu",
  },
  architect: {
    src: "/Smedek.webp",
    alt: {
      cz: "Architekt František Šmédek, kancelář SMEDEK",
      en: "Architect František Šmédek, SMEDEK studio",
    },
  },
  gallery: [
    {
      src: "/velkyBytObyvak_11zon.webp",
      alt: {
        cz: "Velký byt — Obývací pokoj",
        en: "Large apartment — Living room",
      },
    },
    {
      src: "/loznice.webp",
      alt: { cz: "Velký byt — Ložnice", en: "Large apartment — Bedroom" },
    },

    {
      src: "/velkyBytKoupelna_11zon.webp",
      alt: { cz: "Velký byt — Koupelna", en: "Large apartment — Bathroom" },
    },
    {
      src: "/velkyBytKuchyne_11zon.webp",
      alt: { cz: "Velký byt — Kuchyně", en: "Large apartment — Kitchen" },
    },
    {
      src: "/garsonkaObyvak.webp",
      alt: {
        cz: "Garsonka — obývací část",
        en: "Studio apartment — living area",
      },
    },
    {
      src: "/vyhled.webp",
      alt: { cz: "Výhled", en: "View" },
    },
  ],
} as const;
