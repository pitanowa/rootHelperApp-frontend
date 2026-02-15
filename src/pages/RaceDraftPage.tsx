import type { DraftState, MatchPlayerState } from '../features/matches/types'
import { raceDraftUi as ui } from '../features/matches/raceDraftUi'
import { useRaceDraftState } from '../features/matches/hooks/useRaceDraftState'
import RaceDraftTopBar from '../features/matches/components/RaceDraftTopBar'
import RaceDraftModals from '../features/matches/components/RaceDraftModals'
import RaceDraftBanPhase from '../features/matches/components/RaceDraftBanPhase'
import RaceDraftPickPhase from '../features/matches/components/RaceDraftPickPhase'

type Props = {
  matchId: number
  draft: DraftState
  players: MatchPlayerState[]
  loading: boolean
  error: string | null
  onPick: (playerId: number, race: string) => void | Promise<void>
  onSetBans?: (bans: string[]) => void | Promise<void>
  onRefresh?: () => void
  onResetPick?: () => Promise<unknown>
  landmarksEnabled?: boolean
  landmarksBanned?: string | null
  landmarksRandomCount?: number | null
  landmarksDrawn?: string[]
  onLandmarksBan?: (banned: string, randomCount: 1 | 2) => void | Promise<void>
}

export default function RaceDraftView({
  matchId,
  draft,
  players,
  loading,
  error,
  onPick,
  onSetBans,
  onRefresh,
  onResetPick,
  landmarksEnabled,
  landmarksBanned,
  landmarksRandomCount,
  landmarksDrawn,
  onLandmarksBan,
}: Props) {
  const {
    playersById,
    totalPlayers,
    drawCount,
    maxBans,
    maxVagabondCopies,
    canBanSecondVagabond,
    localBans,
    localLandmarkBanned,
    setLocalLandmarkBanned,
    localLandmarkRandomCount,
    setLocalLandmarkRandomCount,
    vagabondBanCount,
    nonVagabondBans,
    bansCount,
    bansLeft,
    currentPlayerId,
    currentPlayer,
    assignedCount,
    remainingPicks,
    order,
    canAddMoreBans,
    bansValid,
    confirmLastPickOpen,
    setConfirmLastPickOpen,
    pendingPick,
    setPendingPick,
    isLastPick,
    finishOpen,
    setFinishOpen,
    toggleBan,
    addSecondVagabondBan,
    clearBans,
  } = useRaceDraftState({
    draft,
    players,
    landmarksBanned,
    landmarksRandomCount,
  })

  return (
    <div style={ui.page}>
      <div style={ui.backdrop}>
        <RaceDraftTopBar
          matchId={matchId}
          draft={draft}
          loading={loading}
          remainingPicks={remainingPicks}
          onRefresh={onRefresh}
          onResetPick={onResetPick}
        />

        {error && (
          <div style={ui.err}>
            <b>Error:</b> {error}
          </div>
        )}

        <RaceDraftModals
          confirmLastPickOpen={confirmLastPickOpen}
          pendingPick={pendingPick}
          loading={loading}
          setConfirmLastPickOpen={setConfirmLastPickOpen}
          setPendingPick={setPendingPick}
          onPick={onPick}
          onRefresh={onRefresh}
          finishOpen={finishOpen}
          setFinishOpen={setFinishOpen}
        />

        <RaceDraftBanPhase
          draft={draft}
          loading={loading}
          maxBans={maxBans}
          drawCount={drawCount}
          bansCount={bansCount}
          bansLeft={bansLeft}
          clearBans={clearBans}
          localBans={localBans}
          canAddMoreBans={canAddMoreBans}
          nonVagabondBans={nonVagabondBans}
          vagabondBanCount={vagabondBanCount}
          maxVagabondCopies={maxVagabondCopies}
          canBanSecondVagabond={canBanSecondVagabond}
          toggleBan={toggleBan}
          addSecondVagabondBan={addSecondVagabondBan}
          landmarksEnabled={landmarksEnabled}
          landmarksBanned={landmarksBanned}
          landmarksDrawn={landmarksDrawn}
          localLandmarkBanned={localLandmarkBanned}
          setLocalLandmarkBanned={setLocalLandmarkBanned}
          localLandmarkRandomCount={localLandmarkRandomCount}
          setLocalLandmarkRandomCount={setLocalLandmarkRandomCount}
          onLandmarksBan={onLandmarksBan}
          onRefresh={onRefresh}
          onSetBans={onSetBans}
          bansValid={bansValid}
        />

        <RaceDraftPickPhase
          draft={draft}
          loading={loading}
          landmarksEnabled={landmarksEnabled}
          landmarksBanned={landmarksBanned}
          landmarksRandomCount={landmarksRandomCount}
          landmarksDrawn={landmarksDrawn}
          currentPlayer={currentPlayer}
          currentPlayerId={currentPlayerId}
          assignedCount={assignedCount}
          totalPlayers={totalPlayers}
          isLastPick={isLastPick}
          setPendingPick={setPendingPick}
          setConfirmLastPickOpen={setConfirmLastPickOpen}
          onPick={onPick}
          order={order}
          playersById={playersById}
        />
      </div>
    </div>
  )
}
