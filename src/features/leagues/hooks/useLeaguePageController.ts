import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiDelete, apiGet, apiPost } from '../../../api'
import type { Player } from '../../../types'
import { toErrorMessage } from '../../../shared/errors'
import type { CreatedMatch, MatchListItem, MatchSummary, StandingRow } from '../types'

type Params = {
  leagueId: number
  onMatchCreated: (matchId: number) => void
}

export function useLeaguePageController({ leagueId, onMatchCreated }: Params) {
  const [standings, setStandings] = useState<StandingRow[]>([])
  const [matches, setMatches] = useState<MatchListItem[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [ranked, setRanked] = useState(true)
  const [timerSeconds, setTimerSeconds] = useState(180)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [landmarksEnabled, setLandmarksEnabled] = useState(false)
  const [raceDraftEnabled, setRaceDraftEnabled] = useState(false)
  const [excludedRaces, setExcludedRaces] = useState<string[]>([])
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [summary, setSummary] = useState<MatchSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  const players: Player[] = useMemo(
    () => standings.map((s) => ({ id: s.playerId, name: s.playerName, createdAt: '' })),
    [standings],
  )

  useEffect(() => {
    if (!raceDraftEnabled) setExcludedRaces([])
  }, [raceDraftEnabled])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rows, ms] = await Promise.all([
        apiGet<StandingRow[]>(`/api/leagues/${leagueId}/standings`),
        apiGet<MatchListItem[]>(`/api/leagues/${leagueId}/matches`),
      ])

      rows.sort((a, b) => (b.rootsTotal ?? 0) - (a.rootsTotal ?? 0) || a.playerName.localeCompare(b.playerName))
      setStandings(rows)
      setMatches(ms)

      const ids = new Set(rows.map((r) => r.playerId))
      setSelected((prev) => prev.filter((id) => ids.has(id)))
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to load league'))
    } finally {
      setLoading(false)
    }
  }, [leagueId])

  const openMatchSummary = useCallback(async (matchId: number) => {
    setSummary(null)
    setSummaryOpen(true)
    setSummaryLoading(true)
    setError(null)
    try {
      const s = await apiGet<MatchSummary>(`/api/matches/${matchId}/summary`)
      setSummary(s)
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to load match summary'))
      setSummaryOpen(false)
    } finally {
      setSummaryLoading(false)
    }
  }, [])

  const deleteMatch = useCallback(async (matchId: number) => {
    setLoading(true)
    setError(null)
    try {
      await apiDelete<void>(`/api/matches/${matchId}`)
      await load()
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to delete match'))
    } finally {
      setLoading(false)
    }
  }, [load])

  const updateMatchRanked = useCallback(async (matchId: number, rankedNext: boolean) => {
    setLoading(true)
    setError(null)
    try {
      await apiPost<void>(`/api/matches/${matchId}/ranked`, { ranked: rankedNext })
      await load()
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to update match ranked flag'))
    } finally {
      setLoading(false)
    }
  }, [load])

  const saveMatchName = useCallback(async (matchId: number, name: string) => {
    setLoading(true)
    setError(null)
    try {
      await apiPost<void>(`/api/matches/${matchId}/name`, { name })
      await load()
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to set match name'))
    } finally {
      setLoading(false)
    }
  }, [load])

  useEffect(() => {
    if (!Number.isFinite(leagueId)) return
    void load()
  }, [leagueId, load])

  const togglePlayer = useCallback((id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const createMatch = useCallback(async () => {
    if (selected.length < 2) {
      setError('Select at least 2 players')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const match = await apiPost<CreatedMatch>(`/api/leagues/${leagueId}/matches`, {
        timerSeconds,
        playerIds: selected,
        ranked,
        raceDraftEnabled,
        excludedRaces: raceDraftEnabled ? excludedRaces : [],
        landmarksEnabled,
      })
      onMatchCreated(match.id)
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to create match'))
    } finally {
      setLoading(false)
    }
  }, [excludedRaces, landmarksEnabled, leagueId, onMatchCreated, raceDraftEnabled, ranked, selected, timerSeconds])

  return {
    standings,
    matches,
    players,
    selected,
    ranked,
    timerSeconds,
    loading,
    error,
    landmarksEnabled,
    raceDraftEnabled,
    summaryOpen,
    summary,
    summaryLoading,
    setRanked,
    setTimerSeconds,
    setLandmarksEnabled,
    setRaceDraftEnabled,
    setSummaryOpen,
    load,
    openMatchSummary,
    deleteMatch,
    updateMatchRanked,
    saveMatchName,
    togglePlayer,
    createMatch,
  }
}
