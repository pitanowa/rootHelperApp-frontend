import { useMemo, useState } from 'react'
import { LANDMARKS, lmLabel, lmDesc, type LandmarkId } from '../data/landmarks'
import Tooltip from '../components/Tooltip'

type MatchPlayerState = {
  playerId: number
  playerName: string
  score: number
  timeLeftSeconds: number
  race?: string | null
}

type Props = {
  matchId: number
  players: MatchPlayerState[]
  loading: boolean
  error: string | null
  onPick: (playerId: number, race: string) => Promise<void> | void
  onRefresh: () => void

  raceKey: (race?: string | null) => string
  raceLabel: (race?: string | null) => string
  RACE_ICON: Record<string, string>
  RACE_COLOR: Record<string, string>
  ui: any
  landmarksEnabled?: boolean
  landmarkBanned?: string | null
  landmarksRandomCount?: number | null
  landmarksDrawn?: string[]
  onSetLandmarksManual?: (picked: LandmarkId[]) => void | Promise<void>
}

export default function RacePickView(props: Props) {
  const {
    players,
    loading,
    error,
    onPick,
    onRefresh,
    raceKey,
    raceLabel,
    RACE_ICON,
    RACE_COLOR,
    ui,

    landmarksEnabled,
    landmarkBanned,
    landmarksDrawn,
    landmarksRandomCount,
    onSetLandmarksManual,
  } = props

  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(() => players[0]?.playerId ?? 0)
  const [localPickedLandmarks, setLocalPickedLandmarks] = useState<LandmarkId[]>(() => {
    const drawn = (landmarksDrawn ?? []).filter((x): x is LandmarkId =>
      LANDMARKS.some((l) => l.id === x)
    )
    return drawn.slice(0, 2)
  })

  function toggleLandmark(id: LandmarkId) {
    setLocalPickedLandmarks((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return prev // max 2
      return [...prev, id]
    })
  }

  const taken = useMemo(() => {
    const s = new Set<string>()
    for (const p of players) {
      const rk = raceKey(p.race)
      if (rk) s.add(rk)
    }
    return s
  }, [players, raceKey])

  const pool = useMemo(() => Object.keys(RACE_ICON), [RACE_ICON])

  const selectedPlayer = players.find((p) => p.playerId === selectedPlayerId) ?? players[0] ?? null

  return (
    <div style={ui.page}>
      <div style={ui.shell}>
        <div style={ui.topbar}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={ui.badge}>Race pick (no draft)</span>
            <button
              onClick={onRefresh}
              disabled={loading}
              style={ui.btn('ghost', loading)}
            >
              Refresh
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {players.map((p) => {
              const active = p.playerId === selectedPlayerId
              return (
                <button
                  key={p.playerId}
                  disabled={loading}
                  onClick={() => setSelectedPlayerId(p.playerId)}
                  style={{
                    ...ui.btn(active ? 'primary' : 'ghost', loading),
                    opacity: active ? 1 : 0.9,
                  }}
                  title={p.playerName}
                >
                  {p.playerName}
                </button>
              )
            })}
          </div>
        </div>

        {landmarksEnabled && (
          <div style={{ ...ui.card, marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 1000, letterSpacing: 0.2 }}>🏷️ Landmarks</div>
                <div style={{ opacity: 0.78, fontSize: 13, marginTop: 4 }}>
                  Banned: <b>{landmarkBanned ?? '—'}</b> • Draw: <b>{(landmarksDrawn?.length ?? 0) || landmarksRandomCount || '—'}</b>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {(landmarksDrawn ?? []).length === 0 ? (
                  <span style={ui.badge}>Not drawn yet</span>
                ) : (
                  landmarksDrawn!.map((id) => (
                    <Tooltip
                      placement="bottom"
                      content={
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 1000, opacity: 0.8, marginBottom: 6, letterSpacing: 0.25, textTransform: 'uppercase' }}>
                            {lmLabel(id)}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 850, opacity: 0.96, lineHeight: 1.35 }}>
                            {lmDesc(id)}
                          </div>
                        </div>
                      }
                    >
                      <span style={{ ...ui.badge, cursor: 'help' }}>
                        🏷️ {lmLabel(id)}
                      </span>
                    </Tooltip>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        {landmarksEnabled && (
          <div style={{ ...ui.card, marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 1000, letterSpacing: 0.2 }}>🏷️ Choose 1-2 landmarks (manual)</div>
                <div style={{ opacity: 0.78, fontSize: 13, marginTop: 4 }}>
                  Picked: <b>{localPickedLandmarks.length}/2</b>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button
                  disabled={loading || (landmarksDrawn?.length ?? 0) > 0}
                  onClick={() => setLocalPickedLandmarks([])}
                  style={ui.btn('ghost', loading || (landmarksDrawn?.length ?? 0) > 0)}
                  title={(landmarksDrawn?.length ?? 0) > 0 ? 'Already locked' : 'Clear selection'}
                >
                  🧹 Clear
                </button>

                <button
                  disabled={
                    loading ||
                    !onSetLandmarksManual ||
                    localPickedLandmarks.length === 0 ||
                    (landmarksDrawn?.length ?? 0) > 0
                  }
                  onClick={async () => {
                    if (!onSetLandmarksManual) return
                    if (localPickedLandmarks.length === 0) return
                    await onSetLandmarksManual(localPickedLandmarks)
                  }}
                  style={ui.btn(
                    'primary',
                    loading ||
                    !onSetLandmarksManual ||
                    localPickedLandmarks.length < 1 ||
                    localPickedLandmarks.length > 2 ||
                    (landmarksDrawn?.length ?? 0) > 0
                  )}
                  title={
                    (landmarksDrawn?.length ?? 0) > 0
                      ? 'Already locked'
                      : localPickedLandmarks.length < 1
                        ? 'Pick at least 1 landmark'
                        : ''
                  }
                >
                  ✅ Confirm landmarks
                </button>
              </div>
            </div>

            <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {LANDMARKS.map((lm) => {
                const picked = localPickedLandmarks.includes(lm.id)
                const alreadyLocked = (landmarksDrawn?.length ?? 0) > 0
                const disabled =
                  loading ||
                  alreadyLocked ||
                  (!picked && localPickedLandmarks.length >= 2)

                return (
                  <Tooltip
                    placement="top"
                    content={
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 1000, opacity: 0.8, marginBottom: 6, letterSpacing: 0.25, textTransform: 'uppercase' }}>
                          {lm.label}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 850, opacity: 0.96, lineHeight: 1.35 }}>
                          {lm.desc}
                        </div>
                      </div>
                    }
                    disabled={loading || alreadyLocked}
                  >
                    <button
                      disabled={disabled}
                      onClick={() => toggleLandmark(lm.id)}
                      style={ui.btn(picked ? 'primary' : 'ghost', disabled)}
                    >
                      {picked ? '✅' : '🏷️'} {lm.label}
                    </button>
                  </Tooltip>
                )
              })}
            </div>

            <div style={{ opacity: 0.78, fontSize: 13, marginTop: 10 }}>
              After confirmation, landmarks are locked for this match.
            </div>
          </div>
        )}


        {error && <div style={ui.errorBox}>Error: {error}</div>}

        <div style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {players.map((p) => {
              const rk = raceKey(p.race)
              const hex = RACE_COLOR[rk] ?? '#dc2626'
              return (
                <span key={p.playerId} style={ui.badgeStrong(hex)}>
                  {p.playerName}: <b>{raceLabel(p.race)}</b>
                </span>
              )
            })}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            {pool.map((rk) => {
              const icon = RACE_ICON[rk]
              const hex = RACE_COLOR[rk] ?? '#dc2626'

              const disabled = loading || taken.has(rk) || !selectedPlayer || !!selectedPlayer.race
              const pickedBySomeone = taken.has(rk)

              return (
                <button
                  key={rk}
                  disabled={disabled}
                  onClick={() => selectedPlayer && onPick(selectedPlayer.playerId, rk)}
                  style={{
                    ...ui.btn('race', disabled, hex),
                    padding: 14,
                    borderRadius: 18,
                    display: 'grid',
                    gap: 10,
                    justifyItems: 'center',
                    opacity: pickedBySomeone ? 0.55 : 1,
                  }}
                  title={pickedBySomeone ? 'Already picked' : `Pick ${rk}`}
                >
                  <img
                    src={icon}
                    alt={rk}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: 'contain',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: 14,
                      padding: 8,
                      border: `1px solid rgba(255,255,255,0.14)`,
                    }}
                  />
                  <div style={{ fontWeight: 1000 }}>{rk}</div>
                </button>
              )
            })}
          </div>

          <div style={{ opacity: 0.78, fontSize: 13 }}>
            Select a player, then pick a race.
            {landmarksEnabled && (landmarksDrawn?.length ?? 0) === 0
              ? ' Landmarks are required before the match can start.'
              : ' Once both players have a race, you will automatically enter the match view.'}
          </div>
        </div>
      </div>
    </div>
  )
}
