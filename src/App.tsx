import { useLayoutEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './styles/GlobalStyle'
import { theme } from './styles/theme'
import { Loader } from './components/Loader'
import { Layout } from './components/Layout'
import { Hero } from './components/Hero'
import { ProjectIntro } from './components/sections/ProjectIntro'
import { ApartmentSection } from './components/sections/ApartmentSection'
import { Gallery } from './components/sections/Gallery'
import { Features } from './components/sections/Features'
import { ContactCTA } from './components/sections/ContactCTA'
import { Footer } from './components/Footer'
import { SiteClosing } from './components/SiteClosing'
import { LanguageProvider } from './i18n/LanguageContext'

function isReloadNavigation(): boolean {
  const nav = performance.getEntriesByType?.(
    'navigation',
  )?.[0] as PerformanceNavigationTiming | undefined
  return nav?.type === 'reload'
}

export default function App() {
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
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {!ready && <Loader onComplete={() => setReady(true)} />}
        <Layout ariaHidden={!ready}>
          <Hero />
          <ProjectIntro />
          <ApartmentSection />
          <Gallery />
          <Features />
          <SiteClosing>
            <ContactCTA />
            <Footer />
          </SiteClosing>
        </Layout>
      </ThemeProvider>
    </LanguageProvider>
  )
}
