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
