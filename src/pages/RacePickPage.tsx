import { useMemo, useState } from 'react'

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
  } = props

  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(() => players[0]?.playerId ?? 0)

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
            Select a player, then pick a race. Once both players have a race, you will automatically enter the match view.
          </div>
        </div>
      </div>
    </div>
  )
}
