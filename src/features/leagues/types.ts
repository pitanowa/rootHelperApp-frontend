export type StandingRow = {
  playerId: number
  playerName: string
  rootsTotal: number
  pointsTotal: number
  gamesPlayed: number
  wins: number
}

export type CreatedMatch = {
  id: number
  leagueId: number
  groupId: number
  status: string
  timerSecondsInitial: number
}

export type MatchListItem = {
  id: number
  status: string
  timerSecondsInitial: number
  ranked: boolean
  name?: string | null
}

export type MatchSummary = {
  matchId: number
  leagueId: number
  matchName: string | null
  ranked: boolean
  finished: boolean
  description: string | null
  players: {
    playerId: number
    playerName: string
    raceId: string | null
    raceLabel?: string | null
    points: number
    roots: number
  }[]
  landmarks: { id: string; label: string }[]
  rankingAfter: {
    position: number
    playerId: number
    playerName: string
    totalPoints: number
    totalRoots: number
    gamesPlayed: number
    wins: number
  }[]
}
