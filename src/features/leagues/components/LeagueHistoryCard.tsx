import { Link } from 'react-router-dom'
import type { LeaguePageUi } from '../leaguePageUi'
import type { MatchListItem } from '../types'

type Props = {
  matches: MatchListItem[]
  loading: boolean
  summaryLoading: boolean
  onOpenSummary: (matchId: number) => void | Promise<void>
  onUpdateMatchRanked: (matchId: number, rankedNext: boolean) => void | Promise<void>
  onRenameMatch: (matchId: number, currentName: string | null | undefined) => void | Promise<void>
  onDeleteMatch: (matchId: number) => void | Promise<void>
  ui: LeaguePageUi
}

export default function LeagueHistoryCard({
  matches,
  loading,
  summaryLoading,
  onOpenSummary,
  onUpdateMatchRanked,
  onRenameMatch,
  onDeleteMatch,
  ui,
}: Props) {
  return (
    <div style={ui.historyCard}>
      <div style={ui.historyHeaderRow}>
        <div>
          <h2 style={ui.historyTitle}>Match history</h2>
          <div style={ui.historyMeta}>Blood, glory, and permanent records.</div>
        </div>

        <div style={{ ...ui.badge, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.82)' }}>
          Matches: <span style={{ fontWeight: 1000 }}>{matches.length}</span>
        </div>
      </div>

      {matches.length === 0 ? (
        <div style={ui.historyEmpty}>No matches yet.</div>
      ) : (
        <div style={ui.historyGrid}>
          {matches.map((m) => {
            const disabled = loading

            return (
              <div
                key={m.id}
                style={ui.matchRow}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.borderColor = 'rgba(248,113,113,0.20)'
                  e.currentTarget.style.boxShadow = '0 22px 60px rgba(0,0,0,0.36), 0 0 40px rgba(220,38,38,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(173,55,69,0.26)'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.30)'
                }}
              >
                <div style={ui.matchLeft}>
                  <div style={ui.matchTopLine}>
                    <span style={ui.matchId}>{m.name && m.name.trim() ? m.name : `Match #${m.id}`}</span>
                    <span style={ui.statusChip(m.status)}>{m.status === 'FINISHED' ? '✅' : m.status === 'DRAFT' ? '🧪' : '⚔️'} {m.status}</span>
                    <span style={ui.modeChip(m.ranked)}>{m.ranked ? '🏆 RANKED' : '🍻 CASUAL'}</span>
                  </div>

                  <div style={ui.chipRow}>
                    <span style={ui.chip}>⏱ {m.timerSecondsInitial}s</span>
                  </div>
                </div>

                <div style={ui.actions}>
                  {m.status !== 'FINISHED' && (
                    <Link
                      to={`/matches/${m.id}`}
                      style={ui.linkBtn('open', disabled)}
                      onClick={(e) => {
                        if (disabled) e.preventDefault()
                      }}
                      onMouseEnter={(e) => {
                        if (disabled) return
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      ⚔️ Open
                    </Link>
                  )}

                  <button
                    onClick={() => onOpenSummary(m.id)}
                    disabled={disabled || summaryLoading || m.status !== 'FINISHED'}
                    title={m.status !== 'FINISHED' ? 'Summary available after FINISHED' : undefined}
                    style={ui.linkBtn('ghost', disabled || summaryLoading || m.status !== 'FINISHED')}
                    onMouseEnter={(e) => {
                      if (disabled || summaryLoading || m.status !== 'FINISHED') return
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    📜 Summary
                  </button>

                  <button
                    onClick={() => onUpdateMatchRanked(m.id, !m.ranked)}
                    disabled={disabled}
                    style={ui.linkBtn('ghost', disabled)}
                    onMouseEnter={(e) => {
                      if (disabled) return
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    🔁 Set {m.ranked ? 'CASUAL' : 'RANKED'}
                  </button>

                  <button
                    disabled={disabled}
                    style={ui.linkBtn('ghost', disabled)}
                    onClick={() => onRenameMatch(m.id, m.name)}
                  >
                    ✏️ Rename
                  </button>

                  <button
                    onClick={() => onDeleteMatch(m.id)}
                    disabled={disabled || m.ranked}
                    title={m.ranked ? 'Cannot delete RANKED match. Set it to CASUAL first.' : undefined}
                    style={ui.linkBtn('danger', disabled || m.ranked)}
                    onMouseEnter={(e) => {
                      if (disabled || m.ranked) return
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    🩸 Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
