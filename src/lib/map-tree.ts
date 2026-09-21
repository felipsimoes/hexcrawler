import { createEmptyTemplate } from '../data/empty-template'
import type { HexCrawlerMap, MapPath, PrintPage } from '../types/map'
import { cloneMap } from './validation'

export function getMapAtPath(root: HexCrawlerMap, path: MapPath): HexCrawlerMap {
  let current = root
  for (const hexId of path) {
    const hex = current.hexes.find((h) => h.id === hexId)
    if (!hex?.subMap) {
      throw new Error(`No sub-map at hex ${hexId}`)
    }
    current = hex.subMap
  }
  return current
}

export function updateMapAtPath(
  root: HexCrawlerMap,
  path: MapPath,
  updater: (map: HexCrawlerMap) => HexCrawlerMap,
): HexCrawlerMap {
  if (path.length === 0) {
    return updater(root)
  }

  const [hexId, ...rest] = path
  return {
    ...root,
    hexes: root.hexes.map((hex) => {
      if (hex.id !== hexId || !hex.subMap) return hex
      return {
        ...hex,
        subMap: updateMapAtPath(hex.subMap, rest, updater),
      }
    }),
  }
}

export function createSubMap(
  title: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): HexCrawlerMap {
  const blank = createEmptyTemplate(t)
  return { ...blank, title: title || t('defaults.untitledMap') }
}

export function expandHex(
  root: HexCrawlerMap,
  path: MapPath,
  hexId: number,
  t: (key: string, params?: Record<string, string | number>) => string,
): HexCrawlerMap {
  return updateMapAtPath(root, path, (map) => ({
    ...map,
    hexes: map.hexes.map((hex) => {
      if (hex.id !== hexId || hex.subMap) return hex
      const title = hex.name || t('nested.subMapTitle', { id: hexId })
      return { ...hex, subMap: createSubMap(title, t) }
    }),
  }))
}

export function removeSubMap(root: HexCrawlerMap, path: MapPath, hexId: number): HexCrawlerMap {
  return updateMapAtPath(root, path, (map) => ({
    ...map,
    hexes: map.hexes.map((hex) => {
      if (hex.id !== hexId) return hex
      return {
        id: hex.id,
        name: hex.name,
        description: hex.description,
        imageDataUrl: hex.imageDataUrl,
      }
    }),
  }))
}

export function collectPrintPages(root: HexCrawlerMap): PrintPage[] {
  const pages: PrintPage[] = []

  function walk(map: HexCrawlerMap, path: MapPath, labelParts: string[]) {
    const label = labelParts.filter(Boolean).join(' › ') || map.title
    pages.push({ map, path, label })

    for (const hex of map.hexes) {
      if (!hex.subMap) continue
      const part = hex.name ? `${hex.id}. ${hex.name}` : `${hex.id}`
      walk(hex.subMap, [...path, hex.id], [...labelParts, part])
    }
  }

  walk(root, [], [root.title])
  return pages
}

export function breadcrumbSegments(
  root: HexCrawlerMap,
  path: MapPath,
): Array<{ label: string; path: MapPath }> {
  const segments: Array<{ label: string; path: MapPath }> = [
    { label: root.title || 'Map', path: [] },
  ]

  let current = root
  const walked: MapPath = []

  for (const hexId of path) {
    const hex = current.hexes.find((h) => h.id === hexId)
    if (!hex?.subMap) break
    walked.push(hexId)
    segments.push({
      label: hex.name || `#${hexId}`,
      path: [...walked],
    })
    current = hex.subMap
  }

  return segments
}

export function cloneRoot(map: HexCrawlerMap): HexCrawlerMap {
  return cloneMap(map)
}
