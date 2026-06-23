import { useContext } from 'react'
import { I18nContext, type I18nContextValue } from './i18n-context'

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

export function translateError(message: string, t: I18nContextValue['t']): string {
  if (message.startsWith('errors.') || message.startsWith('messages.')) {
    return t(message)
  }
  return message
}
