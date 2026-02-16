import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Group } from '../../../types'
import { createGroup as createGroupRequest, listGroups } from '../api'
import { toErrorMessage } from '../../../shared/errors'

export function useGroupsPageController(gameKey: string) {
  const [groups, setGroups] = useState<Group[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sortedGroups = useMemo(() => [...groups].sort((a, b) => a.name.localeCompare(b.name)), [groups])

  const loadGroups = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setGroups(await listGroups(gameKey))
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to load groups'))
    } finally {
      setLoading(false)
    }
  }, [gameKey])

  useEffect(() => {
    void loadGroups()
  }, [loadGroups])

  const createGroup = useCallback(async () => {
    const trimmed = name.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    try {
      const created = await createGroupRequest(gameKey, trimmed)
      setGroups((prev) => [...prev, created])
      setName('')
    } catch (e: unknown) {
      setError(toErrorMessage(e, 'Failed to create group'))
    } finally {
      setLoading(false)
    }
  }, [gameKey, name])

  return {
    sortedGroups,
    name,
    loading,
    error,
    setName,
    loadGroups,
    createGroup,
  }
}
