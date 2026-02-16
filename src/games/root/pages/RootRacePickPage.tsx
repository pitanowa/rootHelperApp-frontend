import RacePickLandmarksSection from '../match/components/RacePickLandmarksSection'
import RacePickRacePool from '../match/components/RacePickRacePool'
import RacePickTopBar from '../match/components/RacePickTopBar'
import { useRacePickState } from '../match/hooks/useRacePickState'
import type { RacePickViewProps } from '../match/racePickTypes'

export default function RacePickView(props: RacePickViewProps) {
  const {
    players,
    loading,
    error,
    onPick,
    onRefresh,
    ui,
    landmarksEnabled,
    landmarkBanned,
    landmarksDrawn,
    landmarksRandomCount,
    onSetLandmarksManual,
  } = props

  const {
    selectedPlayerId,
    setSelectedPlayerId,
    localPickedLandmarks,
    setLocalPickedLandmarks,
    toggleLandmark,
    taken,
    pool,
    selectedPlayer,
  } = useRacePickState(players, landmarksDrawn)

  return (
    <div style={ui.page}>
      <div style={ui.shell}>
        <RacePickTopBar
          players={players}
          selectedPlayerId={selectedPlayerId}
          loading={loading}
          onRefresh={onRefresh}
          onSelectPlayer={setSelectedPlayerId}
          ui={ui}
        />

        <RacePickLandmarksSection
          loading={loading}
          landmarksEnabled={landmarksEnabled}
          landmarkBanned={landmarkBanned}
          landmarksRandomCount={landmarksRandomCount}
          landmarksDrawn={landmarksDrawn}
          localPickedLandmarks={localPickedLandmarks}
          setLocalPickedLandmarks={setLocalPickedLandmarks}
          toggleLandmark={toggleLandmark}
          onSetLandmarksManual={onSetLandmarksManual}
          ui={ui}
        />

        {error && <div style={ui.errorBox}>Error: {error}</div>}

        <RacePickRacePool
          players={players}
          loading={loading}
          taken={taken}
          pool={pool}
          selectedPlayer={selectedPlayer}
          onPick={onPick}
          landmarksEnabled={landmarksEnabled}
          landmarksDrawn={landmarksDrawn}
          ui={ui}
        />
      </div>
    </div>
  )
}


