import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { resolveGameModule } from '../games/registry'
import type { GameCapabilities } from '../games/types'
import { applyGameTheme } from '../theme/applyGameTheme'
import { useAppCtx } from '../../useAppCtx'
import TopNav from '../layout/TopNav'
import GameNotSupported from './GameNotSupported'
import GameRoutes from './GameRoutes'

export default function GameLayout() {
  const { gameKey: routeGameKey } = useParams()
  const { supportedGames, supportedGamesLoading, supportedGamesError } = useAppCtx()

  const module = resolveGameModule(routeGameKey)

  const backendGame = useMemo(() => {
    if (!module) return null
    return supportedGames.find((game) => game.key.toUpperCase() === module.key.toUpperCase()) ?? null
  }, [module, supportedGames])

  const capabilities: GameCapabilities | null = useMemo(() => {
    if (!module) return null
    if (backendGame) {
      return {
        raceDraftSupported: backendGame.raceDraftSupported,
        landmarksSupported: backendGame.landmarksSupported,
      }
    }
    return module.defaultCapabilities
  }, [backendGame, module])

  useEffect(() => {
    if (module) applyGameTheme(module.themeTokens)
  }, [module])

  if (!module) {
    return <GameNotSupported routeGameKey={routeGameKey} details="Unknown game route key." />
  }

  if (!supportedGamesLoading && !supportedGamesError && !backendGame) {
    return <GameNotSupported routeGameKey={routeGameKey} details="Backend does not expose this game in GET /api/games." />
  }

  if (!capabilities) {
    return <GameNotSupported routeGameKey={routeGameKey} />
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <TopNav module={module} />
      <GameRoutes module={module} capabilities={capabilities} />
    </div>
  )
}
