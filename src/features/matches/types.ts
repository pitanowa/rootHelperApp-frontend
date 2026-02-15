export type ActiveMatch = {
  id: number
  status: string
  leagueId?: number
  groupId?: number
  ranked?: boolean
}

export type MatchPlayerState = {
  playerId: number
  playerName: string
  score: number
  timeLeftSeconds: number
  race?: string | null
}

export type DraftAssignment = {
  playerId: number
  race: string
}

export type DraftState = {
  matchId: number
  status: 'DRAFTING' | 'FINISHED'
  phase: 'BAN' | 'PICK'
  currentPickIndex: number
  currentPlayerId: number | null
  pickOrder: number[]
  pool: string[]
  bannedRaces: string[]
  assignments: DraftAssignment[]
}

export type MatchState = {
  matchId: number
  leagueId: number
  groupId: number
  status: string
  timerSecondsInitial: number
  raceDraftEnabled?: boolean
  players: MatchPlayerState[]
}

