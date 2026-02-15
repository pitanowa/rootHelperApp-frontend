import { useCallback, useEffect, useMemo, useState } from 'react'
import type { GroupDetails, League, Player } from '../../../types'
import {
  addGroupMember,
  createGroupLeague,
  getGroupDetails,
  listGroupLeagues,
  listPlayersForGroups,
  removeGroupMember,
} from '../api'
import { toErrorMessage } from '../../../shared/errors'

type Params = {
  groupId: number
  onSelectedGroupIdChange: (groupId: number | null) => void
}

export function useGroupDetailsController({ groupId, onSelectedGroupIdChange }: Params) {
  const [group, setGroup] = useState<GroupDetails | null>(null)
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [newLeagueName, setNewLeagueName] = useState('')
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    onSelectedGroupIdChange(Number.isFinite(groupId) ? groupId : null)
  }, [groupId, onSelectedGroupIdChange])

  const memberIds = useMemo(() => new Set(group?.members.map((m) => m.id) ?? []), [group])

  const availablePlayers = useMemo(
    () => allPlayers.filter((p) => !memberIds.has(p.id)).sort((a, b) => a.name.localeCompare(b.name)),
    [allPlayers, memberIds],
  )

  const sortedLeagues = useMemo(() => [...leagues].sort((a, b) => a.name.localeCompare(b.name)), [leagues])
  const sortedMembers = useMemo(() => group?.members.slice().sort((a, b) => a.name.localeCompare(b.name)) ?? [], [group?.members])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [g, players, ls] = await Promise.all([
        getGroupDetails(groupId),
        listPlayersForGroups(),
        listGroupLeagues(groupId),
      ])
      setGroup(g)
      setAllPlayers(players)
      setLeagues(ls)
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to load group details'))
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    if (!Number.isFinite(groupId)) return
    void loadAll()
  }, [groupId, loadAll])

  const addMember = useCallback(async () => {
    if (selectedPlayerId === '') return
    setLoading(true)
    setError(null)
    try {
      await addGroupMember(groupId, selectedPlayerId)
      await loadAll()
      setSelectedPlayerId('')
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to add member'))
    } finally {
      setLoading(false)
    }
  }, [groupId, loadAll, selectedPlayerId])

  const removeMember = useCallback(async (playerId: number) => {
    setLoading(true)
    setError(null)
    try {
      await removeGroupMember(groupId, playerId)
      await loadAll()
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to remove member'))
    } finally {
      setLoading(false)
    }
  }, [groupId, loadAll])

  const createLeague = useCallback(async () => {
    const trimmed = newLeagueName.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    try {
      await createGroupLeague(groupId, trimmed)
      setNewLeagueName('')
      await loadAll()
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to create league'))
    } finally {
      setLoading(false)
    }
  }, [groupId, loadAll, newLeagueName])

  return {
    group,
    loading,
    error,
    selectedPlayerId,
    setSelectedPlayerId,
    newLeagueName,
    setNewLeagueName,
    sortedLeagues,
    sortedMembers,
    availablePlayers,
    loadAll,
    addMember,
    removeMember,
    createLeague,
  }
}
