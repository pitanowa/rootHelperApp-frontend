import { createContext } from 'react'
import type { SupportedGame } from './core/games/types'

export type AppCtx = {
  selectedGameKey: string
  setSelectedGameKey: (value: string) => void
  selectedGroupId: number | null
  setSelectedGroupId: (value: number | null) => void
  selectedLeagueId: number | null
  setSelectedLeagueId: (value: number | null) => void
  supportedGames: SupportedGame[]
  supportedGamesLoading: boolean
  supportedGamesError: string | null
  refreshSupportedGames: () => Promise<void>
}

export const Ctx = createContext<AppCtx | null>(null)
