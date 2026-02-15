import { Link } from 'react-router-dom'
import type { ActiveMatch } from '../../matches/types'
import { getGroupLabel, getLeagueLabel } from '../homePageUi'

type HomeMatchesCardProps = {
  activeMatches: ActiveMatch[]
  loading: boolean
  error: string | null
  leagueMap: Record<number, string>
  groupMap: Record<number, string>
  onOpenMatch: (match: ActiveMatch) => void
}

export default function HomeMatchesCard({
  activeMatches,
  loading,
  error,
  leagueMap,
  groupMap,
  onOpenMatch,
}: HomeMatchesCardProps) {
  return (
    <section className="home-card home-fade-up home-fade-up--delay-3">
      <header className="home-card__header">
        <h2>Aktywne mecze</h2>
        <span className="home-live">LIVE</span>
      </header>

      <div className="home-card__body home-scroll home-scroll--gap">
        {loading && <div className="home-state">Ładowanie...</div>}
        {!loading && error && <div className="home-state home-state--error">{error}</div>}
        {!loading && !error && activeMatches.length === 0 && <div className="home-state">Brak aktywnych meczów.</div>}
        {!loading && !error && activeMatches.length > 0 && (
          <>
            {activeMatches.map((match) => (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="home-match"
                onClick={() => onOpenMatch(match)}
              >
                <div className="home-match__main">
                  <strong>{getLeagueLabel(match.leagueId != null ? leagueMap[match.leagueId] : undefined)}</strong>
                  <span>{getGroupLabel(match.groupId != null ? groupMap[match.groupId] : undefined)}</span>
                </div>
                <div className="home-match__meta">
                  <span className="home-chip home-chip--running">RUNNING</span>
                  {match.ranked != null && (
                    <span className={`home-chip ${match.ranked ? 'home-chip--ranked' : 'home-chip--casual'}`}>
                      {match.ranked ? 'RANKED' : 'CASUAL'}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </>
        )}
      </div>

      <footer className="home-card__footer">Kliknij mecz, aby wrócić do rozgrywki.</footer>
    </section>
  )
}
