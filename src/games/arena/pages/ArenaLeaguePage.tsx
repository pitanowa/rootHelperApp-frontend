import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { gameApiGet } from '../../../api'
import type { GamePageProps } from '../../../core/games/types'

type StandingRow = {
  playerId: number
  playerName: string
  pointsTotal: number
  gamesPlayed: number
  wins: number
}

type MatchListItem = {
  id: number
  status: string
  ranked: boolean
  name?: string | null
}

type LeagueResponse = {
  id: number
  name: string
  gameKey?: string
}

export default function ArenaLeaguePage({ gameKey }: GamePageProps) {
  const { leagueId } = useParams()
  const lid = Number(leagueId)
  const [league, setLeague] = useState<LeagueResponse | null>(null)
  const [standings, setStandings] = useState<StandingRow[]>([])
  const [matches, setMatches] = useState<MatchListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(lid)) return

    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const [rows, ms] = await Promise.all([
          gameApiGet<StandingRow[]>(gameKey, `/leagues/${lid}/standings`),
          gameApiGet<MatchListItem[]>(gameKey, `/leagues/${lid}/matches`),
        ])
        if (cancelled) return
        setStandings(rows)
        setMatches(ms)
        setLeague({ id: lid, name: `League #${lid}`, gameKey })
      } catch (e: unknown) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load arena league data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [gameKey, lid])

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 20, color: 'rgba(255,255,255,0.92)' }}>
      <section style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(10, 16, 24, 0.72)', padding: 16 }}>
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>{league?.name ?? 'Arena League'}</h1>
        <p style={{ marginTop: 0, opacity: 0.78 }}>Placeholder game module. League and standings are loaded via game-aware API.</p>
        {error ? <div style={{ color: '#ffd3d3' }}>Error: {error}</div> : null}
      </section>

      <section style={{ marginTop: 14, borderRadius: 16, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(10, 16, 24, 0.72)', padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Standings</h2>
        {loading ? <div>Loading...</div> : null}
        {!loading && standings.length === 0 ? <div>No standings data.</div> : null}
        {!loading && standings.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 6px' }}>Player</th>
                <th style={{ textAlign: 'left', padding: '8px 6px' }}>Points</th>
                <th style={{ textAlign: 'left', padding: '8px 6px' }}>Games</th>
                <th style={{ textAlign: 'left', padding: '8px 6px' }}>Wins</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => (
                <tr key={row.playerId}>
                  <td style={{ padding: '8px 6px' }}>{row.playerName}</td>
                  <td style={{ padding: '8px 6px' }}>{row.pointsTotal}</td>
                  <td style={{ padding: '8px 6px' }}>{row.gamesPlayed}</td>
                  <td style={{ padding: '8px 6px' }}>{row.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>

      <section style={{ marginTop: 14, borderRadius: 16, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(10, 16, 24, 0.72)', padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Matches</h2>
        {loading ? <div>Loading...</div> : null}
        {!loading && matches.length === 0 ? <div>No matches yet.</div> : null}
        {!loading && matches.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {matches.map((match) => (
              <li key={match.id}>{match.name?.trim() ? match.name : `Match #${match.id}`} - {match.status} - {match.ranked ? 'RANKED' : 'CASUAL'}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  )
}

