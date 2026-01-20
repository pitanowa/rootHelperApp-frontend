import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import PlayersPage from './pages/PlayersPage'
import GroupsPage from './pages/GroupsPage'
import GroupDetailsPage from './pages/GroupDetailsPage'
import LeaguePage from './pages/LeaguePage'
import MatchPage from './pages/MatchPage'
import HomePage from './pages/HomePage'

import { apiGet } from './api'
import { useAppCtx } from './AppContext'

type LeagueDto = { id: number; groupId: number; name: string }
type GroupDto = { id: number; name: string }

type ActiveMatchDto = {
  id: number
  status: string
  leagueId?: number
  groupId?: number
  ranked?: boolean
}

function Nav() {
  const nav = useNavigate()
  const { selectedGroupId, setSelectedGroupId, selectedLeagueId, setSelectedLeagueId } = useAppCtx()

  const [leagues, setLeagues] = useState<LeagueDto[]>([])
  const [activeMatches, setActiveMatches] = useState<ActiveMatchDto[]>([])
  const [loadingLeagues, setLoadingLeagues] = useState(false)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [groups, setGroups] = useState<GroupDto[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [leagueMap, setLeagueMap] = useState<Record<number, string>>({})


  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          setLoadingGroups(true)
          const data = await apiGet<GroupDto[]>(`/api/groups`)
          if (cancelled) return
          setGroups(data ?? [])
        } finally {
          if (!cancelled) setLoadingGroups(false)
        }
      })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const all = await apiGet<{ id: number; name: string }[]>(`/api/leagues`)
          if (cancelled) return
          setLeagueMap(Object.fromEntries((all ?? []).map((l) => [l.id, l.name])))
        } catch {
          // olać — wtedy pokażemy tylko leagueId
        }
      })()
    return () => {
      cancelled = true
    }
  }, [])

  const ui = {
    barWrap: {
      padding: 16,
      maxWidth: 1000,
      margin: '0 auto',
    } as const,

    bar: {
      position: 'relative',
      zIndex: 50,
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: 10,
      borderRadius: 18,
      border: '1px solid rgba(255,255,255,0.08)',
      background:
        'radial-gradient(900px 420px at 15% 0%, rgba(220,38,38,0.20), transparent 55%), radial-gradient(800px 360px at 90% 10%, rgba(59,130,246,0.16), transparent 60%), linear-gradient(180deg, rgba(10,10,12,0.92), rgba(16,10,12,0.88))',
      boxShadow: '0 22px 60px rgba(0,0,0,0.40), 0 0 40px rgba(220,38,38,0.08)',
    } as const,

    link: (active: boolean) =>
      ({
        padding: '12px 14px',
        borderRadius: 16,
        fontSize: 14,
        lineHeight: '16px',
        fontWeight: 1100 as any,
        textDecoration: 'none',
        border: active ? '1px solid rgba(248,113,113,0.30)' : '1px solid rgba(255,255,255,0.14)',
        background: active
          ? 'linear-gradient(135deg, rgba(220,38,38,0.30), rgba(255,255,255,0.05))'
          : 'rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.90)',
        letterSpacing: 0.2,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: active ? '0 18px 40px rgba(220,38,38,0.12)' : 'none',
        transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
        userSelect: 'none',
      }) as const,

    pill: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '1px 5px',
      borderRadius: 14,
      border: '1px solid rgba(255,255,255,0.14)',
      background: 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.90)',
      fontWeight: 900,
      height: '100%',
    } as const,

    select: {
      position: 'relative',
      zIndex: 60,
      height: 32,
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.14)',
      background: 'rgba(0,0,0,0.25)',
      color: 'rgba(255,255,255,0.92)',
      padding: '0 10px',
      fontWeight: 900,
      outline: 'none',
      cursor: 'pointer',
    } as const,

    rightGrid: {
      marginLeft: 'auto',
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gridTemplateRows: '44px 44px',
      gap: 10,
      alignItems: 'stretch',
    } as const,


    pillStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    } as const,

    button: (enabled: boolean) =>
      ({
        height: 32,
        borderRadius: 10,
        border: enabled ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255,255,255,0.10)',
        background: enabled ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.06)',
        color: enabled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.45)',
        padding: '0 10px',
        fontWeight: 1000,
        cursor: enabled ? 'pointer' : 'not-allowed',
      }) as const,

    rightHint: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.70)',
      padding: '8px 10px',
      borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(255,255,255,0.04)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
    } as const,
  }

  const linkStyle = ({ isActive }: { isActive: boolean }) => ui.link(isActive)

  useEffect(() => {
    if (!selectedGroupId) {
      setLeagues([])
      setSelectedLeagueId(null)
      return
    }

    let cancelled = false
      ; (async () => {
        try {
          setLoadingLeagues(true)
          const data = await apiGet<LeagueDto[]>(`/api/groups/${selectedGroupId}/leagues`)
          if (cancelled) return

          setLeagues(data ?? [])

          // auto-pick jeśli obecna liga nie istnieje w nowej liście
          const stillValid = (data ?? []).some((l) => l.id === selectedLeagueId)
          if (!stillValid) setSelectedLeagueId(data?.[0]?.id ?? null)
        } finally {
          if (!cancelled) setLoadingLeagues(false)
        }
      })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId])

  useEffect(() => {
    if (!selectedGroupId) {
      setActiveMatches([])
      return
    }

    let cancelled = false
      ; (async () => {
        try {
          setLoadingMatches(true)

          const qs = new URLSearchParams()
          qs.set('groupId', String(selectedGroupId))
          if (selectedLeagueId) qs.set('leagueId', String(selectedLeagueId))

          const data = await apiGet<ActiveMatchDto[]>(`/api/matches/active?${qs.toString()}`)
          if (cancelled) return
          setActiveMatches(data ?? [])
        } finally {
          if (!cancelled) setLoadingMatches(false)
        }
      })()

    return () => {
      cancelled = true
    }
  }, [selectedGroupId, selectedLeagueId])

  const newestActive = useMemo(() => activeMatches[0] ?? null, [activeMatches])

  return (
    <div style={ui.barWrap}>
      <div style={ui.bar}>
        <NavLink
          to="/"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          🏠 Home
        </NavLink>

        <NavLink
          to="/players"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          🧑‍🤝‍🧑 Players
        </NavLink>

        <NavLink
          to="/groups"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          🛡️ Groups
        </NavLink>

        {/* RIGHT SIDE (2x2 grid) */}
        <div style={ui.rightGrid}>
          {/* LEFT COLUMN: Group + League stacked */}
          <div style={{ gridColumn: 1, gridRow: 1 }}>
            <div style={ui.pill}>
              <span style={{ opacity: 0.75, fontSize: 12 }}>Group:</span>

              {loadingGroups ? (
                <span style={{ opacity: 0.55, fontSize: 12 }}>loading…</span>
              ) : groups.length === 0 ? (
                <span style={{ opacity: 0.55, fontSize: 12 }}>none</span>
              ) : (
                <select
                  style={ui.select}
                  value={selectedGroupId ?? ''}
                  onChange={(e) => {
                    const gid = e.target.value ? Number(e.target.value) : null
                    setSelectedGroupId(gid)
                    setSelectedLeagueId(null)
                    if (gid) nav(`/groups/${gid}`)
                  }}
                >
                  <option value="" disabled>
                    select…
                  </option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div style={{ gridColumn: 1, gridRow: 2 }}>
            <div style={ui.pill}>
              <span style={{ opacity: 0.75, fontSize: 12 }}>League:</span>

              {!selectedGroupId ? (
                <span style={{ opacity: 0.55, fontSize: 12 }}>select group</span>
              ) : loadingLeagues ? (
                <span style={{ opacity: 0.55, fontSize: 12 }}>loading…</span>
              ) : leagues.length === 0 ? (
                <span style={{ opacity: 0.55, fontSize: 12 }}>none</span>
              ) : (
                <select
                  style={ui.select}
                  value={selectedLeagueId ?? ''}
                  onChange={(e) => setSelectedLeagueId(e.target.value ? Number(e.target.value) : null)}
                >
                  {leagues.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Active match spans 2 rows */}
          <div style={{ gridColumn: 2, gridRow: '1 / span 2' }}>
            <div style={{ ...ui.pill, alignItems: 'center' }}>
              <span style={{ opacity: 0.75, fontSize: 12 }}>Active match:</span>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                {!selectedGroupId ? (
                  <button style={ui.button(false)} disabled>
                    select group
                  </button>
                ) : loadingMatches ? (
                  <button style={ui.button(false)} disabled>
                    loading…
                  </button>
                ) : activeMatches.length === 0 ? (
                  <button style={ui.button(false)} disabled>
                    none
                  </button>
                ) : activeMatches.length === 1 && newestActive ? (
                  <button style={ui.button(true)} onClick={() => nav(`/matches/${newestActive.id}`)}>
                    go #{newestActive.id}
                  </button>
                ) : (
                  <select
                    style={ui.select}
                    value={newestActive?.id ?? ''}
                    onChange={(e) => {
                      const id = Number(e.target.value)
                      if (id) nav(`/matches/${id}`)
                    }}
                  >
                    {activeMatches.map((m) => (
                      <option key={m.id} value={m.id}>
                        #{m.id}
                        {m.leagueId ? ` • ${leagueMap[m.leagueId] ?? `L${m.leagueId}`}` : ''}
                        {m.ranked != null ? (m.ranked ? ' • Ranked' : ' • Casual') : ''}
                      </option>
                    ))}

                  </select>
                )}
              </div>

              {/* dół — mały hint, opcjonalnie */}
              <div style={{ opacity: 0.55, fontSize: 12 }}>
                {activeMatches.length > 1 ? `${activeMatches.length} active` : ' '}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
        <Route path="/leagues/:leagueId" element={<LeaguePage />} />
        <Route path="/matches/:matchId" element={<MatchPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  )
}
