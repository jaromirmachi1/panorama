import { useState } from 'react'
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
import { LanguageProvider } from './i18n/LanguageContext'

export default function App() {
  const [ready, setReady] = useState(false)

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
          <ContactCTA />
          <Footer />
        </Layout>
      </ThemeProvider>
    </LanguageProvider>
  )
}
