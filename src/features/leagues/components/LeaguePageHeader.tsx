import { Link } from 'react-router-dom'
import type { LeaguePageUi } from '../leaguePageUi'

type Props = {
  loading: boolean
  error: string | null
  onRefresh: () => void | Promise<void>
  ui: LeaguePageUi
}

export default function LeaguePageHeader({ loading, error, onRefresh, ui }: Props) {
  return (
    <div style={ui.headerCard}>
      <h1 style={{ marginTop: 0, marginBottom: 8 }}>League</h1>

      <div style={{ fontSize: 12, color: 'rgba(233,200,205,0.8)', marginBottom: 10 }}>
        Manage standings, create matches, and keep the war log tidy.
      </div>

      {error ? (
        <div style={ui.error}>
          <b>Error:</b> {error}
        </div>
      ) : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Link to="/groups" style={ui.backLink}>
          ‹ back
        </Link>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{ ...ui.refreshBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
