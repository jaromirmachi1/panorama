import type { Lang } from "./LanguageContext";

export const t = {
  nav: {
    project: { cz: "Projekt", en: "Project" },
    apartments: { cz: "Byty", en: "Apartments" },
    gallery: { cz: "Galerie", en: "Gallery" },
    contact: { cz: "Kontakt", en: "Contact" },
    // Credits / external links in the hero navbar
    lvl: { cz: "Realitka", en: "Reality" },
    instagram: { cz: "Instagram", en: "Instagram" },

    // (kept for now, but no longer used in the navbar)
    news: { cz: "+ News", en: "+ News" },
    réseaux: { cz: "+ Réseaux", en: "+ Networks" },
    lang: { cz: "CZ", en: "EN" },
    menu: { cz: "Menu", en: "Menu" },
    closeMenuAria: { cz: "Zavřít nabídku", en: "Close menu" },
    mobileNavAria: { cz: "Hlavní menu", en: "Main menu" },
    langCz: { cz: "Čeština", en: "Czech" },
    langEn: { cz: "Angličtina", en: "English" },
  },

  hero: {
    wordmarkAria: { cz: "Panorama Žabiny", en: "Panorama Žabiny" },
  },

  loader: {
    lvlLogoAlt: { cz: "LVL Reality", en: "LVL Reality" },
  },

  projectIntro: {
    title: { cz: "O projektu", en: "About the project" },
    body1: {
      cz: `Klidný ráj v Žabovřeskách na Kroftově je zasazená do zelené zóny blízko Palackého vrchu, s výhledem na městskou panoramatu Brna. Díky poloze v zeleni vyniká příjemným mikroklimatem: v létě osvěží chlad lesa, v zimě sněhová pokrývka. Lákavým cílem procházek pro rodiny s dětmi je nedaleký lesopark s loukami a stezkami.`,
      en: `A calm paradise in Žabovřesky on Kroftova is set within a green zone near Palacký Hill, with views of Brno's city skyline. Thanks to its position in the greenery, it boasts a pleasant microclimate: in summer, the cool of the forest refreshes; in winter, snow blankets the area. A tempting destination for walks for families with children is the nearby forest park with meadows and trails.`,
    },
    body2: {
      cz: `Bydlet v objetí přírody však neznamená vzdát se městského stylu. K dispozici je kompletní občanská vybavenost Žabovřesk, včetně škol a obchodů, plus výborná doprava do centra – autem 10 minut, MHD 20 minut.`,
      en: `Living in the embrace of nature, however, does not mean giving up the city’s style. A complete range of amenities in Žabovřesky is available—including schools and shops—plus excellent transport connections to the center: 10 minutes by car, 20 minutes by public transport.`,
    },
    meta: {
      cz: `Developerský projekt v Žabinách, navržený pro klidné městské bydlení.`,
      en: `A developers project in Žabiny, designed for calm urban living.`,
    },
    small: {
      cz: `Brno • 2026 • 25 jednotek`,
      en: `Brno • 2026 • 25 units`,
    },
  },

  apartments: {
    eyebrow: { cz: "Byty", en: "Apartments" },
    title: { cz: "Aktuální dostupnost", en: "Current availability" },
    listAria: { cz: "Seznam apartmánů", en: "Apartments list" },
    paginationAria: { cz: "Stránkování", en: "Pagination" },
    infoDefaultTitle: { cz: "Vyberte podlaží", en: "Select a floor" },
    infoDefaultLine: {
      cz: "Hoverem přepnete zvýrazněné fotografie",
      en: "Hover to highlight the selected photos",
    },
    floorLabel: { cz: "Podlaží", en: "Floor" },
    pageLabel: { cz: "Stránkování", en: "Pagination" },
    buildingA: { cz: "Budova A", en: "Building A" },
    buildingB: { cz: "Budova B", en: "Building B" },
    inquiry: {
      title: { cz: "Poptávka bytu", en: "Apartment inquiry" },
      subtitle: {
        cz: "Vyplňte údaje a ozveme se s podrobnostmi k vybrané jednotce.",
        en: "Leave your details and we will follow up about this unit.",
      },
      flatLabel: { cz: "Vybraný byt", en: "Selected apartment" },
      firstName: { cz: "Jméno", en: "First name" },
      lastName: { cz: "Příjmení", en: "Last name" },
      email: { cz: "E-mail", en: "Email" },
      phone: { cz: "Telefon", en: "Phone" },
      note: { cz: "Poznámka", en: "Note" },
      notePlaceholder: {
        cz: "Dotaz nebo doplňující informace (nepovinné)",
        en: "Question or extra details (optional)",
      },
      submit: { cz: "Odeslat poptávku", en: "Send inquiry" },
      close: { cz: "Zavřít", en: "Close" },
      closeAria: { cz: "Zavřít formulář", en: "Close form" },
      backdropAria: { cz: "Zavřít", en: "Close" },
      stubNote: {
        cz: "Údaje odesíláme z e-mailu přes Resend (server na Vercelu). Viz docs/RESEND.md.",
        en: "We send your details via Resend (server on Vercel). See docs/RESEND.md.",
      },
      sending: { cz: "Odesílám…", en: "Sending…" },
      sendError: {
        cz: "Odeslání se nepovedlo. Zkuste to znovu nebo nás kontaktujte přímo e-mailem.",
        en: "Could not send. Please try again or email us directly.",
      },
      sendErrorConfig: {
        cz: "E-mail není nakonfigurován (na Vercelu chybí RESEND_* / INQUIRY_TO_EMAIL, nebo použijte vercel dev). Viz docs/RESEND.md.",
        en: "Email is not configured (missing Resend env on Vercel, or use vercel dev locally). See docs/RESEND.md.",
      },
      thanks: {
        cz: "Děkujeme. Brzy se vám ozveme.",
        en: "Thank you. We will be in touch shortly.",
      },
    },
  },

  gallery: {
    eyebrow: { cz: "Galerie", en: "Gallery" },
    title: { cz: "Světlo v pohybu", en: "Light in motion" },
  },

  features: {
    eyebrow: { cz: "Prodej projektu", en: "Project sales" },
    title: {
      cz: "Realitní zástupci LVL Reality",
      en: "LVL Reality representatives",
    },
    lead: {
      cz: "Kontaktujte naše makléře ohledně prodeje a prohlídek v Panorama Žabiny.",
      en: "Contact our agents for sales and viewings at Panorama Žabiny.",
    },
    mapLabel: { cz: "Adresa", en: "Address" },
    mapAddress: {
      cz: "Kroftova 2191/80, 679 04 Brno",
      en: "Kroftova 2191/80, 679 04 Brno",
    },
    realtorMobile: { cz: "Mobil", en: "Mobile" },
    realtorEmail: { cz: "E-mail", en: "Email" },
  },

  aboutArch: {
    eyebrow: { cz: "Architekt", en: "Architect" },
    title: { cz: "František Šmédek", en: "František Šmédek" },
    studio: { cz: "SMEDEK", en: "SMEDEK" },
    studioRole: {
      cz: "Architektonická kancelář",
      en: "Architectural practice",
    },
    intro: {
      cz: "Náš bytový dům navrhl renomovaný brněnský architekt František Šmédek a jeho architektonická kancelář SMEDEK, která je známá svým inovativním a futuristickým přístupem k tvorbě.",
      en: "Our residential building was designed by renowned Brno architect František Šmédek and his practice SMEDEK — known for an innovative, forward-looking approach to architecture.",
    },
  },

  contact: {
    eyebrow: { cz: "Kontakt", en: "Contact" },
    title: { cz: "Máte zájem o byt?", en: "Interested in an apartment?" },
    copy: {
      cz: "Napište nám. Pošleme dostupnost, půdorysy a standardy v jednom elegantním balíčku.",
      en: "Write to us. We’ll send availability, floor plans, and specifications in one elegant package.",
    },
    buttonPrimary: { cz: "Nezávazně poptat", en: "Request information" },
    buttonGhost: { cz: "Zpět nahoru", en: "Back to top" },
  },

  footer: {
    small1: {
      cz: "Luxusní prezentace • statický web",
      en: "Luxury presentation • static website",
    },
    /** Bottom bar: one line before emphasized uitherapy */
    creditLineLead: { cz: "Made & powered by", en: "Made & powered by" },
    powered: {
      cz: "LVL Reality powered by uitherapy",
      en: "LVL Reality powered by uitherapy",
    },
    columns: {
      agency: { cz: "Agency", en: "Agency" },
      projects: { cz: "Projekty", en: "Projects" },
      contact: { cz: "Kontakt", en: "Contact" },
      socials: { cz: "Sociální sítě", en: "Socials" },
    },
    location: { cz: "Brno • Žabovřesky", en: "Brno • Žabovřesky" },
    /** Footer social: globe link to LVL Reality */
    lvlWebAria: {
      cz: "Web LVL Reality — lvlreality.cz",
      en: "LVL Reality website — lvlreality.cz",
    },
    legal: { cz: "LEGALS", en: "LEGALS" },
    privacy: { cz: "PRIVACY POLICY", en: "PRIVACY POLICY" },
  },
} as const satisfies Record<string, unknown>;

export function getDictionary(lang: Lang) {
  return lang === "cz" ? t : t;
}
