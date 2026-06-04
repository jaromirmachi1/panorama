import {
  getCookieConsent,
  hasMarketingConsent,
  type CookieConsentPreferences,
} from './cookieConsent'

const GOOGLE_ADS_ID = 'AW-18073640000'

/** Google Ads conversion label from the shared lead-form action */
export const GOOGLE_ADS_LEAD_CONVERSION_SEND_TO =
  'AW-18073640000/k7VTCK606JkcEMC4l6pD' as const

let googleAdsLoading = false

export function loadGoogleAds(preferences = getCookieConsent()) {
  if (
    typeof window === 'undefined' ||
    googleAdsLoading ||
    preferences?.marketing !== true
  ) {
    return
  }

  googleAdsLoading = true
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }

  window.gtag('js', new Date())
  window.gtag('config', GOOGLE_ADS_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`
  document.head.appendChild(script)
}

export function applyCookieConsent(preferences: CookieConsentPreferences | null) {
  if (preferences?.marketing) {
    loadGoogleAds(preferences)
  }
}

/**
 * Fires after a lead form is successfully submitted (SPA — no thank-you URL).
 * Matches Google’s snippet; optional `value` / `currency` for transaction-style reporting.
 */
export function reportGoogleAdsLeadConversion(overrides?: {
  value?: number
  currency?: string
}) {
  if (typeof window === 'undefined' || !hasMarketingConsent()) {
    return
  }

  loadGoogleAds()
  if (typeof window.gtag !== 'function') return

  window.gtag('event', 'conversion', {
    send_to: GOOGLE_ADS_LEAD_CONVERSION_SEND_TO,
    value: overrides?.value ?? 1.0,
    currency: overrides?.currency ?? 'CZK',
  })
}
