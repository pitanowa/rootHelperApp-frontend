import { useState } from 'react'
import type { Dispatch, SetStateAction, CSSProperties } from 'react'
import Tooltip from '../../../components/Tooltip'
import { LANDMARKS, type LandmarkId, lmLabel, lmTooltipContent } from '../../../data/landmarks'
import type { MatchPlayerState } from '../types'
import { raceKey, raceLabel, RACE_COLOR, RACE_ICON } from '../../../constants/races'

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
  landmarksRandomCount?: number | null
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
  landmarksRandomCount,
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
  const drawCount = (drawn.length || landmarksRandomCount) ?? '—'

  return (
    <div style={ui.layout}>
      <div style={ui.centerWrap}>
        <div style={{ width: 'min(980px, 100%)' }}>
          <div style={ui.cardsGrid}>
            {playersInMatchOrder.map((p) => {
              const rk = raceKey(p.race)
              const hex = RACE_COLOR[rk] ?? '#dc2626'
              const icon = RACE_ICON[rk] ?? ''

              const t = localTime[p.playerId] ?? p.timeLeftSeconds
              const timeUp = t <= 0
              const isRunning = runningPlayerId === p.playerId

              return (
                <div key={p.playerId} style={ui.playerCard(hex, timeUp, isRunning)}>
                  <div style={ui.cardTopRow}>
                    <div style={{ minWidth: 0 }}>
                      <div style={ui.smallName} title={p.playerName}>
                        {p.playerName}
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 6 }}>
                        <span style={ui.badgeStrong(hex)}>{raceLabel(p.race)}</span>

                        {timeUp ? (
                          <span style={ui.badgeStrong('#ef4444')}>TIME UP</span>
                        ) : isRunning ? (
                          <span style={ui.badgeStrong('#22c55e')}>RUNNING</span>
                        ) : (
                          <span style={ui.badge}>STOPPED</span>
                        )}
                      </div>
                    </div>

                    {icon ? (
                      <img
                        src={icon}
                        alt={raceLabel(p.race)}
                        title={raceLabel(p.race)}
                        style={{ ...ui.heroIcon(hex), width: 56, height: 56, padding: 8, borderRadius: 16 }}
                      />
                    ) : null}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={ui.timerRow}>
                        <div>
                          <div style={ui.smallTimer(timeUp)}>{fmt(t)}</div>
                          <div style={{ fontSize: 12, opacity: 0.72, color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>time left</div>
                        </div>

                        <div style={ui.timeControls}>
                          <button
                            onClick={() => onRemoveSecond(p.playerId)}
                            disabled={loading || !matchStarted}
                            style={ui.timeBtn('sub', loading || !matchStarted)}
                            onMouseEnter={(e) => {
                              if (loading || !matchStarted) return
                              e.currentTarget.style.transform = 'translateY(-1px)'
                              e.currentTarget.style.filter = 'brightness(1.08)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.filter = 'none'
                            }}
                            title="-1 second"
                          >
                            -1s
                          </button>

                          <button
                            onClick={() => onAddSecond(p.playerId)}
                            disabled={loading || !matchStarted}
                            style={ui.timeBtn('add', loading || !matchStarted)}
                            onMouseEnter={(e) => {
                              if (loading || !matchStarted) return
                              e.currentTarget.style.transform = 'translateY(-1px)'
                              e.currentTarget.style.filter = 'brightness(1.08)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.filter = 'none'
                            }}
                            title="+1 second"
                          >
                            +1s
                          </button>

                          <button
                            onClick={() => onRemoveMinute(p.playerId)}
                            disabled={loading || !matchStarted}
                            style={ui.timeBtn('sub', loading || !matchStarted)}
                            onMouseEnter={(e) => {
                              if (loading || !matchStarted) return
                              e.currentTarget.style.transform = 'translateY(-1px)'
                              e.currentTarget.style.filter = 'brightness(1.08)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.filter = 'none'
                            }}
                            title="-1 minute"
                          >
                            -1m
                          </button>

                          <button
                            onClick={() => onAddMinute(p.playerId)}
                            disabled={loading || !matchStarted}
                            style={ui.timeBtn('add', loading || !matchStarted)}
                            onMouseEnter={(e) => {
                              if (loading || !matchStarted) return
                              e.currentTarget.style.transform = 'translateY(-1px)'
                              e.currentTarget.style.filter = 'brightness(1.08)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.filter = 'none'
                            }}
                            title="+1 minute"
                          >
                            +1m
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, opacity: 0.72, color: 'rgba(255,255,255,0.72)' }}>score</div>
                      <div style={{ fontSize: 26, fontWeight: 1000, fontVariantNumeric: 'tabular-nums' }}>{p.score}</div>
                    </div>
                  </div>

                  <div style={ui.miniActionsRow}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        value={scoreInput[p.playerId] ?? String(p.score ?? 0)}
                        disabled={loading || !matchStarted}
                        onChange={(e) => setScoreInput((prev) => ({ ...prev, [p.playerId]: e.target.value }))}
                        onKeyDown={async (e) => {
                          if (e.key !== 'Enter') return
                          const raw = (scoreInput[p.playerId] ?? '').trim()
                          if (raw === '') return
                          const n = Number(raw)
                          if (!Number.isFinite(n)) return
                          await onSetScoreAbsolute(p.playerId, Math.trunc(n))
                        }}
                        style={{
                          width: 80,
                          padding: '10px 12px',
                          borderRadius: 14,
                          border: '1px solid rgba(255,255,255,0.14)',
                          background: 'rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.92)',
                          outline: 'none',
                          fontWeight: 900,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                        title="Wpisz docelowy wynik i nacisnij Enter"
                      />

                      <button
                        onClick={async () => {
                          const raw = (scoreInput[p.playerId] ?? '').trim()
                          if (raw === '') return
                          const n = Number(raw)
                          if (!Number.isFinite(n)) return
                          await onSetScoreAbsolute(p.playerId, Math.trunc(n))
                        }}
                        disabled={loading || !matchStarted}
                        style={ui.btn('ghost', loading || !matchStarted)}
                      >
                        Set
                      </button>

                      <button
                        onClick={() => onRefreshTimer(p.playerId)}
                        disabled={loading || !matchStarted}
                        style={ui.btn('ghost', loading || !matchStarted)}
                      >
                        Timer
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {!isRunning ? (
                        <button
                          onClick={() => onSetRunning(p.playerId)}
                          disabled={loading || !matchStarted}
                          style={{
                            ...ui.btn('race', loading || !matchStarted, hex),
                            color: 'rgba(255,255,255,0.92)',
                          }}
                        >
                          Start
                        </button>
                      ) : (
                        <button onClick={() => onStopRunning(p.playerId)} disabled={loading || !matchStarted} style={ui.btn('danger', loading || !matchStarted)}>
                          Stop
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
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
          <div style={ui.panel}>
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
              <div style={{ padding: 12, display: 'grid', gap: 10 }}>
                <span style={ui.badge}>
                  banned: <b>{landmarkBanned ?? '—'}</b> • draw: <b>{drawCount}</b>
                </span>

                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, fontWeight: 900 }}>AVAILABLE IN MATCH</div>
                  {drawn.length === 0 ? (
                    <div style={{ ...ui.badge, display: 'inline-flex' }}>Landmarks not drawn yet</div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {drawn.map((id) => (
                        <Tooltip key={id} placement="top" content={lmTooltipContent(id as LandmarkId)}>
                          <span style={{ ...ui.badge, cursor: 'help', border: '1px solid rgba(255,95,116,0.42)' }}>
                            Landmark: {lmLabel(id as LandmarkId)}
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function fmt(secs: number) {
  const s = Math.max(0, Math.floor(secs))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

