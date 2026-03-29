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
        cz: "Obývací pokoj",
        en: "Living room",
      },
    },
    {
      src: "/loznice.webp",
      alt: { cz: "Ložnice", en: "Bedroom" },
    },

    {
      src: "/velkyBytKoupelna_11zon.webp",
      alt: { cz: "Koupelna", en: "Bathroom" },
    },
    {
      src: "/velkyBytKuchyne_11zon.webp",
      alt: { cz: "Kuchyně", en: "Kitchen" },
    },
  ],
} as const;
