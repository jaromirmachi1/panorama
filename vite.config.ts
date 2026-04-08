import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Replaces %SITE_URL% in index.html (no trailing slash). Set VITE_SITE_URL for staging. */
function siteUrlHtmlPlugin(siteUrl: string): Plugin {
  return {
    name: 'html-site-url',
    transformIndexHtml(html) {
      return html.replace(/%SITE_URL%/g, siteUrl)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://panorama-zabiny.cz').replace(
    /\/$/,
    '',
  )
  return {
    plugins: [react(), siteUrlHtmlPlugin(siteUrl)],
  }
})
