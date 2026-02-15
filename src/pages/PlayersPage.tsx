import PlayersHeaderCard from '../features/players/components/PlayersHeaderCard'
import PlayersList from '../features/players/components/PlayersList'
import { usePlayersPageController } from '../features/players/hooks/usePlayersPageController'
import { playersPageUi } from '../features/players/playersPageUi'

export default function PlayersPage() {
  const {
    sortedPlayers,
    name,
    loading,
    error,
    setName,
    loadPlayers,
    addPlayer,
    removePlayer,
  } = usePlayersPageController()

  return (
    <div style={playersPageUi.page}>
      <div style={playersPageUi.backdrop}>
        <PlayersHeaderCard
          name={name}
          loading={loading}
          error={error}
          onNameChange={setName}
          onAddPlayer={addPlayer}
          onRefresh={loadPlayers}
          ui={playersPageUi}
        />

        <PlayersList
          players={sortedPlayers}
          loading={loading}
          onRemovePlayer={async (id) => {
            const ok = window.confirm('Remove this player?')
            if (!ok) return
            await removePlayer(id)
          }}
          ui={playersPageUi}
        />
      </div>
    </div>
  )
}
