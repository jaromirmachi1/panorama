/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional absolute origin for the inquiry API (no trailing slash).
   * Use when running `vite` alone to point at a deployed preview: `https://your-app.vercel.app`
   */
  readonly VITE_INQUIRY_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
