import type { StandingsColumn } from '../../../core/games/types'
import type { LeaguePageUi } from '../leaguePageUi'
import type { StandingRow } from '../types'

type Props = {
  standings: StandingRow[]
  columns: StandingsColumn[]
  ui: LeaguePageUi
}

export default function LeagueStandingsCard({ standings, columns, ui }: Props) {
  const hasRoots = columns.some((column) => column.key === 'rootsTotal')

  return (
    <div style={ui.standingsCardDark}>
      <div style={ui.standingsHeaderDark}>
        <div>
          <h2 style={ui.standingsTitleDark}>Standings</h2>
          <div style={ui.standingsMetaDark}>Sorted by {hasRoots ? 'roots' : 'points'}</div>
        </div>

        <div style={ui.standingsBadgeDark}>
          Players: <span style={{ fontWeight: 1000 }}>{standings.length}</span>
        </div>
      </div>

      {standings.length === 0 ? (
        <div style={ui.standingsEmptyDark}>No standings yet.</div>
      ) : (
        <div style={ui.standingsTableWrapDark}>
          <table style={ui.standingsTableDark}>
            <thead>
              <tr>
                <th style={ui.standingsThDark}>#</th>
                <th style={ui.standingsThDark}>Player</th>
                {columns.map((column) => (
                  <th key={column.key} style={ui.standingsThDark}>{column.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {standings.map((r, idx) => {
                const rank = idx + 1
                const initials = (r.playerName || '?')
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((x) => x[0]?.toUpperCase())
                  .join('')

                const zebra = idx % 2 === 0
                const baseBg = rank <= 3 ? 'rgba(var(--app-accent-rgb),0.08)' : zebra ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)'

                const values: Record<string, string | number> = {
                  rootsTotal: r.rootsTotal,
                  pointsTotal: r.pointsTotal,
                  gamesPlayed: r.gamesPlayed,
                  wins: r.wins,
                }

                return (
                  <tr key={r.playerId} style={{ ...ui.standingsTrBaseDark, background: baseBg }}>
                    <td style={{ ...ui.standingsTdDark, width: 70 }}>
                      <span style={ui.standingsRankPillDark(rank)}>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}</span>
                    </td>

                    <td style={ui.standingsTdDark}>
                      <div style={ui.standingsPlayerCellDark}>
                        <div style={ui.standingsAvatarDark(rank)} aria-hidden>
                          {initials || 'P'}
                        </div>
                        <div style={{ display: 'grid', gap: 2 }}>
                          <div style={{ fontWeight: 1000 }}>{r.playerName}</div>
                          <div style={{ fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>
                            {rank === 1 ? 'Legend' : rank <= 3 ? 'Champion' : 'Warrior'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {columns.map((column) => (
                      <td key={column.key} style={ui.standingsTdDark}>
                        <span style={ui.standingsStatPillDark}>{values[column.key] ?? '-'}</span>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

