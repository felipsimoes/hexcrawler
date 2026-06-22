import type { Faction, HexCrawlerMap, HexCell } from '../types/map'
import { EMPTY_TEMPLATE } from '../data/empty-template'

function isStringArray(value: unknown, length: number): value is string[] {
  return Array.isArray(value) && value.length === length && value.every((v) => typeof v === 'string')
}

function isHexCell(value: unknown): value is HexCell {
  if (!value || typeof value !== 'object') return false
  const hex = value as HexCell
  return (
    typeof hex.id === 'number' &&
    typeof hex.name === 'string' &&
    typeof hex.description === 'string' &&
    (hex.imageDataUrl === null || typeof hex.imageDataUrl === 'string')
  )
}

function isFaction(value: unknown): value is Faction {
  if (!value || typeof value !== 'object') return false
  const faction = value as Faction
  if (typeof faction.name !== 'string') return false
  if (!Array.isArray(faction.resources) || !faction.resources.every((r) => typeof r === 'string')) {
    return false
  }
  if (!Array.isArray(faction.goals)) return false
  return faction.goals.every(
    (g) =>
      g &&
      typeof g === 'object' &&
      typeof g.text === 'string' &&
      typeof g.clockSlots === 'number' &&
      g.clockSlots >= 3 &&
      g.clockSlots <= 5,
  )
}

export function validateMap(data: unknown): HexCrawlerMap {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid file: expected a JSON object.')
  }

  const map = data as HexCrawlerMap

  if (map.version !== 1) {
    throw new Error('Unsupported map version. Expected version 1.')
  }

  if (typeof map.title !== 'string') {
    throw new Error('Invalid map: title must be a string.')
  }

  if (!Array.isArray(map.hexes) || map.hexes.length !== 19 || !map.hexes.every(isHexCell)) {
    throw new Error('Invalid map: expected exactly 19 hex entries.')
  }

  const ids = map.hexes.map((h) => h.id).sort((a, b) => a - b)
  const expectedIds = Array.from({ length: 19 }, (_, i) => i + 1)
  if (ids.some((id, i) => id !== expectedIds[i])) {
    throw new Error('Invalid map: hex ids must be 1 through 19.')
  }

  if (!isStringArray(map.encounters, 6)) {
    throw new Error('Invalid map: expected 6 encounter entries.')
  }

  if (!isStringArray(map.rumours, 6)) {
    throw new Error('Invalid map: expected 6 rumour entries.')
  }

  if (!Array.isArray(map.factions) || map.factions.length !== 3 || !map.factions.every(isFaction)) {
    throw new Error('Invalid map: expected 3 factions.')
  }

  return structuredClone(map)
}

export function cloneMap(map: HexCrawlerMap): HexCrawlerMap {
  return structuredClone(map)
}

export function createEmptyMap(): HexCrawlerMap {
  return cloneMap(EMPTY_TEMPLATE)
}
