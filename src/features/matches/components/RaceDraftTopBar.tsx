import type { DraftState } from '../types'
import { raceDraftUi as ui } from '../raceDraftUi'
import RaceDraftBadge from './RaceDraftBadge'

type Props = {
  matchId: number
  draft: DraftState
  loading: boolean
  remainingPicks: number
  onRefresh?: () => void
  onResetPick?: () => Promise<unknown>
}

export default function RaceDraftTopBar({
  matchId,
  draft,
  loading,
  remainingPicks,
  onRefresh,
  onResetPick,
}: Props) {
  return (
    <div style={ui.topRow}>
      <div>
        <h1 style={ui.title}>Race draft</h1>
        <div style={ui.metaLine}>
          🩸 match #{matchId} • {draft.status} • phase {draft.phase}
          {draft.phase === 'PICK' ? ` • remaining picks ${remainingPicks}` : ''}
        </div>
      </div>

      <div style={ui.rightBadges}>
        {draft.status === 'DRAFTING' ? <RaceDraftBadge variant="hot" text="DRAFTING" /> : <RaceDraftBadge variant="ghost" text="FINISHED" />}
        {draft.phase === 'BAN' ? <RaceDraftBadge variant="info" text="BAN" /> : <RaceDraftBadge variant="info" text="PICK" />}

        {onRefresh && (
          <button
            onClick={async () => {
              if (draft.phase === 'PICK' && draft.status === 'DRAFTING' && onResetPick) {
                await onResetPick()
              }
              onRefresh()
            }}
            disabled={loading}
            style={ui.btn('ghost', loading)}
            onMouseEnter={(e) => {
              if (loading) return
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            🔄 Refresh
          </button>
        )}
      </div>
    </div>
  )
}
