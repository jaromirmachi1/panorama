export const images = {
  hero: {
    src: "/panorama.webp",
    alt: "Panorama Žabiny — vizualizace projektu",
  },
  about: {
    src: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1800&q=80",
    alt: "Architectural interior detail",
  },
  gallery: [
    {
      src: "/velkyBytObyvak_11zon.webp",
      alt: {
        cz: "Velký byt — obývací pokoj",
        en: "Large apartment — living room",
      },
    },
    {
      src: "/velkyBytKuchyne_11zon.webp",
      alt: { cz: "Velký byt — kuchyně", en: "Large apartment — kitchen" },
    },
    {
      src: "/velkyBytKoupelna_11zon.webp",
      alt: { cz: "Velký byt — Koupelna", en: "Large apartment — bathroom" },
    },
  ],
} as const;
