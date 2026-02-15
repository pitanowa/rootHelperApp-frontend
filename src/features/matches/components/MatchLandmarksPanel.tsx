import Tooltip from '../../../components/Tooltip'
import { type LandmarkId, lmLabel, lmTooltipContent } from '../../../data/landmarks'
import type { MatchState } from '../types'
import type { MatchPageUi } from '../matchPageUi'

type Props = {
  state: MatchState
  ui: MatchPageUi
}

export default function MatchLandmarksPanel({ state, ui }: Props) {
  if (!state.landmarksEnabled) return null

  return (
    <div style={{ ...ui.panel, margin: '0 auto 14px' }}>
      <div style={ui.panelHead}>
        <div>Landmarks</div>
        <span style={ui.badge}>
          banned: <b>{state.landmarkBanned ?? '—'}</b> • draw: <b>{(state.landmarksDrawn?.length ?? state.landmarksRandomCount) ?? '—'}</b>
        </span>
      </div>

      <div style={{ padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(state.landmarksDrawn ?? []).map((id) => (
          <Tooltip
            key={id}
            placement="top"
            content={lmTooltipContent(id as LandmarkId)}
          >
            <span style={{ ...ui.badge, cursor: 'help' }}>
              {lmLabel(id as LandmarkId)}
            </span>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
