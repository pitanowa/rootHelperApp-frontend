import { Link } from 'react-router-dom'
import { GAME_MODULES } from '../core/games/registry'
import { gameHomePath } from '../routing/paths'

export default function GameSelectPage() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px', color: 'rgba(255,255,255,0.92)' }}>
      <section
        style={{
          borderRadius: 20,
          border: '1px solid rgba(196,63,75,0.34)',
          background:
            'radial-gradient(900px 260px at 10% 0%, rgba(193,38,61,0.22), transparent 60%), linear-gradient(180deg, rgba(20,7,12,0.95), rgba(10,4,7,0.98))',
          boxShadow: '0 16px 50px rgba(0,0,0,0.5), 0 0 32px rgba(137,19,40,0.18)',
          padding: 20,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Choose game</h1>
        <p style={{ marginTop: 0, marginBottom: 16, opacity: 0.82 }}>
          Select a game module. Core screens are shared, while league and match logic can be game-specific.
        </p>

        <div style={{ display: 'grid', gap: 10 }}>
          {GAME_MODULES.map((game) => (
            <Link
              key={game.key}
              to={gameHomePath(game.key)}
              style={{
                borderRadius: 14,
                border: '1px solid rgba(213,128,139,0.3)',
                background: 'rgba(255,255,255,0.04)',
                padding: '12px 14px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'grid',
                gap: 4,
              }}
            >
              <strong style={{ fontSize: 18 }}>{game.name}</strong>
              <span style={{ fontSize: 13, opacity: 0.82 }}>{game.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
