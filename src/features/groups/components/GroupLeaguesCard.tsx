import { Link } from 'react-router-dom'
import type { League } from '../../../types'
import { gameLeaguePath } from '../../../routing/paths'
import type { GroupDetailsPageUi } from '../groupDetailsPageUi'

type Props = {
  gameKey: string
  loading: boolean
  newLeagueName: string
  setNewLeagueName: (value: string) => void
  sortedLeagues: League[]
  onCreateLeague: () => void | Promise<void>
  ui: GroupDetailsPageUi
}

export default function GroupLeaguesCard({
  gameKey,
  loading,
  newLeagueName,
  setNewLeagueName,
  sortedLeagues,
  onCreateLeague,
  ui,
}: Props) {
  return (
    <section style={ui.card}>
      <div style={ui.cardTitleRow}>
        <h2 style={ui.cardTitle}>Leagues</h2>
        <span style={ui.badge}>{sortedLeagues.length} total</span>
      </div>

      <div style={ui.controlsRow}>
        <input
          value={newLeagueName}
          onChange={(e) => setNewLeagueName(e.target.value)}
          placeholder="League name..."
          disabled={loading}
          style={ui.field}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(211,160,85,0.5)'
            e.currentTarget.style.boxShadow = '0 18px 44px rgba(96,70,34,0.24)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(213,128,139,0.3)'
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onCreateLeague()
          }}
        />

        <button
          onClick={onCreateLeague}
          disabled={loading || !newLeagueName.trim()}
          style={ui.btn('primary', loading || !newLeagueName.trim())}
          onMouseEnter={(e) => {
            if (loading || !newLeagueName.trim()) return
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ⚔️ Create
        </button>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {sortedLeagues.map((l) => (
          <Link
            key={l.id}
            to={gameLeaguePath(gameKey, l.id)}
            style={ui.leagueLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.borderColor = 'rgba(255,95,116,0.52)'
              e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.42), 0 0 40px rgba(137,19,40,0.18)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'rgba(196,63,75,0.32)'
              e.currentTarget.style.boxShadow = '0 14px 38px rgba(0,0,0,0.42)'
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
              <div style={{ fontSize: 12, ...ui.muted }}>leagueId: {l.id}</div>
            </div>
            <span style={{ opacity: 0.75, fontWeight: 900 }}>Open →</span>
          </Link>
        ))}

        {sortedLeagues.length === 0 && <div style={ui.empty}>No leagues yet. Create one above.</div>}
      </div>
    </section>
  )
}
