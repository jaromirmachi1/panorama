import type { Lang } from '../i18n/LanguageContext'

type Localized = Record<Lang, string>

export type PrivacySection = {
  heading: Localized
  paragraphs: Localized[]
}

export const privacyPolicyMeta = {
  title: {
    cz: 'Ochrana osobních údajů',
    en: 'Privacy policy',
  },
  updated: {
    cz: 'Poslední aktualizace: březen 2026',
    en: 'Last updated: March 2026',
  },
  backHome: {
    cz: 'Zpět na hlavní stránku',
    en: 'Back to homepage',
  },
} as const satisfies Record<string, Localized>

export const privacyPolicySections: PrivacySection[] = [
  {
    heading: {
      cz: '1. Správce osobních údajů',
      en: '1. Data controller',
    },
    paragraphs: [
      {
        cz: 'Správcem osobních údajů je SD GROUP PROSPERITY s.r.o., IČO 21369178, se sídlem Radnická 376/11, 602 00 Brno, provozovatel webu a projektu Panorama Žabiny (dále jen „správce“).',
        en: 'The data controller is SD GROUP PROSPERITY s.r.o., Company ID 21369178, with registered office at Radnická 376/11, 602 00 Brno, operator of the Panorama Žabiny website and project (the “controller”).',
      },
      {
        cz: 'Kontaktní e-mail pro záležitosti ochrany osobních údajů: info@panoramazabiny.cz.',
        en: 'Contact e-mail for privacy matters: info@panoramazabiny.cz.',
      },
    ],
  },
  {
    heading: {
      cz: '2. Jaké údaje zpracováváme',
      en: '2. What data we process',
    },
    paragraphs: [
      {
        cz: 'Prostřednictvím kontaktního a poptávkového formuláře zpracováváme zejména jméno, příjmení, e-mail, telefon, volitelnou poznámku a informace o vybraném bytě (pokud je uvedena).',
        en: 'Through the contact and inquiry forms we mainly process your first name, last name, e-mail, phone number, optional message, and selected apartment details (if provided).',
      },
      {
        cz: 'Při návštěvě webu mohou být zpracovávány technické údaje (např. IP adresa, cookies) v rozsahu popsaném v nastavení cookies.',
        en: 'When you visit the website, technical data (e.g. IP address, cookies) may be processed as described in the cookie settings.',
      },
    ],
  },
  {
    heading: {
      cz: '3. Účel a právní základ zpracování',
      en: '3. Purpose and legal basis',
    },
    paragraphs: [
      {
        cz: 'Údaje z formuláře zpracováváme za účelem vyřízení vaší poptávky, komunikace k projektu Panorama Žabiny a případného sjednání prohlídky či obchodního jednání.',
        en: 'We process form data to handle your inquiry, communicate about Panorama Žabiny, and arrange viewings or commercial follow-up where relevant.',
      },
      {
        cz: 'Právním základem je váš souhlas udělený zaškrtnutím pole ve formuláři a případně jednání před uzavřením smlouvy (čl. 6 odst. 1 písm. a) a b) GDPR).',
        en: 'The legal bases are your consent given via the form checkbox and, where applicable, steps taken before entering into a contract (Art. 6(1)(a) and (b) GDPR).',
      },
    ],
  },
  {
    heading: {
      cz: '4. Doba uchování údajů',
      en: '4. Data retention',
    },
    paragraphs: [
      {
        cz: 'Údaje z poptávky uchováváme po dobu nezbytnou k vyřízení dotazu a následné komunikace, nejdéle však 3 roky od posledního kontaktu, pokud zákon nestanoví jinak.',
        en: 'Inquiry data is kept for as long as needed to handle the request and follow up, for a maximum of 3 years from the last contact unless law requires otherwise.',
      },
    ],
  },
  {
    heading: {
      cz: '5. Příjemci a zpracovatelé',
      en: '5. Recipients and processors',
    },
    paragraphs: [
      {
        cz: 'Údaje mohou být zpřístupněny realitním zástupcům projektu (LVL Reality) a technickým poskytovatelům zajišťujícím provoz webu a odesílání e-mailů, vždy v nezbytném rozsahu.',
        en: 'Data may be shared with project real estate representatives (LVL Reality) and technical providers operating the website and e-mail delivery, always to the minimum extent necessary.',
      },
    ],
  },
  {
    heading: {
      cz: '6. Vaše práva',
      en: '6. Your rights',
    },
    paragraphs: [
      {
        cz: 'Máte právo na přístup k údajům, opravu, výmaz, omezení zpracování, přenositelnost, vznést námitku a odvolat souhlas. Odvolání souhlasu nemá vliv na zákonnost zpracování před jeho odvoláním.',
        en: 'You have the right to access, rectify, erase, restrict processing, data portability, object, and withdraw consent. Withdrawal does not affect the lawfulness of processing before withdrawal.',
      },
      {
        cz: 'Stížnost můžete podat u Úřadu pro ochranu osobních údajů (www.uoou.cz).',
        en: 'You may lodge a complaint with the Czech Office for Personal Data Protection (www.uoou.cz).',
      },
    ],
  },
  {
    heading: {
      cz: '7. Cookies a marketingové měření',
      en: '7. Cookies and marketing measurement',
    },
    paragraphs: [
      {
        cz: 'Volitelné cookies a marketingové skripty (např. Sklik, Google Ads) aktivujeme až po vašem souhlasu v cookie liště. Nastavení můžete kdykoli změnit v patičce webu.',
        en: 'Optional cookies and marketing scripts (e.g. Sklik, Google Ads) are activated only after your consent in the cookie banner. You can change your choice anytime in the site footer.',
      },
    ],
  },
]
