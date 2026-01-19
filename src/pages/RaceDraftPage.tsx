import { RACE_LABEL } from '../constants/races'
import { useEffect, useMemo, useState } from 'react'
import cats from '../assets/races/root_cats.png'
import dynasty from '../assets/races/root_dynasty.png'
import alliance from '../assets/races/root_alliance.png'
import crows from '../assets/races/root_crows.png'
import vaga from '../assets/races/root_vaga.png'
import priests from '../assets/races/root_priests.png'
import riverfolk from '../assets/races/root_riverfolk.png'
import knights from '../assets/races/root_knights.png'
import kingdom from '../assets/races/root_kingdom.png'
import rats from '../assets/races/root_rats.png'

const RACE_ICON: Record<string, string> = {
  CATS: cats,
  EAGLES: dynasty,
  ALLIANCE: alliance,
  CROWS: crows,
  VAGABOND: vaga,
  LIZARDS: priests,
  OTTERS: riverfolk,
  BADGERS: knights,
  MOLES: kingdom,
  RATS: rats,
}

// kanoniczna lista ras (musi się zgadzać z backendem)
const ALL_RACES = Object.keys(RACE_ICON)
const VAGABOND = 'VAGABOND'
const raceLabel = (race?: string | null) => (race ? RACE_LABEL[race] ?? race : '—')


export type MatchPlayerState = {
  playerId: number
  playerName: string
  race?: string | null
}

export type DraftAssignment = {
  playerId: number
  race: string
}

export type DraftState = {
  matchId: number
  status: 'DRAFTING' | 'FINISHED'
  phase: 'BAN' | 'PICK'
  currentPickIndex: number
  currentPlayerId: number | null
  pickOrder: number[]
  pool: string[]
  bannedRaces: string[]
  assignments: DraftAssignment[]
}

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
      'radial-gradient(900px 400px at 20% 0%, rgba(220,38,38,0.22), transparent 55%), radial-gradient(800px 360px at 85% 10%, rgba(59,130,246,0.18), transparent 60%), linear-gradient(180deg, rgba(10,10,12,0.92), rgba(16,10,12,0.88))',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow:
      '0 28px 80px rgba(0,0,0,0.45), 0 0 60px rgba(220,38,38,0.10)',
    backdropFilter: 'blur(10px)',
  } as const,

  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 12,
  } as const,

  title: {
    margin: 0,
    letterSpacing: 0.6,
    fontSize: 26,
    fontWeight: 1000,
  } as const,

  metaLine: {
    marginTop: 6,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
  } as const,

  rightBadges: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
  } as const,

  // Cards / Sections
  card: {
    marginTop: 12,
    borderRadius: 18,
    padding: 14,
    border: '1px solid rgba(255,255,255,0.10)',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
    boxShadow: '0 18px 55px rgba(0,0,0,0.35)',
  } as const,

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 12,
  } as const,

  h2: {
    margin: 0,
    fontSize: 18,
    letterSpacing: 0.4,
    color: 'rgba(255,255,255,0.92)',
  } as const,

  sub: {
    fontSize: 12,
    opacity: 0.78,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 4,
  } as const,

  // Badges
  badge: (variant: 'hot' | 'ghost' | 'ok' | 'info') => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '7px 10px',
      borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.12)',
      fontWeight: 1000,
      fontSize: 12,
      letterSpacing: 0.4,
      userSelect: 'none',
    } as const

    const map = {
      hot: {
        background:
          'linear-gradient(135deg, rgba(220,38,38,0.90), rgba(127,29,29,0.88))',
        color: 'rgba(255,255,255,0.95)',
        boxShadow: '0 16px 34px rgba(220,38,38,0.22)',
      },
      ok: {
        background:
          'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(255,255,255,0.04))',
        color: 'rgba(255,255,255,0.88)',
      },
      info: {
        background:
          'linear-gradient(135deg, rgba(59,130,246,0.24), rgba(255,255,255,0.04))',
        color: 'rgba(255,255,255,0.88)',
      },
      ghost: {
        background: 'rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.78)',
        opacity: 0.9,
      },
    } as const

    return { ...base, ...(map[variant] as any) }
  },

  // Buttons
  btn: (variant: 'open' | 'danger' | 'ghost' | 'gold', disabled: boolean) =>
    ({
      padding: '10px 12px',
      borderRadius: 12,
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

  // Race tiles (BAN / POOL)
  tileGrid: {
    marginTop: 12,
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  } as const,

  raceTile: (state: 'neutral' | 'banned' | 'pick', disabled: boolean) =>
    ({
      padding: '10px 12px',
      borderRadius: 16,
      border:
        state === 'banned'
          ? '1px solid rgba(248,113,113,0.35)'
          : state === 'pick'
            ? '1px solid rgba(59,130,246,0.35)'
            : '1px solid rgba(255,255,255,0.14)',
      background:
        state === 'banned'
          ? 'linear-gradient(180deg, rgba(220,38,38,0.18), rgba(255,255,255,0.04))'
          : state === 'pick'
            ? 'linear-gradient(180deg, rgba(59,130,246,0.18), rgba(255,255,255,0.04))'
            : 'rgba(255,255,255,0.05)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      boxShadow:
        state === 'banned'
          ? '0 18px 45px rgba(0,0,0,0.34), 0 0 40px rgba(220,38,38,0.10)'
          : '0 16px 40px rgba(0,0,0,0.28)',
      transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
    }) as const,

  icon32: { width: 34, height: 34 } as const,

  hint: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.78,
    color: 'rgba(255,255,255,0.72)',
  } as const,

  // Players list
  playerRow: (isCurrent: boolean) =>
    ({
      borderRadius: 16,
      padding: 12,
      border: isCurrent
        ? '1px solid rgba(220,38,38,0.25)'
        : '1px solid rgba(255,255,255,0.10)',
      background: isCurrent
        ? 'linear-gradient(180deg, rgba(220,38,38,0.14), rgba(255,255,255,0.03))'
        : 'rgba(255,255,255,0.04)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      boxShadow: isCurrent ? '0 20px 55px rgba(0,0,0,0.36)' : '0 16px 40px rgba(0,0,0,0.28)',
      transition: 'transform 120ms ease, box-shadow 120ms ease',
    }) as const,

  playerLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    flexWrap: 'wrap',
  } as const,

  playerName: {
    fontWeight: 1000,
    letterSpacing: 0.2,
    color: 'rgba(255,255,255,0.92)',
  } as const,

  playerRight: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
  } as const,

  racePill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.05)',
  } as const,

  err: {
    padding: 12,
    borderRadius: 14,
    border: '1px solid rgba(248,113,113,0.40)',
    background: 'rgba(220,38,38,0.12)',
    marginTop: 12,
    color: 'rgba(255,255,255,0.9)',
  } as const,
}

function Badge({ text, variant }: { text: string; variant: 'hot' | 'ghost' | 'ok' | 'info' }) {
  return <span style={ui.badge(variant)}>{text}</span>
}

export default function RaceDraftView({
  matchId,
  draft,
  players,
  loading,
  error,
  onPick,
  onSetBans,
  onRefresh,
}: {
  matchId: number
  draft: DraftState
  players: MatchPlayerState[]
  loading: boolean
  error: string | null
  onPick: (playerId: number, race: string) => void
  onSetBans?: (bans: string[]) => void
  onRefresh?: () => void
}) {
  const playersById = useMemo(() => {
    const m = new Map<number, MatchPlayerState>()
    for (const p of players) m.set(p.playerId, p)
    return m
  }, [players])

  const totalPlayers = players.length
  const drawCount = totalPlayers + 1
  const maxBans = Math.max(0, ALL_RACES.length - drawCount)

  const [localBans, setLocalBans] = useState<string[]>(draft.bannedRaces ?? [])

  useEffect(() => {
    setLocalBans(draft.bannedRaces ?? [])
  }, [draft.bannedRaces, draft.matchId, draft.phase])

  const vagabondBanCount = useMemo(
    () => localBans.filter((r) => r === VAGABOND).length,
    [localBans],
  )

  const nonVagabondBans = useMemo(() => new Set(localBans.filter((r) => r !== VAGABOND)), [localBans])

  const bansCount = localBans.length
  const bansLeft = Math.max(0, maxBans - bansCount)

  const currentPlayerId = draft.currentPlayerId
  const currentPlayer = currentPlayerId != null ? playersById.get(currentPlayerId) : null

  const assignedCount = useMemo(() => players.filter((p) => !!p.race).length, [players])
  const remainingPicks = Math.max(0, totalPlayers - assignedCount)

  const order = useMemo(() => {
    if (draft.pickOrder && draft.pickOrder.length) return draft.pickOrder
    return [...players].sort((a, b) => a.playerName.localeCompare(b.playerName)).map((p) => p.playerId)
  }, [draft.pickOrder, players])

  const canAddMoreBans = bansCount < maxBans

  function toggleBan(race: string) {
    if (draft.phase !== 'BAN') return
    if (draft.status !== 'DRAFTING') return

    if (race === VAGABOND) {
      if (vagabondBanCount > 0) {
        const idx = localBans.findIndex((r) => r === VAGABOND)
        if (idx >= 0) {
          const next = localBans.slice()
          next.splice(idx, 1)
          setLocalBans(next)
        }
      } else {
        if (!canAddMoreBans) return
        setLocalBans([...localBans, VAGABOND])
      }
      return
    }

    const isBanned = nonVagabondBans.has(race)
    if (isBanned) {
      setLocalBans(localBans.filter((r) => r !== race))
    } else {
      if (!canAddMoreBans) return
      setLocalBans([...localBans, race])
    }
  }

  function addSecondVagabondBan() {
    if (draft.phase !== 'BAN') return
    if (draft.status !== 'DRAFTING') return
    if (!canAddMoreBans) return
    if (vagabondBanCount >= 2) return
    setLocalBans([...localBans, VAGABOND])
  }

  function clearBans() {
    if (draft.phase !== 'BAN') return
    if (draft.status !== 'DRAFTING') return
    setLocalBans([])
  }

  const bansValid = bansCount <= maxBans

  return (
    <div style={ui.page}>
      <div style={ui.backdrop}>
        <div style={ui.topRow}>
          <div>
            <h1 style={ui.title}>Race draft</h1>
            <div style={ui.metaLine}>
              🩸 match #{matchId} • {draft.status} • phase {draft.phase}
              {draft.phase === 'PICK' ? ` • remaining picks ${remainingPicks}` : ''}
            </div>
          </div>

          <div style={ui.rightBadges}>
            {draft.status === 'DRAFTING' ? (
              <Badge variant="hot" text="DRAFTING" />
            ) : (
              <Badge variant="ghost" text="FINISHED" />
            )}

            {draft.phase === 'BAN' ? <Badge variant="info" text="BAN" /> : <Badge variant="info" text="PICK" />}

            {onRefresh && (
              <button
                onClick={onRefresh}
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
            )}
          </div>
        </div>

        {error && (
          <div style={ui.err}>
            <b>Error:</b> {error}
          </div>
        )}

        {/* BAN PHASE */}
        {draft.phase === 'BAN' && (
          <div style={ui.card}>
            <div style={ui.cardHeader}>
              <div>
                <h2 style={ui.h2}>Ban phase</h2>
                <div style={ui.sub}>
                  You can ban up to <b>{maxBans}</b> (must leave <b>{drawCount}</b> races for the draft pool).
                </div>
              </div>

              <div style={ui.rightBadges}>
                <Badge variant="ghost" text={`Bans: ${bansCount}/${maxBans}`} />
                <Badge variant="ghost" text={`Left: ${bansLeft}`} />
                <button
                  onClick={clearBans}
                  disabled={loading || draft.status !== 'DRAFTING'}
                  style={ui.btn('ghost', loading || draft.status !== 'DRAFTING')}
                >
                  🧹 Clear
                </button>
              </div>
            </div>

            <div style={ui.tileGrid}>
              {ALL_RACES.map((race) => {
                const isVaga = race === VAGABOND
                const isBanned = isVaga ? vagabondBanCount > 0 : nonVagabondBans.has(race)
                const disabledAdd = !isBanned && !canAddMoreBans
                const disabled = loading || draft.status !== 'DRAFTING' || disabledAdd

                return (
                  <button
                    key={race}
                    onClick={() => toggleBan(race)}
                    disabled={disabled}
                    title={
                      isVaga
                        ? `VAGABOND ban count: ${vagabondBanCount}/2 (click toggles 0<->1; use +1 for second ban)`
                        : raceLabel(race)
                    }
                    style={ui.raceTile(isBanned ? 'banned' : 'neutral', disabled)}
                    onMouseEnter={(e) => {
                      if (disabled) return
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <img src={RACE_ICON[race]} alt={race} style={ui.icon32} />
                    {isVaga && <span style={{ fontSize: 12, fontWeight: 1000 }}>{vagabondBanCount}/2</span>}
                  </button>
                )
              })}

              <button
                onClick={addSecondVagabondBan}
                disabled={loading || draft.status !== 'DRAFTING' || !canAddMoreBans || vagabondBanCount >= 2}
                style={ui.raceTile('neutral', loading || draft.status !== 'DRAFTING' || !canAddMoreBans || vagabondBanCount >= 2)}
                title="Add second VAGABOND ban (ban 2 of 2 copies)"
              >
                🗡️ +1 VAGABOND ban
              </button>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={ui.sub}>
                Selected bans are sent as a list. VAGABOND can appear twice to ban both copies.
              </div>

              <button
                onClick={() => onSetBans?.(localBans)}
                disabled={loading || draft.status !== 'DRAFTING' || !bansValid || !onSetBans}
                style={ui.btn('danger', loading || draft.status !== 'DRAFTING' || !bansValid || !onSetBans)}
                title={!onSetBans ? 'Provide onSetBans callback in parent' : ''}
              >
                🩸 Confirm bans & start draft
              </button>
            </div>
          </div>
        )}

        {/* PICK PHASE */}
        {draft.phase === 'PICK' && (
          <>
            {/* Current picker */}
            <div style={ui.card}>
              <div style={ui.cardHeader}>
                <div>
                  <div style={ui.sub}>Now picking</div>
                  <div style={{ fontSize: 20, fontWeight: 1000, letterSpacing: 0.3 }}>
                    {currentPlayer ? currentPlayer.playerName : currentPlayerId != null ? `playerId=${currentPlayerId}` : '—'}
                  </div>
                </div>

                <div style={ui.rightBadges}>
                  <Badge variant="ghost" text={`Pool: ${draft.pool.length}`} />
                  <Badge variant="ghost" text={`Assigned: ${assignedCount}/${totalPlayers}`} />
                </div>
              </div>
            </div>

            {/* Pool */}
            <div style={ui.card}>
              <h2 style={ui.h2}>Available races</h2>

              {draft.pool.length === 0 ? (
                <div style={ui.sub}>No races in pool.</div>
              ) : (
                <div style={ui.tileGrid}>
                  {draft.pool.map((race, idx) => {
                    const disabled = loading || draft.status !== 'DRAFTING' || draft.currentPlayerId == null
                    return (
                      <button
                        key={`${race}-${idx}`}
                        onClick={() => {
                          if (draft.currentPlayerId != null) onPick(draft.currentPlayerId, race)
                        }}
                        disabled={disabled}
                        title={raceLabel(race)}
                        style={ui.raceTile('pick', disabled)}
                        onMouseEnter={(e) => {
                          if (disabled) return
                          e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        <img src={RACE_ICON[race]} alt={race} style={ui.icon32} />
                      </button>
                    )
                  })}
                </div>
              )}

              <div style={ui.hint}>
                Tip: click a race to assign it to the current player. (Backend enforces turn order.)
              </div>
            </div>

            {/* Pick order + assignments */}
            <div style={ui.card}>
              <h2 style={ui.h2}>Players</h2>

              <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                {order.map((pid, idx) => {
                  const p = playersById.get(pid)
                  const isCurrent = pid === draft.currentPlayerId && draft.status === 'DRAFTING'
                  const race = p?.race ?? null

                  return (
                    <div
                      key={pid}
                      style={ui.playerRow(isCurrent)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <div style={ui.playerLeft}>
                        <div style={ui.playerName}>
                          {idx + 1}. {p?.playerName ?? `playerId=${pid}`}
                        </div>
                        {isCurrent && <Badge variant="hot" text="PICKING" />}
                      </div>

                      <div style={ui.playerRight}>
                        <Badge variant="ghost" text={raceLabel(race)} />
                        {race ? (
                          <span title={raceLabel(race)} style={ui.racePill}>
                            <img src={RACE_ICON[race]} alt={raceLabel(race)} style={{ width: 22, height: 22 }} />
                          </span>
                        ) : (
                          <Badge variant="ghost" text="—" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
