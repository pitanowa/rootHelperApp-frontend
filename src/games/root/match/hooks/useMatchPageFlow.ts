import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { gameApiPost } from '../../../../api'
import type { DraftState, MatchPlayerState, MatchState } from '../../../../features/matches/types'
import {
  LS_MANUAL_ORDER,
  LS_SETUP,
  lsClearRaces,
  lsGetBool,
  lsGetJson,
  lsGetRaceMap,
  lsSetJson,
  lsSetRace,
} from '../matchPageStorage'
import { getErrorMessage } from '../matchPageUi'

export type UseMatchPageFlowParams = {
  gameKey: string
  mid: number
  state: MatchState | null
  setState: Dispatch<SetStateAction<MatchState | null>>
  draft: DraftState | null
  load: () => Promise<void>
  setError: Dispatch<SetStateAction<string | null>>
}

type LandmarksStateResponse = {
  enabled: boolean
  banned: string | null
  randomCount: number | null
  drawn: string[]
}

export function useMatchPageFlow({
  gameKey,
  mid,
  state,
  setState,
  draft,
  load,
  setError,
}: UseMatchPageFlowParams) {
  const [flowStage, setFlowStage] = useState<'NONE' | 'SETUP'>('NONE')
  const [setupIndex, setSetupIndex] = useState(0)

  const prevDraftStatusRef = useRef<DraftState['status'] | null>(null)

  const playersInMatchOrder = useMemo(() => {
    if (!state) return []

    const draftOrder = draft?.pickOrder?.length ? [...draft.pickOrder].reverse() : null
    if (draftOrder) {
      const byId = new Map(state.players.map((p) => [p.playerId, p]))
      const arranged = draftOrder.map((id) => byId.get(id)).filter(Boolean) as MatchPlayerState[]
      const used = new Set(arranged.map((p) => p.playerId))
      const rest = state.players.filter((p) => !used.has(p.playerId))
      return [...arranged, ...rest]
    }

    if (state.raceDraftEnabled === false) {
      const manual = [...lsGetJson<number[]>(LS_MANUAL_ORDER(mid), [])].reverse()
      if (manual.length) {
        const byId = new Map(state.players.map((p) => [p.playerId, p]))
        const arranged = manual.map((id) => byId.get(id)).filter(Boolean) as MatchPlayerState[]
        const used = new Set(arranged.map((p) => p.playerId))
        const rest = state.players.filter((p) => !used.has(p.playerId))
        return [...arranged, ...rest]
      }
    }

    return [...state.players]
  }, [state, draft, mid])

  useEffect(() => {
    if (!draft) return

    const prevStatus = prevDraftStatusRef.current
    if (draft.status === 'FINISHED' && prevStatus !== 'FINISHED' && !lsGetBool(LS_SETUP(mid))) {
      window.setTimeout(() => {
        setSetupIndex(0)
        setFlowStage('SETUP')
      }, 0)
    }

    prevDraftStatusRef.current = draft.status
  }, [draft, mid])

  useEffect(() => {
    if (!state) return
    if (state.raceDraftEnabled) return
    if (lsGetBool(LS_SETUP(mid))) return

    const allPicked = state.players.every((p) => !!p.race)
    if (!allPicked) return

    window.setTimeout(() => {
      setSetupIndex(0)
      setFlowStage('SETUP')
    }, 0)
  }, [state, mid])

  useEffect(() => {
    if (!state) return
    if (state.raceDraftEnabled) return
    if (state.status !== 'DRAFT') return

    const allPicked = state.players.every((p) => !!p.race)
    if (!allPicked) return

    const landmarksRequired = !!state.landmarksEnabled
    const landmarksOk = (state.landmarksDrawn?.length ?? 0) > 0
    if (landmarksRequired && !landmarksOk) return

    void (async () => {
      try {
        await gameApiPost<void>(gameKey, `/matches/${mid}/start`)
        await load()
      } catch (e: unknown) {
        setError(getErrorMessage(e, 'Failed to start match'))
      }
    })()
  }, [gameKey, load, mid, setError, state])

  const needsRacePick =
    !!state &&
    state.raceDraftEnabled === false &&
    state.players.some((p) => !p.race)

  const showSetupHintsButton = draft?.status === 'FINISHED' && !lsGetBool(LS_SETUP(mid))

  const openSetupHints = useCallback(() => {
    setSetupIndex(0)
    setFlowStage('SETUP')
  }, [])

  const onDraftLandmarksBan = useCallback(
    async (banned: string, randomCount: 1 | 2) => {
      await gameApiPost(gameKey, `/matches/${mid}/landmarks/ban`, { banned, randomCount })
      await load()
    },
    [gameKey, load, mid],
  )

  const onDraftPick = useCallback(
    async (playerId: number, race: string) => {
      try {
        await gameApiPost(gameKey, `/matches/${mid}/draft/pick`, { playerId, race })
        await load()
      } catch (e: unknown) {
        setError(getErrorMessage(e, 'Failed to pick race'))
      }
    },
    [gameKey, load, mid, setError],
  )

  const onDraftSetBans = useCallback(
    async (bannedRaces: string[]) => {
      try {
        await gameApiPost(gameKey, `/matches/${mid}/draft/bans`, { bannedRaces })
        await load()
      } catch (e: unknown) {
        setError(getErrorMessage(e, 'Failed to set bans'))
      }
    },
    [gameKey, load, mid, setError],
  )

  const onDraftResetPick = useCallback(() => gameApiPost(gameKey, `/matches/${mid}/draft/reset-pick`), [gameKey, mid])

  const onSetLandmarksManual = useCallback(
    async (picked: string[]) => {
      try {
        const resp = await gameApiPost<LandmarksStateResponse>(gameKey, `/matches/${mid}/landmarks/manual`, { picked })

        setState((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            landmarkBanned: resp.banned ?? null,
            landmarksRandomCount: resp.randomCount ?? null,
            landmarksDrawn: resp.drawn ?? [],
          }
        })

        await load()
      } catch (e: unknown) {
        setError(getErrorMessage(e, 'Failed to set landmarks'))
      }
    },
    [gameKey, load, mid, setError, setState],
  )

  const onManualPick = useCallback(
    async (playerId: number, race: string) => {
      try {
        setState((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            players: prev.players.map((p) => (p.playerId === playerId ? { ...p, race } : p)),
          }
        })

        const key = LS_MANUAL_ORDER(mid)
        const order = lsGetJson<number[]>(key, [])
        if (!order.includes(playerId)) {
          order.push(playerId)
          lsSetJson(key, order)
        }

        lsSetRace(mid, playerId, race)
        await gameApiPost(gameKey, `/matches/${mid}/race-pick`, { playerId, race })

        const allPickedNow = (state?.players ?? []).every((p) =>
          p.playerId === playerId ? true : !!(p.race || lsGetRaceMap(mid)[p.playerId]),
        )

        if (allPickedNow) {
          await load()
          return
        }

        await load()
      } catch (e: unknown) {
        setError(getErrorMessage(e, 'Failed to pick race'))
      }
    },
    [gameKey, load, mid, setError, setState, state],
  )

  const onManualReset = useCallback(async () => {
    try {
      lsClearRaces(mid)

      setState((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          players: prev.players.map((p) => ({ ...p, race: null })),
        }
      })

      await gameApiPost(gameKey, `/matches/${mid}/race-pick/reset`)
      await load()
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Failed to reset race picks'))
    }
  }, [gameKey, load, mid, setError, setState])

  return {
    flowStage,
    setFlowStage,
    setupIndex,
    setSetupIndex,
    playersInMatchOrder,
    needsRacePick,
    showSetupHintsButton,
    openSetupHints,
    onDraftLandmarksBan,
    onDraftPick,
    onDraftSetBans,
    onDraftResetPick,
    onSetLandmarksManual,
    onManualPick,
    onManualReset,
  }
}

