import { useNavigate, useParams } from 'react-router-dom'
import { MatchSummaryModal } from '../../../components/modals/MatchSummary'
import { MatchSummaryView } from '../../../components/match/MatchSummaryView'
import battlefield from '../../../assets/backgrounds/root_match_summary.png'
import LeagueCreateMatchCard from '../../../features/leagues/components/LeagueCreateMatchCard'
import LeagueHistoryCard from '../../../features/leagues/components/LeagueHistoryCard'
import LeaguePageHeader from '../../../features/leagues/components/LeaguePageHeader'
import LeagueStandingsCard from '../../../features/leagues/components/LeagueStandingsCard'
import { useLeaguePageController } from '../../../features/leagues/hooks/useLeaguePageController'
import { leaguePageUi } from '../../../features/leagues/leaguePageUi'
import { gameMatchPath } from '../../../routing/paths'
import { buildRootCreateMatchPayload, getRootLeaguePageConfig, getRootStandingsColumns } from '../config'

type Props = {
  gameKey: string
}

export default function RootLeaguePage({ gameKey }: Props) {
  const { leagueId } = useParams()
  const lid = Number(leagueId)
  const nav = useNavigate()

  const {
    standings,
    matches,
    players,
    selected,
    ranked,
    timerSeconds,
    loading,
    error,
    leagueConfig,
    landmarksEnabled,
    raceDraftEnabled,
    summaryOpen,
    summary,
    summaryLoading,
    setRanked,
    setTimerSeconds,
    setLandmarksEnabled,
    setRaceDraftEnabled,
    setSummaryOpen,
    load,
    openMatchSummary,
    deleteMatch,
    updateMatchRanked,
    saveMatchName,
    togglePlayer,
    createMatch,
  } = useLeaguePageController({
    gameKey,
    leagueId: lid,
    getLeaguePageConfig: getRootLeaguePageConfig,
    buildCreateMatchPayload: buildRootCreateMatchPayload,
    onMatchCreated: (matchId) => nav(gameMatchPath(gameKey, matchId)),
  })

  return (
    <div style={leaguePageUi.page}>
      <div style={leaguePageUi.backdrop}>
        <LeaguePageHeader loading={loading} error={error} onRefresh={load} ui={leaguePageUi} />

        <LeagueStandingsCard standings={standings} columns={getRootStandingsColumns()} ui={leaguePageUi} />

        <LeagueCreateMatchCard
          players={players}
          selected={selected}
          timerSeconds={timerSeconds}
          ranked={ranked}
          leagueConfig={leagueConfig}
          landmarksEnabled={landmarksEnabled}
          raceDraftEnabled={raceDraftEnabled}
          loading={loading}
          onTimerChange={setTimerSeconds}
          onRankedChange={setRanked}
          onLandmarksEnabledChange={setLandmarksEnabled}
          onRaceDraftEnabledChange={setRaceDraftEnabled}
          onTogglePlayer={togglePlayer}
          onCreateMatch={createMatch}
          ui={leaguePageUi}
        />

        <LeagueHistoryCard
          gameKey={gameKey}
          matches={matches}
          loading={loading}
          summaryLoading={summaryLoading}
          onOpenSummary={openMatchSummary}
          onUpdateMatchRanked={updateMatchRanked}
          onRenameMatch={async (matchId, currentName) => {
            const next = window.prompt('Match name:', currentName ?? '')
            if (next === null) return
            await saveMatchName(matchId, next)
          }}
          onDeleteMatch={async (matchId) => {
            const ok = window.confirm('Delete match? If FINISHED+RANKED it will rollback standings.')
            if (!ok) return
            await deleteMatch(matchId)
          }}
          ui={leaguePageUi}
        />
      </div>

      <MatchSummaryModal
        open={summaryOpen && !!summary}
        loading={summaryLoading}
        saving={false}
        title={summary?.matchName?.trim() ? summary.matchName : `Match #${summary?.matchId}`}
        subtitle={summary ? `League #${summary.leagueId} • ${summary.ranked ? 'RANKED WAR' : 'CASUAL BLOODBATH'}` : undefined}
        accentHex="#dc2626"
        variant="war"
        backgroundUrl={battlefield}
        onClose={() => setSummaryOpen(false)}
        hideSave
      >
        {summary ? (
          <MatchSummaryView
            summary={summary}
            mode="readonly"
          />
        ) : null}
      </MatchSummaryModal>
    </div>
  )
}
