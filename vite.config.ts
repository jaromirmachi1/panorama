import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * index.html: %SITE_URL% → canonical origin; optional Google Search Console meta from env.
 */
function indexHtmlPlugin(siteUrl: string, googleSiteVerification?: string): Plugin {
  return {
    name: 'index-html',
    transformIndexHtml(html) {
      let out = html.replace(/%SITE_URL%/g, siteUrl)
      const gsc = googleSiteVerification?.trim()
      if (gsc) {
        const safe = gsc.replace(/"/g, '&quot;')
        out = out.replace(
          /<!--\s*VITE_GSC_VERIFICATION\s*-->/,
          `<meta name="google-site-verification" content="${safe}" />`,
        )
      } else {
        out = out.replace(/\s*<!--\s*VITE_GSC_VERIFICATION\s*-->/, '')
      }
      return out
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://panoramazabiny.cz').replace(
    /\/$/,
    '',
  )
  return {
    plugins: [
      react(),
      indexHtmlPlugin(siteUrl, env.VITE_GOOGLE_SITE_VERIFICATION),
    ],
  }
})
