import { Link } from 'react-router-dom'
import type { DraftState, MatchState } from '../types'
import type { MatchPageUi } from '../matchPageUi'

type Props = {
  state: MatchState
  draft: DraftState | null
  loading: boolean
  matchStarted: boolean
  runningPlayerId: number | null
  onStartMatch: () => void | Promise<void>
  onFinishMatch: () => void | Promise<void>
  showSetupHintsButton: boolean
  onOpenSetupHints: () => void
  ui: MatchPageUi
}

export default function MatchActionsBar({
  state,
  draft,
  loading,
  matchStarted,
  runningPlayerId,
  onStartMatch,
  onFinishMatch,
  showSetupHintsButton,
  onOpenSetupHints,
  ui,
}: Props) {
  return (
    <div style={ui.actionsTop}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/groups" style={{ ...ui.btn('ghost', loading), textDecoration: 'none' }}>
          ← Back
        </Link>

        {!matchStarted ? (
          <button
            onClick={onStartMatch}
            disabled={loading || draft?.status === 'DRAFTING'}
            style={ui.btn('primary', loading || draft?.status === 'DRAFTING')}
            title={draft?.status === 'DRAFTING' ? 'Finish draft first' : undefined}
            onMouseEnter={(e) => {
              if (loading || draft?.status === 'DRAFTING') return
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Start match
          </button>
        ) : (
          <button
            onClick={onFinishMatch}
            disabled={loading || state.status === 'FINISHED'}
            style={ui.btn('danger', loading || state.status === 'FINISHED')}
            onMouseEnter={(e) => {
              if (loading || state.status === 'FINISHED') return
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Finish match
          </button>
        )}

        {showSetupHintsButton && (
          <button
            style={ui.btn('ghost', loading)}
            disabled={loading}
            onClick={onOpenSetupHints}
          >
            Setup hints
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {runningPlayerId != null && (
          <span style={ui.badgeStrong('#22c55e')}>
            Running: <b>{state.players.find((p) => p.playerId === runningPlayerId)?.playerName ?? runningPlayerId}</b>
          </span>
        )}
      </div>
    </div>
  )
}
