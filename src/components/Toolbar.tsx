import { useRef } from 'react'
import { createEmptyTemplate } from '../data/empty-template'
import { OAKWOOD_TEMPLATE } from '../data/oakwood-template'
import { useI18n, translateError } from '../i18n'
import { exportMap, importMapFromFile, isHexcrawlFile } from '../lib/persistence'
import { cloneMap } from '../lib/validation'
import type { HexCrawlerMap } from '../types/map'
import type { Locale } from '../i18n'

interface ToolbarProps {
  title: string
  onTitleChange: (title: string) => void
  onImport: (map: HexCrawlerMap) => void
  onNew: (map: HexCrawlerMap) => void
  onPreview: () => void
  onError: (message: string) => void
  map: HexCrawlerMap
}

function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <label className="toolbar__language">
      <span className="sr-only">{t('toolbar.language')}</span>
      <select
        className="toolbar__language-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label={t('toolbar.language')}
      >
        <option value="en">EN</option>
        <option value="pt-BR">PT</option>
      </select>
    </label>
  )
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
  const { t } = useI18n()
  const importRef = useRef<HTMLInputElement>(null)

  const handleImportFile = async (file: File | undefined) => {
    if (!file || !isHexcrawlFile(file)) return
    try {
      const imported = await importMapFromFile(file)
      onImport(imported)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'messages.importFailed'
      onError(translateError(message, t))
    }
  }

  const confirmAndNew = (template: HexCrawlerMap, labelKey: 'confirm.blankLabel' | 'confirm.sampleLabel') => {
    if (window.confirm(t('confirm.newMap', { label: t(labelKey) }))) {
      onNew(cloneMap(template))
    }
  }

  return (
    <header className="toolbar no-print">
      <label className="toolbar__title field">
        <span className="sr-only">{t('toolbar.mapTitle')}</span>
        <input
          type="text"
          className="toolbar__title-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={t('toolbar.mapTitle')}
        />
      </label>
      <div className="toolbar__actions">
        <LanguageSwitcher />
        <button type="button" className="btn-compact" onClick={() => importRef.current?.click()}>
          {t('toolbar.import')}
        </button>
        <button
          type="button"
          className="btn-compact"
          onClick={() => {
            void exportMap(map).catch((err) => {
              const message = err instanceof Error ? err.message : 'messages.exportFailed'
              onError(translateError(message, t))
            })
          }}
        >
          {t('toolbar.export')}
        </button>
        <button
          type="button"
          className="btn-compact btn-secondary"
          onClick={() => confirmAndNew(createEmptyTemplate(t), 'confirm.blankLabel')}
        >
          {t('toolbar.blank')}
        </button>
        <button
          type="button"
          className="btn-compact btn-secondary"
          onClick={() => confirmAndNew(OAKWOOD_TEMPLATE, 'confirm.sampleLabel')}
        >
          {t('toolbar.sample')}
        </button>
        <button type="button" className="btn-compact btn-secondary" onClick={onPreview}>
          {t('toolbar.previewPrint')}
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
    </header>
  )
}
