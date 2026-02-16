import type { Player } from '../../../types'
import type { PlayersPageUi } from '../playersPageUi'

type Props = {
  players: Player[]
  loading: boolean
  onRemovePlayer: (id: number) => void | Promise<void>
  ui: PlayersPageUi
}

export default function PlayersList({ players, loading, onRemovePlayer, ui }: Props) {
  return (
    <div style={ui.list}>
      {players.map((p) => {
        const initials = (p.name || '?')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((x) => x[0]?.toUpperCase())
          .join('')

        return (
          <div
            key={p.id}
            style={ui.playerCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.borderColor = 'rgba(var(--app-accent-rgb),0.18)'
              e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.38), 0 0 40px rgba(var(--app-accent-rgb),0.10)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'rgba(var(--app-accent-rgb),0.32)'
              e.currentTarget.style.boxShadow = '0 18px 55px rgba(0,0,0,0.4)'
            }}
          >
            <div style={ui.left}>
              <div style={ui.avatar} aria-hidden>
                {initials || 'P'}
              </div>
              <div>
                <div style={ui.name}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.78, color: 'rgba(var(--app-muted-rgb),0.78)' }}>Warrior registered</div>
              </div>
            </div>

            <button
              onClick={() => onRemovePlayer(p.id)}
              disabled={loading}
              style={ui.btn('danger', loading)}
              onMouseEnter={(e) => {
                if (loading) return
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              🩸 Delete
            </button>
          </div>
        )
      })}

      {!loading && players.length === 0 && <div style={ui.empty}>No players yet. Add the first one above.</div>}
    </div>
  )
}


