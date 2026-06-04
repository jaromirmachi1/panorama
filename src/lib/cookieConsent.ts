export type CookieConsentPreferences = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

export const COOKIE_CONSENT_STORAGE_KEY = 'panorama_cookie_consent_v1'
export const COOKIE_SETTINGS_EVENT = 'panorama:open-cookie-settings'

export function getCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as Partial<CookieConsentPreferences>
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    }
  } catch {
    return null
  }
}

export function saveCookieConsent(preferences: CookieConsentPreferences) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    COOKIE_CONSENT_STORAGE_KEY,
    JSON.stringify({
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      updatedAt: new Date().toISOString(),
    }),
  )

  window.dispatchEvent(
    new CustomEvent<CookieConsentPreferences>('panorama:cookie-consent', {
      detail: preferences,
    }),
  )
}

export function hasMarketingConsent() {
  return getCookieConsent()?.marketing === true
}
