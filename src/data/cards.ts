export type Clearing = 'MOUSE' | 'FOX' | 'RABBIT' | 'BIRD'
export type CraftType = 'POINTS' | 'ABILITY' | 'DOMINANCE'
export type Item = 'SACK' | 'BOOT' | 'SWORD' | 'CROSSBOW' | 'HAMMER' | 'TEAPOT' | 'COIN' | 'TORCH'

export type CardDef = {
  id: string
  name: string
  img: string
  clearing: Clearing
  craftType: CraftType
  numberOfCards: number
  item?: Item
}

import meta from './cards.meta.json'

// ✅ Vite: łapie wszystkie png z folderu jako URL-e
const IMG = import.meta.glob('../assets/cards/*.png', { eager: true, as: 'url' }) as Record<string, string>

function imgForId(id: string) {
  const path = `../assets/cards/${id}.png`
  const url = IMG[path]
  if (!url) {
    console.warn(`[cards] Missing image for id="${id}" → expected ${path}`)
    return ''
  }
  return url
}

export const CARDS: CardDef[] = (meta as Omit<CardDef, 'img'>[]).map((c) => ({
  ...c,
  img: imgForId(c.id),
}))
