import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MatchSummaryModal } from '../../../components/modals/MatchSummary'
import { MatchSummaryView } from '../../../components/match/MatchSummaryView'
import LeagueCreateMatchCard from '../../../features/leagues/components/LeagueCreateMatchCard'
import LeagueHistoryCard from '../../../features/leagues/components/LeagueHistoryCard'
import LeaguePageHeader from '../../../features/leagues/components/LeaguePageHeader'
import LeagueStandingsCard from '../../../features/leagues/components/LeagueStandingsCard'
import { useLeaguePageController } from '../../../features/leagues/hooks/useLeaguePageController'
import { leaguePageUi } from '../../../features/leagues/leaguePageUi'
import type { GamePageProps } from '../../../core/games/types'
import { gameMatchPath } from '../../../routing/paths'
import { buildRootCreateMatchPayload, getRootLeaguePageConfig, getRootStandingsColumns } from '../config'
import { getMatchSummaryBackground } from '../matchSummaryBackground'

type Props = GamePageProps

export default function RootLeaguePage({ gameKey, capabilities }: Props) {
  const { leagueId } = useParams()
  const lid = Number(leagueId)
  const nav = useNavigate()
  const [summaryIntroOpen, setSummaryIntroOpen] = useState(false)

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
    getLeaguePageConfig: () => getRootLeaguePageConfig(capabilities),
    buildCreateMatchPayload: buildRootCreateMatchPayload,
    onMatchCreated: (matchId) => nav(gameMatchPath(gameKey, matchId)),
  })

  const handleOpenSummary = async (matchId: number) => {
    setSummaryIntroOpen(false)
    const loadedSummary = await openMatchSummary(matchId)
    if (loadedSummary) setSummaryIntroOpen(true)
  }

  const proceedToSummary = () => setSummaryIntroOpen(false)

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
          onOpenSummary={handleOpenSummary}
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

      {summaryIntroOpen && summary ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2147483647,
            background: 'rgba(0,0,0,0.9)',
            display: 'grid',
            gridTemplateRows: '1fr auto',
            gap: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              minHeight: 0,
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.16)',
              overflow: 'hidden',
              boxShadow: '0 30px 90px rgba(0,0,0,0.75)',
            }}
          >
            <img
              src={getMatchSummaryBackground(summary.matchName)}
              alt={summary.matchName?.trim() ? `Match image: ${summary.matchName}` : 'Match image'}
              style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#050505' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={proceedToSummary}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 800,
              }}
            >
              Przejdz do podsumowania
            </button>
          </div>
        </div>
      ) : null}

      <MatchSummaryModal
        open={summaryOpen && !!summary && !summaryIntroOpen}
        loading={summaryLoading}
        saving={false}
        title={summary?.matchName?.trim() ? summary.matchName : `Match #${summary?.matchId}`}
        subtitle={summary ? `League #${summary.leagueId} | ${summary.ranked ? 'RANKED WAR' : 'CASUAL BLOODBATH'}` : undefined}
        accentHex="#dc2626"
        variant="war"
        backgroundUrl={getMatchSummaryBackground(summary?.matchName)}
        onClose={() => {
          setSummaryIntroOpen(false)
          setSummaryOpen(false)
        }}
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
