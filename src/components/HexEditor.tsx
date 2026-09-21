import { useEffect, useRef, useState } from 'react'
import { useI18n, translateError } from '../i18n'
import { resizeImageToDataUrl } from '../lib/images'
import { resolveImageSrc } from '../lib/tiles'
import type { HexCell } from '../types/map'
import { TilePicker } from './TilePicker'

interface HexEditorProps {
  hex: HexCell
  hexCount: number
  onChange: (patch: Partial<HexCell>) => void
  onError: (message: string) => void
  onSelectHex: (id: number) => void
  onExpand: () => void
  onOpenSubMap: () => void
  onRemoveSubMap: () => void
}

export function HexEditor({
  hex,
  hexCount,
  onChange,
  onError,
  onSelectHex,
  onExpand,
  onOpenSubMap,
  onRemoveSubMap,
}: HexEditorProps) {
  const { t } = useI18n()
  const fileRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [tilesOpen, setTilesOpen] = useState(false)
  const previewSrc = resolveImageSrc(hex.imageDataUrl)
  const hasSubMap = Boolean(hex.subMap)

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return
    try {
      const dataUrl = await resizeImageToDataUrl(file)
      onChange({ imageDataUrl: dataUrl })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'messages.imageUploadFailed'
      onError(translateError(message, t))
    }
  }

  const handleRemoveSubMap = () => {
    if (window.confirm(t('confirm.removeSubMap'))) {
      onRemoveSubMap()
    }
  }

  useEffect(() => {
    nameRef.current?.focus()
  }, [hex.id])

  return (
    <section className="hex-editor panel">
      <div className="hex-editor__nav">
        <button
          type="button"
          className="btn-compact"
          disabled={hex.id <= 1}
          onClick={() => onSelectHex(hex.id - 1)}
        >
          {t('hexEditor.prev')}
        </button>
        <h2>{t('hexEditor.title', { id: hex.id })}</h2>
        <button
          type="button"
          className="btn-compact"
          disabled={hex.id >= hexCount}
          onClick={() => onSelectHex(hex.id + 1)}
        >
          {t('hexEditor.next')}
        </button>
      </div>
      <label className="field">
        <span>{t('hexEditor.name')}</span>
        <input
          type="text"
          value={hex.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={t('hexEditor.namePlaceholder')}
          ref={nameRef}
        />
      </label>
      <label className="field">
        <span>{t('hexEditor.description')}</span>
        <textarea
          rows={5}
          value={hex.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={t('hexEditor.descriptionPlaceholder')}
        />
      </label>
      <div className="hex-editor__image-row">
        <div className="hex-editor__preview">
          {previewSrc ? (
            <img src={previewSrc} alt={t('hexEditor.title', { id: hex.id })} />
          ) : (
            <div className="hex-editor__preview-empty">{t('hexEditor.noImage')}</div>
          )}
        </div>
        <div className="hex-editor__image-actions">
          <button type="button" className="btn-secondary" onClick={() => setTilesOpen((open) => !open)}>
            {tilesOpen ? t('hexEditor.hideTiles') : t('hexEditor.chooseTile')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={(e) => {
              void handleImageUpload(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          <button type="button" onClick={() => fileRef.current?.click()}>
            {t('hexEditor.uploadCustom')}
          </button>
          {hex.imageDataUrl && (
            <button type="button" className="btn-secondary" onClick={() => onChange({ imageDataUrl: null })}>
              {t('hexEditor.clearImage')}
            </button>
          )}
        </div>
      </div>
      {tilesOpen && (
        <TilePicker selectedValue={hex.imageDataUrl} onSelect={(imageDataUrl) => onChange({ imageDataUrl })} />
      )}

      <div className="hex-editor__nested">
        {hasSubMap ? (
          <div className="hex-editor__nested-actions">
            <button type="button" className="btn-primary" onClick={onOpenSubMap}>
              {t('nested.openMap')}
            </button>
            <button type="button" className="btn-secondary" onClick={handleRemoveSubMap}>
              {t('nested.removeMap')}
            </button>
          </div>
        ) : (
          <button type="button" onClick={onExpand}>
            {t('nested.expandMap')}
          </button>
        )}
      </div>
    </section>
  )
}
