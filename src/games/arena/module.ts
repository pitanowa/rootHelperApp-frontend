import type { GameModule } from '../../core/games/types'
import ArenaLeaguePage from './pages/ArenaLeaguePage'
import ArenaMatchPage from './pages/ArenaMatchPage'

export const arenaGameModule: GameModule = {
  key: 'ARENA',
  slug: 'arena',
  name: 'Arena (Placeholder)',
  description: 'Minimal second game module for architecture proof.',
  themeTokens: {
    backgroundImage: 'linear-gradient(180deg, #0f172a, #1f2937)',
    accent: '#38bdf8',
  },
  getLeaguePageConfig: () => ({
    supportsRaceDraft: false,
    supportsLandmarks: false,
  }),
  getStandingsColumns: () => [
    { key: 'pointsTotal', label: 'Points' },
    { key: 'gamesPlayed', label: 'Games' },
    { key: 'wins', label: 'Wins' },
  ],
  buildCreateMatchPayload: (formState) => ({
    timerSeconds: formState.timerSeconds,
    playerIds: formState.playerIds,
    ranked: formState.ranked,
  }),
  LeaguePage: ArenaLeaguePage,
  MatchPage: ArenaMatchPage,
}
