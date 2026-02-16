import type { GameModule } from './types'
import { rootGameModule } from '../../games/root/module'
import { arenaGameModule } from '../../games/arena/module'
import { stationfallGameModule } from '../../games/stationfall/module'

export const GAME_MODULES: GameModule[] = [rootGameModule, arenaGameModule, stationfallGameModule]

const byKey = new Map(GAME_MODULES.map((module) => [module.key.toUpperCase(), module]))
const bySlug = new Map(GAME_MODULES.map((module) => [module.slug.toLowerCase(), module]))

export const DEFAULT_GAME_KEY = 'ROOT'

export function resolveGameModule(input: string | null | undefined): GameModule | null {
  if (!input) return null
  const raw = input.trim()
  if (!raw) return null

  return byKey.get(raw.toUpperCase()) ?? bySlug.get(raw.toLowerCase()) ?? null
}

export function getGameModule(gameKey: string): GameModule {
  const module = resolveGameModule(gameKey) ?? resolveGameModule(DEFAULT_GAME_KEY)
  if (!module) {
    throw new Error('No game modules registered')
  }
  return module
}

export function toRouteGameKey(gameKey: string): string {
  return getGameModule(gameKey).slug
}

export function toApiGameKey(gameKey: string): string {
  return getGameModule(gameKey).key
}
