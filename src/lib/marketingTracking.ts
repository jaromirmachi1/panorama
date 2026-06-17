import type { CookieConsentPreferences } from './cookieConsent'
import { applyCookieConsent as applyGoogleAdsConsent } from './googleAds'
import { fireSklikRetargeting } from './sklik'

export function applyMarketingConsent(
  preferences: CookieConsentPreferences | null,
) {
  applyGoogleAdsConsent(preferences)
  fireSklikRetargeting()
}

export function initMarketingTracking() {
  fireSklikRetargeting()
}
