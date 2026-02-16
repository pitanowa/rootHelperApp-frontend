import type { CSSProperties } from 'react'
import type { LandmarkId } from '../../../data/landmarks'
import type { MatchPlayerState } from '../../../features/matches/types'

export type RacePickUi = {
  page: CSSProperties
  shell: CSSProperties
  topbar: CSSProperties
  badge: CSSProperties
  badgeStrong: (hex: string) => CSSProperties
  btn: (variant: 'primary' | 'ghost' | 'race', disabled: boolean, hex?: string) => CSSProperties
  card?: CSSProperties
  errorBox: CSSProperties
}

export type RacePickViewProps = {
  matchId: number
  players: MatchPlayerState[]
  loading: boolean
  error: string | null
  onPick: (playerId: number, race: string) => Promise<void> | void
  onRefresh: () => void
  ui: RacePickUi
  landmarksEnabled?: boolean
  landmarkBanned?: string | null
  landmarksRandomCount?: number | null
  landmarksDrawn?: string[]
  onSetLandmarksManual?: (picked: LandmarkId[]) => void | Promise<void>
}

