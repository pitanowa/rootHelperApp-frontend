import { Link } from 'react-router-dom'
import { homeHeroPills, homeSetupSteps } from '../homePageUi'
import { gameGroupsPath, gamePlayersPath } from '../../../routing/paths'

type HomeHeroProps = {
  gameKey: string
  playersCount: number
  activeMatchesCount: number
  onRefresh: () => void
}

export default function HomeHero({ gameKey, playersCount, activeMatchesCount, onRefresh }: HomeHeroProps) {
  return (
    <section className="home-hero home-fade-up">
      <div className="home-hero__aurora" />

      <div className="home-hero__left">
        <div className="home-hero__pills">
          {homeHeroPills.map((pill) => (
            <span key={pill} className="home-pill">
              {pill}
            </span>
          ))}
        </div>

        <h1 className="home-hero__title">
          League command center for <span>{gameKey.toUpperCase()}</span>
        </h1>
        <p className="home-hero__description">
          Manage players, groups, leagues, and live matches from one place. Start a game-specific flow without
          switching tools.
        </p>

        <div className="home-hero__actions">
          <Link to={gamePlayersPath(gameKey)} className="home-cta home-cta--primary">
            Build player roster
          </Link>
          <Link to={gameGroupsPath(gameKey)} className="home-cta home-cta--ghost">
            Manage groups
          </Link>
          <button type="button" onClick={onRefresh} className="home-cta home-cta--soft">
            Refresh dashboard
          </button>
        </div>

        <div className="home-hero__metrics">
          <div className="home-metric">
            <strong>{playersCount}</strong>
            <span>Players</span>
          </div>
          <div className="home-metric">
            <strong>{activeMatchesCount}</strong>
            <span>Active matches</span>
          </div>
          <div className="home-metric">
            <strong>Live</strong>
            <span>League status</span>
          </div>
        </div>
      </div>

      <aside className="home-hero__right">
        <h2>Startup sequence</h2>
        <div className="home-steps">
          {homeSetupSteps.map((step) => (
            <article key={step.title} className="home-step">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </aside>
    </section>
  )
}
