export const PRIVACY_POLICY_PATH = '/ochrana-osobnich-udaju' as const

const PRIVACY_POLICY_ALIASES = [
  PRIVACY_POLICY_PATH,
  '/privacy-policy',
  '/gdpr',
] as const

export function isPrivacyPolicyPath(pathname: string) {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return PRIVACY_POLICY_ALIASES.some(
    (alias) => normalized === alias.replace(/\/$/, ''),
  )
}

export function privacyPolicyHref() {
  return PRIVACY_POLICY_PATH
}
