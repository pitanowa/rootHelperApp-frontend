import { toRouteGameKey } from '../core/games/registry'

export function gameRootPath(gameKey: string) {
  return `/${toRouteGameKey(gameKey)}`
}

export function gameHomePath(gameKey: string) {
  return gameRootPath(gameKey)
}

export function gamePlayersPath(gameKey: string) {
  return `${gameRootPath(gameKey)}/players`
}

export function gameGroupsPath(gameKey: string) {
  return `${gameRootPath(gameKey)}/groups`
}

export function gameGroupDetailsPath(gameKey: string, groupId: number) {
  return `${gameGroupsPath(gameKey)}/${groupId}`
}

export function gameLeaguePath(gameKey: string, leagueId: number) {
  return `${gameRootPath(gameKey)}/leagues/${leagueId}`
}

export function gameMatchPath(gameKey: string, matchId: number) {
  return `${gameRootPath(gameKey)}/matches/${matchId}`
}
