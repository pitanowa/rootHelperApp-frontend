import Tooltip from '../../../../components/Tooltip'
import { LANDMARKS, type LandmarkId, lmLabel, lmTooltipContent } from '../../../../data/landmarks'
import type { MatchState } from '../../../../features/matches/types'
import type { MatchPageUi } from '../matchPageUi'

type Props = {
  state: MatchState
  ui: MatchPageUi
}

export default function MatchLandmarksPanel({ state, ui }: Props) {
  if (!state.landmarksEnabled) return null

  const drawn = state.landmarksDrawn ?? []
  const drawnSet = new Set(drawn)
  const banned = state.landmarkBanned ?? null
  const drawCount = (drawn.length || state.landmarksRandomCount) ?? '—'

  return (
    <div style={{ ...ui.panel, margin: '0 auto 14px' }}>
      <div style={ui.panelHead}>
        <div>Landmarks</div>
        <span style={ui.badge}>
          banned: <b>{banned ?? '—'}</b> • draw: <b>{drawCount}</b>
        </span>
      </div>

      <div style={{ padding: 12, display: 'grid', gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, fontWeight: 900 }}>AVAILABLE IN MATCH</div>
          {drawn.length === 0 ? (
            <div style={{ ...ui.badge, display: 'inline-flex' }}>Landmarks not drawn yet</div>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {drawn.map((id) => (
                <Tooltip key={id} placement="top" content={lmTooltipContent(id as LandmarkId)}>
                  <span style={{ ...ui.badge, cursor: 'help', border: '1px solid rgba(255,95,116,0.42)' }}>
                    ??? {lmLabel(id as LandmarkId)}
                  </span>
                </Tooltip>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8, fontWeight: 900 }}>ALL LANDMARKS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
            {LANDMARKS.map((lm) => {
              const isBanned = banned === lm.id
              const isDrawn = drawnSet.has(lm.id)

              return (
                <Tooltip key={lm.id} placement="top" content={lmTooltipContent(lm.id)}>
                  <div
                    style={{
                      borderRadius: 12,
                      border: isBanned
                        ? '1px solid rgba(248,113,113,0.42)'
                        : isDrawn
                          ? '1px solid rgba(255,95,116,0.42)'
                          : '1px solid rgba(255,255,255,0.14)',
                      background: isBanned
                        ? 'rgba(220,38,38,0.16)'
                        : isDrawn
                          ? 'rgba(159,27,49,0.16)'
                          : 'rgba(255,255,255,0.03)',
                      padding: '8px 10px',
                      display: 'grid',
                      gap: 4,
                    }}
                  >
                    <div style={{ fontWeight: 900, fontSize: 13 }}>{lmLabel(lm.id as LandmarkId)}</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>
                      {isBanned ? 'Banned' : isDrawn ? 'Available' : 'Not drawn'}
                    </div>
                  </div>
                </Tooltip>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

