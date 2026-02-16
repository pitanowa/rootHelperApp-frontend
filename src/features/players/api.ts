import { gameApiDelete, gameApiGet, gameApiPost } from '../../api'
import type { Player } from '../../types'

const SHARED_PLAYERS_GAME_KEY = 'ROOT'

export function listPlayers(_gameKey: string): Promise<Player[]> {
  return gameApiGet<Player[]>(SHARED_PLAYERS_GAME_KEY, '/players')
}

export function createPlayer(_gameKey: string, name: string): Promise<Player> {
  return gameApiPost<Player>(SHARED_PLAYERS_GAME_KEY, '/players', { name })
}

export function deletePlayer(_gameKey: string, playerId: number): Promise<void> {
  return gameApiDelete<void>(SHARED_PLAYERS_GAME_KEY, `/players/${playerId}`)
}
