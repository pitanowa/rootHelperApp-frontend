import type { Player } from '../../../types'
import type { GroupDetailsPageUi } from '../groupDetailsPageUi'

type Props = {
  loading: boolean
  selectedPlayerId: number | ''
  setSelectedPlayerId: (value: number | '') => void
  availablePlayers: Player[]
  sortedMembers: Player[]
  onAddMember: () => void | Promise<void>
  onRefresh: () => void | Promise<void>
  onRemoveMember: (playerId: number) => void | Promise<void>
  ui: GroupDetailsPageUi
}

export default function GroupMembersCard({
  loading,
  selectedPlayerId,
  setSelectedPlayerId,
  availablePlayers,
  sortedMembers,
  onAddMember,
  onRefresh,
  onRemoveMember,
  ui,
}: Props) {
  return (
    <section style={ui.card}>
      <div style={ui.cardTitleRow}>
        <h2 style={ui.cardTitle}>Members</h2>
        <span style={ui.badge}>{sortedMembers.length} total</span>
      </div>

      <div style={ui.controlsRow}>
        <select
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value ? Number(e.target.value) : '')}
          disabled={loading}
          style={ui.selectField}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,95,116,0.5)'
            e.currentTarget.style.boxShadow = '0 18px 44px rgba(137,19,40,0.28)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(213,128,139,0.3)'
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <option value="" disabled hidden>
            Select player to add...
          </option>
          {availablePlayers.map((p) => (
            <option key={p.id} value={p.id} style={{ color: '#111827', background: '#ffffff' }}>
              {p.name} (id {p.id})
            </option>
          ))}
        </select>

        <button
          onClick={onAddMember}
          disabled={loading || selectedPlayerId === ''}
          style={ui.btn('gold', loading || selectedPlayerId === '')}
          onMouseEnter={(e) => {
            if (loading || selectedPlayerId === '') return
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ✨ Add
        </button>

        <button
          onClick={onRefresh}
          disabled={loading}
          style={ui.btn('ghost', loading)}
          onMouseEnter={(e) => {
            if (loading) return
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ↻ Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {sortedMembers.map((m) => (
          <div
            key={m.id}
            style={ui.rowCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.borderColor = 'rgba(220,38,38,0.18)'
              e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.35), 0 0 40px rgba(220,38,38,0.10)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'rgba(196,63,75,0.32)'
              e.currentTarget.style.boxShadow = '0 14px 38px rgba(0,0,0,0.42)'
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={ui.rowName}>{m.name}</div>
              <div style={{ fontSize: 12, ...ui.muted }}>playerId: {m.id}</div>
            </div>

            <button
              onClick={() => onRemoveMember(m.id)}
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
              🗡️ Remove
            </button>
          </div>
        ))}

        {sortedMembers.length === 0 && <div style={ui.empty}>No members yet. Add players above.</div>}
      </div>
    </section>
  )
}
