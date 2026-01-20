import { useEffect, useMemo, useState } from 'react'
import { apiDelete, apiGet, apiPost } from '../api'
import type { Player } from '../types'

// =====================
// Legendary Dark UI
// =====================
const ui = {
  page: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 16,
    fontFamily: 'system-ui, sans-serif',
    color: 'rgba(255,255,255,0.92)',
  } as const,

  backdrop: {
    borderRadius: 20,
    padding: 16,
    background:
      'radial-gradient(900px 420px at 15% 0%, rgba(220,38,38,0.22), transparent 55%), radial-gradient(800px 360px at 90% 10%, rgba(59,130,246,0.18), transparent 60%), linear-gradient(180deg, rgba(10,10,12,0.92), rgba(16,10,12,0.88))',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow:
      '0 28px 80px rgba(0,0,0,0.45), 0 0 60px rgba(220,38,38,0.10)',
    backdropFilter: 'blur(10px)',
  } as const,

  h1: { margin: 0, letterSpacing: 0.6, fontSize: 26, fontWeight: 1000 } as const,
  p: { marginTop: 6, opacity: 0.78, color: 'rgba(255,255,255,0.72)' } as const,

  controls: {
    display: 'flex',
    gap: 10,
    margin: '16px 0 12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  } as const,

  input: {
    flex: 1,
    minWidth: 220,
    padding: '12px 12px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.14)',
    outline: 'none',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.92)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  btn: (variant: 'gold' | 'ghost' | 'danger', disabled: boolean) =>
    ({
      padding: '12px 14px',
      borderRadius: 14,
      border:
        variant === 'danger'
          ? '1px solid rgba(248,113,113,0.35)'
          : variant === 'gold'
            ? '1px solid rgba(250,204,21,0.30)'
            : '1px solid rgba(255,255,255,0.14)',
      background:
        variant === 'danger'
          ? 'linear-gradient(135deg, rgba(220,38,38,0.88), rgba(127,29,29,0.88))'
          : variant === 'gold'
            ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(255,255,255,0.04))'
            : 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.92)',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'danger'
          ? '0 16px 34px rgba(220,38,38,0.22)'
          : variant === 'gold'
            ? '0 16px 34px rgba(250,204,21,0.10)'
            : 'none',
      transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
      userSelect: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap',
    }) as const,

  err: {
    padding: 12,
    borderRadius: 14,
    border: '1px solid rgba(248,113,113,0.40)',
    background: 'rgba(220,38,38,0.12)',
    marginTop: 10,
    marginBottom: 12,
    color: 'rgba(255,255,255,0.9)',
  } as const,

  loading: { opacity: 0.75, color: 'rgba(255,255,255,0.72)' } as const,

  list: { display: 'grid', gap: 10, marginTop: 12 } as const,

  playerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
    boxShadow: '0 18px 55px rgba(0,0,0,0.32)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  left: { display: 'flex', alignItems: 'center', gap: 10 } as const,

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 14,
    display: 'grid',
    placeItems: 'center',
    fontWeight: 1000,
    border: '1px solid rgba(255,255,255,0.14)',
    background:
      'linear-gradient(135deg, rgba(220,38,38,0.18), rgba(59,130,246,0.10))',
    color: 'rgba(255,255,255,0.92)',
  } as const,

  name: { fontWeight: 1000, letterSpacing: 0.2 } as const,

  empty: {
    opacity: 0.78,
    padding: 12,
    border: '1px dashed rgba(255,255,255,0.20)',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    color: 'rgba(255,255,255,0.75)',
  } as const,
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => a.name.localeCompare(b.name))
  }, [players])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<Player[]>('/api/players')
      setPlayers(data)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load players')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function addPlayer() {
    const trimmed = name.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    try {
      const created = await apiPost<Player>('/api/players', { name: trimmed })
      setPlayers((prev) => [...prev, created])
      setName('')
    } catch (e: any) {
      setError(e?.message ?? 'Failed to add player')
    } finally {
      setLoading(false)
    }
  }

  async function removePlayer(id: number) {
    const ok = confirm('Remove this player?')
    if (!ok) return

    setLoading(true)
    setError(null)
    try {
      await apiDelete<void>(`/api/players/${id}`)
      setPlayers((prev) => prev.filter((p) => p.id !== id))
    } catch (e: any) {
      setError(e?.message ?? 'Failed to remove player')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={ui.page}>
      <div style={ui.backdrop}>
        <h1 style={ui.h1}>Players</h1>
        <p style={ui.p}>Add and manage players.</p>

        <div style={ui.controls}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Player name…"
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
              if (e.key === 'Enter') addPlayer()
            }}
          />

          <button
            onClick={addPlayer}
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
            onClick={load}
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

        {loading && <div style={ui.loading}>Loading…</div>}

        <div style={ui.list}>
          {sortedPlayers.map((p) => {
            const initials = (p.name || '?')
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((x) => x[0]?.toUpperCase())
              .join('')

            return (
              <div
                key={p.id}
                style={ui.playerCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.borderColor = 'rgba(220,38,38,0.18)'
                  e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.38), 0 0 40px rgba(220,38,38,0.10)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                  e.currentTarget.style.boxShadow = '0 18px 55px rgba(0,0,0,0.32)'
                }}
              >
                <div style={ui.left}>
                  <div style={ui.avatar} aria-hidden>
                    {initials || 'P'}
                  </div>
                  <div>
                    <div style={ui.name}>{p.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>
                      Warrior registered
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removePlayer(p.id)}
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
                  🩸 Delete
                </button>
              </div>
            )
          })}

          {!loading && sortedPlayers.length === 0 && (
            <div style={ui.empty}>No players yet. Add the first one above.</div>
          )}
        </div>
      </div>
    </div>
  )
}
