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
    cssVars: {
      '--app-text': '#e6efff',
      '--app-text-rgb': '230, 239, 255',
      '--app-muted-rgb': '168, 186, 219',
      '--app-shell-bg':
        'radial-gradient(900px 420px at 15% 0%, rgba(30, 64, 175, 0.26), transparent 55%), radial-gradient(760px 300px at 90% 8%, rgba(14, 116, 144, 0.26), transparent 60%), linear-gradient(180deg, rgba(6, 13, 31, 0.95), rgba(2, 8, 24, 0.98))',
      '--app-shell-border': '1px solid rgba(56, 189, 248, 0.3)',
      '--app-shell-shadow': '0 28px 80px rgba(0, 0, 0, 0.58), 0 0 56px rgba(14, 116, 144, 0.2)',
      '--app-panel-bg': 'linear-gradient(180deg, rgba(6, 16, 38, 0.95), rgba(2, 10, 28, 0.98))',
      '--app-panel-border': '1px solid rgba(56, 189, 248, 0.26)',
      '--app-panel-shadow': '0 18px 55px rgba(0, 0, 0, 0.46), 0 0 40px rgba(14, 116, 144, 0.16)',
      '--app-input-bg': 'linear-gradient(180deg, rgba(8, 22, 48, 0.95), rgba(5, 14, 34, 0.98))',
      '--app-input-border': '1px solid rgba(56, 189, 248, 0.28)',
      '--app-soft-bg': 'rgba(148, 163, 184, 0.08)',
      '--app-soft-border': '1px solid rgba(56, 189, 248, 0.24)',
      '--app-dashed-border': '1px dashed rgba(56, 189, 248, 0.32)',
      '--app-accent-rgb': '56, 189, 248',
      '--app-accent-gradient': 'linear-gradient(135deg, rgba(14, 116, 144, 0.86), rgba(37, 99, 235, 0.82))',
      '--app-accent-soft-gradient': 'linear-gradient(135deg, rgba(14, 116, 144, 0.52), rgba(37, 99, 235, 0.4))',
      '--app-accent-border': '1px solid rgba(56, 189, 248, 0.42)',
      '--app-accent-glow': '0 16px 34px rgba(14, 116, 144, 0.3)',
    },
  },
  defaultCapabilities: {
    raceDraftSupported: false,
    landmarksSupported: false,
  },
  getLeaguePageConfig: (capabilities) => ({
    supportsRaceDraft: capabilities.raceDraftSupported,
    supportsLandmarks: capabilities.landmarksSupported,
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

