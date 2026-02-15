import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import type { MatchPlayerState } from '../types'
import { raceKey, raceLabel, RACE_COLOR, RACE_ICON } from '../../../constants/races'

type MatchPlayerCardUi = {
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
}

type Props = {
  player: MatchPlayerState
  localTime: number
  isRunning: boolean
  hasActiveTimer: boolean
  loading: boolean
  matchStarted: boolean
  scoreInput: Record<number, string>
  setScoreInput: Dispatch<SetStateAction<Record<number, string>>>
  ui: MatchPlayerCardUi
  onRemoveSecond: (playerId: number) => void | Promise<void>
  onAddSecond: (playerId: number) => void | Promise<void>
  onRemoveMinute: (playerId: number) => void | Promise<void>
  onAddMinute: (playerId: number) => void | Promise<void>
  onSetScoreAbsolute: (playerId: number, targetScore: number) => void | Promise<void>
  onRefreshTimer: (playerId: number) => void | Promise<void>
  onSetRunning: (playerId: number) => void | Promise<void>
  onStopRunning: (playerId: number) => void | Promise<void>
}

type TimeAction = {
  label: '-1s' | '+1s' | '-1m' | '+1m'
  title: string
  onClick: () => void | Promise<void>
  variant: 'add' | 'sub'
}

function hoverLiftButton(el: HTMLButtonElement, enabled: boolean) {
  if (!enabled) return
  el.style.transform = 'translateY(-1px)'
  el.style.filter = 'brightness(1.08)'
}

function hoverResetButton(el: HTMLButtonElement) {
  el.style.transform = 'translateY(0)'
  el.style.filter = 'none'
}

export default function MatchPlayerCard({
  player,
  localTime,
  isRunning,
  hasActiveTimer,
  loading,
  matchStarted,
  scoreInput,
  setScoreInput,
  ui,
  onRemoveSecond,
  onAddSecond,
  onRemoveMinute,
  onAddMinute,
  onSetScoreAbsolute,
  onRefreshTimer,
  onSetRunning,
  onStopRunning,
}: Props) {
  const rk = raceKey(player.race)
  const hex = RACE_COLOR[rk] ?? '#dc2626'
  const icon = RACE_ICON[rk] ?? ''
  const timeUp = localTime <= 0
  const disabled = loading || !matchStarted

  const timeActions: TimeAction[] = [
    { label: '-1s', title: '-1 second', onClick: () => onRemoveSecond(player.playerId), variant: 'sub' },
    { label: '+1s', title: '+1 second', onClick: () => onAddSecond(player.playerId), variant: 'add' },
    { label: '-1m', title: '-1 minute', onClick: () => onRemoveMinute(player.playerId), variant: 'sub' },
    { label: '+1m', title: '+1 minute', onClick: () => onAddMinute(player.playerId), variant: 'add' },
  ]

  return (
    <div
      style={{
        ...ui.playerCard(hex, timeUp, isRunning),
        filter: hasActiveTimer && !isRunning ? 'grayscale(0.5) saturate(0.65)' : 'none',
        opacity: hasActiveTimer && !isRunning ? 0.66 : 1,
        transform: hasActiveTimer && !isRunning ? 'scale(0.992)' : 'scale(1)',
        transition: 'filter 180ms ease, opacity 180ms ease, transform 180ms ease',
      }}
    >
      {isRunning && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            borderRadius: 999,
            padding: '4px 9px',
            fontSize: 11,
            fontWeight: 1000,
            letterSpacing: 0.4,
            border: `1px solid ${hex}`,
            background: `linear-gradient(135deg, ${hex}, rgba(20,8,12,0.9))`,
            color: 'rgba(255,255,255,0.95)',
            boxShadow: `0 10px 24px ${hex}55`,
          }}
        >
          TIMER ACTIVE
        </div>
      )}

      <div style={ui.cardTopRow}>
        <div style={{ minWidth: 0 }}>
          <div style={ui.smallName} title={player.playerName}>
            {player.playerName}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 6 }}>
            <span style={ui.badgeStrong(hex)}>{raceLabel(player.race)}</span>

            {timeUp ? (
              <span style={ui.badgeStrong('#ef4444')}>TIME UP</span>
            ) : isRunning ? (
              <span style={ui.badgeStrong('#ef4444')}>RUNNING TIMER</span>
            ) : (
              <span style={ui.badge}>STOPPED</span>
            )}
          </div>
        </div>

        {icon ? (
          <img
            src={icon}
            alt={raceLabel(player.race)}
            title={raceLabel(player.race)}
            style={{ ...ui.heroIcon(hex), width: 56, height: 56, padding: 8, borderRadius: 16 }}
          />
        ) : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
        <div style={{ minWidth: 0 }}>
          <div style={ui.timerRow}>
            <div>
              <div style={ui.smallTimer(timeUp)}>{fmt(localTime)}</div>
              <div style={{ fontSize: 12, opacity: 0.72, color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>time left</div>
            </div>
          </div>

          <div style={{ ...ui.timeControls, marginTop: 8 }}>
            {timeActions.map((action) => (
              <button
                key={`${player.playerId}-${action.label}`}
                onClick={action.onClick}
                disabled={disabled}
                style={ui.timeBtn(action.variant, disabled)}
                onMouseEnter={(e) => hoverLiftButton(e.currentTarget, !disabled)}
                onMouseLeave={(e) => hoverResetButton(e.currentTarget)}
                title={action.title}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, opacity: 0.72, color: 'rgba(255,255,255,0.72)' }}>score</div>
          <div style={{ fontSize: 26, fontWeight: 1000, fontVariantNumeric: 'tabular-nums' }}>{player.score}</div>
        </div>
      </div>

      <div style={ui.miniActionsRow}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="number"
            value={scoreInput[player.playerId] ?? String(player.score ?? 0)}
            disabled={disabled}
            onChange={(e) => setScoreInput((prev) => ({ ...prev, [player.playerId]: e.target.value }))}
            onKeyDown={async (e) => {
              if (e.key !== 'Enter') return
              const raw = (scoreInput[player.playerId] ?? '').trim()
              if (raw === '') return
              const n = Number(raw)
              if (!Number.isFinite(n)) return
              await onSetScoreAbsolute(player.playerId, Math.trunc(n))
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
            title="Set target score and press Enter"
          />

          <button
            onClick={async () => {
              const raw = (scoreInput[player.playerId] ?? '').trim()
              if (raw === '') return
              const n = Number(raw)
              if (!Number.isFinite(n)) return
              await onSetScoreAbsolute(player.playerId, Math.trunc(n))
            }}
            disabled={disabled}
            style={ui.btn('ghost', disabled)}
          >
            Set score
          </button>

          <button
            onClick={() => onRefreshTimer(player.playerId)}
            disabled={disabled}
            style={ui.btn('ghost', disabled)}
          >
            Reset timer
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {!isRunning ? (
            <button
              onClick={() => onSetRunning(player.playerId)}
              disabled={disabled}
              style={{
                ...ui.btn('race', disabled, hex),
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              Start
            </button>
          ) : (
            <button onClick={() => onStopRunning(player.playerId)} disabled={disabled} style={ui.btn('danger', disabled)}>
              Stop
            </button>
          )}
        </div>
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
