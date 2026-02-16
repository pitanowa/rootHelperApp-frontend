import { createContext } from 'react'

export type AppCtx = {
  selectedGameKey: string
  setSelectedGameKey: (value: string) => void
  selectedGroupId: number | null
  setSelectedGroupId: (value: number | null) => void
  selectedLeagueId: number | null
  setSelectedLeagueId: (value: number | null) => void
}

export const Ctx = createContext<AppCtx | null>(null)
