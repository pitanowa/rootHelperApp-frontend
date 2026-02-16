import { apiGet } from '../../api'
import type { SupportedGame } from './types'

export function listSupportedGames(): Promise<SupportedGame[]> {
  return apiGet<SupportedGame[]>('/api/games')
}
