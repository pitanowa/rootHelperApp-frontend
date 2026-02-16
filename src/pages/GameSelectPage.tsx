import { Link } from 'react-router-dom'
import { GAME_MODULES, resolveGameModule } from '../core/games/registry'
import { gameHomePath } from '../routing/paths'
import { useAppCtx } from '../useAppCtx'

export default function GameSelectPage() {
  const { supportedGames, supportedGamesLoading, supportedGamesError, refreshSupportedGames } = useAppCtx()

  const items =
    supportedGames.length > 0
      ? supportedGames
          .map((game) => {
            const module = resolveGameModule(game.key)
            if (!module) return null
            return {
              key: module.key,
              title: game.displayName,
              description: module.description,
            }
          })
          .filter((item): item is { key: string; title: string; description: string } => item != null)
      : GAME_MODULES.map((module) => ({ key: module.key, title: module.name, description: module.description }))

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px', color: 'rgba(255,255,255,0.92)' }}>
      <section
        style={{
          borderRadius: 20,
          border: 'var(--app-shell-border)',
          background:
            'var(--app-shell-bg)',
          boxShadow: 'var(--app-shell-shadow)',
          padding: 20,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Choose game</h1>
        <p style={{ marginTop: 0, marginBottom: 16, opacity: 0.82 }}>
          Select a game module. Core screens are shared, while league and match logic can be game-specific.
        </p>

        {supportedGamesLoading ? <p style={{ marginTop: 0, opacity: 0.8 }}>Loading supported games...</p> : null}

        {supportedGamesError ? (
          <div style={{ marginBottom: 14, color: '#ffd5dc' }}>
            <div style={{ marginBottom: 8 }}>Failed to load games from backend: {supportedGamesError}</div>
            <button type="button" onClick={() => void refreshSupportedGames()}>
              Retry
            </button>
          </div>
        ) : null}

        <div style={{ display: 'grid', gap: 10 }}>
          {items.map((game) => (
            <Link
              key={game.key}
              to={gameHomePath(game.key)}
              style={{
                borderRadius: 14,
                border: 'var(--app-input-border)',
                background: 'var(--app-soft-bg)',
                padding: '12px 14px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'grid',
                gap: 4,
              }}
            >
              <strong style={{ fontSize: 18 }}>{game.title}</strong>
              <span style={{ fontSize: 13, opacity: 0.82 }}>{game.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

