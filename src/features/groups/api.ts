import { apiDelete, apiGet, apiPost } from '../../api'
import type { Group, GroupDetails, League, Player } from '../../types'

export function listGroups(): Promise<Group[]> {
  return apiGet<Group[]>('/api/groups')
}

export function createGroup(name: string): Promise<Group> {
  return apiPost<Group>('/api/groups', { name })
}

export function getGroupDetails(groupId: number): Promise<GroupDetails> {
  return apiGet<GroupDetails>(`/api/groups/${groupId}`)
}

export function listGroupLeagues(groupId: number): Promise<League[]> {
  return apiGet<League[]>(`/api/groups/${groupId}/leagues`)
}

export function createGroupLeague(groupId: number, name: string): Promise<League> {
  return apiPost<League>(`/api/groups/${groupId}/leagues`, { name })
}

export function addGroupMember(groupId: number, playerId: number): Promise<void> {
  return apiPost<void>(`/api/groups/${groupId}/members/${playerId}`)
}

export function removeGroupMember(groupId: number, playerId: number): Promise<void> {
  return apiDelete<void>(`/api/groups/${groupId}/members/${playerId}`)
}

export function listPlayersForGroups(): Promise<Player[]> {
  return apiGet<Player[]>('/api/players')
}

