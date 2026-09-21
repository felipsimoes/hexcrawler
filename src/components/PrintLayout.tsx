import { useI18n } from '../i18n'
import { collectPrintPages } from '../lib/map-tree'
import { HexGrid } from './HexGrid'
import type { HexCrawlerMap, PrintPage } from '../types/map'

interface PrintLayoutProps {
  rootMap: HexCrawlerMap
}

function ClockDots({ count }: { count: number }) {
  return (
    <span className="print-clock">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="print-clock__dot" />
      ))}
    </span>
  )
}

function PrintPageView({ page, showTrail }: { page: PrintPage; showTrail: boolean }) {
  const { t } = useI18n()
  const { map } = page

  return (
    <div className="print-layout">
      {showTrail && page.path.length > 0 && (
        <p className="print-trail">{page.label}</p>
      )}
      <div className="print-main">
        <div className="print-map-column">
          <header className="print-header">
            <div className="print-title-frame">
              <h1 className="print-title">{map.title || t('print.untitledMap')}</h1>
            </div>
          </header>
          <div className="print-map">
            <HexGrid hexes={map.hexes} size={44} />
          </div>
        </div>
        <div className="print-descriptions">
          {map.hexes.map((hex) => (
            <p key={hex.id} className="print-hex-entry">
              <strong>
                {hex.id}. {hex.name || t('print.locationFallback', { id: hex.id })}
                {hex.subMap ? ` ${t('print.hasSubMap')}` : ''}
              </strong>{' '}
              {hex.description}
            </p>
          ))}
        </div>
      </div>

      <div className="print-bottom">
        <section className="print-encounters">
          <h2>{t('print.encounters')}</h2>
          <p className="print-subtitle">{t('print.encounterTable')}</p>
          <ol>
            {map.encounters.map((entry, i) => (
              <li key={i}>{entry || t('print.encounterFallback', { n: i + 1 })}</li>
            ))}
          </ol>
        </section>

        <section className="print-rumours">
          <h2>{t('print.rumours')}</h2>
          <p className="print-subtitle">{t('print.rumourTable')}</p>
          <ol>
            {map.rumours.map((entry, i) => (
              <li key={i}>{entry || t('print.rumourFallback', { n: i + 1 })}</li>
            ))}
          </ol>
        </section>

        <section className="print-factions">
          <h2 className="print-factions__heading">{t('print.factions')}</h2>
          <div className="print-factions__grid">
            {map.factions.map((faction, i) => (
              <div key={i} className="print-faction">
                <h3>{faction.name || t('print.factionFallback', { n: i + 1 })}</h3>
                <div className="print-faction__block">
                  <h4>{t('print.resources')}</h4>
                  <ul>
                    {faction.resources.filter(Boolean).map((resource, ri) => (
                      <li key={ri}>{resource}</li>
                    ))}
                  </ul>
                </div>
                <div className="print-faction__block">
                  <h4>{t('print.goals')}</h4>
                  <ul className="print-goals">
                    {faction.goals.map((goal, gi) => (
                      <li key={gi}>
                        <ClockDots count={goal.clockSlots} />
                        <span>{goal.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export function PrintLayout({ rootMap }: PrintLayoutProps) {
  const pages = collectPrintPages(rootMap)
  const multiPage = pages.length > 1

  return (
    <div className="print-document">
      {pages.map((page, index) => (
        <div key={page.path.join('-') || 'root'} className="print-page-wrap">
          {index > 0 && <div className="print-page-break" />}
          <PrintPageView page={page} showTrail={multiPage} />
        </div>
      ))}
    </div>
  )
}
