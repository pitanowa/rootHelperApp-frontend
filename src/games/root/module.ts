import type { GameModule } from '../../core/games/types'
import { buildRootCreateMatchPayload, getRootLeaguePageConfig, getRootStandingsColumns, rootThemeTokens } from './config'
import RootLeaguePage from './pages/RootLeaguePage'
import RootMatchPage from './pages/RootMatchPage'

export const rootGameModule: GameModule = {
  key: 'ROOT',
  slug: 'root',
  name: 'Root',
  description: 'League and match management for Root.',
  themeTokens: rootThemeTokens,
  defaultCapabilities: {
    raceDraftSupported: true,
    landmarksSupported: true,
  },
  getLeaguePageConfig: getRootLeaguePageConfig,
  getStandingsColumns: getRootStandingsColumns,
  buildCreateMatchPayload: buildRootCreateMatchPayload,
  LeaguePage: RootLeaguePage,
  MatchPage: RootMatchPage,
}

