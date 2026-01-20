import type React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../api'
import { useAppCtx } from '../AppContext'

type ActiveMatchListItem = {
  id: number
  status: string // "RUNNING"
  leagueId?: number
  groupId?: number
  ranked?: boolean
}

type NamedEntity = {
  id: number
  name: string
}

type PlayerListItem = {
  id: number
  name: string
}

type StandingRow = {
  playerId: number
  playerName: string
  pointsTotal: number
  gamesPlayed: number
  wins: number
}

// =====================
// Legendary Dark UI
// =====================
const ui = {
  page: {
    maxWidth: 980,
    margin: '0 auto',
    padding: 16,
    fontFamily: 'system-ui, sans-serif',
    color: 'rgba(255,255,255,0.92)',
  } as const,

  hero: {
    borderRadius: 22,
    padding: 20,
    border: '1px solid rgba(255,255,255,0.08)',
    background:
      'radial-gradient(1200px 500px at 10% 0%, rgba(220,38,38,0.18), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(59,130,246,0.14), transparent 55%), linear-gradient(180deg, rgba(8,8,10,1), rgba(10,6,8,1))', // <- baza 100% opaque
    boxShadow: '0 22px 70px rgba(0,0,0,0.55), 0 0 60px rgba(220,38,38,0.10)',
    overflow: 'hidden',
  } as const,

  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 10px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.80)',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.3,
  } as const,

  h1: { margin: '6px 0 8px', fontSize: 34, lineHeight: 1.1, letterSpacing: 0.6 } as const,
  heroText: { fontSize: 15, opacity: 0.88, lineHeight: 1.7, maxWidth: 720, color: 'rgba(255,255,255,0.78)' } as const,

  btn: (variant: 'open' | 'ghost' | 'danger' | 'gold', disabled: boolean) =>
    ({
      padding: '10px 14px',
      borderRadius: 14,
      border:
        variant === 'danger'
          ? '1px solid rgba(248,113,113,0.35)'
          : variant === 'open'
            ? '1px solid rgba(59,130,246,0.35)'
            : variant === 'gold'
              ? '1px solid rgba(250,204,21,0.30)'
              : '1px solid rgba(255,255,255,0.14)',
      background:
        variant === 'danger'
          ? 'linear-gradient(135deg, rgba(220,38,38,0.88), rgba(127,29,29,0.88))'
          : variant === 'open'
            ? 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(99,102,241,0.92))'
            : variant === 'gold'
              ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(255,255,255,0.04))'
              : 'rgba(255,255,255,0.05)',
      textDecoration: 'none',
      color: 'rgba(255,255,255,0.92)',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'danger'
          ? '0 16px 34px rgba(220,38,38,0.22)'
          : variant === 'open'
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

  miniPanel: {
    flex: '0 1 320px',
    minWidth: 280,
    alignSelf: 'stretch',
    borderRadius: 18,
    padding: 14,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))', // <- 100% opaque
  } as const,

  step: {
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.12)',
    padding: 12,
    background: 'rgba(255,255,255,0.06)',
  } as const,

  stepTitle: { fontWeight: 1000, color: 'rgba(255,255,255,0.92)' } as const,
  stepText: { opacity: 0.78, marginTop: 4, lineHeight: 1.5, color: 'rgba(255,255,255,0.76)' } as const,

  grid: {
    marginTop: 16,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
  } as const,

  card: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))', // <- 100% opaque
    boxShadow: '0 18px 55px rgba(0,0,0,0.45), 0 0 50px rgba(220,38,38,0.08)',
    overflow: 'hidden',
  } as const,

  cardTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 10,
  } as const,

  cardTitle: { fontSize: 16, fontWeight: 1000, color: 'rgba(255,255,255,0.92)' } as const,

  openLink: {
    textDecoration: 'none',
    fontWeight: 1000,
    opacity: 0.8,
    color: 'rgba(255,255,255,0.82)',
  } as const,

  panelInner: {
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))', // <- 100% opaque
    overflow: 'hidden',
  } as const,

  scroll: {
    maxHeight: 170,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: 2,
  } as const,

  row: {
    padding: '8px 10px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    fontWeight: 1000,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'rgba(255,255,255,0.90)',
  } as const,

  subtle: { padding: 10, opacity: 0.78, color: 'rgba(255,255,255,0.72)' } as const,

  err: {
    padding: 10,
    borderTop: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.92)',
    fontWeight: 1000,
    background: 'rgba(220,38,38,0.10)',
  } as const,

  standingsHeaderMini: {
    display: 'grid',
    gridTemplateColumns: '52px 1fr 64px',
    gap: 8,
    padding: '8px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
    fontSize: 12,
    fontWeight: 1000,
    opacity: 0.75,
    color: 'rgba(255,255,255,0.72)',
    background: 'rgba(255,255,255,0.04)',
  } as const,

  standingsRowMini: {
    display: 'grid',
    gridTemplateColumns: '52px 1fr 64px',
    gap: 8,
    padding: '8px 10px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    alignItems: 'center',
    color: 'rgba(255,255,255,0.90)',
  } as const,

  rankPill: (rank: number) =>
    ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 26,
      height: 22,
      borderRadius: 999,
      padding: '0 8px',
      fontWeight: 1000,
      border: '1px solid rgba(255,255,255,0.14)',
      background:
        rank === 1
          ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(255,255,255,0.04))'
          : rank === 2
            ? 'linear-gradient(135deg, rgba(203,213,225,0.18), rgba(255,255,255,0.04))'
            : rank === 3
              ? 'linear-gradient(135deg, rgba(251,146,60,0.18), rgba(255,255,255,0.04))'
              : 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.90)',
    }) as const,

  matchLink: {
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 14,
    padding: 12,
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  tag: (variant: 'running' | 'ranked' | 'casual') =>
    ({
      fontSize: 12,
      fontWeight: 1000,
      borderRadius: 999,
      padding: '6px 10px',
      border: '1px solid rgba(255,255,255,0.12)',
      background:
        variant === 'running'
          ? 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(255,255,255,0.04))'
          : variant === 'ranked'
            ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(255,255,255,0.04))'
            : 'linear-gradient(135deg, rgba(148,163,184,0.20), rgba(255,255,255,0.04))',
      color: 'rgba(255,255,255,0.85)',
      letterSpacing: 0.2,
    }) as const,
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span style={ui.pill}>{children}</span>
}

export default function HomePage() {
  const { setSelectedGroupId, setSelectedLeagueId } = useAppCtx()

  const [players, setPlayers] = useState<PlayerListItem[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(true)
  const [playersError, setPlayersError] = useState<string | null>(null)

  const [activeMatches, setActiveMatches] = useState<ActiveMatchListItem[]>([])
  const [loadingActive, setLoadingActive] = useState(true)
  const [activeError, setActiveError] = useState<string | null>(null)

  const [leagueMap, setLeagueMap] = useState<Record<number, string>>({})
  const [groupMap, setGroupMap] = useState<Record<number, string>>({})

  const [standings, setStandings] = useState<StandingRow[]>([])
  const [standingsLeagueId, setStandingsLeagueId] = useState<number | null>(null)
  const [loadingStandings, setLoadingStandings] = useState(true)
  const [standingsError, setStandingsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadingPlayers(true)
      setPlayersError(null)
      setLoadingActive(true)
      setActiveError(null)

      try {
        const [matches, leagues, groups, playersResp] = await Promise.all([
          apiGet<ActiveMatchListItem[]>('/api/matches/active'),
          apiGet<NamedEntity[]>('/api/leagues'),
          apiGet<NamedEntity[]>('/api/groups'),
          apiGet<PlayerListItem[]>('/api/players'),
        ])

        if (cancelled) return

        setPlayers(playersResp ?? [])
        setActiveMatches(matches ?? [])

        setLeagueMap(Object.fromEntries((leagues ?? []).map((l) => [l.id, l.name])))
        setGroupMap(Object.fromEntries((groups ?? []).map((g) => [g.id, g.name])))

        const lid = leagues?.[0]?.id ?? null
        setStandingsLeagueId(lid)

        // load standings for first league (if any)
        try {
          setLoadingStandings(true)
          setStandingsError(null)
          if (lid == null) {
            setStandings([])
          } else {
            const s = await apiGet<StandingRow[]>(`/api/leagues/${lid}/standings`)
            if (!cancelled) setStandings(s ?? [])
          }
        } catch (e: any) {
          if (!cancelled) setStandingsError(e?.message ?? 'Failed to load standings')
        } finally {
          if (!cancelled) setLoadingStandings(false)
        }
      } catch (e: any) {
        if (cancelled) return
        setActiveError(e?.message ?? 'Failed to load active matches')
      } finally {
        if (cancelled) return
        setLoadingPlayers(false)
        setLoadingActive(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div style={ui.page}>
      {/* HERO */}
      <div style={ui.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 280, flex: '1 1 520px' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <Pill>🩸 ROOT League</Pill>
              <Pill>⚔️ Matchmaking</Pill>
              <Pill>🧪 Draft ras</Pill>
              <Pill>🏅 Ranked / Casual</Pill>
            </div>

            <h1 style={ui.h1}>
              Panel do prowadzenia ligi i meczów w <span style={{ whiteSpace: 'nowrap' }}>Root</span>
            </h1>

            <div style={ui.heroText}>
              Ta aplikacja pozwala szybko zarządzać graczami, grupami i rozgrywkami. Tworzysz mecze, śledzisz status, a w trakcie
              rozgrywki ogarniasz draft ras i timer — bez chaosu w notatkach i excelach.
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <Link
                to="/players"
                style={ui.btn('gold', false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                ✨ Zacznij od graczy
              </Link>

              <Link
                to="/groups"
                style={ui.btn('ghost', false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                🛡️ Przejdź do grup
              </Link>
            </div>
          </div>

          {/* mini panel */}
          <div style={ui.miniPanel}>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={ui.step}>
                <div style={ui.stepTitle}>1) Dodaj graczy</div>
                <div style={ui.stepText}>Utwórz bazę uczestników ligi.</div>
              </div>

              <div style={ui.step}>
                <div style={ui.stepTitle}>2) Zrób grupy</div>
                <div style={ui.stepText}>Organizuj graczy w zestawy do kolejki / ligi.</div>
              </div>

              <div style={ui.step}>
                <div style={ui.stepTitle}>3) Twórz mecze</div>
                <div style={ui.stepText}>Przechodź do meczu i prowadź draft + timer.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEKCJE */}
      <div style={ui.grid}>
        {/* PLAYERS */}
        <div style={ui.card}>
          <div style={ui.cardTitleRow}>
            <div style={ui.cardTitle}>Players</div>
            <Link to="/players" style={ui.openLink} title="Open full players list">
              open →
            </Link>
          </div>

          <div style={ui.panelInner}>
            <div style={ui.scroll}>
              {loadingPlayers && <div style={ui.subtle}>Loading…</div>}

              {!loadingPlayers && playersError && <div style={ui.err}>{playersError}</div>}

              {!loadingPlayers && !playersError && players.length === 0 && <div style={ui.subtle}>No players yet.</div>}

              {!loadingPlayers && !playersError && players.length > 0 && (
                <div style={{ display: 'grid' }}>
                  {players.map((p, idx) => (
                    <div
                      key={p.id}
                      style={{
                        ...ui.row,
                        borderTop: idx === 0 ? 'none' : ui.row.borderTop,
                      }}
                      title={p.name}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>
            Total: <b>{players.length}</b>
          </div>
        </div>

        {/* STANDINGS */}
        <div style={ui.card}>
          <div style={ui.cardTitleRow}>
            <div style={ui.cardTitle}>Standings</div>
            {standingsLeagueId != null && (
              <Link to={`/leagues/${standingsLeagueId}`} style={ui.openLink} title="Open full league">
                open →
              </Link>
            )}
          </div>

          <div style={ui.panelInner}>
            <div style={ui.scroll}>
              {loadingStandings && <div style={ui.subtle}>Loading…</div>}

              {!loadingStandings && standingsError && <div style={ui.err}>{standingsError}</div>}

              {!loadingStandings && !standingsError && standings.length === 0 && <div style={ui.subtle}>No standings yet.</div>}

              {!loadingStandings && !standingsError && standings.length > 0 && (
                <div style={{ display: 'grid' }}>
                  {standings.map((r, idx) => {
                    const rank = idx + 1
                    const baseBg = rank <= 3 ? 'rgba(220,38,38,0.08)' : 'transparent'
                    return (
                      <div
                        key={r.playerId}
                        style={{ ...ui.standingsRowMini, background: baseBg }}
                        title={`Games: ${r.gamesPlayed}, Wins: ${r.wins}`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(220,38,38,0.12)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = baseBg
                        }}
                      >
                        <div style={{ opacity: 0.85, fontSize: 12 }}>
                          <span style={ui.rankPill(rank)}>{rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}</span>
                        </div>
                        <div style={{ fontWeight: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.playerName}
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 1000, fontVariantNumeric: 'tabular-nums' }}>{r.pointsTotal}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>
            Tip: hover row to see games/wins.
          </div>
        </div>

        {/* MATCHES */}
        <div style={ui.card}>
          <div style={ui.cardTitleRow}>
            <div style={ui.cardTitle}>Current running matches</div>
            <span style={{ fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>live</span>
          </div>

          <div style={ui.panelInner}>
            <div style={{ padding: 12 }}>
              {loadingActive && <div style={{ opacity: 0.78, color: 'rgba(255,255,255,0.72)' }}>Loading…</div>}

              {!loadingActive && activeError && <div style={ui.err}>{activeError}</div>}

              {!loadingActive && !activeError && activeMatches.length === 0 && (
                <div style={{ opacity: 0.78, color: 'rgba(255,255,255,0.72)' }}>No active match</div>
              )}

              {!loadingActive && !activeError && activeMatches.length > 0 && (
                <div style={{ display: 'grid', gap: 10 }}>
                  {activeMatches.map((m) => (
                    <Link
                      key={m.id}
                      to={`/matches/${m.id}`}
                      style={ui.matchLink}
                      onClick={() => {
                        // ✅ ustaw context zanim przejdziesz do meczu
                        setSelectedGroupId(m.groupId ?? null)
                        setSelectedLeagueId(m.leagueId ?? null)
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.borderColor = 'rgba(220,38,38,0.18)'
                        e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.38), 0 0 40px rgba(220,38,38,0.10)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ fontWeight: 1000, color: 'rgba(255,255,255,0.92)' }}>
                          {m.leagueId != null ? leagueMap[m.leagueId] ?? 'Unknown league' : 'No league'}
                        </div>

                        <div style={{ fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>
                          {m.groupId != null ? groupMap[m.groupId] ?? 'No group' : 'No group'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <span style={ui.tag('running')}>✅ RUNNING</span>
                        {m.ranked != null && (
                          <span style={ui.tag(m.ranked ? 'ranked' : 'casual')}>{m.ranked ? '🏅 Ranked' : '🍻 Casual'}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>
            Tip: click a running match to continue.
          </div>
        </div>
      </div>
    </div>
  )
}
