import type { GroupsPageUi } from '../groupsPageUi'

type Props = {
  name: string
  loading: boolean
  error: string | null
  onNameChange: (next: string) => void
  onCreateGroup: () => void | Promise<void>
  onRefresh: () => void | Promise<void>
  ui: GroupsPageUi
}

export default function GroupsHeaderCard({
  name,
  loading,
  error,
  onNameChange,
  onCreateGroup,
  onRefresh,
  ui,
}: Props) {
  return (
    <div style={ui.glowTop}>
      <h1 style={ui.header}>Groups</h1>
      <p style={ui.sub}>A group is your set of players (e.g. "ROOT ekipa"). Leagues belong to a group.</p>

      <div style={ui.controls}>
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Group name..."
          disabled={loading}
          style={ui.input}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.40)'
            e.currentTarget.style.boxShadow = '0 18px 44px rgba(59,130,246,0.14)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onCreateGroup()
          }}
        />

        <button
          onClick={onCreateGroup}
          disabled={loading || !name.trim()}
          style={ui.btn('gold', loading || !name.trim())}
          onMouseEnter={(e) => {
            if (loading || !name.trim()) return
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Create
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
          Refresh
        </button>
      </div>

      {error && (
        <div style={ui.err}>
          <b>Error:</b> {error}
        </div>
      )}
    </div>
  )
}
