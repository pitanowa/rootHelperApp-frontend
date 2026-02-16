import { useCallback, useEffect, useMemo, useState } from 'react'
import { gameApiDelete, gameApiGet, gameApiPost } from '../../../api'
import type { CreateMatchFormState, LeaguePageConfig } from '../../../core/games/types'
import type { Player } from '../../../types'
import { toErrorMessage } from '../../../shared/errors'
import type { CreatedMatch, MatchListItem, MatchSummary, StandingRow } from '../types'

type Params = {
  gameKey: string
  leagueId: number
  getLeaguePageConfig: () => LeaguePageConfig
  buildCreateMatchPayload: (formState: CreateMatchFormState) => Record<string, unknown>
  onMatchCreated: (matchId: number) => void
}

export function useLeaguePageController({
  gameKey,
  leagueId,
  getLeaguePageConfig,
  buildCreateMatchPayload,
  onMatchCreated,
}: Params) {
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

  const leagueConfig = getLeaguePageConfig()

  const players: Player[] = useMemo(
    () => standings.map((s) => ({ id: s.playerId, name: s.playerName, createdAt: '' })),
    [standings],
  )

  useEffect(() => {
    if (!leagueConfig.supportsRaceDraft && raceDraftEnabled) setRaceDraftEnabled(false)
    if (!leagueConfig.supportsLandmarks && landmarksEnabled) setLandmarksEnabled(false)
  }, [landmarksEnabled, leagueConfig.supportsLandmarks, leagueConfig.supportsRaceDraft, raceDraftEnabled])

  useEffect(() => {
    if (!raceDraftEnabled) setExcludedRaces([])
  }, [raceDraftEnabled])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rows, ms] = await Promise.all([
        gameApiGet<StandingRow[]>(gameKey, `/leagues/${leagueId}/standings`),
        gameApiGet<MatchListItem[]>(gameKey, `/leagues/${leagueId}/matches`),
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
  }, [gameKey, leagueId])

  const openMatchSummary = useCallback(async (matchId: number) => {
    setSummary(null)
    setSummaryOpen(true)
    setSummaryLoading(true)
    setError(null)
    try {
      const s = await gameApiGet<MatchSummary>(gameKey, `/matches/${matchId}/summary`)
      setSummary(s)
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to load match summary'))
      setSummaryOpen(false)
    } finally {
      setSummaryLoading(false)
    }
  }, [gameKey])

  const deleteMatch = useCallback(async (matchId: number) => {
    setLoading(true)
    setError(null)
    try {
      await gameApiDelete<void>(gameKey, `/matches/${matchId}`)
      await load()
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to delete match'))
    } finally {
      setLoading(false)
    }
  }, [gameKey, load])

  const updateMatchRanked = useCallback(async (matchId: number, rankedNext: boolean) => {
    setLoading(true)
    setError(null)
    try {
      await gameApiPost<void>(gameKey, `/matches/${matchId}/ranked`, { ranked: rankedNext })
      await load()
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to update match ranked flag'))
    } finally {
      setLoading(false)
    }
  }, [gameKey, load])

  const saveMatchName = useCallback(async (matchId: number, name: string) => {
    setLoading(true)
    setError(null)
    try {
      await gameApiPost<void>(gameKey, `/matches/${matchId}/name`, { name })
      await load()
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to set match name'))
    } finally {
      setLoading(false)
    }
  }, [gameKey, load])

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
      const payload = buildCreateMatchPayload({
        timerSeconds,
        playerIds: selected,
        ranked,
        raceDraftEnabled,
        excludedRaces,
        landmarksEnabled,
      })

      const match = await gameApiPost<CreatedMatch>(gameKey, `/leagues/${leagueId}/matches`, payload)
      onMatchCreated(match.id)
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to create match'))
    } finally {
      setLoading(false)
    }
  }, [buildCreateMatchPayload, excludedRaces, gameKey, landmarksEnabled, leagueId, onMatchCreated, raceDraftEnabled, ranked, selected, timerSeconds])

  return {
    standings,
    matches,
    players,
    selected,
    ranked,
    timerSeconds,
    loading,
    error,
    leagueConfig,
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
