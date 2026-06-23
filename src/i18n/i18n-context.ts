import { createContext } from 'react'
import type { Locale } from './types'

export interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export const LOCALE_STORAGE_KEY = 'hexcrawler-locale'

export function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((current, part) => {
    if (typeof current !== 'object' || current === null) return undefined
    return (current as Record<string, unknown>)[part]
  }, obj)
  return typeof value === 'string' ? value : undefined
}

export function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    text,
  )
}

export function detectLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored === 'en' || stored === 'pt-BR') return stored
  const browser = navigator.language.toLowerCase()
  if (browser.startsWith('pt')) return 'pt-BR'
  return 'en'
}
