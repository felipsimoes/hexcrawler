import { useState } from 'react'
import { useI18n } from '../i18n'
import {
  TILE_CATEGORIES,
  getTilesByCategory,
  isTileReference,
  toTileReference,
} from '../lib/tiles'

interface TilePickerProps {
  selectedValue: string | null
  onSelect: (imageDataUrl: string) => void
}

export function TilePicker({ selectedValue, onSelect }: TilePickerProps) {
  const { t } = useI18n()
  const [category, setCategory] = useState(TILE_CATEGORIES[0] ?? 'foundation')
  const tiles = getTilesByCategory(category)

  const selectedTileId =
    selectedValue && isTileReference(selectedValue) ? selectedValue.slice('tile:'.length) : null

  const categoryLabel = (cat: string) => {
    const key = `tiles.${cat}` as const
    const translated = t(key)
    return translated === key ? cat : translated
  }

  return (
    <div className="tile-picker">
      <div className="tile-picker__header">
        <span className="tile-picker__label">{t('tilePicker.choose')}</span>
        <div className="tile-picker__categories">
          {TILE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`tile-picker__category${cat === category ? ' tile-picker__category--active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>
      <div className="tile-picker__grid">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            className={`tile-picker__item${selectedTileId === tile.id ? ' tile-picker__item--selected' : ''}`}
            onClick={() => onSelect(toTileReference(tile.id))}
            title={tile.label}
          >
            <img src={tile.url} alt={tile.label} loading="lazy" />
            <span>{tile.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
