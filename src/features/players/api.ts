import { gameApiDelete, gameApiGet, gameApiPost } from '../../api'
import type { Player } from '../../types'

export function listPlayers(gameKey: string): Promise<Player[]> {
  return gameApiGet<Player[]>(gameKey, '/players')
}

export function createPlayer(gameKey: string, name: string): Promise<Player> {
  return gameApiPost<Player>(gameKey, '/players', { name })
}

export function deletePlayer(gameKey: string, playerId: number): Promise<void> {
  return gameApiDelete<void>(gameKey, `/players/${playerId}`)
}
