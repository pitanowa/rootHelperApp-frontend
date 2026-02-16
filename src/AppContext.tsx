import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_GAME_KEY } from './core/games/registry'
import { listSupportedGames } from './core/games/api'
import type { SupportedGame } from './core/games/types'
import { Ctx } from './app-context'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedGameKey, setSelectedGameKey] = useState(DEFAULT_GAME_KEY)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null)

  const [supportedGames, setSupportedGames] = useState<SupportedGame[]>([])
  const [supportedGamesLoading, setSupportedGamesLoading] = useState(true)
  const [supportedGamesError, setSupportedGamesError] = useState<string | null>(null)

  const refreshSupportedGames = useCallback(async () => {
    setSupportedGamesLoading(true)
    setSupportedGamesError(null)
    try {
      const games = await listSupportedGames()
      setSupportedGames(games ?? [])
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load supported games'
      setSupportedGamesError(message)
      setSupportedGames([])
    } finally {
      setSupportedGamesLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshSupportedGames()
  }, [refreshSupportedGames])

  const value = useMemo(
    () => ({
      selectedGameKey,
      setSelectedGameKey,
      selectedGroupId,
      setSelectedGroupId,
      selectedLeagueId,
      setSelectedLeagueId,
      supportedGames,
      supportedGamesLoading,
      supportedGamesError,
      refreshSupportedGames,
    }),
    [
      selectedGameKey,
      selectedGroupId,
      selectedLeagueId,
      supportedGames,
      supportedGamesLoading,
      supportedGamesError,
      refreshSupportedGames,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
