import { useRef } from 'react'
import { useI18n, translateError } from '../i18n'
import { resizeImageToDataUrl } from '../lib/images'
import { resolveImageSrc } from '../lib/tiles'
import type { HexCell } from '../types/map'
import { TilePicker } from './TilePicker'

interface HexEditorProps {
  hex: HexCell
  onChange: (patch: Partial<HexCell>) => void
  onError: (message: string) => void
}

export function HexEditor({ hex, onChange, onError }: HexEditorProps) {
  const { t } = useI18n()
  const fileRef = useRef<HTMLInputElement>(null)
  const previewSrc = resolveImageSrc(hex.imageDataUrl)

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

  return (
    <section className="hex-editor panel">
      <h2>{t('hexEditor.title', { id: hex.id })}</h2>
      <div className="hex-editor__image-row">
        <div className="hex-editor__preview">
          {previewSrc ? (
            <img src={previewSrc} alt={t('hexEditor.title', { id: hex.id })} />
          ) : (
            <div className="hex-editor__preview-empty">{t('hexEditor.noImage')}</div>
          )}
        </div>
        <div className="hex-editor__image-actions">
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
      <TilePicker selectedValue={hex.imageDataUrl} onSelect={(imageDataUrl) => onChange({ imageDataUrl })} />
      <label className="field">
        <span>{t('hexEditor.name')}</span>
        <input
          type="text"
          value={hex.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={t('hexEditor.namePlaceholder')}
        />
      </label>
      <label className="field">
        <span>{t('hexEditor.description')}</span>
        <textarea
          rows={4}
          value={hex.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={t('hexEditor.descriptionPlaceholder')}
        />
      </label>
    </section>
  )
}
