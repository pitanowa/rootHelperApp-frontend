import type { Dispatch, SetStateAction, CSSProperties } from 'react'
import type { MatchPlayerState } from '../types'

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
  scoreInput: Record<number, string>
  setScoreInput: Dispatch<SetStateAction<Record<number, string>>>
  raceKey: (race?: string | null) => string
  raceLabel: (race?: string | null) => string
  mixRgba: (baseHex: string, alpha: number) => string
  RACE_COLOR: Record<string, string>
  RACE_ICON: Record<string, string>
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
  scoreInput,
  setScoreInput,
  raceKey,
  raceLabel,
  mixRgba,
  RACE_COLOR,
  RACE_ICON,
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
  const activePlayer = playersInMatchOrder.find((p) => p.playerId === runningPlayerId) ?? null

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

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={ui.panel}>
          <div style={ui.panelHead}>
            <div>Scoreboard</div>
            {activePlayer && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={ui.badgeStrong('#dc2626')}>
                  Active: <b>{activePlayer.playerName}</b>
                </span>
              </div>
            )}
          </div>

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
        </div>

        <button
          disabled={loading}
          onClick={onOpenCards}
          style={{
            ...ui.btn('cards', loading),
            width: '100%',
            height: 56,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 20,
            fontWeight: 1000,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            transition: 'transform 140ms ease, box-shadow 140ms ease, filter 140ms ease',
          }}
          onMouseEnter={(e) => {
            if (loading) return
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 26px 70px rgba(0,0,0,0.65), 0 0 90px rgba(59,130,246,0.28)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.55), 0 0 60px rgba(59,130,246,0.18)'
          }}
        >
          CARD LIST
        </button>
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

