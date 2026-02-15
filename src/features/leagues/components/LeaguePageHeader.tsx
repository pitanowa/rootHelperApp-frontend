import { Link } from 'react-router-dom'

type Props = {
  loading: boolean
  error: string | null
  onRefresh: () => void | Promise<void>
}

export default function LeaguePageHeader({ loading, error, onRefresh }: Props) {
  return (
    <>
      <h1 style={{ marginTop: 12, marginBottom: 8 }}>League</h1>

      {error && (
        <div style={{ padding: 12, borderRadius: 12, border: '1px solid #f3c', marginBottom: 12 }}>
          <b>Error:</b> {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/groups" style={{ textDecoration: 'none' }}>
          ← back
        </Link>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{ background: '#ffffff', padding: '8px 12px', borderRadius: 10, border: '1px solid #ccc', cursor: 'pointer' }}
        >
          Refresh
        </button>
      </div>
    </>
  )
}
