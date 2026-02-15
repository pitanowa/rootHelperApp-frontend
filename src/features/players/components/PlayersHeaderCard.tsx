import type { PlayersPageUi } from '../playersPageUi'

type Props = {
  name: string
  loading: boolean
  error: string | null
  onNameChange: (value: string) => void
  onAddPlayer: () => void | Promise<void>
  onRefresh: () => void | Promise<void>
  ui: PlayersPageUi
}

export default function PlayersHeaderCard({
  name,
  loading,
  error,
  onNameChange,
  onAddPlayer,
  onRefresh,
  ui,
}: Props) {
  return (
    <>
      <h1 style={ui.h1}>Players</h1>
      <p style={ui.p}>Add and manage players.</p>

      <div style={ui.controls}>
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Player name..."
          disabled={loading}
          style={ui.input}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'
            e.currentTarget.style.boxShadow = '0 18px 55px rgba(0,0,0,0.34), 0 0 30px rgba(59,130,246,0.12)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.22)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onAddPlayer()
          }}
        />

        <button
          onClick={onAddPlayer}
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
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={ui.err}>
          <b>Error:</b> {error}
        </div>
      )}

      {loading && <div style={ui.loading}>Loading...</div>}
    </>
  )
}
