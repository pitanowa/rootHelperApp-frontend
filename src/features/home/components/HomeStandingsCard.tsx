import { Link } from 'react-router-dom'
import type { StandingRow } from '../../leagues/api'
import { getRankBadge } from '../homePageUi'

type HomeStandingsCardProps = {
  standings: StandingRow[]
  standingsLeagueId: number | null
  loading: boolean
  error: string | null
}

export default function HomeStandingsCard({
  standings,
  standingsLeagueId,
  loading,
  error,
}: HomeStandingsCardProps) {
  return (
    <section className="home-card home-fade-up home-fade-up--delay-2">
      <header className="home-card__header">
        <h2>Tabela ligi</h2>
        {standingsLeagueId != null ? <Link to={`/leagues/${standingsLeagueId}`}>Otwórz</Link> : <span />}
      </header>

      <div className="home-card__body home-scroll">
        {loading && <div className="home-state">Ładowanie...</div>}
        {!loading && error && <div className="home-state home-state--error">{error}</div>}
        {!loading && !error && standings.length === 0 && <div className="home-state">Brak danych tabeli.</div>}
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
                    <strong>{rootsTotal} korzeni</strong>
                    <span>{row.pointsTotal} pkt</span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <footer className="home-card__footer">Top 3 są podświetleni.</footer>
    </section>
  )
}
