import type { HexCrawlerMap } from '../types/map'

export const OAKWOOD_TEMPLATE: HexCrawlerMap = {
  version: 1,
  title: 'Oakwood',
  hexes: [
    { id: 1, name: 'Appleburgh', description: 'A small village of mice and voles. The mayor is a shrew named Appleby. Trade in cheese and seeds.', imageDataUrl: null },
    { id: 2, name: 'Pendle Hill', description: 'A steep hill crowned with ancient standing stones. Owls nest in the crags above.', imageDataUrl: null },
    { id: 3, name: 'Craughley', description: 'Ruined cottages overgrown with bramble. Something stirs in the cellars.', imageDataUrl: null },
    { id: 4, name: 'Nunsthorpe', description: 'An abandoned abbey where ghostly chanting echoes at dusk.', imageDataUrl: null },
    { id: 5, name: 'The Thicketts', description: 'Dense thorny woods. Paths shift; travelers rarely emerge where they entered.', imageDataUrl: null },
    { id: 6, name: 'Abbadon Hill', description: 'A barren mound said to be cursed. Nothing grows on its slopes.', imageDataUrl: null },
    { id: 7, name: "Badger's Den", description: 'A fortified burrow ruled by a grizzled badger lord and his kin.', imageDataUrl: null },
    { id: 8, name: 'Oakwood', description: 'The great oak at the heart of the region. Markets gather in its shade.', imageDataUrl: null },
    { id: 9, name: 'Kettlesing', description: 'A hamlet famous for its kettle-shaped pond and herbalist frog.', imageDataUrl: null },
    { id: 10, name: 'Winewath', description: 'Vineyards tended by field mice. The harvest festival draws crowds.', imageDataUrl: null },
    { id: 11, name: 'Bingley Bog', description: 'Treacherous marshland. Will-o-wisps lead the unwary astray.', imageDataUrl: null },
    { id: 12, name: 'Frog Fort', description: 'A lily-pad citadel ruled by the Frog Prince. Croaking guards patrol.', imageDataUrl: null },
    { id: 13, name: 'Brickleforth-on-the-Hill', description: 'A crumbling manor on a hillock. The brickleforth family vanished years ago.', imageDataUrl: null },
    { id: 14, name: 'Bramblerow', description: 'Hedgerows form a maze. Hedgehogs charge tolls at every turn.', imageDataUrl: null },
    { id: 15, name: 'Gorling Lake', description: 'A deep lake with something large beneath the surface.', imageDataUrl: null },
    { id: 16, name: 'Hyde Park', description: 'Overgrown formal gardens. Statues of forgotten heroes crumble.', imageDataUrl: null },
    { id: 17, name: 'The Scrapheap', description: 'Piles of human refuse. Rats scavenge and trade in shiny trinkets.', imageDataUrl: null },
    { id: 18, name: 'The Mulch', description: 'Rotting leaf litter and fungal groves. Spores hang thick in the air.', imageDataUrl: null },
    { id: 19, name: 'M.I.A. HQ', description: 'Hidden burrow of the Mice Intelligence Agency. Agents come and go in secret.', imageDataUrl: null },
  ],
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
