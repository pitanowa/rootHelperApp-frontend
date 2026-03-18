import type { ReactNode } from 'react'
import type { LeaguePageUi } from '../leaguePageUi'

type Props = {
  loading: boolean
  error: string | null
  onRefresh: () => void | Promise<void>
  actions?: ReactNode
  ui: LeaguePageUi
}

export default function LeaguePageHeader({ loading, error, onRefresh, actions, ui }: Props) {
  return (
    <div style={ui.headerCard}>
      <h1 style={{ marginTop: 0, marginBottom: 8 }}>League</h1>

      <div style={{ fontSize: 12, color: 'rgba(var(--app-muted-rgb),0.8)', marginBottom: 10 }}>
        Manage standings, create matches, and keep the war log tidy.
      </div>

      {error ? (
        <div style={ui.error}>
          <b>Error:</b> {error}
        </div>
      ) : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{ ...ui.refreshBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            Refresh
          </button>

          {actions}
        </div>
      </div>
    </div>
  )
}
