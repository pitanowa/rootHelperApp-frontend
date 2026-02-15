import { useEffect, useRef, useState } from 'react'
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
  const [openActionsMatchId, setOpenActionsMatchId] = useState<number | null>(null)
  const historyRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (openActionsMatchId == null) return
      const target = event.target as Node | null
      if (!target) return
      if (historyRef.current?.contains(target)) return
      setOpenActionsMatchId(null)
    }

    window.addEventListener('mousedown', onMouseDown)
    return () => window.removeEventListener('mousedown', onMouseDown)
  }, [openActionsMatchId])

  return (
    <div ref={historyRef} style={ui.historyCard}>
      <div style={ui.historyHeaderRow}>
        <div>
          <h2 style={ui.historyTitle}>Match history</h2>
          <div style={ui.historyMeta}>Blood, glory, and permanent records.</div>
        </div>

        <div style={ui.badge}>
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
                style={{
                  ...ui.matchRow,
                  position: 'relative',
                  overflow: 'visible',
                  zIndex: openActionsMatchId === m.id ? 60 : 1,
                }}
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
                    <span style={ui.statusChip(m.status)}>{m.status === 'FINISHED' ? 'FINISHED' : m.status === 'DRAFT' ? 'DRAFT' : 'RUNNING'}</span>
                    <span style={ui.modeChip(m.ranked)}>{m.ranked ? 'RANKED' : 'CASUAL'}</span>
                  </div>

                  <div style={ui.chipRow}>
                    <span style={ui.chip}>Timer: {m.timerSecondsInitial}s</span>
                  </div>
                </div>

                <div style={{ ...ui.actions, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
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
                        Open
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
                      Summary
                    </button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (disabled) return
                        setOpenActionsMatchId((prev) => (prev === m.id ? null : m.id))
                      }}
                      disabled={disabled}
                      style={ui.linkBtn('ghost', disabled)}
                    >
                      More
                    </button>

                    {openActionsMatchId === m.id ? (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 'calc(100% + 6px)',
                          minWidth: 210,
                          zIndex: 5000,
                          display: 'grid',
                          gap: 6,
                          padding: 8,
                          borderRadius: 12,
                          border: '1px solid rgba(209,110,122,0.3)',
                          background: 'linear-gradient(180deg, rgba(18,7,12,0.98), rgba(9,3,6,1))',
                          boxShadow: '0 22px 50px rgba(0,0,0,0.55)',
                        }}
                      >
                        <button
                          onClick={() => {
                            void onUpdateMatchRanked(m.id, !m.ranked)
                            setOpenActionsMatchId(null)
                          }}
                          disabled={disabled}
                          style={{ ...ui.linkBtn('ghost', disabled), justifyContent: 'center' }}
                        >
                          Set {m.ranked ? 'CASUAL' : 'RANKED'}
                        </button>

                        <button
                          disabled={disabled}
                          style={{ ...ui.linkBtn('ghost', disabled), justifyContent: 'center' }}
                          onClick={() => {
                            void onRenameMatch(m.id, m.name)
                            setOpenActionsMatchId(null)
                          }}
                        >
                          Rename
                        </button>

                        <button
                          onClick={() => {
                            void onDeleteMatch(m.id)
                            setOpenActionsMatchId(null)
                          }}
                          disabled={disabled || m.ranked}
                          title={m.ranked ? 'Cannot delete RANKED match. Set it to CASUAL first.' : undefined}
                          style={{ ...ui.linkBtn('danger', disabled || m.ranked), justifyContent: 'center' }}
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
