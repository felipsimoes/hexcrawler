export interface HexPosition {
  id: number
  q: number
  r: number
}

function cubeDistance(q: number, r: number): number {
  const s = -q - r
  return Math.max(Math.abs(q), Math.abs(r), Math.abs(s))
}

function ringCoords(radius: number): Array<{ q: number; r: number }> {
  if (radius === 0) return [{ q: 0, r: 0 }]
  const coords: Array<{ q: number; r: number }> = []
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      if (cubeDistance(q, r) === radius) coords.push({ q, r })
    }
  }
  return coords
}

/** Pointy-top pixel position from axial coordinates. */
export function axialToPixel(q: number, r: number, size: number): { x: number; y: number } {
  const x = size * Math.sqrt(3) * (q + r / 2)
  const y = size * (3 / 2) * r
  return { x, y }
}

/** Sort hexes clockwise starting from the top. */
function sortClockwiseFromTop(coords: Array<{ q: number; r: number }>): Array<{ q: number; r: number }> {
  return [...coords].sort((a, b) => {
    const pa = axialToPixel(a.q, a.r, 1)
    const pb = axialToPixel(b.q, b.r, 1)
    let angleA = Math.atan2(pa.y, pa.x) + Math.PI / 2
    let angleB = Math.atan2(pb.y, pb.x) + Math.PI / 2
    if (angleA < 0) angleA += Math.PI * 2
    if (angleB < 0) angleB += Math.PI * 2
    return angleA - angleB
  })
}

function buildHexPositions(): HexPosition[] {
  const positions: HexPosition[] = [{ id: 1, q: 0, r: 0 }]
  let id = 2

  for (const radius of [1, 2]) {
    const ring = sortClockwiseFromTop(ringCoords(radius))
    for (const { q, r } of ring) {
      positions.push({ id, q, r })
      id++
    }
  }

  return positions
}

/**
 * Classic honeycomb cluster: 1 center + 6 neighbors + 12 outer ring = 19 hexes.
 * Each hex shares sides with its neighbors (radius-2 axial grid).
 */
export const HEX_POSITIONS: HexPosition[] = buildHexPositions()

export const HEX_SIZE = 52
export const HEX_GAP = 0
export const HEX_BADGE_RADIUS = 10
export const HEX_BADGE_OUTSET = 11

/** Pointy-top hex vertices (point at top and bottom). */
export function hexPolygonPoints(cx: number, cy: number, size: number): string {
  const points: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = ((60 * i - 90) * Math.PI) / 180
    const x = cx + size * Math.cos(angle)
    const y = cy + size * Math.sin(angle)
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}

export function getGridBounds(size: number) {
  const halfWidth = (Math.sqrt(3) / 2) * size
  const halfHeight = size
  const badgeR = HEX_BADGE_RADIUS + 2

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  const centers: Array<{ x: number; y: number }> = []

  for (const pos of HEX_POSITIONS) {
    const { x, y } = axialToPixel(pos.q, pos.r, size)
    centers.push({ x, y })
    minX = Math.min(minX, x - halfWidth)
    maxX = Math.max(maxX, x + halfWidth)
    minY = Math.min(minY, y - halfHeight)
    maxY = Math.max(maxY, y + halfHeight)
  }

  const gridCenterX = (minX + maxX) / 2
  const gridCenterY = (minY + maxY) / 2

  for (const { x, y } of centers) {
    const badge = badgePosition(x, y, size, gridCenterX, gridCenterY)
    minX = Math.min(minX, x - halfWidth, badge.x - badgeR)
    maxX = Math.max(maxX, x + halfWidth, badge.x + badgeR)
    minY = Math.min(minY, y - halfHeight, badge.y - badgeR)
    maxY = Math.max(maxY, y + halfHeight, badge.y + badgeR)
  }

  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY }
}

/** Place number badge on the outward-facing edge of each hex. */
export function badgePosition(
  cx: number,
  cy: number,
  size: number,
  gridCenterX: number,
  gridCenterY: number,
): { x: number; y: number } {
  const dx = cx - gridCenterX
  const dy = cy - gridCenterY
  const dist = size + HEX_BADGE_OUTSET

  if (Math.hypot(dx, dy) < size * 0.15) {
    return { x: cx, y: cy - dist }
  }

  const angle = Math.atan2(dy, dx)
  return {
    x: cx + dist * Math.cos(angle),
    y: cy + dist * Math.sin(angle),
  }
}
