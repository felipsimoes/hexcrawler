import { useCallback, useState } from 'react'
import { HexEditor } from './components/HexEditor'
import { HexGrid } from './components/HexGrid'
import { PrintLayout } from './components/PrintLayout'
import { SectionEditors } from './components/SectionEditors'
import { Toolbar } from './components/Toolbar'
import { useMapState } from './hooks/useMapState'
import { isHexcrawlFile, importMapFromFile } from './lib/persistence'
import type { AppMode } from './types/map'
import './styles/global.css'
import './styles/editor.css'
import './styles/print.css'

function App() {
  const [mode, setMode] = useState<AppMode>('edit')
  const {
    map,
    selectedHexId,
    setSelectedHexId,
    message,
    showMessage,
    replaceMap,
    setTitle,
    updateHex,
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
        showMessage('Map imported successfully.')
      } catch (err) {
        showMessage(err instanceof Error ? err.message : 'Import failed.')
      }
    },
    [replaceMap, showMessage],
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
            map={map}
          />
          <main className="editor-layout no-print">
            <aside className="editor-layout__map">
              <HexGrid
                hexes={map.hexes}
                selectedHexId={selectedHexId}
                interactive
                onSelectHex={setSelectedHexId}
              />
            </aside>
            <div className="editor-layout__sidebar">
              <HexEditor
                hex={selectedHex}
                onChange={(patch) => updateHex(selectedHex.id, patch)}
                onError={showMessage}
              />
              <SectionEditors
                map={map}
                selectedHexId={selectedHexId}
                onSelectHex={setSelectedHexId}
                onUpdateHex={updateHex}
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
            </div>
          </main>
        </>
      ) : (
        <div className="print-mode">
          <div className="print-toolbar no-print">
            <button type="button" className="btn-secondary" onClick={() => setMode('edit')}>
              Back to editor
            </button>
            <button type="button" className="btn-primary" onClick={() => window.print()}>
              Print / Save PDF
            </button>
          </div>
          <PrintLayout map={map} />
        </div>
      )}
    </div>
  )
}

export default App
