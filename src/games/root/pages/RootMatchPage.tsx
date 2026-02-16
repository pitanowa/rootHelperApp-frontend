import { useNavigate, useParams } from 'react-router-dom'
import CardsModal from '../../../components/modals/CardsModal'
import SetupModal from '../../../components/modals/SetupModal'
import { MatchSummaryModal } from '../../../components/modals/MatchSummary'
import { MatchSummaryView } from '../../../components/match/MatchSummaryView'
import RootRaceDraftPage from './RootRaceDraftPage'
import RootRacePickPage from './RootRacePickPage'
import { CARDS } from '../../../data/cards'
import MatchPlayersSection from '../../../features/matches/components/MatchPlayersSection'
import MatchActionsBar from '../../../features/matches/components/MatchActionsBar'
import { useCardsFilters } from '../../../features/matches/hooks/useCardsFilters'
import { useMatchController } from '../../../features/matches/hooks/useMatchController'
import { useMatchPageFlow } from '../../../features/matches/hooks/useMatchPageFlow'
import { LS_SETUP, lsGetRaceMap, lsSetBool, setupTextForRace } from '../../../features/matches/matchPageStorage'
import { matchPageUi, mixRgba, playAlarm } from '../../../features/matches/matchPageUi'
import { gameLeaguePath } from '../../../routing/paths'

type Props = {
  gameKey: string
}

export default function MatchPage({ gameKey }: Props) {
  const { matchId } = useParams()
  const nav = useNavigate()
  const mid = Number(matchId)

  const {
    state,
    setState,
    draft,
    localTime,
    runningPlayerId,
    loading,
    error,
    setError,
    scoreInput,
    setScoreInput,
    summaryOpen,
    setSummaryOpen,
    summary,
    summaryDesc,
    setSummaryDesc,
    summarySaving,
    matchStarted,
    load,
    startMatch,
    finish,
    setRunning,
    stopRunning,
    addMinute,
    removeMinute,
    addSecond,
    removeSecond,
    setScoreAbsolute,
    refreshTimer,
    saveSummaryAndExit,
  } = useMatchController({
    gameKey,
    mid,
    getRaceMap: lsGetRaceMap,
    playAlarm,
    onGoToLeague: (leagueId) => nav(gameLeaguePath(gameKey, leagueId)),
  })

  const {
    flowStage,
    setFlowStage,
    setupIndex,
    setSetupIndex,
    playersInMatchOrder,
    needsRacePick,
    showSetupHintsButton,
    openSetupHints,
    onDraftLandmarksBan,
    onDraftPick,
    onDraftSetBans,
    onDraftResetPick,
    onSetLandmarksManual,
    onManualPick,
    onManualReset,
  } = useMatchPageFlow({
    gameKey,
    mid,
    state,
    setState,
    draft,
    load,
    setError,
  })

  const {
    cardsOpen,
    setCardsOpen,
    cardsSearch,
    setCardsSearch,
    fClearings,
    setFClearings,
    fCraft,
    setFCraft,
    fItems,
    setFItems,
    previewCard,
    setPreviewCard,
    filteredCards,
    resetCardFilters,
  } = useCardsFilters(CARDS)

  if (state?.raceDraftEnabled && draft && draft.status === 'DRAFTING') {
    return (
      <RootRaceDraftPage
        matchId={mid}
        draft={draft}
        players={state.players}
        loading={loading}
        error={error}
        landmarksEnabled={state.landmarksEnabled}
        landmarksBanned={state.landmarkBanned}
        landmarksRandomCount={state.landmarksRandomCount ?? null}
        landmarksDrawn={state.landmarksDrawn ?? []}
        onLandmarksBan={onDraftLandmarksBan}
        onPick={onDraftPick}
        onSetBans={onDraftSetBans}
        onResetPick={onDraftResetPick}
        onRefresh={load}
      />
    )
  }

  if (needsRacePick && state) {
    return (
      <RootRacePickPage
        matchId={mid}
        players={state.players}
        loading={loading}
        error={error}
        ui={matchPageUi}
        landmarksEnabled={state.landmarksEnabled}
        landmarkBanned={state.landmarkBanned}
        landmarksRandomCount={state.landmarksRandomCount}
        landmarksDrawn={state.landmarksDrawn ?? []}
        onSetLandmarksManual={onSetLandmarksManual}
        onPick={onManualPick}
        onRefresh={onManualReset}
      />
    )
  }

  return (
    <div style={matchPageUi.page}>
      <div style={matchPageUi.shell}>
        {state && (
          <MatchActionsBar
            state={state}
            draft={draft}
            loading={loading}
            matchStarted={!!matchStarted}
            runningPlayerId={runningPlayerId}
            onStartMatch={startMatch}
            onFinishMatch={finish}
            showSetupHintsButton={showSetupHintsButton}
            onOpenSetupHints={openSetupHints}
            ui={matchPageUi}
          />
        )}

        <SetupModal
          open={flowStage !== 'NONE'}
          loading={loading}
          playersInMatchOrder={playersInMatchOrder}
          setupIndex={setupIndex}
          setSetupIndex={setSetupIndex}
          mid={mid}
          setFlowStage={setFlowStage}
          setupTextForRace={setupTextForRace}
          lsSetBool={lsSetBool}
          LS_SETUP={LS_SETUP}
          ui={matchPageUi}
        />

        {error && <div style={matchPageUi.errorBox}>Error: {error}</div>}

        {!state ? (
          <div style={{ opacity: 0.78, color: 'rgba(255,255,255,0.72)' }}>{loading ? 'Loading…' : 'Match not found'}</div>
        ) : (
          <MatchPlayersSection
            playersInMatchOrder={playersInMatchOrder}
            localTime={localTime}
            runningPlayerId={runningPlayerId}
            loading={loading}
            matchStarted={!!matchStarted}
            landmarksEnabled={state.landmarksEnabled}
            landmarkBanned={state.landmarkBanned}
            landmarksDrawn={state.landmarksDrawn ?? []}
            scoreInput={scoreInput}
            setScoreInput={setScoreInput}
            mixRgba={mixRgba}
            ui={matchPageUi}
            onRemoveSecond={removeSecond}
            onAddSecond={addSecond}
            onRemoveMinute={removeMinute}
            onAddMinute={addMinute}
            onSetScoreAbsolute={setScoreAbsolute}
            onRefreshTimer={refreshTimer}
            onSetRunning={setRunning}
            onStopRunning={stopRunning}
            onOpenCards={() => setCardsOpen(true)}
          />
        )}

        <CardsModal
          open={cardsOpen}
          loading={loading}
          cardsSearch={cardsSearch}
          setCardsSearch={setCardsSearch}
          fClearings={fClearings}
          setFClearings={setFClearings}
          fCraft={fCraft}
          setFCraft={setFCraft}
          fItems={fItems}
          setFItems={setFItems}
          previewCard={previewCard}
          setPreviewCard={setPreviewCard}
          filteredCards={filteredCards}
          totalCards={CARDS.length}
          onResetFilters={resetCardFilters}
          onClose={() => {
            setCardsOpen(false)
            setPreviewCard(null)
          }}
          ui={matchPageUi}
        />

        <MatchSummaryModal
          open={summaryOpen && !!summary}
          loading={loading}
          saving={summarySaving}
          title="Match Summary"
          subtitle={summary ? `match #${summary.matchId} | league #${summary.leagueId} | ${summary.ranked ? 'ranked' : 'casual'}` : undefined}
          accentHex="#c1263d"
          onClose={() => setSummaryOpen(false)}
          onSave={saveSummaryAndExit}
        >
          {summary ? (
            <MatchSummaryView
              summary={summary}
              mode="edit"
              description={summaryDesc}
              setDescription={setSummaryDesc}
            />
          ) : null}
        </MatchSummaryModal>
      </div>
    </div>
  )
}

