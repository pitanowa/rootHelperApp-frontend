import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { listGroups } from '../../groups/api'
import { listLeagues, listLeagueStandings, type StandingRow } from '../../leagues/api'
import { listActiveMatches } from '../../matches/api'
import type { ActiveMatch } from '../../matches/types'
import { listPlayers } from '../../players/api'
import { toErrorMessage } from '../../../shared/errors'

type PlayerListItem = { id: number; name: string }

export function useHomePageController(gameKey: string) {
  const [players, setPlayers] = useState<PlayerListItem[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(true)
  const [playersError, setPlayersError] = useState<string | null>(null)

  const [activeMatches, setActiveMatches] = useState<ActiveMatch[]>([])
  const [loadingActive, setLoadingActive] = useState(true)
  const [activeError, setActiveError] = useState<string | null>(null)

  const [leagueMap, setLeagueMap] = useState<Record<number, string>>({})
  const [groupMap, setGroupMap] = useState<Record<number, string>>({})

  const [standings, setStandings] = useState<StandingRow[]>([])
  const [standingsLeagueId, setStandingsLeagueId] = useState<number | null>(null)
  const [loadingStandings, setLoadingStandings] = useState(true)
  const [standingsError, setStandingsError] = useState<string | null>(null)

  const location = useLocation()
  const requestIdRef = useRef(0)

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current

    setLoadingPlayers(true)
    setPlayersError(null)
    setLoadingActive(true)
    setActiveError(null)
    setLoadingStandings(true)
    setStandingsError(null)

    try {
      const [matches, leagues, groups, playersResp] = await Promise.all([
        listActiveMatches(gameKey),
        listLeagues(gameKey),
        listGroups(gameKey),
        listPlayers(gameKey),
      ])

      if (requestId !== requestIdRef.current) return

      setPlayers(playersResp ?? [])
      setActiveMatches(matches ?? [])
      setLeagueMap(Object.fromEntries((leagues ?? []).map((league) => [league.id, league.name])))
      setGroupMap(Object.fromEntries((groups ?? []).map((group) => [group.id, group.name])))

      const initialLeagueId = leagues?.[0]?.id ?? null
      setStandingsLeagueId(initialLeagueId)

      if (initialLeagueId == null) {
        setStandings([])
      } else {
        try {
          const standingsRows = await listLeagueStandings(gameKey, initialLeagueId)
          if (requestId !== requestIdRef.current) return
          setStandings(standingsRows ?? [])
        } catch (error: unknown) {
          if (requestId !== requestIdRef.current) return
          setStandingsError(toErrorMessage(error, 'Failed to fetch league standings.'))
          setStandings([])
        }
      }
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return
      setActiveError(toErrorMessage(error, 'Failed to fetch active matches.'))
      setPlayersError(toErrorMessage(error, 'Failed to fetch players list.'))
      setStandingsError(toErrorMessage(error, 'Failed to fetch league standings.'))
      setActiveMatches([])
      setPlayers([])
      setStandings([])
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingPlayers(false)
        setLoadingActive(false)
        setLoadingStandings(false)
      }
    }
  }, [gameKey])

  useEffect(() => {
    void load()
  }, [load, location.pathname])

  return {
    players,
    loadingPlayers,
    playersError,
    activeMatches,
    loadingActive,
    activeError,
    leagueMap,
    groupMap,
    standings,
    standingsLeagueId,
    loadingStandings,
    standingsError,
    load,
  }
}
