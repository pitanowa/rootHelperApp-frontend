import { useMemo, useState } from 'react'
import { LANDMARKS, type LandmarkId } from '../../../data/landmarks'
import { raceKey, RACE_IDS } from '../../../constants/races'
import type { MatchPlayerState } from '../types'

export function useRacePickState(players: MatchPlayerState[], landmarksDrawn?: string[]) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(() => players[0]?.playerId ?? 0)
  const [localPickedLandmarks, setLocalPickedLandmarks] = useState<LandmarkId[]>(() => {
    const drawn = (landmarksDrawn ?? []).filter((x): x is LandmarkId => LANDMARKS.some((l) => l.id === x))
    return drawn.slice(0, 2)
  })

  function toggleLandmark(id: LandmarkId) {
    setLocalPickedLandmarks((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  const taken = useMemo(() => {
    const s = new Set<string>()
    for (const p of players) {
      const rk = raceKey(p.race)
      if (rk) s.add(rk)
    }
    return s
  }, [players])

  const pool = useMemo(() => RACE_IDS, [])
  const selectedPlayer = players.find((p) => p.playerId === selectedPlayerId) ?? players[0] ?? null

  return {
    selectedPlayerId,
    setSelectedPlayerId,
    localPickedLandmarks,
    setLocalPickedLandmarks,
    toggleLandmark,
    taken,
    pool,
    selectedPlayer,
  }
}

