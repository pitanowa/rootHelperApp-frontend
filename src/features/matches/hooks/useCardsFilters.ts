import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { CardDef, Clearing, CraftType, Item } from '../../../data/cards'

type CardsFilterState = {
  cardsOpen: boolean
  setCardsOpen: Dispatch<SetStateAction<boolean>>
  cardsSearch: string
  setCardsSearch: Dispatch<SetStateAction<string>>
  fClearings: Record<Clearing, boolean>
  setFClearings: Dispatch<SetStateAction<Record<Clearing, boolean>>>
  fCraft: Record<CraftType, boolean>
  setFCraft: Dispatch<SetStateAction<Record<CraftType, boolean>>>
  fItems: Record<Item, boolean>
  setFItems: Dispatch<SetStateAction<Record<Item, boolean>>>
  previewCard: CardDef | null
  setPreviewCard: Dispatch<SetStateAction<CardDef | null>>
  filteredCards: CardDef[]
  resetCardFilters: () => void
}

export function useCardsFilters(cards: CardDef[]): CardsFilterState {
  const [cardsOpen, setCardsOpen] = useState(false)
  const [cardsSearch, setCardsSearch] = useState('')
  const [fClearings, setFClearings] = useState<Record<Clearing, boolean>>({
    MOUSE: false,
    FOX: false,
    RABBIT: false,
    BIRD: false,
  })
  const [fCraft, setFCraft] = useState<Record<CraftType, boolean>>({
    POINTS: false,
    ABILITY: false,
    DOMINANCE: false,
  })
  const [fItems, setFItems] = useState<Record<Item, boolean>>({
    SACK: false,
    BOOT: false,
    SWORD: false,
    CROSSBOW: false,
    HAMMER: false,
    TEAPOT: false,
    COIN: false,
    TORCH: false,
  })
  const [previewCard, setPreviewCard] = useState<CardDef | null>(null)

  function resetCardFilters() {
    setCardsSearch('')
    setFClearings({ MOUSE: false, FOX: false, RABBIT: false, BIRD: false })
    setFCraft({ POINTS: false, ABILITY: false, DOMINANCE: false })
    setFItems({
      SACK: false,
      BOOT: false,
      SWORD: false,
      CROSSBOW: false,
      HAMMER: false,
      TEAPOT: false,
      COIN: false,
      TORCH: false,
    })
  }

  const filteredCards = useMemo(() => {
    const search = cardsSearch.trim().toLowerCase()

    const anyClearing = Object.values(fClearings).some(Boolean)
    const anyCraft = Object.values(fCraft).some(Boolean)
    const anyItem = Object.values(fItems).some(Boolean)

    return cards.filter((c) => {
      if (search) {
        const okName = c.name.toLowerCase().includes(search) || c.id.toLowerCase().includes(search)
        if (!okName) return false
      }

      if (anyClearing && !fClearings[c.clearing]) return false
      if (anyCraft && !fCraft[c.craftType]) return false

      if (anyItem) {
        if (!c.item) return false
        if (!fItems[c.item]) return false
      }

      return true
    })
  }, [cards, cardsSearch, fClearings, fCraft, fItems])

  return {
    cardsOpen,
    setCardsOpen,
    cardsSearch,
    setCardsSearch,
    fClearings,
    setFClearings,
    fCraft,
    setFCraft,
    fItems,
    setFItems,
    previewCard,
    setPreviewCard,
    filteredCards,
    resetCardFilters,
  }
}
