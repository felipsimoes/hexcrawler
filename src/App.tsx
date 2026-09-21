import { useCallback, useState } from 'react'
import { Breadcrumb } from './components/Breadcrumb'
import { HexEditor } from './components/HexEditor'
import { HexGrid } from './components/HexGrid'
import { PrintLayout } from './components/PrintLayout'
import { SectionEditors } from './components/SectionEditors'
import { Toolbar } from './components/Toolbar'
import { useMapState } from './hooks/useMapState'
import { translateError, useI18n } from './i18n'
import { isHexcrawlFile, importMapFromFile } from './lib/persistence'
import type { AppMode } from './types/map'
import './styles/global.css'
import './styles/editor.css'
import './styles/print.css'

function App() {
  const { t } = useI18n()
  const [mode, setMode] = useState<AppMode>('edit')
  const {
    rootMap,
    map,
    breadcrumbs,
    selectedHexId,
    setSelectedHexId,
    message,
    showMessage,
    replaceMap,
    navigateTo,
    setTitle,
    updateHex,
    expandSelectedHex,
    openSubMap,
    removeSelectedSubMap,
    setEncounter,
    setRumour,
    updateFaction,
    setFactionResource,
    addFactionResource,
    removeFactionResource,
    setFactionGoal,
    addFactionGoal,
    removeFactionGoal,
  } = useMapState()

  const selectedHex = map.hexes.find((h) => h.id === selectedHexId) ?? map.hexes[0]

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (!file || !isHexcrawlFile(file)) return
      try {
        const imported = await importMapFromFile(file)
        replaceMap(imported)
        showMessage(t('messages.importSuccess'))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'messages.importFailed'
        showMessage(translateError(message, t))
      }
    },
    [replaceMap, showMessage, t],
  )

  return (
    <div
      className={`app app--${mode}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => void handleDrop(e)}
    >
      {message && (
        <div className="toast no-print" role="status">
          {message}
        </div>
      )}

      {mode === 'edit' ? (
        <>
          <Toolbar
            title={map.title}
            onTitleChange={setTitle}
            onImport={replaceMap}
            onNew={replaceMap}
            onPreview={() => setMode('print')}
            onError={showMessage}
            map={rootMap}
          />
          <Breadcrumb segments={breadcrumbs} onNavigate={navigateTo} />
          <main className="editor-layout no-print">
            <div className="editor-workspace">
              <aside className="editor-layout__map">
                <HexGrid
                  hexes={map.hexes}
                  selectedHexId={selectedHexId}
                  interactive
                  onSelectHex={setSelectedHexId}
                  onOpenHex={openSubMap}
                />
                <div className="hex-jump" role="listbox" aria-label={t('hexEditor.jump')}>
                  {map.hexes.map((hex) => (
                    <button
                      key={hex.id}
                      type="button"
                      role="option"
                      aria-selected={hex.id === selectedHexId}
                      title={hex.name || t('print.locationFallback', { id: hex.id })}
                      className={`hex-jump__item${hex.id === selectedHexId ? ' hex-jump__item--active' : ''}${hex.name ? ' hex-jump__item--named' : ''}${hex.subMap ? ' hex-jump__item--nested' : ''}`}
                      onClick={() => setSelectedHexId(hex.id)}
                      onDoubleClick={() => {
                        if (hex.subMap) openSubMap(hex.id)
                      }}
                    >
                      {hex.id}
                    </button>
                  ))}
                </div>
              </aside>
              <HexEditor
                hex={selectedHex}
                hexCount={map.hexes.length}
                onChange={(patch) => updateHex(selectedHex.id, patch)}
                onError={showMessage}
                onSelectHex={setSelectedHexId}
                onExpand={() => expandSelectedHex(t)}
                onOpenSubMap={() => openSubMap(selectedHex.id)}
                onRemoveSubMap={removeSelectedSubMap}
              />
            </div>
            <SectionEditors
              map={map}
              onSetEncounter={setEncounter}
              onSetRumour={setRumour}
              onUpdateFaction={updateFaction}
              onSetFactionResource={setFactionResource}
              onAddFactionResource={addFactionResource}
              onRemoveFactionResource={removeFactionResource}
              onSetFactionGoal={setFactionGoal}
              onAddFactionGoal={addFactionGoal}
              onRemoveFactionGoal={removeFactionGoal}
            />
          </main>
        </>
      ) : (
        <div className="print-mode">
          <div className="print-toolbar no-print">
            <button type="button" className="btn-secondary" onClick={() => setMode('edit')}>
              {t('print.backToEditor')}
            </button>
            <button type="button" className="btn-primary" onClick={() => window.print()}>
              {t('print.printSavePdf')}
            </button>
          </div>
          <PrintLayout rootMap={rootMap} />
        </div>
      )}
    </div>
  )
}

export default App
