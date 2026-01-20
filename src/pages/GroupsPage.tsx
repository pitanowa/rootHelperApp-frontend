import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiPost } from '../api'
import type { Group } from '../types'

// =====================
// Legendary Dark UI (Groups)
// =====================
const ui = {
  page: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 16,
    fontFamily: 'system-ui, sans-serif',
    color: 'rgba(255,255,255,0.92)',
  } as const,

  header: { marginBottom: 8, letterSpacing: 0.4 } as const,
  sub: { marginTop: 0, opacity: 0.78, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 } as const,

  card: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
    boxShadow: '0 18px 55px rgba(0,0,0,0.45), 0 0 50px rgba(220,38,38,0.08)',
    overflow: 'hidden',
  } as const,

  glowTop: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.10)',
    background:
      'radial-gradient(900px 260px at 10% 0%, rgba(220,38,38,0.22), transparent 60%), radial-gradient(800px 260px at 90% 20%, rgba(59,130,246,0.16), transparent 55%), linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
    boxShadow: '0 22px 70px rgba(0,0,0,0.50), 0 0 60px rgba(220,38,38,0.10)',
    overflow: 'hidden',
  } as const,

  controls: {
    display: 'flex',
    gap: 10,
    margin: '16px 0',
    flexWrap: 'wrap',
    alignItems: 'center',
  } as const,

  input: {
    flex: 1,
    minWidth: 220,
    padding: '12px 12px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))',
    color: 'rgba(255,255,255,0.92)',
    outline: 'none',
    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  btn: (variant: 'primary' | 'ghost' | 'gold', disabled: boolean) =>
    ({
      padding: '12px 14px',
      borderRadius: 14,
      border:
        variant === 'primary'
          ? '1px solid rgba(59,130,246,0.40)'
          : variant === 'gold'
            ? '1px solid rgba(250,204,21,0.28)'
            : '1px solid rgba(255,255,255,0.14)',
      background:
        variant === 'primary'
          ? 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(99,102,241,0.92))'
          : variant === 'gold'
            ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(255,255,255,0.04))'
            : 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.92)',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'primary'
          ? '0 16px 34px rgba(59,130,246,0.22)'
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
    borderRadius: 16,
    border: '1px solid rgba(248,113,113,0.30)',
    background: 'rgba(220,38,38,0.12)',
    color: 'rgba(255,255,255,0.92)',
    fontWeight: 900,
    marginBottom: 12,
    boxShadow: '0 16px 44px rgba(0,0,0,0.35)',
  } as const,

  list: { display: 'grid', gap: 10 } as const,

  groupLink: {
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 14,
    background: 'linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 14px 38px rgba(0,0,0,0.35)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease, background 120ms ease',
  } as const,

  groupName: { fontWeight: 1000, letterSpacing: 0.2 } as const,
  openHint: { opacity: 0.75, fontWeight: 900 } as const,

  empty: {
    opacity: 0.78,
    padding: 14,
    border: '1px dashed rgba(255,255,255,0.22)',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.04)',
  } as const,
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sorted = useMemo(() => [...groups].sort((a, b) => a.name.localeCompare(b.name)), [groups])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setGroups(await apiGet<Group[]>('/api/groups'))
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load groups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function createGroup() {
    const trimmed = name.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    try {
      const created = await apiPost<Group>('/api/groups', { name: trimmed })
      setGroups((prev) => [...prev, created])
      setName('')
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={ui.page}>
      <div style={ui.glowTop}>
        <h1 style={ui.header}>Groups</h1>
        <p style={ui.sub}>A group is your set of players (e.g. “ROOT ekipa”). Leagues belong to a group.</p>

        <div style={ui.controls}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              if (e.key === 'Enter') createGroup()
            }}
          />

          <button
            onClick={createGroup}
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
            ✨ Create
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
            ↻ Refresh
          </button>
        </div>

        {error && (
          <div style={ui.err}>
            <b>Error:</b> {error}
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={ui.list}>
          {sorted.map((g) => (
            <Link
              key={g.id}
              to={`/groups/${g.id}`}
              style={ui.groupLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.borderColor = 'rgba(220,38,38,0.18)'
                e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.42), 0 0 40px rgba(220,38,38,0.10)'
                e.currentTarget.style.background =
                  'radial-gradient(700px 260px at 10% 0%, rgba(220,38,38,0.14), transparent 60%), linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                e.currentTarget.style.boxShadow = '0 14px 38px rgba(0,0,0,0.35)'
                e.currentTarget.style.background = 'linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))'
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={ui.groupName}>{g.name}</div>
                <div style={{ fontSize: 12, opacity: 0.72, marginTop: 3, color: 'rgba(255,255,255,0.70)' }}>
                  Open leagues and matches →
                </div>
              </div>

              <div style={ui.openHint}>Open →</div>
            </Link>
          ))}

          {sorted.length === 0 && (
            <div style={ui.empty}>No groups yet. Create the first one above.</div>
          )}
        </div>
      </div>
    </div>
  )
}
