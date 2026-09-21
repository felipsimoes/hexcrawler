import {
  HEX_BADGE_RADIUS,
  HEX_GAP,
  HEX_POSITIONS,
  HEX_SIZE,
  axialToPixel,
  badgePosition,
  getGridBounds,
  hexPolygonPoints,
} from '../data/hex-layout'
import { resolveImageSrc } from '../lib/tiles'
import { useI18n } from '../i18n'
import type { HexCell } from '../types/map'

interface HexGridProps {
  hexes: HexCell[]
  selectedHexId?: number
  interactive?: boolean
  size?: number
  onSelectHex?: (id: number) => void
  onOpenHex?: (id: number) => void
  showLabels?: boolean
  className?: string
}

export function HexGrid({
  hexes,
  selectedHexId,
  interactive = false,
  size = HEX_SIZE,
  onSelectHex,
  onOpenHex,
  showLabels = true,
  className,
}: HexGridProps) {
  const { t } = useI18n()
  const hexMap = new Map(hexes.map((h) => [h.id, h]))
  const bounds = getGridBounds(size)
  const padding = 4
  const viewWidth = bounds.width + padding * 2
  const viewHeight = bounds.height + padding * 2
  const offsetX = -bounds.minX + padding
  const offsetY = -bounds.minY + padding
  const drawSize = size - HEX_GAP
  const gridCenterX = (bounds.minX + bounds.maxX) / 2 + offsetX
  const gridCenterY = (bounds.minY + bounds.maxY) / 2 + offsetY

  return (
    <svg
      className={className ? `hex-grid ${className}` : 'hex-grid'}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      width={viewWidth}
      height={viewHeight}
      preserveAspectRatio="xMidYMid meet"
      role={interactive ? 'listbox' : 'img'}
      aria-label={t('hexGrid.ariaLabel')}
    >
      <defs>
        {HEX_POSITIONS.map((pos) => {
          const { x, y } = axialToPixel(pos.q, pos.r, size)
          const cx = x + offsetX
          const cy = y + offsetY
          const clipId = `hex-clip-${pos.id}`
          return (
            <clipPath key={clipId} id={clipId}>
              <polygon points={hexPolygonPoints(cx, cy, drawSize)} />
            </clipPath>
          )
        })}
      </defs>

      {HEX_POSITIONS.map((pos) => {
        const hex = hexMap.get(pos.id)
        const { x, y } = axialToPixel(pos.q, pos.r, size)
        const cx = x + offsetX
        const cy = y + offsetY
        const points = hexPolygonPoints(cx, cy, drawSize)
        const isSelected = selectedHexId === pos.id
        const badge = badgePosition(cx, cy, drawSize, gridCenterX, gridCenterY)
        const imageSrc = resolveImageSrc(hex?.imageDataUrl ?? null)

        return (
          <g
            key={pos.id}
            className={`hex-cell${isSelected ? ' hex-cell--selected' : ''}${interactive ? ' hex-cell--interactive' : ''}`}
            onClick={interactive ? () => onSelectHex?.(pos.id) : undefined}
            onDoubleClick={
              interactive && hex?.subMap ? () => onOpenHex?.(pos.id) : undefined
            }
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectHex?.(pos.id)
                    }
                  }
                : undefined
            }
            role={interactive ? 'option' : undefined}
            aria-selected={interactive ? isSelected : undefined}
            tabIndex={interactive ? 0 : undefined}
          >
            <polygon className="hex-cell__shape" points={points} />
            {imageSrc ? (
              <image
                href={imageSrc}
                x={cx - drawSize}
                y={cy - drawSize}
                width={drawSize * 2}
                height={drawSize * 2}
                clipPath={`url(#hex-clip-${pos.id})`}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <g clipPath={`url(#hex-clip-${pos.id})`}>
                <rect
                  x={cx - drawSize}
                  y={cy - drawSize}
                  width={drawSize * 2}
                  height={drawSize * 2}
                  className="hex-cell__placeholder"
                />
                <text x={cx} y={cy + 4} className="hex-cell__placeholder-icon" textAnchor="middle">
                  ✎
                </text>
              </g>
            )}
            {showLabels && hex?.name && (
              <foreignObject
                x={cx - drawSize * 0.72}
                y={cy - 14}
                width={drawSize * 1.44}
                height={28}
              >
                <div xmlns="http://www.w3.org/1999/xhtml" className="hex-cell__name">{hex.name}</div>
              </foreignObject>
            )}
            <polygon className="hex-cell__border" points={points} />
            {hex?.subMap && (
              <circle
                className="hex-cell__expand-mark"
                cx={cx}
                cy={cy + drawSize * 0.55}
                r={4}
              />
            )}
            <g className="hex-cell__badge">
              <circle cx={badge.x} cy={badge.y} r={HEX_BADGE_RADIUS} />
              <text x={badge.x} y={badge.y + 4} textAnchor="middle">
                {pos.id}
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}
