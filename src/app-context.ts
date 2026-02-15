import { createContext } from 'react'

export type AppCtx = {
  selectedGroupId: number | null
  setSelectedGroupId: (v: number | null) => void
  selectedLeagueId: number | null
  setSelectedLeagueId: (v: number | null) => void
}

export const Ctx = createContext<AppCtx | null>(null)

