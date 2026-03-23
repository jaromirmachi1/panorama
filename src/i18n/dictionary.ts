import type { Lang } from './LanguageContext'

export const t = {
  nav: {
    project: { cz: 'Projekt', en: 'Project' },
    apartments: { cz: 'Byty', en: 'Apartments' },
    benefits: { cz: 'Benefity', en: 'Benefits' },
    contact: { cz: 'Kontakt', en: 'Contact' },
    news: { cz: '+ News', en: '+ News' },
    réseaux: { cz: '+ Réseaux', en: '+ Networks' },
    lang: { cz: 'CZ', en: 'EN' },
  },

  hero: {
    wordmarkAria: { cz: 'Panorama Žabiny', en: 'Panorama Žabiny' },
  },

  projectIntro: {
    title: { cz: 'O projektu', en: 'About the project' },
    body1: {
      cz: `Klidný ráj v Žabovřeskách na Kroftově je zasazená do zelené zóny blízko Palackého vrchu, s výhledem na městskou panoramatu Brna. Díky poloze v zeleni vyniká příjemným mikroklimatem: v létě osvěží chlad lesa, v zimě sněhová pokrývka. Lákavým cílem procházek pro rodiny s dětmi je nedaleký lesopark s loukami a stezkami.`,
      en: `A calm paradise in Žabovřesky on Kroftova is set within a green zone near Palacký Hill, with views of Brno's city skyline. Thanks to its position in the greenery, it boasts a pleasant microclimate: in summer, the cool of the forest refreshes; in winter, snow blankets the area. A tempting destination for walks for families with children is the nearby forest park with meadows and trails.`,
    },
    body2: {
      cz: `Bydlet v objetí přírody však neznamená vzdát se městského stylu. K dispozici je kompletní občanská vybavenost Žabovřesk, včetně škol a obchodů, plus výborná doprava do centra – autem 10 minut, MHD 20 minut.`,
      en: `Living in the embrace of nature, however, does not mean giving up the city’s style. A complete range of amenities in Žabovřesky is available—including schools and shops—plus excellent transport connections to the center: 10 minutes by car, 20 minutes by public transport.`,
    },
    meta: {
      cz: `Komorní projekt v Žabinách, navržený pro klidné městské bydlení.`,
      en: `A boutique project in Žabiny, designed for calm urban living.`,
    },
    small: {
      cz: `Brno • 2026 • 48 jednotek • energetický standard A`,
      en: `Brno • 2026 • 48 units • Energy standard A`,
    },
  },

  apartments: {
    eyebrow: { cz: 'Byty', en: 'Apartments' },
    title: { cz: 'Aktuální dostupnost', en: 'Current availability' },
    listAria: { cz: 'Seznam apartmánů', en: 'Apartments list' },
    paginationAria: { cz: 'Stránkování', en: 'Pagination' },
    infoDefaultTitle: { cz: 'Vyberte podlaží', en: 'Select a floor' },
    infoDefaultLine: {
      cz: 'Hoverem přepnete zvýrazněné fotografie',
      en: 'Hover to highlight the selected photos',
    },
    floorLabel: { cz: 'Podlaží', en: 'Floor' },
    pageLabel: { cz: 'Stránkování', en: 'Pagination' },
  },

  gallery: {
    eyebrow: { cz: 'Galerie', en: 'Gallery' },
    title: { cz: 'Světlo v pohybu', en: 'Light in motion' },
  },

  features: {
    eyebrow: { cz: 'Benefity', en: 'Benefits' },
    title: { cz: 'Minimalistická kvalita', en: 'Minimalist quality' },
    lead: {
      cz: 'Vše podstatné. Bez nadbytečných slov — důraz na atmosféru, prostor a klid.',
      en: 'Everything essential. No excess words — focused on atmosphere, space, and calm.',
    },
    cards: {
      locality: {
        title: { cz: 'Lokalita', en: 'Location' },
        body: { cz: 'Žabiny: klid v zeleni, město na dosah.', en: 'Žabiny: calm in greenery, the city within reach.' },
      },
      architecture: {
        title: { cz: 'Architektura', en: 'Architecture' },
        body: { cz: 'Čisté proporce, promyšlené průhledy, světlo.', en: 'Clean proportions, thoughtful sightlines, light.' },
      },
      quality: {
        title: { cz: 'Kvalita', en: 'Quality' },
        body: { cz: 'Prémiové standardy a důraz na detail.', en: 'Premium standards and a focus on detail.' },
      },
      investment: {
        title: { cz: 'Investice', en: 'Investment' },
        body: { cz: 'Nadčasová hodnota v atraktivní čtvrti.', en: 'Timeless value in an attractive district.' },
      },
    },
  },

  contact: {
    eyebrow: { cz: 'Kontakt', en: 'Contact' },
    title: { cz: 'Máte zájem o byt?', en: 'Interested in an apartment?' },
    copy: {
      cz: 'Napište nám. Pošleme dostupnost, půdorysy a standardy v jednom elegantním balíčku.',
      en: 'Write to us. We’ll send availability, floor plans, and specifications in one elegant package.',
    },
    buttonPrimary: { cz: 'Nezávazně poptat', en: 'Request information' },
    buttonGhost: { cz: 'Zpět nahoru', en: 'Back to top' },
  },

  footer: {
    small1: {
      cz: 'Luxusní prezentace • statický web',
      en: 'Luxury presentation • static website',
    },
  },
} as const satisfies Record<string, unknown>

export function getDictionary(lang: Lang) {
  return lang === 'cz' ? t : t
}

