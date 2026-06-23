import { en } from './locales/en'
import { ptBR } from './locales/pt-BR'
import type { Locale } from './types'

export const messages = {
  en,
  'pt-BR': ptBR,
} as const

export type Messages = (typeof messages)[Locale]
