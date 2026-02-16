import type { CreateMatchFormState, GameCapabilities, LeaguePageConfig, StandingsColumn, ThemeTokens } from '../../core/games/types'
import rootBg from '../../assets/root.png'
import rootBoardBg from '../../assets/root_board.jpg'

export const rootThemeTokens: ThemeTokens = {
  backgroundImage:
    `radial-gradient(1200px 700px at 15% -10%, rgba(193, 38, 61, 0.18), transparent 55%), ` +
    `linear-gradient(180deg, rgba(23, 8, 13, 0.82), rgba(11, 4, 7, 0.9)), ` +
    `url(${rootBg}), url(${rootBoardBg})`,
  accent: '#c1263d',
  cssVars: {
    '--app-text': '#fbeff1',
    '--app-text-rgb': '251, 239, 241',
    '--app-muted-rgb': '233, 200, 205',
    '--app-shell-bg':
      'radial-gradient(900px 420px at 15% 0%, rgba(193, 38, 61, 0.28), transparent 55%), radial-gradient(760px 300px at 90% 8%, rgba(115, 22, 35, 0.36), transparent 60%), linear-gradient(180deg, rgba(23, 8, 13, 0.95), rgba(11, 4, 7, 0.98))',
    '--app-shell-border': '1px solid rgba(196, 63, 75, 0.34)',
    '--app-shell-shadow': '0 28px 80px rgba(0, 0, 0, 0.56), 0 0 56px rgba(137, 19, 40, 0.22)',
    '--app-panel-bg': 'linear-gradient(180deg, rgba(25, 8, 13, 0.95), rgba(11, 4, 7, 0.98))',
    '--app-panel-border': '1px solid rgba(196, 63, 75, 0.32)',
    '--app-panel-shadow': '0 18px 55px rgba(0, 0, 0, 0.45), 0 0 40px rgba(137, 19, 40, 0.16)',
    '--app-input-bg': 'linear-gradient(180deg, rgba(26, 9, 14, 0.95), rgba(14, 5, 9, 0.98))',
    '--app-input-border': '1px solid rgba(213, 128, 139, 0.3)',
    '--app-soft-bg': 'rgba(255, 255, 255, 0.04)',
    '--app-soft-border': '1px solid rgba(213, 128, 139, 0.28)',
    '--app-dashed-border': '1px dashed rgba(213, 128, 139, 0.32)',
    '--app-accent-rgb': '193, 38, 61',
    '--app-accent-gradient': 'linear-gradient(135deg, rgba(193, 38, 61, 0.9), rgba(117, 15, 31, 0.92))',
    '--app-accent-soft-gradient': 'linear-gradient(135deg, rgba(193, 38, 61, 0.44), rgba(117, 15, 31, 0.34))',
    '--app-accent-border': '1px solid rgba(255, 95, 116, 0.45)',
    '--app-accent-glow': '0 16px 34px rgba(137, 19, 40, 0.35)',
  },
}

export function getRootLeaguePageConfig(capabilities: GameCapabilities): LeaguePageConfig {
  return {
    supportsRaceDraft: capabilities.raceDraftSupported,
    supportsLandmarks: capabilities.landmarksSupported,
  }
}

export function getRootStandingsColumns(): StandingsColumn[] {
  return [
    { key: 'rootsTotal', label: 'Roots' },
    { key: 'pointsTotal', label: 'Points' },
    { key: 'gamesPlayed', label: 'Games' },
    { key: 'wins', label: 'Wins' },
  ]
}

export function buildRootCreateMatchPayload(formState: CreateMatchFormState): Record<string, unknown> {
  return {
    timerSeconds: formState.timerSeconds,
    playerIds: formState.playerIds,
    ranked: formState.ranked,
    raceDraftEnabled: formState.raceDraftEnabled,
    excludedRaces: formState.raceDraftEnabled ? formState.excludedRaces : [],
    landmarksEnabled: formState.landmarksEnabled,
  }
}
