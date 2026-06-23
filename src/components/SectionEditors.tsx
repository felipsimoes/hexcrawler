import { useI18n } from '../i18n'
import type { HexCrawlerMap } from '../types/map'

interface SectionEditorsProps {
  map: HexCrawlerMap
  selectedHexId: number
  onSelectHex: (id: number) => void
  onUpdateHex: (id: number, patch: Partial<HexCrawlerMap['hexes'][number]>) => void
  onSetEncounter: (index: number, value: string) => void
  onSetRumour: (index: number, value: string) => void
  onUpdateFaction: (index: number, patch: Partial<HexCrawlerMap['factions'][number]>) => void
  onSetFactionResource: (factionIndex: number, resourceIndex: number, value: string) => void
  onAddFactionResource: (factionIndex: number) => void
  onRemoveFactionResource: (factionIndex: number, resourceIndex: number) => void
  onSetFactionGoal: (
    factionIndex: number,
    goalIndex: number,
    patch: Partial<HexCrawlerMap['factions'][number]['goals'][number]>,
  ) => void
  onAddFactionGoal: (factionIndex: number) => void
  onRemoveFactionGoal: (factionIndex: number, goalIndex: number) => void
}

export function SectionEditors({
  map,
  selectedHexId,
  onSelectHex,
  onUpdateHex,
  onSetEncounter,
  onSetRumour,
  onUpdateFaction,
  onSetFactionResource,
  onAddFactionResource,
  onRemoveFactionResource,
  onSetFactionGoal,
  onAddFactionGoal,
  onRemoveFactionGoal,
}: SectionEditorsProps) {
  const { t } = useI18n()

  return (
    <div className="section-editors">
      <section className="panel">
        <h2>{t('sections.allLocations')}</h2>
        <div className="location-list">
          {map.hexes.map((hex) => (
            <div
              key={hex.id}
              className={`location-item${hex.id === selectedHexId ? ' location-item--active' : ''}`}
            >
              <button type="button" className="location-item__select" onClick={() => onSelectHex(hex.id)}>
                {hex.id}
              </button>
              <div className="location-item__fields">
                <input
                  type="text"
                  value={hex.name}
                  onChange={(e) => onUpdateHex(hex.id, { name: e.target.value })}
                  placeholder={t('sections.locationNamePlaceholder', { id: hex.id })}
                />
                <textarea
                  rows={2}
                  value={hex.description}
                  onChange={(e) => onUpdateHex(hex.id, { description: e.target.value })}
                  placeholder={t('sections.descriptionPlaceholder')}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>{t('sections.encounters')}</h2>
        <p className="panel-subtitle">{t('sections.encountersSubtitle')}</p>
        {map.encounters.map((encounter, index) => (
          <label key={index} className="field field--inline">
            <span>{index + 1}.</span>
            <input
              type="text"
              value={encounter}
              onChange={(e) => onSetEncounter(index, e.target.value)}
              placeholder={t('sections.encounterPlaceholder', { n: index + 1 })}
            />
          </label>
        ))}
      </section>

      <section className="panel">
        <h2>{t('sections.rumours')}</h2>
        <p className="panel-subtitle">{t('sections.rumoursSubtitle')}</p>
        {map.rumours.map((rumour, index) => (
          <label key={index} className="field field--inline">
            <span>{index + 1}.</span>
            <input
              type="text"
              value={rumour}
              onChange={(e) => onSetRumour(index, e.target.value)}
              placeholder={t('sections.rumourPlaceholder', { n: index + 1 })}
            />
          </label>
        ))}
      </section>

      <section className="panel">
        <h2>{t('sections.factions')}</h2>
        <div className="faction-editors">
          {map.factions.map((faction, fi) => (
            <div key={fi} className="faction-editor">
              <label className="field">
                <span>{t('sections.factionName')}</span>
                <input
                  type="text"
                  value={faction.name}
                  onChange={(e) => onUpdateFaction(fi, { name: e.target.value })}
                />
              </label>

              <div className="faction-editor__subsection">
                <div className="subsection-header">
                  <h3>{t('sections.resources')}</h3>
                  <button type="button" className="btn-small" onClick={() => onAddFactionResource(fi)}>
                    {t('sections.add')}
                  </button>
                </div>
                {faction.resources.map((resource, ri) => (
                  <div key={ri} className="inline-row">
                    <input
                      type="text"
                      value={resource}
                      onChange={(e) => onSetFactionResource(fi, ri, e.target.value)}
                      placeholder={t('sections.resourcePlaceholder')}
                    />
                    <button
                      type="button"
                      className="btn-small btn-secondary"
                      onClick={() => onRemoveFactionResource(fi, ri)}
                      aria-label={t('sections.removeResource')}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="faction-editor__subsection">
                <div className="subsection-header">
                  <h3>{t('sections.goals')}</h3>
                  <button type="button" className="btn-small" onClick={() => onAddFactionGoal(fi)}>
                    {t('sections.add')}
                  </button>
                </div>
                {faction.goals.map((goal, gi) => (
                  <div key={gi} className="goal-row">
                    <div className="goal-row__clocks">
                      <label>
                        {t('sections.clock')}
                        <select
                          value={goal.clockSlots}
                          onChange={(e) =>
                            onSetFactionGoal(fi, gi, { clockSlots: Number(e.target.value) })
                          }
                        >
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                      </label>
                      <span className="clock-preview" aria-hidden>
                        {Array.from({ length: goal.clockSlots }).map((_, ci) => (
                          <span key={ci} className="clock-dot" />
                        ))}
                      </span>
                    </div>
                    <div className="inline-row">
                      <input
                        type="text"
                        value={goal.text}
                        onChange={(e) => onSetFactionGoal(fi, gi, { text: e.target.value })}
                        placeholder={t('sections.goalPlaceholder')}
                      />
                      <button
                        type="button"
                        className="btn-small btn-secondary"
                        onClick={() => onRemoveFactionGoal(fi, gi)}
                        aria-label={t('sections.removeGoal')}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
