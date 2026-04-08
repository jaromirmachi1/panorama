/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Public site origin (no trailing slash). Canonical URLs, OG/Twitter images, JSON-LD.
   * Default in build: https://panoramazabiny.cz
   */
  readonly VITE_SITE_URL?: string;
  /** Google Search Console — HTML tag verification `content` value only */
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
  /**
   * Optional absolute origin for the inquiry API (no trailing slash).
   * Use when running `vite` alone to point at a deployed preview: `https://your-app.vercel.app`
   */
  readonly VITE_INQUIRY_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
