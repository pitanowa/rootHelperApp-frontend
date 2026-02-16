import { Link } from 'react-router-dom'
import type { StandingRow } from '../../leagues/api'
import { gameLeaguePath } from '../../../routing/paths'
import { getRankBadge } from '../homePageUi'

type HomeStandingsCardProps = {
  gameKey: string
  standings: StandingRow[]
  standingsLeagueId: number | null
  loading: boolean
  error: string | null
}

export default function HomeStandingsCard({
  gameKey,
  standings,
  standingsLeagueId,
  loading,
  error,
}: HomeStandingsCardProps) {
  return (
    <section className="home-card home-fade-up home-fade-up--delay-2">
      <header className="home-card__header">
        <h2>League table</h2>
        {standingsLeagueId != null ? <Link to={gameLeaguePath(gameKey, standingsLeagueId)}>Open</Link> : <span />}
      </header>

      <div className="home-card__body home-scroll">
        {loading && <div className="home-state">Loading...</div>}
        {!loading && error && <div className="home-state home-state--error">{error}</div>}
        {!loading && !error && standings.length === 0 && <div className="home-state">No standings data.</div>}
        {!loading && !error && standings.length > 0 && (
          <div className="home-standings">
            {standings.map((row, index) => {
              const rank = index + 1
              const rootsTotal = row.rootsTotal ?? 0
              return (
                <article key={row.playerId} className={`home-standings__row${rank <= 3 ? ' is-top' : ''}`}>
                  <div className={`home-rank home-rank--${rank <= 3 ? rank : 'default'}`}>{getRankBadge(rank)}</div>
                  <div className="home-standings__player">{row.playerName}</div>
                  <div className="home-standings__score">
                    <strong>{rootsTotal} roots</strong>
                    <span>{row.pointsTotal} points</span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <footer className="home-card__footer">Top 3 players are highlighted.</footer>
    </section>
  )
}
