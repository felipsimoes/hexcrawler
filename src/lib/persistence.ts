import type { HexCrawlerMap } from '../types/map'
import { validateMap } from './validation'

const STORAGE_KEY = 'hexcrawler-draft'

export function saveToLocalStorage(map: HexCrawlerMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Quota exceeded or private browsing — ignore
  }
}

export function loadFromLocalStorage(): HexCrawlerMap | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return validateMap(JSON.parse(raw))
  } catch {
    return null
  }
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function sanitizeFilename(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'hexcrawl-map'
}

export function exportMap(map: HexCrawlerMap): void {
  const json = JSON.stringify(map, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${sanitizeFilename(map.title)}.hexcrawl.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function importMapFromFile(file: File): Promise<HexCrawlerMap> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        resolve(validateMap(data))
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Could not parse map file.'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsText(file)
  })
}

export function isHexcrawlFile(file: File): boolean {
  return file.name.endsWith('.json') || file.name.endsWith('.hexcrawl.json') || file.type === 'application/json'
}
