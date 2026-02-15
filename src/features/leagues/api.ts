import { apiGet } from '../../api'

export type NamedLeague = { id: number; name: string }

export type StandingRow = {
  playerId: number
  playerName: string
  rootsTotal?: number
  pointsTotal: number
  gamesPlayed: number
  wins: number
}

export function listLeagues(): Promise<NamedLeague[]> {
  return apiGet<NamedLeague[]>('/api/leagues')
}

export function listLeagueStandings(leagueId: number): Promise<StandingRow[]> {
  return apiGet<StandingRow[]>(`/api/leagues/${leagueId}/standings`)
}
