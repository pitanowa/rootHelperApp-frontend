import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import SetupModal from '../../../components/modals/SetupModal'
import type { MatchPlayerState, MatchState } from '../types'
import type { MatchPageUi } from '../matchPageUi'
import type { FlowStage } from '../matchPageStorage'
import { LS_SETUP, lsSetBool, setupTextForRace } from '../matchPageStorage'

type Props = {
  state: MatchState | null
  loading: boolean
  mid: number
  flowStage: FlowStage
  setFlowStage: Dispatch<SetStateAction<FlowStage>>
  playersInMatchOrder: MatchPlayerState[]
  setupIndex: number
  setSetupIndex: Dispatch<SetStateAction<number>>
  onRefresh: () => void | Promise<void>
  ui: MatchPageUi
}

export default function MatchTopBar({
  state,
  loading,
  mid,
  flowStage,
  setFlowStage,
  playersInMatchOrder,
  setupIndex,
  setSetupIndex,
  onRefresh,
  ui,
}: Props) {
  return (
    <div style={ui.topbar}>
      <Link to="/groups" style={ui.backLink}>
        ← back
      </Link>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {state && (
          <span style={ui.badge}>
            match {state.matchId} • league {state.leagueId} • {state.status}
          </span>
        )}

        <button
          onClick={onRefresh}
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
          Refresh
        </button>
      </div>

      <SetupModal
        open={flowStage !== 'NONE'}
        loading={loading}
        playersInMatchOrder={playersInMatchOrder}
        setupIndex={setupIndex}
        setSetupIndex={setSetupIndex}
        mid={mid}
        setFlowStage={setFlowStage}
        setupTextForRace={setupTextForRace}
        lsSetBool={lsSetBool}
        LS_SETUP={LS_SETUP}
        ui={ui}
      />
    </div>
  )
}

