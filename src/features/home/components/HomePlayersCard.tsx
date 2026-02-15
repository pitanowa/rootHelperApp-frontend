import { Link } from 'react-router-dom'

type PlayerListItem = { id: number; name: string }

type HomePlayersCardProps = {
  players: PlayerListItem[]
  loading: boolean
  error: string | null
}

export default function HomePlayersCard({ players, loading, error }: HomePlayersCardProps) {
  return (
    <section className="home-card home-fade-up home-fade-up--delay-1">
      <header className="home-card__header">
        <h2>Gracze</h2>
        <Link to="/players">Otwórz</Link>
      </header>

      <div className="home-card__body home-scroll">
        {loading && <div className="home-state">Ładowanie...</div>}
        {!loading && error && <div className="home-state home-state--error">{error}</div>}
        {!loading && !error && players.length === 0 && <div className="home-state">Brak graczy.</div>}
        {!loading && !error && players.length > 0 && (
          <ul className="home-list">
            {players.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
        )}
      </div>

      <footer className="home-card__footer">Łącznie: {players.length}</footer>
    </section>
  )
}
