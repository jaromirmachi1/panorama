import { hasMarketingConsent } from './cookieConsent'

const SKLIK_RC_SRC = 'https://c.seznam.cz/js/rc.js'
const SKLIK_RTG_ID = 1691901
const SKLIK_FORM_CONVERSION_ID = 100278556
const SKLIK_CONTACT_CONVERSION_ID = 100278555

type SklikConsent = 0 | 1

let loadPromise: Promise<void> | null = null

function getSklikConsent(): SklikConsent {
  return hasMarketingConsent() ? 1 : 0
}

function loadSklikRc(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const finish = () => resolve()

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SKLIK_RC_SRC}"]`,
    )
    if (existing) {
      if (window.rc) {
        finish()
        return
      }
      existing.addEventListener('load', finish, { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('Sklik rc.js failed to load')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = SKLIK_RC_SRC
    script.async = true
    script.onload = finish
    script.onerror = () => reject(new Error('Sklik rc.js failed to load'))
    document.head.appendChild(script)
  })

  return loadPromise
}

function updateIdentities() {
  window.sznIVA?.IS?.updateIdentities({ eid: null })
}

async function withSklikReady(run: () => void) {
  try {
    await loadSklikRc()
    updateIdentities()
    run()
  } catch (error) {
    console.warn('[sklik]', error)
  }
}

/** Site-wide retargeting hit — consent 0 before marketing consent, 1 after. */
export function fireSklikRetargeting() {
  withSklikReady(() => {
    window.rc?.retargetingHit({
      rtgId: SKLIK_RTG_ID,
      consent: getSklikConsent(),
    })
  })
}

/** Form submission conversion (thank-you state in inquiry modal). */
export function reportSklikFormConversion(value?: number | null) {
  withSklikReady(() => {
    window.rc?.conversionHit({
      id: SKLIK_FORM_CONVERSION_ID,
      value: value ?? null,
      consent: getSklikConsent(),
    })
  })
}

/** Phone or email contact conversion (click-to-call / mailto). */
export function reportSklikContactConversion() {
  withSklikReady(() => {
    window.rc?.conversionHit({
      id: SKLIK_CONTACT_CONVERSION_ID,
      value: null,
      consent: getSklikConsent(),
    })
  })
}

export function applySklikConsent() {
  fireSklikRetargeting()
}
