import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiDelete, apiGet, apiPost } from '../api'
import type { GroupDetails, League, Player } from '../types'
import { useAppCtx } from '../AppContext'

// =====================
// Legendary Dark UI (GroupDetails)
// =====================
const ui = {
  page: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 16,
    fontFamily: 'system-ui, sans-serif',
    color: 'rgba(255,255,255,0.92)',
  } as const,

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
        borderRadius: 18,
    padding: 16,

    flexWrap: 'wrap',
        background:
      'radial-gradient(900px 260px at 10% 0%, rgba(220,38,38,0.22), transparent 60%), radial-gradient(800px 260px at 90% 20%, rgba(59,130,246,0.16), transparent 55%), linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',

  } as const,

  title: { margin: 0, lineHeight: 1.1, letterSpacing: 0.4 } as const,
  subtitle: { marginTop: 6, fontSize: 13, opacity: 0.78, color: 'rgba(255,255,255,0.72)' } as const,

  glowHeader: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.10)',
    background:
      'radial-gradient(900px 260px at 10% 0%, rgba(220,38,38,0.22), transparent 60%), radial-gradient(800px 260px at 90% 20%, rgba(59,130,246,0.16), transparent 55%), linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
    boxShadow: '0 22px 70px rgba(0,0,0,0.50), 0 0 60px rgba(220,38,38,0.10)',
    overflow: 'hidden',
  } as const,

  backLink: {
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 14,
    padding: '10px 12px',
    color: 'rgba(255,255,255,0.92)',
    background: 'rgba(255,255,255,0.05)',
    fontWeight: 1000,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  } as const,

  badge: {
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 1000,
    letterSpacing: 0.2,
    whiteSpace: 'nowrap',
  } as const,

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

  card: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
    boxShadow: '0 18px 55px rgba(0,0,0,0.45), 0 0 50px rgba(220,38,38,0.08)',
    overflow: 'hidden',
  } as const,

  cardTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  } as const,

  cardTitle: { margin: 0, fontSize: 18, fontWeight: 1000, color: 'rgba(255,255,255,0.92)' } as const,
  muted: { opacity: 0.75, color: 'rgba(255,255,255,0.72)' } as const,

  twoCol: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    alignItems: 'start',
  } as const,

  controlsRow: {
    display: 'flex',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  } as const,

  field: {
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

  btn: (variant: 'ghost' | 'primary' | 'danger' | 'gold', disabled: boolean) =>
    ({
      padding: '12px 14px',
      borderRadius: 14,
      border:
        variant === 'danger'
          ? '1px solid rgba(248,113,113,0.35)'
          : variant === 'primary'
            ? '1px solid rgba(59,130,246,0.35)'
            : variant === 'gold'
              ? '1px solid rgba(250,204,21,0.28)'
              : '1px solid rgba(255,255,255,0.14)',
      background:
        variant === 'danger'
          ? 'linear-gradient(135deg, rgba(220,38,38,0.88), rgba(127,29,29,0.88))'
          : variant === 'primary'
            ? 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(99,102,241,0.92))'
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
          : variant === 'primary'
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

  rowCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 12,
    background: 'rgba(255,255,255,0.05)',
    boxShadow: '0 14px 38px rgba(0,0,0,0.35)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  rowName: {
    fontWeight: 1000,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'rgba(255,255,255,0.92)',
  } as const,

  selectField: {
    flex: 1,
    minWidth: 220,
    padding: '12px 12px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))',
    color: '#ffffff',
    outline: 'none',
    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
  } as const,

  empty: {
    opacity: 0.78,
    padding: 14,
    border: '1px dashed rgba(255,255,255,0.22)',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.72)',
  } as const,

  leagueLink: {
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 12,
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 14px 38px rgba(0,0,0,0.35)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,
}

export default function GroupDetailsPage() {
  const { groupId } = useParams()
  const { setSelectedGroupId } = useAppCtx()

    useEffect(() => {
    setSelectedGroupId(groupId ? Number(groupId) : null)
  }, [groupId, setSelectedGroupId])

  const gid = Number(groupId)

  const [group, setGroup] = useState<GroupDetails | null>(null)
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [newLeagueName, setNewLeagueName] = useState('')

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const memberIds = useMemo(() => new Set(group?.members.map((m) => m.id) ?? []), [group])

  const availablePlayers = useMemo(() => {
    return allPlayers
      .filter((p) => !memberIds.has(p.id))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [allPlayers, memberIds])

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const [g, players, ls] = await Promise.all([
        apiGet<GroupDetails>(`/api/groups/${gid}`),
        apiGet<Player[]>('/api/players'),
        apiGet<League[]>(`/api/groups/${gid}/leagues`),
      ])
      setGroup(g)
      setAllPlayers(players)
      setLeagues(ls)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load group details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!Number.isFinite(gid)) return
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid])

  async function addMember() {
    if (selectedPlayerId === '') return
    setLoading(true)
    setError(null)
    try {
      await apiPost<void>(`/api/groups/${gid}/members/${selectedPlayerId}`)
      await loadAll()
      setSelectedPlayerId('')
    } catch (e: any) {
      setError(e?.message ?? 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  async function removeMember(playerId: number) {
    const ok = confirm('Remove this member from group?')
    if (!ok) return

    setLoading(true)
    setError(null)
    try {
      await apiDelete<void>(`/api/groups/${gid}/members/${playerId}`)
      await loadAll()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to remove member')
    } finally {
      setLoading(false)
    }
  }

  async function createLeague() {
    const trimmed = newLeagueName.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    try {
      await apiPost<League>(`/api/groups/${gid}/leagues`, { name: trimmed })
      setNewLeagueName('')
      await loadAll()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create league')
    } finally {
      setLoading(false)
    }
  }

  const sortedLeagues = useMemo(() => [...leagues].sort((a, b) => a.name.localeCompare(b.name)), [leagues])
  const sortedMembers = useMemo(() => group?.members.slice().sort((a, b) => a.name.localeCompare(b.name)) ?? [], [group?.members])

  return (
    <div style={ui.page}>
      <div style={ui.topBar}>
        <div>
          <h1 style={ui.title}>Group</h1>
          <div style={ui.subtitle}>Manage members and leagues inside this group.</div>
        </div>

        <Link
          to="/groups"
          style={ui.backLink}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.18)'
            e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.35), 0 0 40px rgba(220,38,38,0.10)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ← back
        </Link>
      </div>

      {error && (
        <div style={ui.err}>
          <b>Error:</b> {error}
        </div>
      )}

      {!group ? (
        <div style={{ padding: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>{loading ? 'Loading…' : 'Group not found'}</div>
      ) : (
        <>
          {/* Header */}
          <div style={{ ...ui.glowHeader, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 1000, fontSize: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {group.name}
                </div>
                <div style={{ fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>id: {group.id}</div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span style={ui.badge}>👥 {sortedMembers.length} members</span>
                <span style={ui.badge}>🏆 {sortedLeagues.length} leagues</span>
              </div>
            </div>
          </div>

          {/* Two columns */}
          <div style={ui.twoCol}>
            {/* Members */}
            <section style={ui.card}>
              <div style={ui.cardTitleRow}>
                <h2 style={ui.cardTitle}>Members</h2>
                <span style={ui.badge}>{sortedMembers.length} total</span>
              </div>

              <div style={ui.controlsRow}>
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value ? Number(e.target.value) : '')}
                  disabled={loading}
                  style={ui.selectField as React.CSSProperties}
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
                >
                  <option value="" disabled hidden>
                    Select player to add…
                  </option>
                  {availablePlayers.map((p) => (
                    <option key={p.id} value={p.id} style={{ color: '#111827', background: '#ffffff' }}>
                      {p.name} (id {p.id})
                    </option>
                  ))}
                </select>

                <button
                  onClick={addMember}
                  disabled={loading || selectedPlayerId === ''}
                  style={ui.btn('gold', loading || selectedPlayerId === '')}
                  onMouseEnter={(e) => {
                    if (loading || selectedPlayerId === '') return
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  ✨ Add
                </button>

                <button
                  onClick={loadAll}
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

              <div style={{ display: 'grid', gap: 10 }}>
                {sortedMembers.map((m) => (
                  <div
                    key={m.id}
                    style={ui.rowCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.borderColor = 'rgba(220,38,38,0.18)'
                      e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.35), 0 0 40px rgba(220,38,38,0.10)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                      e.currentTarget.style.boxShadow = '0 14px 38px rgba(0,0,0,0.35)'
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={ui.rowName}>{m.name}</div>
                      <div style={{ fontSize: 12, ...ui.muted }}>playerId: {m.id}</div>
                    </div>

                    <button
                      onClick={() => removeMember(m.id)}
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
                      🗡️ Remove
                    </button>
                  </div>
                ))}

                {sortedMembers.length === 0 && <div style={ui.empty}>No members yet. Add players above.</div>}
              </div>
            </section>

            {/* Leagues */}
            <section style={ui.card}>
              <div style={ui.cardTitleRow}>
                <h2 style={ui.cardTitle}>Leagues</h2>
                <span style={ui.badge}>{sortedLeagues.length} total</span>
              </div>

              <div style={ui.controlsRow}>
                <input
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  placeholder="League name..."
                  disabled={loading}
                  style={ui.field}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(250,204,21,0.32)'
                    e.currentTarget.style.boxShadow = '0 18px 44px rgba(250,204,21,0.10)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createLeague()
                  }}
                />

                <button
                  onClick={createLeague}
                  disabled={loading || !newLeagueName.trim()}
                  style={ui.btn('primary', loading || !newLeagueName.trim())}
                  onMouseEnter={(e) => {
                    if (loading || !newLeagueName.trim()) return
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  ⚔️ Create
                </button>
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                {sortedLeagues.map((l) => (
                  <Link
                    key={l.id}
                    to={`/leagues/${l.id}`}
                    style={ui.leagueLink}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'
                      e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.35), 0 0 40px rgba(59,130,246,0.10)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                      e.currentTarget.style.boxShadow = '0 14px 38px rgba(0,0,0,0.35)'
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.name}
                      </div>
                      <div style={{ fontSize: 12, ...ui.muted }}>leagueId: {l.id}</div>
                    </div>
                    <span style={{ opacity: 0.75, fontWeight: 900 }}>Open →</span>
                  </Link>
                ))}

                {sortedLeagues.length === 0 && <div style={ui.empty}>No leagues yet. Create one above.</div>}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
