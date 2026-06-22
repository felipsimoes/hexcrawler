import { HexGrid } from './HexGrid'
import type { HexCrawlerMap } from '../types/map'

interface PrintLayoutProps {
  map: HexCrawlerMap
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

export function PrintLayout({ map }: PrintLayoutProps) {
  return (
    <div className="print-layout">
      <header className="print-header">
        <div className="print-title-frame">
          <h1 className="print-title">{map.title || 'Untitled Map'}</h1>
        </div>
      </header>

      <div className="print-main">
        <div className="print-map">
          <HexGrid hexes={map.hexes} size={44} />
        </div>
        <div className="print-descriptions">
          {map.hexes.map((hex) => (
            <p key={hex.id} className="print-hex-entry">
              <strong>
                {hex.id}. {hex.name || `Location ${hex.id}`}
              </strong>{' '}
              {hex.description}
            </p>
          ))}
        </div>
      </div>

      <div className="print-bottom">
        <section className="print-encounters">
          <h2>Encounters</h2>
          <p className="print-subtitle">d6 encounter</p>
          <ol>
            {map.encounters.map((entry, i) => (
              <li key={i}>{entry || `Encounter ${i + 1}`}</li>
            ))}
          </ol>
        </section>

        <section className="print-rumours">
          <h2>Rumours</h2>
          <p className="print-subtitle">d6 rumour</p>
          <ol>
            {map.rumours.map((entry, i) => (
              <li key={i}>{entry || `Rumour ${i + 1}`}</li>
            ))}
          </ol>
        </section>

        <section className="print-factions">
          <h2 className="print-factions__heading">Factions</h2>
          <div className="print-factions__grid">
            {map.factions.map((faction, i) => (
              <div key={i} className="print-faction">
                <h3>{faction.name || `Faction ${i + 1}`}</h3>
                <div className="print-faction__block">
                  <h4>Resources</h4>
                  <ul>
                    {faction.resources.filter(Boolean).map((resource, ri) => (
                      <li key={ri}>{resource}</li>
                    ))}
                  </ul>
                </div>
                <div className="print-faction__block">
                  <h4>Goals</h4>
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
