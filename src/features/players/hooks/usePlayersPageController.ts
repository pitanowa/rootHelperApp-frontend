import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Player } from '../../../types'
import { createPlayer, deletePlayer, listPlayers } from '../api'
import { toErrorMessage } from '../../../shared/errors'

export function usePlayersPageController(gameKey: string) {
  const [players, setPlayers] = useState<Player[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sortedPlayers = useMemo(() => [...players].sort((a, b) => a.name.localeCompare(b.name)), [players])

  const loadPlayers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listPlayers(gameKey)
      setPlayers(data)
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to load players'))
    } finally {
      setLoading(false)
    }
  }, [gameKey])

  useEffect(() => {
    void loadPlayers()
  }, [loadPlayers])

  const addPlayer = useCallback(async () => {
    const trimmed = name.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    try {
      const created = await createPlayer(gameKey, trimmed)
      setPlayers((prev) => [...prev, created])
      setName('')
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to add player'))
    } finally {
      setLoading(false)
    }
  }, [gameKey, name])

  const removePlayer = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      await deletePlayer(gameKey, id)
    } catch (e: unknown) {
      const msg = toErrorMessage(e, 'Failed to remove player')
      const notFound = msg.includes('404')
      if (!notFound) {
        setError(msg)
        setLoading(false)
        return
      }
    }

    setPlayers((prev) => prev.filter((p) => p.id !== id))
    setLoading(false)
  }, [gameKey])

  return {
    sortedPlayers,
    name,
    loading,
    error,
    setName,
    loadPlayers,
    addPlayer,
    removePlayer,
  }
}
