import { gameApiDelete, gameApiGet, gameApiPost } from '../../api'
import type { Group, GroupDetails, League, Player } from '../../types'

const SHARED_PLAYERS_GAME_KEY = 'ROOT'

export function listGroups(gameKey: string): Promise<Group[]> {
  return gameApiGet<Group[]>(gameKey, '/groups')
}

export function createGroup(gameKey: string, name: string): Promise<Group> {
  return gameApiPost<Group>(gameKey, '/groups', { name })
}

export function getGroupDetails(gameKey: string, groupId: number): Promise<GroupDetails> {
  return gameApiGet<GroupDetails>(gameKey, `/groups/${groupId}`)
}

export function listGroupLeagues(gameKey: string, groupId: number): Promise<League[]> {
  return gameApiGet<League[]>(gameKey, `/groups/${groupId}/leagues`)
}

export function createGroupLeague(gameKey: string, groupId: number, name: string): Promise<League> {
  return gameApiPost<League>(gameKey, `/groups/${groupId}/leagues`, { name })
}

export function addGroupMember(gameKey: string, groupId: number, playerId: number): Promise<void> {
  return gameApiPost<void>(gameKey, `/groups/${groupId}/members/${playerId}`)
}

export function removeGroupMember(gameKey: string, groupId: number, playerId: number): Promise<void> {
  return gameApiDelete<void>(gameKey, `/groups/${groupId}/members/${playerId}`)
}

export function listPlayersForGroups(_gameKey: string): Promise<Player[]> {
  return gameApiGet<Player[]>(SHARED_PLAYERS_GAME_KEY, '/players')
}
