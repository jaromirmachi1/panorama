export const images = {
  hero: {
    src: "/2buildings-2.webp",
    alt: "Panorama Žabiny — vizualizace projektu",
  },
  about: {
    src: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1800&q=80",
    alt: "Architectural interior detail",
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
