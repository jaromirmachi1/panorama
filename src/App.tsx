import { useEffect, useLayoutEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './styles/GlobalStyle'
import { theme } from './styles/theme'
import { Loader } from './components/Loader'
import { Layout } from './components/Layout'
import { Hero } from './components/Hero'
import { ProjectIntro } from './components/sections/ProjectIntro'
import { ApartmentSection } from './components/sections/ApartmentSection'
import { Gallery } from './components/sections/Gallery'
import { InteriorStandards } from './components/sections/InteriorStandards'
import { Features } from './components/sections/Features'
import { ContactCTA } from './components/sections/ContactCTA'
import { Footer } from './components/Footer'
import { SiteClosing } from './components/SiteClosing'
import { CookieConsent } from './components/CookieConsent'
import { LanguageProvider } from './i18n/LanguageContext'
import { usePathname } from './hooks/usePathname'
import { initMarketingTracking } from './lib/marketingTracking'
import { isPrivacyPolicyPath } from './lib/siteRoutes'
import { GdprPage } from './pages/GdprPage'

function isReloadNavigation(): boolean {
  const nav = performance.getEntriesByType?.(
    'navigation',
  )?.[0] as PerformanceNavigationTiming | undefined
  return nav?.type === 'reload'
}

function HomePage() {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    if (!isReloadNavigation()) return
    const { pathname, search, hash } = window.location
    if (hash) {
      window.history.replaceState(null, '', pathname + search)
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      {!ready && <Loader onComplete={() => setReady(true)} />}
      <Layout ariaHidden={!ready}>
        <Hero />
        <ProjectIntro />
        <ApartmentSection />
        <Gallery />
        <InteriorStandards />
        <Features />
        <SiteClosing>
          <ContactCTA />
          <Footer />
        </SiteClosing>
      </Layout>
    </>
  )
}

export default function App() {
  const pathname = usePathname()
  const showPrivacyPage = isPrivacyPolicyPath(pathname)

  useEffect(() => {
    initMarketingTracking()
  }, [])

  useEffect(() => {
    if (showPrivacyPage) {
      window.scrollTo(0, 0)
    }
  }, [showPrivacyPage])

  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {showPrivacyPage ? <GdprPage /> : <HomePage />}
        <CookieConsent />
      </ThemeProvider>
    </LanguageProvider>
  )
}
