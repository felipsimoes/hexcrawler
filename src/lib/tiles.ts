export interface TileAsset {
  id: string
  category: string
  filename: string
  label: string
  url: string
}

export const TILE_PREFIX = 'tile:'

const tileModules = import.meta.glob('../../tiles/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function parseTilePath(path: string): { category: string; filename: string } {
  const match = path.match(/\/tiles\/(.+)$/)
  const relative = match?.[1] ?? path
  const parts = relative.split('/')

  if (parts.length === 1) {
    return { category: 'foundation', filename: parts[0] }
  }

  return { category: parts[0], filename: parts[parts.length - 1] }
}

function labelFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, '')
  const stripped = withoutExt
    .replace(/^\d+-foundation_/i, '')
    .replace(/^\d+-/i, '')
    .replace(/[-_]+/g, ' ')
  return stripped.replace(/\b\w/g, (char) => char.toUpperCase())
}

function sortKey(tile: TileAsset): string {
  const numberMatch = tile.filename.match(/^(\d+)/)
  if (numberMatch) {
    return `${tile.category}:${numberMatch[1].padStart(4, '0')}:${tile.filename}`
  }
  return `${tile.category}:9999:${tile.filename}`
}

function buildCatalog(): TileAsset[] {
  return Object.entries(tileModules)
    .map(([path, url]) => {
      const { category, filename } = parseTilePath(path)
      return {
        id: `${category}/${filename}`,
        category,
        filename,
        label: labelFromFilename(filename),
        url,
      }
    })
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
}

export const TILE_CATALOG: TileAsset[] = buildCatalog()

export const TILE_CATEGORIES: string[] = [...new Set(TILE_CATALOG.map((tile) => tile.category))].sort(
  (a, b) => {
    if (a === 'foundation') return -1
    if (b === 'foundation') return 1
    return a.localeCompare(b)
  },
)

const tileById = new Map(TILE_CATALOG.map((tile) => [tile.id, tile]))

export function isTileReference(value: string): boolean {
  return value.startsWith(TILE_PREFIX)
}

export function toTileReference(tileId: string): string {
  return `${TILE_PREFIX}${tileId}`
}

export function getTileById(tileId: string): TileAsset | undefined {
  return tileById.get(tileId)
}

export function getTileUrl(tileId: string): string | undefined {
  return tileById.get(tileId)?.url
}

export function resolveImageSrc(value: string | null): string | null {
  if (!value) return null
  if (isTileReference(value)) {
    return getTileUrl(value.slice(TILE_PREFIX.length)) ?? null
  }
  return value
}

export function getTilesByCategory(category: string): TileAsset[] {
  return TILE_CATALOG.filter((tile) => tile.category === category)
}

/** Default foundation tiles for hex index 0..18 (maps to numbered foundation art). */
export function getDefaultTileRefForHex(hexIndex: number): string | null {
  const foundation = getTilesByCategory('foundation')
  const numbered = foundation
    .map((tile) => ({ tile, number: Number(tile.filename.match(/^(\d+)/)?.[1] ?? NaN) }))
    .filter((entry) => !Number.isNaN(entry.number))
    .sort((a, b) => a.number - b.number)

  const match = numbered.find((entry) => entry.number === hexIndex + 1) ?? numbered[hexIndex]
  return match ? toTileReference(match.tile.id) : null
}

export function categoryLabel(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
