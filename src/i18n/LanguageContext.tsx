import React, { createContext, useContext, useEffect } from 'react'
import en, { type TranslationKey } from './en'
import de from './de'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

export type Language = 'en' | 'de'

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, de }

function detectDefaultLanguage(): Language {
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('de')) return 'de'
  return 'en'
}

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useLocalStorageState<Language>('paradiso.language', detectDefaultLanguage())

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t: LanguageContextValue['t'] = (key, vars) => {
    let str = dictionaries[language][key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v))
      }
    }
    return str
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
