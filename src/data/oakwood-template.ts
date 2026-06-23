import { getDefaultTileRefForHex } from '../lib/tiles'
import type { HexCrawlerMap } from '../types/map'

const HEX_DATA = [
  { name: 'Appleburgh', description: 'A small village of mice and voles. The mayor is a shrew named Appleby. Trade in cheese and seeds.' },
  { name: 'Pendle Hill', description: 'A steep hill crowned with ancient standing stones. Owls nest in the crags above.' },
  { name: 'Craughley', description: 'Ruined cottages overgrown with bramble. Something stirs in the cellars.' },
  { name: 'Nunsthorpe', description: 'An abandoned abbey where ghostly chanting echoes at dusk.' },
  { name: 'The Thicketts', description: 'Dense thorny woods. Paths shift; travelers rarely emerge where they entered.' },
  { name: 'Abbadon Hill', description: 'A barren mound said to be cursed. Nothing grows on its slopes.' },
  { name: "Badger's Den", description: 'A fortified burrow ruled by a grizzled badger lord and his kin.' },
  { name: 'Oakwood', description: 'The great oak at the heart of the region. Markets gather in its shade.' },
  { name: 'Kettlesing', description: 'A hamlet famous for its kettle-shaped pond and herbalist frog.' },
  { name: 'Winewath', description: 'Vineyards tended by field mice. The harvest festival draws crowds.' },
  { name: 'Bingley Bog', description: 'Treacherous marshland. Will-o-wisps lead the unwary astray.' },
  { name: 'Frog Fort', description: 'A lily-pad citadel ruled by the Frog Prince. Croaking guards patrol.' },
  { name: 'Brickleforth-on-the-Hill', description: 'A crumbling manor on a hillock. The brickleforth family vanished years ago.' },
  { name: 'Bramblerow', description: 'Hedgerows form a maze. Hedgehogs charge tolls at every turn.' },
  { name: 'Gorling Lake', description: 'A deep lake with something large beneath the surface.' },
  { name: 'Hyde Park', description: 'Overgrown formal gardens. Statues of forgotten heroes crumble.' },
  { name: 'The Scrapheap', description: 'Piles of human refuse. Rats scavenge and trade in shiny trinkets.' },
  { name: 'The Mulch', description: 'Rotting leaf litter and fungal groves. Spores hang thick in the air.' },
  { name: 'M.I.A. HQ', description: 'Hidden burrow of the Mice Intelligence Agency. Agents come and go in secret.' },
] as const

export const OAKWOOD_TEMPLATE: HexCrawlerMap = {
  version: 1,
  title: 'Oakwood',
  hexes: HEX_DATA.map((hex, index) => ({
    id: index + 1,
    name: hex.name,
    description: hex.description,
    imageDataUrl: getDefaultTileRefForHex(index),
  })),
  encounters: [
    'd6 frogs are kidnapping an important mouse.',
    'A lost hedgehog asks for directions to Bramblerow.',
    'An owl circles overhead, watching.',
    'A patrol of M.I.A. agents questions travelers.',
    'A merchant cart stuck in the bog needs help.',
    'Strange lights flicker over Pendle Hill at dusk.',
  ],
  rumours: [
    'The Frog Prince has returned to Frog Fort.',
    'Something ancient sleeps beneath Abbadon Hill.',
    'The brickleforth treasure is still in the manor.',
    'Owls are gathering allies for a coup.',
    'M.I.A. is recruiting new agents in Oakwood.',
    'The lake monster of Gorling Lake has been seen again.',
  ],
  factions: [
    {
      name: 'Owl Ambrosia',
      resources: ['Pendle Hill roost', 'Sharp talons', 'Night scouts'],
      goals: [
        { text: 'Seize control of Oakwood market', clockSlots: 4 },
        { text: 'Drive frogs from Bingley Bog', clockSlots: 5 },
      ],
    },
    {
      name: 'Frog Prince Ribbit',
      resources: ['Frog Fort garrison', 'Bog allies', 'Lily-pad fleet'],
      goals: [
        { text: 'Unite the bog under one crown', clockSlots: 4 },
        { text: 'Recover the royal amulet', clockSlots: 3 },
      ],
    },
    {
      name: 'M.I.A. — Mice Intelligence Agency',
      resources: ['Hidden HQ', 'Spy network', 'Cheese reserves'],
      goals: [
        { text: 'Expose Owl Ambrosia plot', clockSlots: 4 },
        { text: 'Secure Appleburgh alliance', clockSlots: 4 },
      ],
    },
  ],
}
