import { useRef } from 'react'
import { EMPTY_TEMPLATE } from '../data/empty-template'
import { OAKWOOD_TEMPLATE } from '../data/oakwood-template'
import { exportMap, importMapFromFile, isHexcrawlFile } from '../lib/persistence'
import { cloneMap } from '../lib/validation'
import type { HexCrawlerMap } from '../types/map'

interface ToolbarProps {
  title: string
  onTitleChange: (title: string) => void
  onImport: (map: HexCrawlerMap) => void
  onNew: (map: HexCrawlerMap) => void
  onPreview: () => void
  onError: (message: string) => void
  map: HexCrawlerMap
}

export function Toolbar({
  title,
  onTitleChange,
  onImport,
  onNew,
  onPreview,
  onError,
  map,
}: ToolbarProps) {
  const importRef = useRef<HTMLInputElement>(null)

  const handleImportFile = async (file: File | undefined) => {
    if (!file || !isHexcrawlFile(file)) return
    try {
      const imported = await importMapFromFile(file)
      onImport(imported)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Import failed.')
    }
  }

  const confirmAndNew = (template: HexCrawlerMap, label: string) => {
    if (window.confirm(`Start a new map (${label})? Unsaved changes remain in your browser draft.`)) {
      onNew(cloneMap(template))
    }
  }

  return (
    <header className="toolbar no-print">
      <div className="toolbar__actions">
        <button type="button" onClick={() => importRef.current?.click()}>
          Import
        </button>
        <button
          type="button"
          onClick={() => {
            void exportMap(map).catch((err) =>
              onError(err instanceof Error ? err.message : 'Export failed.'),
            )
          }}
        >
          Export
        </button>
        <button type="button" className="btn-secondary" onClick={() => confirmAndNew(EMPTY_TEMPLATE, 'blank')}>
          New blank
        </button>
        <button type="button" className="btn-secondary" onClick={() => confirmAndNew(OAKWOOD_TEMPLATE, 'Oakwood sample')}>
          Load sample
        </button>
        <button type="button" className="btn-primary" onClick={onPreview}>
          Preview &amp; Print
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json,.hexcrawl.json,application/json"
          hidden
          onChange={(e) => {
            void handleImportFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>
      <label className="toolbar__title field">
        <span className="sr-only">Map title</span>
        <input
          type="text"
          className="toolbar__title-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Map title"
        />
      </label>
    </header>
  )
}
