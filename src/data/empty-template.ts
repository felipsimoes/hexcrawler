import type { HexCrawlerMap } from '../types/map'

function makeHexes() {
  return Array.from({ length: 19 }, (_, i) => ({
    id: i + 1,
    name: '',
    description: '',
    imageDataUrl: null,
  }))
}

export const EMPTY_TEMPLATE: HexCrawlerMap = {
  version: 1,
  title: 'Untitled Map',
  hexes: makeHexes(),
  encounters: ['', '', '', '', '', ''],
  rumours: ['', '', '', '', '', ''],
  factions: [
    {
      name: 'Faction One',
      resources: [''],
      goals: [{ text: '', clockSlots: 4 }],
    },
    {
      name: 'Faction Two',
      resources: [''],
      goals: [{ text: '', clockSlots: 4 }],
    },
    {
      name: 'Faction Three',
      resources: [''],
      goals: [{ text: '', clockSlots: 4 }],
    },
  ],
}
