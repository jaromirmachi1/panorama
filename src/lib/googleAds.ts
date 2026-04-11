/** Google Ads conversion label from the shared lead-form action */
export const GOOGLE_ADS_LEAD_CONVERSION_SEND_TO =
  "AW-18073640000/k7VTCK606JkcEMC4l6pD" as const;

/**
 * Fires after a lead form is successfully submitted (SPA — no thank-you URL).
 * Matches Google’s snippet; optional `value` / `currency` for transaction-style reporting.
 */
export function reportGoogleAdsLeadConversion(overrides?: {
  value?: number;
  currency?: string;
}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_LEAD_CONVERSION_SEND_TO,
    value: overrides?.value ?? 1.0,
    currency: overrides?.currency ?? "CZK",
  });
}
