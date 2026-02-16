import type { GameModule } from '../../core/games/types'
import ArenaLeaguePage from '../arena/pages/ArenaLeaguePage'
import ArenaMatchPage from '../arena/pages/ArenaMatchPage'
import stationfallBg from '../../assets/backgrounds/stationfall_background.png'

export const stationfallGameModule: GameModule = {
  key: 'STATIONFALL',
  slug: 'stationfall',
  name: 'Stationfall',
  description: 'League and match operations for Stationfall.',
  themeTokens: {
    backgroundImage:
      `radial-gradient(1200px 700px at 20% -10%, rgba(56, 189, 248, 0.12), transparent 55%), radial-gradient(900px 600px at 80% -20%, rgba(37, 99, 235, 0.18), transparent 60%), linear-gradient(180deg, rgba(2, 6, 23, 0.86), rgba(3, 7, 18, 0.9) 55%, rgba(2, 6, 23, 0.86)), url(${stationfallBg})`,
    accent: '#22d3ee',
    cssVars: {
      '--app-text': '#e6efff',
      '--app-text-rgb': '230, 239, 255',
      '--app-muted-rgb': '168, 186, 219',
      '--app-shell-bg':
        'radial-gradient(900px 420px at 15% 0%, rgba(30, 64, 175, 0.34), transparent 55%), radial-gradient(760px 300px at 90% 8%, rgba(14, 116, 144, 0.34), transparent 60%), linear-gradient(180deg, rgba(6, 13, 31, 0.96), rgba(2, 8, 24, 0.98))',
      '--app-shell-border': '1px solid rgba(56, 189, 248, 0.35)',
      '--app-shell-shadow': '0 28px 80px rgba(0, 0, 0, 0.62), 0 0 56px rgba(14, 116, 144, 0.28)',
      '--app-panel-bg': 'linear-gradient(180deg, rgba(6, 16, 38, 0.95), rgba(2, 10, 28, 0.98))',
      '--app-panel-border': '1px solid rgba(56, 189, 248, 0.3)',
      '--app-panel-shadow': '0 18px 55px rgba(0, 0, 0, 0.5), 0 0 40px rgba(14, 116, 144, 0.24)',
      '--app-input-bg': 'linear-gradient(180deg, rgba(8, 22, 48, 0.95), rgba(5, 14, 34, 0.98))',
      '--app-input-border': '1px solid rgba(56, 189, 248, 0.3)',
      '--app-soft-bg': 'rgba(148, 163, 184, 0.08)',
      '--app-soft-border': '1px solid rgba(56, 189, 248, 0.24)',
      '--app-dashed-border': '1px dashed rgba(56, 189, 248, 0.32)',
      '--app-accent-rgb': '34, 211, 238',
      '--app-accent-gradient': 'linear-gradient(135deg, rgba(14, 116, 144, 0.92), rgba(37, 99, 235, 0.86))',
      '--app-accent-soft-gradient': 'linear-gradient(135deg, rgba(14, 116, 144, 0.56), rgba(37, 99, 235, 0.42))',
      '--app-accent-border': '1px solid rgba(34, 211, 238, 0.45)',
      '--app-accent-glow': '0 16px 34px rgba(14, 116, 144, 0.35)',
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
