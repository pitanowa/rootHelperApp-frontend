import { useParams } from 'react-router-dom'
import { DEFAULT_GAME_KEY } from '../core/games/registry'

export function useCurrentGameKey() {
  const { gameKey } = useParams()
  return (gameKey ?? DEFAULT_GAME_KEY).toUpperCase()
}
