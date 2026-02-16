import { useState } from 'react'
import type { Dispatch, SetStateAction, CSSProperties } from 'react'
import Tooltip from '../../../../components/Tooltip'
import { LANDMARKS, type LandmarkId, lmLabel, lmTooltipContent } from '../../../../data/landmarks'
import type { MatchPlayerState } from '../../../../features/matches/types'
import { raceKey, raceLabel, RACE_COLOR, RACE_ICON } from '../../../../constants/races'
import MatchPlayerCard from './MatchPlayerCard'

type MatchPlayersSectionUi = {
  layout: CSSProperties
  centerWrap: CSSProperties
  cardsGrid: CSSProperties
  playerCard: (hex: string, timeUp: boolean, isRunning: boolean) => CSSProperties
  cardTopRow: CSSProperties
  smallName: CSSProperties
  badgeStrong: (hex: string) => CSSProperties
  badge: CSSProperties
  heroIcon: (hex: string) => CSSProperties
  timerRow: CSSProperties
  smallTimer: (timeUp: boolean) => CSSProperties
  timeControls: CSSProperties
  timeBtn: (variant: 'add' | 'sub', disabled: boolean) => CSSProperties
  miniActionsRow: CSSProperties
  btn: (variant: 'primary' | 'ghost' | 'danger' | 'race' | 'cards', disabled: boolean, hex?: string) => CSSProperties
  panel: CSSProperties
  panelHead: CSSProperties
  tableHeadRow: CSSProperties
  tableCell: CSSProperties
  tableWrap: CSSProperties
  scoreboardRow: (hex: string, isActive: boolean) => CSSProperties
  playerName: CSSProperties
  raceLine: CSSProperties
  miniIcon: (hex: string) => CSSProperties
  score: CSSProperties
}

type Props = {
  playersInMatchOrder: MatchPlayerState[]
  localTime: Record<number, number>
  runningPlayerId: number | null
  loading: boolean
  matchStarted: boolean
  landmarksEnabled?: boolean
  landmarkBanned?: string | null
  landmarksDrawn?: string[]
  scoreInput: Record<number, string>
  setScoreInput: Dispatch<SetStateAction<Record<number, string>>>
  mixRgba: (baseHex: string, alpha: number) => string
  ui: MatchPlayersSectionUi
  onRemoveSecond: (playerId: number) => void | Promise<void>
  onAddSecond: (playerId: number) => void | Promise<void>
  onRemoveMinute: (playerId: number) => void | Promise<void>
  onAddMinute: (playerId: number) => void | Promise<void>
  onSetScoreAbsolute: (playerId: number, targetScore: number) => void | Promise<void>
  onRefreshTimer: (playerId: number) => void | Promise<void>
  onSetRunning: (playerId: number) => void | Promise<void>
  onStopRunning: (playerId: number) => void | Promise<void>
  onOpenCards: () => void
}

export default function MatchPlayersSection({
  playersInMatchOrder,
  localTime,
  runningPlayerId,
  loading,
  matchStarted,
  landmarksEnabled,
  landmarkBanned,
  landmarksDrawn,
  scoreInput,
  setScoreInput,
  mixRgba,
  ui,
  onRemoveSecond,
  onAddSecond,
  onRemoveMinute,
  onAddMinute,
  onSetScoreAbsolute,
  onRefreshTimer,
  onSetRunning,
  onStopRunning,
  onOpenCards,
}: Props) {
  const [scoreboardOpen, setScoreboardOpen] = useState(false)
  const [landmarksOpen, setLandmarksOpen] = useState(false)
  const [cardsOpen, setCardsOpen] = useState(false)

  const activePlayer = playersInMatchOrder.find((p) => p.playerId === runningPlayerId) ?? null
  const drawn = landmarksDrawn ?? []
  const drawnSet = new Set(drawn)

  return (
    <div style={ui.layout}>
      <div style={ui.centerWrap}>
        <div style={{ width: 'min(980px, 100%)' }}>
          <div style={ui.cardsGrid}>
            {playersInMatchOrder.map((player) => (
              <MatchPlayerCard
                key={player.playerId}
                player={player}
                localTime={localTime[player.playerId] ?? player.timeLeftSeconds}
                isRunning={runningPlayerId === player.playerId}
                hasActiveTimer={runningPlayerId != null}
                loading={loading}
                matchStarted={matchStarted}
                scoreInput={scoreInput}
                setScoreInput={setScoreInput}
                ui={ui}
                onRemoveSecond={onRemoveSecond}
                onAddSecond={onAddSecond}
                onRemoveMinute={onRemoveMinute}
                onAddMinute={onAddMinute}
                onSetScoreAbsolute={onSetScoreAbsolute}
                onRefreshTimer={onRefreshTimer}
                onSetRunning={onSetRunning}
                onStopRunning={onStopRunning}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12, alignContent: 'start', height: 'fit-content' }}>
        <div style={ui.panel}>
          <button
            type="button"
            onClick={() => setCardsOpen((prev) => !prev)}
            style={{
              ...ui.panelHead,
              width: '100%',
              cursor: 'pointer',
              background: 'transparent',
              color: 'inherit',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <span>Cards</span>
            <span style={ui.badge}>{cardsOpen ? 'Hide' : 'Show'}</span>
          </button>

          {cardsOpen && (
            <div style={{ padding: 12 }}>
              <button disabled={loading} onClick={onOpenCards} style={{ ...ui.btn('cards', loading), width: '100%', justifyContent: 'center' }}>
                Open Card List
              </button>
            </div>
          )}
        </div>

        <div style={ui.panel}>
          <button
            type="button"
            onClick={() => setScoreboardOpen((prev) => !prev)}
            style={{
              ...ui.panelHead,
              width: '100%',
              cursor: 'pointer',
              background: 'transparent',
              color: 'inherit',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <span>Scoreboard</span>
            <span style={ui.badge}>{scoreboardOpen ? 'Hide' : 'Show'}</span>
          </button>

          {scoreboardOpen && (
            <>
              {activePlayer && (
                <div style={{ padding: '0 12px 10px' }}>
                  <span style={ui.badgeStrong('#dc2626')}>
                    Active: <b>{activePlayer.playerName}</b>
                  </span>
                </div>
              )}

              <div style={ui.tableHeadRow}>
                <div style={{ ...ui.tableCell, fontWeight: 1000, opacity: 0.78 }}>Player / Race</div>
                <div style={{ ...ui.tableCell, fontWeight: 1000, opacity: 0.78, textAlign: 'right' }}>Score</div>
              </div>

              <div style={ui.tableWrap}>
                {playersInMatchOrder.map((p) => {
                  const rk = raceKey(p.race)
                  const icon = RACE_ICON[rk] ?? ''
                  const hex = RACE_COLOR[rk] ?? '#dc2626'
                  const isActiveRow = runningPlayerId === p.playerId

                  return (
                    <div
                      key={p.playerId}
                      style={ui.scoreboardRow(hex, isActiveRow)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = mixRgba(hex, isActiveRow ? 0.2 : 0.14)
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isActiveRow ? mixRgba(hex, 0.16) : mixRgba(hex, 0.08)
                      }}
                    >
                      <div style={{ ...ui.tableCell, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={ui.playerName}>{p.playerName}</div>

                          <div style={ui.raceLine}>
                            {icon ? <img src={icon} alt={raceLabel(p.race)} style={ui.miniIcon(hex)} /> : null}
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{raceLabel(p.race)}</span>
                          </div>
                        </div>
                      </div>

                      <div style={ui.score}>{p.score}</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {landmarksEnabled && (
          <div style={{ ...ui.panel, maxHeight: 'none', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setLandmarksOpen((prev) => !prev)}
              style={{
                ...ui.panelHead,
                width: '100%',
                cursor: 'pointer',
                background: 'transparent',
                color: 'inherit',
                border: 'none',
                textAlign: 'left',
              }}
            >
              <span>Landmarks</span>
              <span style={ui.badge}>{landmarksOpen ? 'Hide' : 'Show'}</span>
            </button>

            {landmarksOpen && (
              <div style={{ padding: 12, display: 'grid', gap: 10, maxHeight: 420, overflowY: 'auto' }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, fontWeight: 900 }}>AVAILABLE IN MATCH</div>
                  {drawn.length === 0 ? (
                    <div style={{ ...ui.badge, display: 'inline-flex' }}>Landmarks not drawn yet</div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {drawn.map((id) => (
                        <Tooltip key={id} placement="top" content={lmTooltipContent(id as LandmarkId)}>
                          <span style={{ ...ui.badge, cursor: 'help', border: '1px solid rgba(255,95,116,0.42)' }}>
                            {lmLabel(id as LandmarkId)}
                          </span>
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8, fontWeight: 900 }}>ALL LANDMARKS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                    {LANDMARKS.map((lm) => {
                      const isBanned = landmarkBanned === lm.id
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
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 900,
                                fontSize: 13,
                                lineHeight: 1.2,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {lmLabel(lm.id as LandmarkId)}
                            </div>
                          </div>
                        </Tooltip>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

