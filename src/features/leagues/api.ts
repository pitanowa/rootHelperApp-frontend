import { gameApiGet, gameApiPost } from '../../api'

export type NamedLeague = { id: number; gameKey?: string; name: string }

export type StandingRow = {
  playerId: number
  playerName: string
  rootsTotal?: number
  pointsTotal: number
  gamesPlayed: number
  wins: number
}

export function listLeagues(gameKey: string): Promise<NamedLeague[]> {
  return gameApiGet<NamedLeague[]>(gameKey, '/leagues')
}

export function listLeagueStandings(gameKey: string, leagueId: number): Promise<StandingRow[]> {
  return gameApiGet<StandingRow[]>(gameKey, `/leagues/${leagueId}/standings`)
}

export function recalculateLeagueStandings(gameKey: string, leagueId: number): Promise<void> {
  return gameApiPost<void>(gameKey, `/leagues/${leagueId}/standings/recalculate`, {})
}
