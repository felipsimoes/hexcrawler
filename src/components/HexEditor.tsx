import { useRef } from 'react'
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
  const fileRef = useRef<HTMLInputElement>(null)
  const previewSrc = resolveImageSrc(hex.imageDataUrl)

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return
    try {
      const dataUrl = await resizeImageToDataUrl(file)
      onChange({ imageDataUrl: dataUrl })
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Image upload failed.')
    }
  }

  return (
    <section className="hex-editor panel">
      <h2>Hex {hex.id}</h2>
      <div className="hex-editor__image-row">
        <div className="hex-editor__preview">
          {previewSrc ? (
            <img src={previewSrc} alt={`Hex ${hex.id} artwork`} />
          ) : (
            <div className="hex-editor__preview-empty">No image</div>
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
            Upload custom image
          </button>
          {hex.imageDataUrl && (
            <button type="button" className="btn-secondary" onClick={() => onChange({ imageDataUrl: null })}>
              Clear image
            </button>
          )}
        </div>
      </div>
      <TilePicker selectedValue={hex.imageDataUrl} onSelect={(imageDataUrl) => onChange({ imageDataUrl })} />
      <label className="field">
        <span>Name</span>
        <input
          type="text"
          value={hex.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Location name"
        />
      </label>
      <label className="field">
        <span>Description</span>
        <textarea
          rows={4}
          value={hex.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Short location description for the print sheet"
        />
      </label>
    </section>
  )
}
