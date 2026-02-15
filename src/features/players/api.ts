import { apiDelete, apiGet, apiPost } from '../../api'
import type { Player } from '../../types'

export function listPlayers(): Promise<Player[]> {
  return apiGet<Player[]>('/api/players')
}

export function createPlayer(name: string): Promise<Player> {
  return apiPost<Player>('/api/players', { name })
}

export function deletePlayer(playerId: number): Promise<void> {
  return apiDelete<void>(`/api/players/${playerId}`)
}

