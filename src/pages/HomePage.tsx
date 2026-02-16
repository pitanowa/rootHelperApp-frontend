import { useCallback } from 'react'
import HomeHero from '../features/home/components/HomeHero'
import HomeMatchesCard from '../features/home/components/HomeMatchesCard'
import HomePlayersCard from '../features/home/components/HomePlayersCard'
import HomeStandingsCard from '../features/home/components/HomeStandingsCard'
import { useHomePageController } from '../features/home/hooks/useHomePageController'
import type { ActiveMatch } from '../features/matches/types'
import { useAppCtx } from '../useAppCtx'
import '../features/home/homePage.css'

type Props = {
  gameKey: string
}

export default function HomePage({ gameKey }: Props) {
  const { setSelectedGroupId, setSelectedLeagueId } = useAppCtx()
  const {
    players,
    loadingPlayers,
    playersError,
    activeMatches,
    loadingActive,
    activeError,
    leagueMap,
    groupMap,
    standings,
    standingsLeagueId,
    loadingStandings,
    standingsError,
    load,
  } = useHomePageController(gameKey)

  const handleOpenMatch = useCallback(
    (match: ActiveMatch) => {
      setSelectedGroupId(match.groupId ?? null)
      setSelectedLeagueId(match.leagueId ?? null)
    },
    [setSelectedGroupId, setSelectedLeagueId],
  )

  return (
    <main className={`home-page home-page--${gameKey.toLowerCase()}`}>
      <HomeHero gameKey={gameKey} playersCount={players.length} activeMatchesCount={activeMatches.length} onRefresh={load} />

      <section className="home-grid">
        <HomePlayersCard players={players} loading={loadingPlayers} error={playersError} />

        <HomeStandingsCard
          gameKey={gameKey}
          standings={standings}
          standingsLeagueId={standingsLeagueId}
          loading={loadingStandings}
          error={standingsError}
        />

        <HomeMatchesCard
          gameKey={gameKey}
          activeMatches={activeMatches}
          loading={loadingActive}
          error={activeError}
          leagueMap={leagueMap}
          groupMap={groupMap}
          onOpenMatch={handleOpenMatch}
        />
      </section>
    </main>
  )
}
