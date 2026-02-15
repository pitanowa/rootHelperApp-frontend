import { raceKey, raceLabel, RACE_COLOR, RACE_ICON } from '../../../constants/races'
import type { MatchPlayerState } from '../types'
import type { RacePickUi } from '../racePickTypes'

type Props = {
  players: MatchPlayerState[]
  loading: boolean
  taken: Set<string>
  pool: readonly string[]
  selectedPlayer: MatchPlayerState | null
  onPick: (playerId: number, race: string) => void | Promise<void>
  landmarksEnabled?: boolean
  landmarksDrawn?: string[]
  ui: RacePickUi
}

export default function RacePickRacePool({
  players,
  loading,
  taken,
  pool,
  selectedPlayer,
  onPick,
  landmarksEnabled,
  landmarksDrawn,
  ui,
}: Props) {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {players.map((p) => {
          const rk = raceKey(p.race)
          const hex = RACE_COLOR[rk] ?? '#dc2626'
          return (
            <span key={p.playerId} style={ui.badgeStrong(hex)}>
              {p.playerName}: <b>{raceLabel(p.race)}</b>
            </span>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {pool.map((rk) => {
          const icon = RACE_ICON[rk]
          const hex = RACE_COLOR[rk] ?? '#dc2626'
          const disabled = loading || taken.has(rk) || !selectedPlayer || !!selectedPlayer.race
          const pickedBySomeone = taken.has(rk)

          return (
            <button
              key={rk}
              disabled={disabled}
              onClick={() => selectedPlayer && onPick(selectedPlayer.playerId, rk)}
              style={{
                ...ui.btn('race', disabled, hex),
                padding: 14,
                borderRadius: 18,
                display: 'grid',
                gap: 10,
                justifyItems: 'center',
                opacity: pickedBySomeone ? 0.55 : 1,
              }}
              title={pickedBySomeone ? 'Already picked' : `Pick ${rk}`}
            >
              <img
                src={icon}
                alt={rk}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: 'contain',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: 8,
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              />
              <div style={{ fontWeight: 1000 }}>{raceLabel(rk)}</div>
            </button>
          )
        })}
      </div>

      <div style={{ opacity: 0.78, fontSize: 13 }}>
        Select a player, then pick a race.
        {landmarksEnabled && (landmarksDrawn?.length ?? 0) === 0
          ? ' Landmarks are required before the match can start.'
          : ' Once both players have a race, you will automatically enter the match view.'}
      </div>
    </div>
  )
}
