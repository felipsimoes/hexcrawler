import { useState } from 'react'
import { useI18n } from '../i18n'
import type { HexCrawlerMap } from '../types/map'

interface SectionEditorsProps {
  map: HexCrawlerMap
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

type SheetTab = 'encounters' | 'rumours' | 'factions'

export function SectionEditors({
  map,
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
  const [tab, setTab] = useState<SheetTab>('encounters')

  return (
    <div className="section-editors">
      <div className="sheet-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'encounters'}
          className={tab === 'encounters' ? 'sheet-tabs__tab sheet-tabs__tab--active' : 'sheet-tabs__tab'}
          onClick={() => setTab('encounters')}
        >
          {t('sections.encounters')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'rumours'}
          className={tab === 'rumours' ? 'sheet-tabs__tab sheet-tabs__tab--active' : 'sheet-tabs__tab'}
          onClick={() => setTab('rumours')}
        >
          {t('sections.rumours')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'factions'}
          className={tab === 'factions' ? 'sheet-tabs__tab sheet-tabs__tab--active' : 'sheet-tabs__tab'}
          onClick={() => setTab('factions')}
        >
          {t('sections.factions')}
        </button>
      </div>

      {tab === 'encounters' && (
      <section className="panel" role="tabpanel">
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
      )}

      {tab === 'rumours' && (
      <section className="panel" role="tabpanel">
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
      )}

      {tab === 'factions' && (
      <section className="panel" role="tabpanel">
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
      )}
    </div>
  )
}
