import { Link } from 'react-router-dom'

type Props = {
  routeGameKey?: string
  details?: string
}

export default function GameNotSupported({ routeGameKey, details }: Props) {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px', color: 'rgba(255,255,255,0.92)' }}>
      <section
        style={{
          borderRadius: 20,
          border: 'var(--app-shell-border)',
          background: 'var(--app-shell-bg)',
          boxShadow: 'var(--app-shell-shadow)',
          padding: 20,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Game not supported</h1>
        <p style={{ marginTop: 0, marginBottom: 10, opacity: 0.85 }}>
          Requested game context{routeGameKey ? `: ${routeGameKey}` : ''} is not available in this frontend/backend setup.
        </p>
        {details ? <p style={{ marginTop: 0, marginBottom: 16, opacity: 0.75 }}>{details}</p> : null}
        <Link to="/" style={{ color: '#fff', fontWeight: 800 }}>
          Go to game selection
        </Link>
      </section>
    </main>
  )
}
