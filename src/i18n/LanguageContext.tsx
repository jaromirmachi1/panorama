/* eslint react-refresh/only-export-components: off */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'cz' | 'en'

type LangContextValue = {
  lang: Lang
  toggleLang: () => void
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'cz'
    const stored = window.localStorage.getItem('lang')
    if (stored === 'cz' || stored === 'en') return stored
    return 'cz'
  })

  const value = useMemo<LangContextValue>(() => {
    return {
      lang,
      toggleLang: () => setLang((l) => (l === 'cz' ? 'en' : 'cz')),
      setLang: (l) => {
        setLang(l)
        window.localStorage.setItem('lang', l)
      },
    }
  }, [lang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}

