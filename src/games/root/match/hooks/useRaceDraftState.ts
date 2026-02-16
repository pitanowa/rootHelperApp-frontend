/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { RACE_IDS } from '../../../../constants/races'
import type { DraftState, MatchPlayerState } from '../../../../features/matches/types'

const ALL_RACES = RACE_IDS
const VAGABOND = 'VAGABOND'

type Params = {
  draft: DraftState
  players: MatchPlayerState[]
  landmarksBanned?: string | null
  landmarksRandomCount?: number | null
}

export function useRaceDraftState({ draft, players, landmarksBanned, landmarksRandomCount }: Params) {
  const playersById = useMemo(() => {
    const m = new Map<number, MatchPlayerState>()
    for (const p of players) m.set(p.playerId, p)
    return m
  }, [players])

  const totalPlayers = players.length
  const drawCount = totalPlayers + 1
  const maxBans = Math.max(0, ALL_RACES.length - drawCount)
  const maxVagabondCopies = totalPlayers === 6 ? 2 : 1
  const canBanSecondVagabond = maxVagabondCopies === 2

  const [localBans, setLocalBans] = useState<string[]>(draft.bannedRaces ?? [])
  const [localLandmarkBanned, setLocalLandmarkBanned] = useState<string>('')
  const [localLandmarkRandomCount, setLocalLandmarkRandomCount] = useState<1 | 2>(1)
  useEffect(() => {
    if (landmarksBanned) setLocalLandmarkBanned(landmarksBanned)
    if (landmarksRandomCount === 1 || landmarksRandomCount === 2) setLocalLandmarkRandomCount(landmarksRandomCount)
  }, [landmarksBanned, landmarksRandomCount])
  useEffect(() => {
    setLocalBans(draft.bannedRaces ?? [])
  }, [draft.bannedRaces, draft.matchId, draft.phase])

  const vagabondBanCount = useMemo(() => localBans.filter((r) => r === VAGABOND).length, [localBans])
  const nonVagabondBans = useMemo(() => new Set(localBans.filter((r) => r !== VAGABOND)), [localBans])

  const bansCount = localBans.length
  const bansLeft = Math.max(0, maxBans - bansCount)

  const currentPlayerId = draft.currentPlayerId
  const currentPlayer = currentPlayerId != null ? (playersById.get(currentPlayerId) ?? null) : null

  const assignedCount = useMemo(() => players.filter((p) => !!p.race).length, [players])
  const remainingPicks = Math.max(0, totalPlayers - assignedCount)

  const order = useMemo(() => {
    if (draft.pickOrder && draft.pickOrder.length) return draft.pickOrder
    return [...players].sort((a, b) => a.playerName.localeCompare(b.playerName)).map((p) => p.playerId)
  }, [draft.pickOrder, players])

  const canAddMoreBans = bansCount < maxBans
  const bansValid = bansCount <= maxBans

  const [confirmLastPickOpen, setConfirmLastPickOpen] = useState(false)
  const [pendingPick, setPendingPick] = useState<{ playerId: number; race: string } | null>(null)

  const isLastPick =
    draft.phase === 'PICK' &&
    draft.status === 'DRAFTING' &&
    remainingPicks === 1 &&
    draft.currentPlayerId != null

  const [finishOpen, setFinishOpen] = useState(false)
  const [finishShownOnce, setFinishShownOnce] = useState(false)
  useEffect(() => {
    if (draft.phase !== 'PICK') return
    if (draft.status !== 'FINISHED') return
    if (finishShownOnce) return
    setFinishShownOnce(true)
    setFinishOpen(true)
  }, [draft.phase, draft.status, finishShownOnce])

  function toggleBan(race: string) {
    if (draft.phase !== 'BAN') return
    if (draft.status !== 'DRAFTING') return

    if (race === VAGABOND) {
      if (vagabondBanCount > 0) {
        const idx = localBans.findIndex((r) => r === VAGABOND)
        if (idx >= 0) {
          const next = localBans.slice()
          next.splice(idx, 1)
          setLocalBans(next)
        }
      } else {
        if (!canAddMoreBans) return
        setLocalBans([...localBans, VAGABOND])
      }
      return
    }

    const isBanned = nonVagabondBans.has(race)
    if (isBanned) {
      setLocalBans(localBans.filter((r) => r !== race))
    } else {
      if (!canAddMoreBans) return
      setLocalBans([...localBans, race])
    }
  }

  function addSecondVagabondBan() {
    if (!canBanSecondVagabond) return
    if (draft.phase !== 'BAN') return
    if (draft.status !== 'DRAFTING') return
    if (!canAddMoreBans) return
    if (vagabondBanCount >= 2) return
    setLocalBans([...localBans, VAGABOND])
  }

  function clearBans() {
    if (draft.phase !== 'BAN') return
    if (draft.status !== 'DRAFTING') return
    setLocalBans([])
  }

  return {
    playersById,
    totalPlayers,
    drawCount,
    maxBans,
    maxVagabondCopies,
    canBanSecondVagabond,
    localBans,
    localLandmarkBanned,
    setLocalLandmarkBanned,
    localLandmarkRandomCount,
    setLocalLandmarkRandomCount,
    vagabondBanCount,
    nonVagabondBans,
    bansCount,
    bansLeft,
    currentPlayerId,
    currentPlayer,
    assignedCount,
    remainingPicks,
    order,
    canAddMoreBans,
    bansValid,
    confirmLastPickOpen,
    setConfirmLastPickOpen,
    pendingPick,
    setPendingPick,
    isLastPick,
    finishOpen,
    setFinishOpen,
    toggleBan,
    addSecondVagabondBan,
    clearBans,
  }
}



