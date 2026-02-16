import type { ComponentType } from 'react'

export type StandingsColumn = {
  key: string
  label: string
}

export type LeaguePageConfig = {
  supportsRaceDraft: boolean
  supportsLandmarks: boolean
}

export type CreateMatchFormState = {
  timerSeconds: number
  playerIds: number[]
  ranked: boolean
  raceDraftEnabled: boolean
  landmarksEnabled: boolean
  excludedRaces: string[]
}

export type ThemeTokens = {
  backgroundImage: string
  accent: string
}

export type GamePageProps = {
  gameKey: string
}

export type GameModule = {
  key: string
  slug: string
  name: string
  description: string
  themeTokens: ThemeTokens
  getLeaguePageConfig: () => LeaguePageConfig
  getStandingsColumns: () => StandingsColumn[]
  buildCreateMatchPayload: (formState: CreateMatchFormState) => Record<string, unknown>
  LeaguePage: ComponentType<GamePageProps>
  MatchPage: ComponentType<GamePageProps>
}
