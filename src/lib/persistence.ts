import type { HexCrawlerMap } from '../types/map'
import { urlToDataUrl } from './images'
import { isTileReference, resolveImageSrc } from './tiles'
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

export async function embedTileReferences(map: HexCrawlerMap): Promise<HexCrawlerMap> {
  const hexes = await Promise.all(
    map.hexes.map(async (hex) => {
      let next = hex
      if (hex.imageDataUrl && isTileReference(hex.imageDataUrl)) {
        const url = resolveImageSrc(hex.imageDataUrl)
        if (!url) {
          next = { ...hex, imageDataUrl: null }
        } else {
          try {
            const dataUrl = await urlToDataUrl(url)
            next = { ...hex, imageDataUrl: dataUrl }
          } catch {
            next = hex
          }
        }
      }
      if (next.subMap) {
        next = { ...next, subMap: await embedTileReferences(next.subMap) }
      }
      return next
    }),
  )
  return { ...map, hexes }
}

export async function exportMap(map: HexCrawlerMap): Promise<void> {
  const embedded = await embedTileReferences(map)
  const json = JSON.stringify(embedded, null, 2)
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
        reject(err instanceof Error ? err : new Error('errors.parseFailed'))
      }
    }
    reader.onerror = () => reject(new Error('errors.readFileFailed'))
    reader.readAsText(file)
  })
}

export function isHexcrawlFile(file: File): boolean {
  return file.name.endsWith('.json') || file.name.endsWith('.hexcrawl.json') || file.type === 'application/json'
}
