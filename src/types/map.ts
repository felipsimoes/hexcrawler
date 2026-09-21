export interface FactionGoal {
  text: string
  clockSlots: number
}

export interface Faction {
  name: string
  resources: string[]
  goals: FactionGoal[]
}

export interface HexCell {
  id: number
  name: string
  description: string
  imageDataUrl: string | null
  /** Optional nested hexcrawl map for this hex. */
  subMap?: HexCrawlerMap
}

export interface HexCrawlerMap {
  version: 1
  title: string
  hexes: HexCell[]
  encounters: string[]
  rumours: string[]
  factions: Faction[]
}

export type AppMode = 'edit' | 'print'

/** Path of hex ids from root into nested sub-maps (empty = root map). */
export type MapPath = number[]

export interface PrintPage {
  map: HexCrawlerMap
  path: MapPath
  /** Human-readable trail, e.g. "Oakwood › Appleburgh" */
  label: string
}
