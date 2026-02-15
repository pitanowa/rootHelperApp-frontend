import { Link } from 'react-router-dom'
import { homeHeroPills, homeSetupSteps } from '../homePageUi'

type HomeHeroProps = {
  playersCount: number
  activeMatchesCount: number
  onRefresh: () => void
}

export default function HomeHero({ playersCount, activeMatchesCount, onRefresh }: HomeHeroProps) {
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
          Dowództwo rozgrywek <span>Root</span>
        </h1>
        <p className="home-hero__description">
          Jedno miejsce do zarządzania graczami, grupami i meczami. Twórz ligi, prowadź draft i kontroluj aktywne stoły
          bez przełączania między notatkami.
        </p>

        <div className="home-hero__actions">
          <Link to="/players" className="home-cta home-cta--primary">
            Zbuduj roster graczy
          </Link>
          <Link to="/groups" className="home-cta home-cta--ghost">
            Zarządzaj grupami
          </Link>
          <button type="button" onClick={onRefresh} className="home-cta home-cta--soft">
            Odśwież centrum
          </button>
        </div>

        <div className="home-hero__metrics">
          <div className="home-metric">
            <strong>{playersCount}</strong>
            <span>Graczy</span>
          </div>
          <div className="home-metric">
            <strong>{activeMatchesCount}</strong>
            <span>Aktywnych meczów</span>
          </div>
          <div className="home-metric">
            <strong>Live</strong>
            <span>Status ligi</span>
          </div>
        </div>
      </div>

      <aside className="home-hero__right">
        <h2>Sekwencja startowa</h2>
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
