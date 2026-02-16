import { useMemo, useState } from 'react'
import { DEFAULT_GAME_KEY } from './core/games/registry'
import { Ctx } from './app-context'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedGameKey, setSelectedGameKey] = useState(DEFAULT_GAME_KEY)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null)

  const value = useMemo(
    () => ({
      selectedGameKey,
      setSelectedGameKey,
      selectedGroupId,
      setSelectedGroupId,
      selectedLeagueId,
      setSelectedLeagueId,
    }),
    [selectedGameKey, selectedGroupId, selectedLeagueId],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
