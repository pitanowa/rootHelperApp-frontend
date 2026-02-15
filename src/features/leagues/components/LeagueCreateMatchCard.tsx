import type { Player } from '../../../types'
import type { LeaguePageUi } from '../leaguePageUi'

type Props = {
  players: Player[]
  selected: number[]
  timerSeconds: number
  ranked: boolean
  landmarksEnabled: boolean
  raceDraftEnabled: boolean
  loading: boolean
  onTimerChange: (next: number) => void
  onRankedChange: (next: boolean) => void
  onLandmarksEnabledChange: (next: boolean) => void
  onRaceDraftEnabledChange: (next: boolean) => void
  onTogglePlayer: (id: number) => void
  onCreateMatch: () => void | Promise<void>
  ui: LeaguePageUi
}

export default function LeagueCreateMatchCard({
  players,
  selected,
  timerSeconds,
  ranked,
  landmarksEnabled,
  raceDraftEnabled,
  loading,
  onTimerChange,
  onRankedChange,
  onLandmarksEnabledChange,
  onRaceDraftEnabledChange,
  onTogglePlayer,
  onCreateMatch,
  ui,
}: Props) {
  return (
    <div style={ui.card}>
      <div style={ui.headerRow}>
        <div>
          <h2 style={ui.title}>Create match</h2>
          <div style={ui.subtitle}>Choose players, set timer and mode, then start.</div>
        </div>

        <div style={ui.badge}>
          Selected: <span style={{ fontWeight: 1000 }}>{selected.length}</span>
        </div>
      </div>

      <div style={ui.controlsWrap}>
        <div style={ui.field}>
          <span style={ui.labelSmall}>Timer (sec)</span>
          <input
            type="number"
            min={60}
            value={timerSeconds}
            onChange={(e) => onTimerChange(Number(e.target.value))}
            disabled={loading}
            style={ui.input}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)'
              e.currentTarget.style.boxShadow = '0 18px 40px rgba(220,38,38,0.18)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(209,110,122,0.3)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          />
        </div>

        <div style={ui.segment} aria-label="match mode">
          <button
            onClick={() => onRankedChange(true)}
            disabled={loading}
            style={{ ...ui.segBtn(ranked), opacity: loading ? 0.6 : 1 }}
            onMouseEnter={(e) => {
              if (loading) return
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            RANKED
          </button>

          <button
            onClick={() => onRankedChange(false)}
            disabled={loading}
            style={{ ...ui.segBtn(!ranked), opacity: loading ? 0.6 : 1 }}
            onMouseEnter={(e) => {
              if (loading) return
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            CASUAL
          </button>
        </div>

        <label style={ui.switch} title="Enable Landmarks setup flow">
          <input
            type="checkbox"
            checked={landmarksEnabled}
            onChange={(e) => onLandmarksEnabledChange(e.target.checked)}
            disabled={loading}
            style={ui.checkbox}
          />
          <span style={{ fontWeight: 900 }}>Landmarks</span>
        </label>

        <label style={ui.switch}>
          <input
            type="checkbox"
            checked={raceDraftEnabled}
            onChange={(e) => onRaceDraftEnabledChange(e.target.checked)}
            disabled={loading}
            style={ui.checkbox}
          />
          <span style={{ fontWeight: 900 }}>Draft</span>
        </label>

        <button
          onClick={onCreateMatch}
          disabled={loading || selected.length < 2}
          title={selected.length < 2 ? 'Select at least 2 players' : undefined}
          style={ui.createBtn(!loading && selected.length >= 2)}
          onMouseEnter={(e) => {
            if (loading || selected.length < 2) return
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Create match
        </button>
      </div>

      <div style={ui.list}>
        {players.map((p) => {
          const isSelected = selected.includes(p.id)
          const initials = (p.name || '?')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((x) => x[0]?.toUpperCase())
            .join('')

          return (
            <label
              key={p.id}
              style={ui.playerCard(isSelected)}
              onMouseEnter={(e) => {
                if (loading) return
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onTogglePlayer(p.id)}
                disabled={loading}
                style={ui.checkbox}
              />

              <div style={ui.avatar} aria-hidden>
                {initials || 'P'}
              </div>

              <div style={{ display: 'grid', gap: 2 }}>
                <div style={ui.playerName}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{isSelected ? 'Selected' : 'Tap to select'}</div>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
