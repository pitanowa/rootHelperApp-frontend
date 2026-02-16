import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { gameApiGet } from '../../../api'
import type { GamePageProps } from '../../../core/games/types'

type ArenaMatch = {
  matchId: number
  leagueId: number
  status: string
  gameKey?: string
}

export default function ArenaMatchPage({ gameKey }: GamePageProps) {
  const { matchId } = useParams()
  const mid = Number(matchId)
  const [match, setMatch] = useState<ArenaMatch | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(mid)) return

    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await gameApiGet<ArenaMatch>(gameKey, `/matches/${mid}`)
        if (!cancelled) setMatch(data)
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load match')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [gameKey, mid])

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 20, color: 'rgba(255,255,255,0.92)' }}>
      <section style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(10, 16, 24, 0.72)', padding: 16 }}>
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>Arena Match</h1>
        <p style={{ marginTop: 0, opacity: 0.78 }}>Placeholder match page for non-ROOT game module.</p>
        {loading ? <div>Loading...</div> : null}
        {error ? <div style={{ color: '#ffd3d3' }}>Error: {error}</div> : null}
        {match ? <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(match, null, 2)}</pre> : null}
      </section>
    </main>
  )
}

