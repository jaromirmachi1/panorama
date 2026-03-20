function svgToDataUri(svg: string) {
  // Using utf8 + encodeURIComponent keeps it simple and self-contained.
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const baseSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b0b"/>
      <stop offset="0.55" stop-color="#1a1a1a"/>
      <stop offset="1" stop-color="#0f0f0f"/>
    </linearGradient>
    <radialGradient id="r" cx="30%" cy="20%" r="80%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="0.6" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  <rect width="1600" height="1000" fill="url(#r)"/>
  <g opacity="0.35">
    <rect x="220" y="160" width="520" height="680" fill="#ffffff" fill-opacity="0.06"/>
    <rect x="760" y="120" width="620" height="720" fill="#ffffff" fill-opacity="0.04"/>
    <rect x="300" y="260" width="380" height="120" fill="#ffffff" fill-opacity="0.06"/>
    <rect x="860" y="230" width="420" height="260" fill="#ffffff" fill-opacity="0.05"/>
  </g>
  <g fill="#ffffff" fill-opacity="0.86" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto" font-size="20" letter-spacing="6">
    <text x="84" y="88">PANORAMA ŽABINY</text>
  </g>
  <g fill="#ffffff" font-family="ui-serif,Georgia,Times New Roman,serif" font-size="110" font-weight="600">
    <text x="86" y="820" opacity="0.95">VÝHLED</text>
  </g>
  <g stroke="#ffffff" stroke-opacity="0.18" stroke-width="2">
    <path d="M70 770 C 280 620, 560 620, 760 770" fill="none"/>
    <path d="M900 850 C 1130 680, 1300 680, 1520 850" fill="none"/>
  </g>
</svg>
`

const aSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050505"/>
      <stop offset="0.5" stop-color="#141414"/>
      <stop offset="1" stop-color="#060606"/>
    </linearGradient>
    <radialGradient id="ra" cx="30%" cy="20%" r="80%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.20"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#g2)"/>
  <rect width="1600" height="1000" fill="url(#ra)"/>
  <g opacity="0.55">
    <rect x="210" y="150" width="560" height="700" fill="#ffffff" fill-opacity="0.06"/>
    <rect x="240" y="190" width="500" height="80" fill="#ffffff" fill-opacity="0.08"/>
    <rect x="760" y="120" width="650" height="720" fill="#ffffff" fill-opacity="0.03"/>
    <g fill="#ffffff" fill-opacity="0.10">
      <rect x="270" y="340" width="440" height="12"/>
      <rect x="270" y="378" width="440" height="12"/>
      <rect x="270" y="416" width="440" height="12"/>
    </g>
  </g>
  <g fill="#ffffff" fill-opacity="0.86" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto" font-size="20" letter-spacing="6">
    <text x="84" y="88">PANORAMA ŽABINY</text>
  </g>
  <g fill="#ffffff" font-family="ui-serif,Georgia,Times New Roman,serif" font-size="116" font-weight="600">
    <text x="86" y="820" opacity="0.95">BUDOVA A</text>
  </g>
  <g stroke="#ffffff" stroke-opacity="0.24" stroke-width="2">
    <path d="M70 770 C 280 610, 560 610, 760 770" fill="none"/>
    <path d="M900 850 C 1130 670, 1300 670, 1520 850" fill="none"/>
  </g>
</svg>
`

const bSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#070707"/>
      <stop offset="0.5" stop-color="#171717"/>
      <stop offset="1" stop-color="#070707"/>
    </linearGradient>
    <radialGradient id="rb" cx="70%" cy="20%" r="85%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.20"/>
      <stop offset="0.6" stop-color="#ffffff" stop-opacity="0.07"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#g3)"/>
  <rect width="1600" height="1000" fill="url(#rb)"/>
  <g opacity="0.55">
    <rect x="220" y="150" width="560" height="700" fill="#ffffff" fill-opacity="0.03"/>
    <rect x="820" y="120" width="600" height="720" fill="#ffffff" fill-opacity="0.05"/>
    <rect x="860" y="190" width="520" height="80" fill="#ffffff" fill-opacity="0.08"/>
    <g fill="#ffffff" fill-opacity="0.10">
      <rect x="900" y="340" width="440" height="12"/>
      <rect x="900" y="378" width="440" height="12"/>
      <rect x="900" y="416" width="440" height="12"/>
    </g>
  </g>
  <g fill="#ffffff" fill-opacity="0.86" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto" font-size="20" letter-spacing="6">
    <text x="84" y="88">PANORAMA ŽABINY</text>
  </g>
  <g fill="#ffffff" font-family="ui-serif,Georgia,Times New Roman,serif" font-size="116" font-weight="600">
    <text x="86" y="820" opacity="0.95">BUDOVA B</text>
  </g>
  <g stroke="#ffffff" stroke-opacity="0.24" stroke-width="2">
    <path d="M70 770 C 280 610, 560 610, 760 770" fill="none"/>
    <path d="M900 850 C 1130 670, 1300 670, 1520 850" fill="none"/>
  </g>
</svg>
`

export const apartmentImages = {
  base: {
    src: svgToDataUri(baseSvg),
    alt: 'Pohled na budovu (základní výchozí stav)',
  },
  buildingA: {
    src: svgToDataUri(aSvg),
    alt: 'Budova A — zvýrazněné podlaží',
  },
  buildingB: {
    src: svgToDataUri(bSvg),
    alt: 'Budova B — zvýrazněné podlaží',
  },
} as const

