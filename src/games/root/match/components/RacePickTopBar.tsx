import type { MatchPlayerState } from '../../../../features/matches/types'
import type { RacePickUi } from '../racePickTypes'

type Props = {
  players: MatchPlayerState[]
  selectedPlayerId: number
  loading: boolean
  onRefresh: () => void
  onSelectPlayer: (playerId: number) => void
  ui: RacePickUi
}

export default function RacePickTopBar({ players, selectedPlayerId, loading, onRefresh, onSelectPlayer, ui }: Props) {
  return (
    <div style={ui.topbar}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={ui.badge}>Race pick (no draft)</span>
        <button onClick={onRefresh} disabled={loading} style={ui.btn('ghost', loading)}>
          Refresh
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {players.map((p) => {
          const active = p.playerId === selectedPlayerId
          return (
            <button
              key={p.playerId}
              disabled={loading}
              onClick={() => onSelectPlayer(p.playerId)}
              style={{ ...ui.btn(active ? 'primary' : 'ghost', loading), opacity: active ? 1 : 0.9 }}
              title={p.playerName}
            >
              {p.playerName}
            </button>
          )
        })}
      </div>
    </div>
  )
}

