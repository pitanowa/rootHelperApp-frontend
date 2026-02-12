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

const LANDMARKS = [
  { id: 'lost_city', label: 'Lost City' },
  { id: 'black_market', label: 'Black Market' },
  { id: 'legendary_forge', label: 'Legendary Forge' },
  { id: 'tower', label: 'The Tower' },
  { id: 'ferry', label: 'Ferry' },
  { id: 'bandit_gangs', label: 'Bandit Gangs' },
] as const

type LandmarkId = (typeof LANDMARKS)[number]['id']

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
    boxShadow: '0 28px 80px rgba(0,0,0,0.45), 0 0 60px rgba(220,38,38,0.10)',
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
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
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
        background: 'linear-gradient(135deg, rgba(220,38,38,0.90), rgba(127,29,29,0.88))',
        color: 'rgba(255,255,255,0.95)',
        boxShadow: '0 16px 34px rgba(220,38,38,0.22)',
      },
      ok: {
        background: 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(255,255,255,0.04))',
        color: 'rgba(255,255,255,0.88)',
      },
      info: {
        background: 'linear-gradient(135deg, rgba(59,130,246,0.24), rgba(255,255,255,0.04))',
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
      border: isCurrent ? '1px solid rgba(220,38,38,0.25)' : '1px solid rgba(255,255,255,0.10)',
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

  // ✅ CONFIRM MODAL
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.62)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    zIndex: 2147483647,
  } as const,

  modal: {
    width: 'min(640px, 100%)',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
    boxShadow: '0 30px 90px rgba(0,0,0,0.60), 0 0 70px rgba(220,38,38,0.10)',
    padding: 16,
  } as const,

  modalTitle: {
    fontSize: 18,
    fontWeight: 1000,
    letterSpacing: 0.2,
    marginBottom: 6,
    color: 'rgba(255,255,255,0.92)',
  } as const,

  modalBody: {
    fontSize: 14,
    opacity: 0.86,
    lineHeight: 1.6,
    marginBottom: 12,
    color: 'rgba(255,255,255,0.80)',
  } as const,

  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    flexWrap: 'wrap',
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
  onResetPick,
  landmarksEnabled,
  landmarksBanned,
  landmarksRandomCount,
  landmarksDrawn,
  onLandmarksBan,

}: {
  matchId: number
  draft: DraftState
  players: MatchPlayerState[]
  loading: boolean
  error: string | null
  onPick: (playerId: number, race: string) => void | Promise<void>
  onSetBans?: (bans: string[]) => void | Promise<void>
  onRefresh?: () => void
  onResetPick?: () => Promise<any>
  landmarksEnabled?: boolean
  landmarksBanned?: string | null
  landmarksRandomCount?: number | null
  landmarksDrawn?: string[]
  onLandmarksBan?: (banned: string, randomCount: 1 | 2) => void | Promise<void>


}) {
  const playersById = useMemo(() => {
    const m = new Map<number, MatchPlayerState>()
    for (const p of players) m.set(p.playerId, p)
    return m
  }, [players])

  const totalPlayers = players.length
  const drawCount = totalPlayers + 1
  const maxBans = Math.max(0, ALL_RACES.length - drawCount)
  const maxVagabondCopies = totalPlayers === 6 ? 2 : 1
  const canBanSecondVagabond = maxVagabondCopies === 2

  const [localBans, setLocalBans] = useState<string[]>(draft.bannedRaces ?? [])
  const [localLandmarkBanned, setLocalLandmarkBanned] = useState<string>('')
  const [localLandmarkRandomCount, setLocalLandmarkRandomCount] = useState<1 | 2>(1)

  useEffect(() => {
    if (landmarksBanned) setLocalLandmarkBanned(landmarksBanned)
    if (landmarksRandomCount === 1 || landmarksRandomCount === 2) setLocalLandmarkRandomCount(landmarksRandomCount)
  }, [landmarksBanned, landmarksRandomCount])

  useEffect(() => {
    setLocalBans(draft.bannedRaces ?? [])
  }, [draft.bannedRaces, draft.matchId, draft.phase])

  const vagabondBanCount = useMemo(() => localBans.filter((r) => r === VAGABOND).length, [localBans])
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
  const bansValid = bansCount <= maxBans

  // ✅ confirm przed OSTATNIM pickiem
  const [confirmLastPickOpen, setConfirmLastPickOpen] = useState(false)
  const [pendingPick, setPendingPick] = useState<{ playerId: number; race: string } | null>(null)

  const isLastPick =
    draft.phase === 'PICK' &&
    draft.status === 'DRAFTING' &&
    remainingPicks === 1 &&
    draft.currentPlayerId != null


  // ✅ CONFIRM FINISH
  const [finishOpen, setFinishOpen] = useState(false)
  const [finishShownOnce, setFinishShownOnce] = useState(false)

  // pokaż modal, kiedy backend zgłosi FINISHED (np. po ostatnim picku)
  useEffect(() => {
    if (draft.phase !== 'PICK') return
    if (draft.status !== 'FINISHED') return
    if (finishShownOnce) return
    setFinishShownOnce(true)
    setFinishOpen(true)
  }, [draft.phase, draft.status, finishShownOnce])

  function toggleBan(race: string) {
    if (draft.phase !== 'BAN') return
    if (draft.status !== 'DRAFTING') return

    if (race === VAGABOND) {
      // <6 graczy → max 1 Vagabond
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
    if (!canBanSecondVagabond) return
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
            {draft.status === 'DRAFTING' ? <Badge variant="hot" text="DRAFTING" /> : <Badge variant="ghost" text="FINISHED" />}
            {draft.phase === 'BAN' ? <Badge variant="info" text="BAN" /> : <Badge variant="info" text="PICK" />}

            {onRefresh && (
              <button
                onClick={async () => {
                  if (draft.phase === 'PICK' && draft.status === 'DRAFTING' && onResetPick) {
                    await onResetPick()
                  }
                  onRefresh()
                }}
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

        {/* ✅ CONFIRM LAST PICK MODAL (pokazuje się zanim draft skończy się na backendzie) */}
        {confirmLastPickOpen && pendingPick && (
          <div style={ui.overlay}>
            <div style={ui.modal}>
              <div style={ui.modalTitle}>Ostatni pick</div>

              <div style={ui.modalBody}>
                To jest <b>ostatni pick</b>. Po nim draft zostanie zakończony i przejdziesz dalej do meczu.
                <div style={{ marginTop: 10, opacity: 0.9 }}>
                  Wybrana rasa: <b>{raceLabel(pendingPick.race)}</b>
                </div>
              </div>

              <div style={ui.modalFooter}>
                <button
                  style={ui.btn('ghost', loading)}
                  disabled={loading}
                  onClick={() => {
                    setConfirmLastPickOpen(false)
                    setPendingPick(null)
                  }}
                >
                  Anuluj
                </button>

                <button
                  style={ui.btn('open', loading)}
                  disabled={loading}
                  onClick={async () => {
                    try {
                      await onPick(pendingPick.playerId, pendingPick.race)
                    } finally {
                      setConfirmLastPickOpen(false)
                      setPendingPick(null)
                      onRefresh?.()
                    }
                  }}
                >
                  Zakończ draft →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ FINISH CONFIRM MODAL */}
        {finishOpen && (
          <div style={ui.overlay}>
            <div style={ui.modal}>
              <div style={ui.modalTitle}>Draft zakończony</div>
              <div style={ui.modalBody}>
                Ostatni pick został wykonany i draft jest <b>FINISHED</b>. Kliknij <b>Przejdź dalej</b>, aby wrócić do meczu.
              </div>
              <div style={ui.modalFooter}>
                <button style={ui.btn('ghost', loading)} disabled={loading} onClick={() => setFinishOpen(false)}>
                  Zostań tutaj
                </button>
                <button
                  style={ui.btn('open', loading)}
                  disabled={loading}
                  onClick={() => {
                    setFinishOpen(false)
                    // parent i tak po statusie FINISHED wyrzuci z draftu (BLOCKING DRAFT VIEW) na MatchPage
                    onRefresh?.()
                  }}
                >
                  Przejdź dalej →
                </button>
              </div>
            </div>
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
                <button onClick={clearBans} disabled={loading || draft.status !== 'DRAFTING'} style={ui.btn('ghost', loading || draft.status !== 'DRAFTING')}>
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
                    {isVaga && (
                      <span style={{ fontSize: 12, fontWeight: 1000 }}>
                        {vagabondBanCount}/{maxVagabondCopies}
                      </span>
                    )}
                  </button>
                )
              })}

              {canBanSecondVagabond && (
                <button
                  onClick={addSecondVagabondBan}
                  disabled={loading || draft.status !== 'DRAFTING' || !canAddMoreBans || vagabondBanCount >= 2}
                  style={ui.raceTile('neutral', loading || draft.status !== 'DRAFTING' || !canAddMoreBans || vagabondBanCount >= 2)}
                  title="Add second VAGABOND ban (ban 2 of 2 copies)"
                >
                  🗡️ +1 VAGABOND ban
                </button>
              )}

            </div>

            {/* LANDMARKS (BAN PHASE) */}
            {landmarksEnabled && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                <div style={ui.cardHeader}>
                  <div>
                    <h2 style={ui.h2}>Landmarks</h2>
                    <div style={ui.sub}>Select 1 landmark to exclude from random draw, then choose how many to draw.</div>
                  </div>

                  <div style={ui.rightBadges}>
                    {landmarksBanned && landmarksDrawn?.length ? (
                      <Badge variant="ok" text={`Locked: ${landmarksBanned} • draw ${landmarksDrawn.length}`} />
                    ) : (
                      <Badge variant="ghost" text="Not set" />
                    )}
                  </div>
                </div>

                {/* pick banned landmark */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {LANDMARKS.map((lm) => {
                    const picked = localLandmarkBanned === lm.id
                    const disabled = loading || draft.status !== 'DRAFTING'

                    return (
                      <button
                        key={lm.id}
                        disabled={disabled}
                        onClick={() => setLocalLandmarkBanned(lm.id)}
                        style={ui.raceTile(picked ? 'banned' : 'neutral', disabled)}
                        title={lm.label}
                      >
                        {picked ? '🚫' : '🏷️'} {lm.label}
                      </button>
                    )
                  })}
                </div>

                {/* choose random count */}
                <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={ui.sub}>Random draw:</span>

                  <button
                    disabled={loading || draft.status !== 'DRAFTING'}
                    onClick={() => setLocalLandmarkRandomCount(1)}
                    style={ui.btn('ghost', loading || draft.status !== 'DRAFTING')}
                  >
                    {localLandmarkRandomCount === 1 ? '✅ ' : ''}1 landmark
                  </button>

                  <button
                    disabled={loading || draft.status !== 'DRAFTING'}
                    onClick={() => setLocalLandmarkRandomCount(2)}
                    style={ui.btn('ghost', loading || draft.status !== 'DRAFTING')}
                  >
                    {localLandmarkRandomCount === 2 ? '✅ ' : ''}2 landmarks
                  </button>

                  <div style={{ marginLeft: 'auto' }}>
                    <button
                      onClick={async () => {
                        if (!onLandmarksBan) return
                        if (!localLandmarkBanned) return
                        await onLandmarksBan(localLandmarkBanned, localLandmarkRandomCount)
                        onRefresh?.()
                      }}
                      disabled={
                        loading ||
                        draft.status !== 'DRAFTING' ||
                        !onLandmarksBan ||
                        !localLandmarkBanned ||
                        !!(landmarksBanned && (landmarksDrawn?.length ?? 0) > 0)
                      }
                      style={ui.btn('gold', loading || draft.status !== 'DRAFTING' || !onLandmarksBan || !localLandmarkBanned)}
                      title={
                        landmarksBanned && (landmarksDrawn?.length ?? 0) > 0
                          ? 'Landmarks already locked for this match'
                          : !localLandmarkBanned
                            ? 'Select a landmark to ban first'
                            : ''
                      }
                    >
                      🏷️ Confirm landmarks
                    </button>
                  </div>
                </div>

                {localLandmarkBanned ? (
                  <div style={ui.hint}>
                    Banned: <b>{localLandmarkBanned}</b> • Will randomly draw <b>{localLandmarkRandomCount}</b> from remaining.
                  </div>
                ) : (
                  <div style={ui.hint}>Pick exactly one landmark above to exclude it from the draw.</div>
                )}
              </div>
            )}

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={ui.sub}>Selected bans are sent as a list. VAGABOND can appear twice to ban both copies.</div>

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
            {landmarksEnabled && (
              <div style={ui.card}>
                <div style={ui.cardHeader}>
                  <div>
                    <h2 style={ui.h2}>Landmarks drawn</h2>
                    <div style={ui.sub}>
                      Banned: <b>{landmarksBanned ?? '—'}</b> • Draw count: <b>{landmarksDrawn?.length ?? landmarksRandomCount ?? '—'}</b>
                    </div>
                  </div>
                  <div style={ui.rightBadges}>
                    <Badge variant="info" text={`Drawn: ${(landmarksDrawn ?? []).length}`} />
                  </div>
                </div>

                {(landmarksDrawn ?? []).length === 0 ? (
                  <div style={ui.sub}>Not drawn yet.</div>
                ) : (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {landmarksDrawn!.map((id) => (
                      <span key={id} style={ui.badge('ghost')}>
                        🏷️ {id}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}


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
                          if (draft.currentPlayerId == null) return

                          // ✅ jeśli to ostatni pick – pokaż confirm zanim wyślesz do backendu
                          if (isLastPick) {
                            setPendingPick({ playerId: draft.currentPlayerId, race })
                            setConfirmLastPickOpen(true)
                            return
                          }

                          onPick(draft.currentPlayerId, race)
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

              <div style={ui.hint}>Tip: click a race to assign it to the current player. (Backend enforces turn order.)</div>
            </div>

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
