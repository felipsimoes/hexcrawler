import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  I18nContext,
  detectLocale,
  getNestedValue,
  interpolate,
  LOCALE_STORAGE_KEY,
} from './i18n-context'
import { messages, type Messages } from './messages'
import type { Locale } from './types'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const catalog = messages[locale] as Messages
      const text = getNestedValue(catalog as unknown as Record<string, unknown>, key) ?? key
      return interpolate(text, params)
    },
    [locale],
  )

  useEffect(() => {
    document.documentElement.lang = locale === 'pt-BR' ? 'pt-BR' : 'en'
    document.title = t('app.title')
  }, [locale, t])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
