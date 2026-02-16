import type { Dispatch, SetStateAction } from 'react'
import Tooltip from '../../../../components/Tooltip'
import { LANDMARKS, lmLabel, lmTooltipContent, type LandmarkId } from '../../../../data/landmarks'
import type { RacePickUi } from '../racePickTypes'

type Props = {
  loading: boolean
  landmarksEnabled?: boolean
  landmarkBanned?: string | null
  landmarksRandomCount?: number | null
  landmarksDrawn?: string[]
  localPickedLandmarks: LandmarkId[]
  setLocalPickedLandmarks: Dispatch<SetStateAction<LandmarkId[]>>
  toggleLandmark: (id: LandmarkId) => void
  onSetLandmarksManual?: (picked: LandmarkId[]) => void | Promise<void>
  ui: RacePickUi
}

export default function RacePickLandmarksSection({
  loading,
  landmarksEnabled,
  landmarkBanned,
  landmarksRandomCount,
  landmarksDrawn,
  localPickedLandmarks,
  setLocalPickedLandmarks,
  toggleLandmark,
  onSetLandmarksManual,
  ui,
}: Props) {
  if (!landmarksEnabled) return null

  return (
    <>
      <div style={{ ...ui.card, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 1000, letterSpacing: 0.2 }}>🏷️ Landmarks</div>
            <div style={{ opacity: 0.78, fontSize: 13, marginTop: 4 }}>
              Banned: <b>{landmarkBanned ?? '—'}</b> • Draw: <b>{(landmarksDrawn?.length ?? 0) || landmarksRandomCount || '—'}</b>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {(landmarksDrawn ?? []).length === 0 ? (
              <span style={ui.badge}>Not drawn yet</span>
            ) : (
              landmarksDrawn!.map((id) => (
                <Tooltip key={id} placement="bottom" content={lmTooltipContent(id as LandmarkId)}>
                  <span style={{ ...ui.badge, cursor: 'help' }}>🏷️ {lmLabel(id)}</span>
                </Tooltip>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{ ...ui.card, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 1000, letterSpacing: 0.2 }}>🏷️ Choose 1-2 landmarks (manual)</div>
            <div style={{ opacity: 0.78, fontSize: 13, marginTop: 4 }}>
              Picked: <b>{localPickedLandmarks.length}/2</b>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              disabled={loading || (landmarksDrawn?.length ?? 0) > 0}
              onClick={() => setLocalPickedLandmarks([])}
              style={ui.btn('ghost', loading || (landmarksDrawn?.length ?? 0) > 0)}
              title={(landmarksDrawn?.length ?? 0) > 0 ? 'Already locked' : 'Clear selection'}
            >
              🧹 Clear
            </button>

            <button
              disabled={loading || !onSetLandmarksManual || localPickedLandmarks.length === 0 || (landmarksDrawn?.length ?? 0) > 0}
              onClick={async () => {
                if (!onSetLandmarksManual || localPickedLandmarks.length === 0) return
                await onSetLandmarksManual(localPickedLandmarks)
              }}
              style={ui.btn('primary', loading || !onSetLandmarksManual || localPickedLandmarks.length < 1 || localPickedLandmarks.length > 2 || (landmarksDrawn?.length ?? 0) > 0)}
            >
              ✅ Confirm landmarks
            </button>
          </div>
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {LANDMARKS.map((lm) => {
            const picked = localPickedLandmarks.includes(lm.id)
            const alreadyLocked = (landmarksDrawn?.length ?? 0) > 0
            const disabled = loading || alreadyLocked || (!picked && localPickedLandmarks.length >= 2)

            return (
              <Tooltip key={lm.id} placement="top" content={lmTooltipContent(lm.id)} disabled={loading || alreadyLocked}>
                <button disabled={disabled} onClick={() => toggleLandmark(lm.id)} style={ui.btn(picked ? 'primary' : 'ghost', disabled)}>
                  {picked ? '✅' : '🏷️'} {lm.label}
                </button>
              </Tooltip>
            )
          })}
        </div>

        <div style={{ opacity: 0.78, fontSize: 13, marginTop: 10 }}>After confirmation, landmarks are locked for this match.</div>
      </div>
    </>
  )
}


