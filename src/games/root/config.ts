import type { CreateMatchFormState, LeaguePageConfig, StandingsColumn, ThemeTokens } from '../../core/games/types'
import rootBg from '../../assets/root.png'

export const rootThemeTokens: ThemeTokens = {
  backgroundImage: `url(${rootBg})`,
  accent: '#c1263d',
}

export function getRootLeaguePageConfig(): LeaguePageConfig {
  return {
    supportsRaceDraft: true,
    supportsLandmarks: true,
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
