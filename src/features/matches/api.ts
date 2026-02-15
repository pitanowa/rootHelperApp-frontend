import { apiGet } from '../../api'
import type { ActiveMatch } from './types'

export function listActiveMatches(groupId?: number | null, leagueId?: number | null): Promise<ActiveMatch[]> {
  const qs = new URLSearchParams()
  if (groupId) qs.set('groupId', String(groupId))
  if (leagueId) qs.set('leagueId', String(leagueId))
  const suffix = qs.size > 0 ? `?${qs.toString()}` : ''
  return apiGet<ActiveMatch[]>(`/api/matches/active${suffix}`)
}

