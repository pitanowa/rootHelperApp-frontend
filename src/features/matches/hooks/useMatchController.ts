import { useCallback, useEffect, useRef, useState } from 'react'
import { apiGet, apiPost } from '../../../api'
import type { DraftState, MatchState } from '../types'

export type MatchSummary = {
  matchId: number
  leagueId: number
  ranked: boolean
  finished: boolean
  description: string | null
  players: {
    playerId: number
    playerName: string
    raceId: string | null
    raceLabel?: string | null
    points: number
    roots: number
  }[]
  landmarks: { id: string; label: string }[]
  rankingAfter: {
    position: number
    playerId: number
    playerName: string
    totalPoints: number
    totalRoots: number
    gamesPlayed: number
    wins: number
  }[]
}

type Params = {
  mid: number
  getRaceMap: (mid: number) => Record<number, string>
  playAlarm: () => void
}

export function useMatchController({ mid, getRaceMap, playAlarm }: Params) {
  const [state, setState] = useState<MatchState | null>(null)
  const [draft, setDraft] = useState<DraftState | null>(null)

  const [localTime, setLocalTime] = useState<Record<number, number>>({})
  const [runningPlayerId, setRunningPlayerId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scoreInput, setScoreInput] = useState<Record<number, string>>({})

  const [summaryOpen, setSummaryOpen] = useState(false)
  const [summary, setSummary] = useState<MatchSummary | null>(null)
  const [summaryDesc, setSummaryDesc] = useState('')
  const [summarySaving, setSummarySaving] = useState(false)

  const alertedRef = useRef<Record<number, boolean>>({})
  const lastSaveRef = useRef<Record<number, number>>({})
  const loadInFlightRef = useRef(false)

  const presetSeconds = state?.timerSecondsInitial ?? 180
  const matchStarted = state?.status === 'RUNNING'

  const load = useCallback(async () => {
    if (!Number.isFinite(mid)) return
    if (loadInFlightRef.current) return
    loadInFlightRef.current = true

    setLoading(true)
    setError(null)

    try {
      const s = await apiGet<MatchState>(`/api/matches/${mid}`)

      const raceMap = getRaceMap(mid)
      let nextState: MatchState = {
        ...s,
        players: s.players.map((p) => ({
          ...p,
          race: raceMap[p.playerId] ?? p.race ?? null,
        })),
      }

      setScoreInput((prev) => {
        const next = { ...prev }
        for (const p of s.players) {
          if (next[p.playerId] === undefined) next[p.playerId] = String(p.score ?? 0)
        }
        return next
      })

      setLocalTime((prev) => {
        const next = { ...prev }
        for (const p of s.players) {
          if (next[p.playerId] === undefined) next[p.playerId] = p.timeLeftSeconds
        }
        return next
      })

      if (s.raceDraftEnabled) {
        try {
          const d = await apiGet<DraftState>(`/api/matches/${mid}/draft`)
          setDraft(d)

          const raceByPlayerId = new Map(d.assignments.map((a) => [a.playerId, a.race]))
          nextState = {
            ...nextState,
            players: nextState.players.map((p) => ({
              ...p,
              race: p.race ?? raceByPlayerId.get(p.playerId) ?? null,
            })),
          }
        } catch {
          setDraft(null)
        }
      } else {
        setDraft(null)
      }

      setState(nextState)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load match')
    } finally {
      setLoading(false)
      loadInFlightRef.current = false
    }
  }, [getRaceMap, mid])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (runningPlayerId == null) return
    const id = window.setInterval(() => {
      setLocalTime((prev) => {
        const cur = prev[runningPlayerId]
        if (cur == null || cur <= 0) return prev
        const nextVal = cur - 1
        if (nextVal <= 0) {
          window.setTimeout(() => setRunningPlayerId(null), 0)
          return { ...prev, [runningPlayerId]: 0 }
        }
        return { ...prev, [runningPlayerId]: nextVal }
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [runningPlayerId])

  useEffect(() => {
    if (!state) return
    for (const p of state.players) {
      const t = localTime[p.playerId] ?? p.timeLeftSeconds
      if (t <= 0 && !alertedRef.current[p.playerId]) {
        alertedRef.current[p.playerId] = true
        playAlarm()
      }
    }
  }, [localTime, playAlarm, state])

  const startMatch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await apiPost<void>(`/api/matches/${mid}/start`)
      await load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to start match')
    } finally {
      setLoading(false)
    }
  }, [load, mid])

  const saveTime = useCallback(
    async (playerId: number, timeLeftSeconds: number) => {
      const now = Date.now()
      const last = lastSaveRef.current[playerId] ?? 0
      if (now - last < 500) return
      lastSaveRef.current[playerId] = now

      await apiPost<void>(`/api/matches/${mid}/players/${playerId}/set-time`, {
        timeLeftSeconds: Math.max(0, Math.floor(timeLeftSeconds)),
      })
    },
    [mid],
  )

  const setRunning = useCallback(
    async (playerId: number) => {
      const t = localTime[playerId] ?? state?.players.find((x) => x.playerId === playerId)?.timeLeftSeconds ?? 0
      if (t <= 0) return

      if (runningPlayerId != null && runningPlayerId !== playerId) {
        const prevT = localTime[runningPlayerId]
        if (prevT != null) {
          try {
            await saveTime(runningPlayerId, prevT)
          } catch {
            // ignore save race when switching active player
          }
        }
      }

      setRunningPlayerId(playerId)
    },
    [localTime, runningPlayerId, saveTime, state?.players],
  )

  const stopRunning = useCallback(
    async (playerId: number) => {
      const t = localTime[playerId]
      setRunningPlayerId((prev) => (prev === playerId ? null : prev))
      if (t == null) return
      try {
        await saveTime(playerId, t)
      } catch {
        // ignore stop save failure; sync on refresh
      }
    },
    [localTime, saveTime],
  )

  const addMinute = useCallback(
    async (playerId: number) => {
      setLocalTime((prev) => ({ ...prev, [playerId]: (prev[playerId] ?? 0) + 60 }))
      try {
        await apiPost<void>(`/api/matches/${mid}/players/${playerId}/time`, { seconds: 60 })
      } catch {
        // keep optimistic local time, backend will resync on next load
      }
    },
    [mid],
  )

  const removeMinute = useCallback(
    async (playerId: number) => {
      setLocalTime((prev) => ({ ...prev, [playerId]: Math.max(0, (prev[playerId] ?? 0) - 60) }))
      try {
        await apiPost<void>(`/api/matches/${mid}/players/${playerId}/time`, { seconds: -60 })
      } catch {
        // keep optimistic local time, backend will resync on next load
      }
    },
    [mid],
  )

  const addSecond = useCallback(
    async (playerId: number) => {
      setLocalTime((prev) => ({ ...prev, [playerId]: (prev[playerId] ?? 0) + 1 }))
      try {
        await apiPost<void>(`/api/matches/${mid}/players/${playerId}/time`, { seconds: 1 })
      } catch {
        // keep optimistic local time, backend will resync on next load
      }
    },
    [mid],
  )

  const removeSecond = useCallback(
    async (playerId: number) => {
      setLocalTime((prev) => ({ ...prev, [playerId]: Math.max(0, (prev[playerId] ?? 0) - 1) }))
      try {
        await apiPost<void>(`/api/matches/${mid}/players/${playerId}/time`, { seconds: -1 })
      } catch {
        // keep optimistic local time, backend will resync on next load
      }
    },
    [mid],
  )

  const scoreDelta = useCallback(
    async (playerId: number, delta: number) => {
      try {
        await apiPost<void>(`/api/matches/${mid}/players/${playerId}/score`, { delta })
        await load()
      } catch {
        // let user continue; next refresh will reconcile
      }
    },
    [load, mid],
  )

  const setScoreAbsolute = useCallback(
    async (playerId: number, targetScore: number) => {
      const current = state?.players.find((p) => p.playerId === playerId)?.score ?? 0
      const delta = targetScore - current
      if (delta === 0) return
      await scoreDelta(playerId, delta)
    },
    [scoreDelta, state?.players],
  )

  const refreshTimer = useCallback(
    async (playerId: number) => {
      setRunningPlayerId((prev) => (prev === playerId ? null : prev))
      alertedRef.current[playerId] = false
      setLocalTime((prev) => ({ ...prev, [playerId]: presetSeconds }))

      try {
        await apiPost<void>(`/api/matches/${mid}/players/${playerId}/set-time`, {
          timeLeftSeconds: presetSeconds,
        })
        await load()
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to refresh timer')
      }
    },
    [load, mid, presetSeconds],
  )

  const openSummaryModal = useCallback(async () => {
    const s = await apiGet<MatchSummary>(`/api/matches/${mid}/summary`)
    setSummary(s)
    setSummaryDesc((s.description ?? '').toString())
    setSummaryOpen(true)
  }, [mid])

  const saveSummaryAndExit = useCallback(async () => {
    if (!summary) return
    setSummarySaving(true)
    try {
      await apiPost<void>(`/api/matches/${mid}/description`, { description: summaryDesc })
      window.location.href = `/leagues/${summary.leagueId}`
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save description')
    } finally {
      setSummarySaving(false)
    }
  }, [mid, summary, summaryDesc])

  const finish = useCallback(async () => {
    const ok = confirm('Finish match? This will update league standings.')
    if (!ok) return

    setLoading(true)
    try {
      if (runningPlayerId != null) {
        const t = localTime[runningPlayerId]
        setRunningPlayerId(null)
        if (t != null) {
          try {
            await saveTime(runningPlayerId, t)
          } catch {
            // ignore flush error and continue finish flow
          }
        }
      }
      await apiPost<void>(`/api/matches/${mid}/finish`)
      await load()
      await openSummaryModal()
    } finally {
      setLoading(false)
    }
  }, [load, localTime, mid, openSummaryModal, runningPlayerId, saveTime])

  return {
    state,
    setState,
    draft,
    localTime,
    runningPlayerId,
    loading,
    error,
    setError,
    scoreInput,
    setScoreInput,
    summaryOpen,
    setSummaryOpen,
    summary,
    summaryDesc,
    setSummaryDesc,
    summarySaving,
    presetSeconds,
    matchStarted,
    load,
    startMatch,
    finish,
    setRunning,
    stopRunning,
    addMinute,
    removeMinute,
    addSecond,
    removeSecond,
    setScoreAbsolute,
    refreshTimer,
    saveSummaryAndExit,
  }
}

