import type { LeaguePageUi } from '../leaguePageUi'
import type { StandingRow } from '../types'

type Props = {
  standings: StandingRow[]
  ui: LeaguePageUi
}

export default function LeagueStandingsCard({ standings, ui }: Props) {
  return (
    <div style={ui.standingsCardDark}>
      <div style={ui.standingsHeaderDark}>
        <div>
          <h2 style={ui.standingsTitleDark}>Standings</h2>
          <div style={ui.standingsMetaDark}>Bloodline ranking • Sorted by roots</div>
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
                <th style={ui.standingsThDark}>Roots</th>
                <th style={ui.standingsThDark}>Games</th>
                <th style={ui.standingsThDark}>Wins</th>
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
                const baseBg = rank <= 3 ? 'rgba(220,38,38,0.08)' : zebra ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)'

                return (
                  <tr
                    key={r.playerId}
                    title={`Roots: ${r.rootsTotal} | Points: ${r.pointsTotal} | Games: ${r.gamesPlayed} | Wins: ${r.wins}`}
                    style={{ ...ui.standingsTrBaseDark, background: baseBg }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(220,38,38,0.12)'
                      e.currentTarget.style.boxShadow = '0 18px 50px rgba(0,0,0,0.35)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = baseBg
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
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

                    <td style={ui.standingsTdDark}>
                      <div style={{ display: 'grid', gap: 2 }}>
                        <span style={ui.standingsPointsDark}>{r.rootsTotal} 🌿</span>
                        <span style={{ fontSize: 11, opacity: 0.72, color: 'rgba(255,255,255,0.75)' }}>{r.pointsTotal} pts</span>
                      </div>
                    </td>

                    <td style={ui.standingsTdDark}>
                      <span style={ui.standingsStatPillDark}>🎮 {r.gamesPlayed}</span>
                    </td>

                    <td style={ui.standingsTdDark}>
                      <span style={ui.standingsStatPillDark}>🏆 {r.wins}</span>
                    </td>
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
