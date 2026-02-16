import { useParams } from 'react-router-dom'
import { useAppCtx } from '../useAppCtx'
import GroupDetailsHeader, { GroupDetailsTopBar } from '../features/groups/components/GroupDetailsHeader'
import GroupLeaguesCard from '../features/groups/components/GroupLeaguesCard'
import GroupMembersCard from '../features/groups/components/GroupMembersCard'
import { useGroupDetailsController } from '../features/groups/hooks/useGroupDetailsController'
import { groupDetailsPageUi } from '../features/groups/groupDetailsPageUi'

type Props = {
  gameKey: string
}

export default function GroupDetailsPage({ gameKey }: Props) {
  const { groupId } = useParams()
  const { setSelectedGroupId } = useAppCtx()

  const gid = Number(groupId)

  const {
    group,
    loading,
    error,
    selectedPlayerId,
    setSelectedPlayerId,
    newLeagueName,
    setNewLeagueName,
    sortedLeagues,
    sortedMembers,
    availablePlayers,
    loadAll,
    addMember,
    removeMember,
    createLeague,
  } = useGroupDetailsController({
    gameKey,
    groupId: gid,
    onSelectedGroupIdChange: setSelectedGroupId,
  })

  return (
    <div style={groupDetailsPageUi.page}>
      <GroupDetailsTopBar gameKey={gameKey} ui={groupDetailsPageUi} />

      {error && (
        <div style={groupDetailsPageUi.err}>
          <b>Error:</b> {error}
        </div>
      )}

      {!group ? (
        <div style={{ padding: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>{loading ? 'Loading...' : 'Group not found'}</div>
      ) : (
        <>
          <GroupDetailsHeader
            group={group}
            membersCount={sortedMembers.length}
            leaguesCount={sortedLeagues.length}
            ui={groupDetailsPageUi}
          />

          <div style={groupDetailsPageUi.twoCol}>
            <GroupMembersCard
              loading={loading}
              selectedPlayerId={selectedPlayerId}
              setSelectedPlayerId={setSelectedPlayerId}
              availablePlayers={availablePlayers}
              sortedMembers={sortedMembers}
              onAddMember={addMember}
              onRefresh={loadAll}
              onRemoveMember={async (playerId) => {
                const ok = window.confirm('Remove this member from group?')
                if (!ok) return
                await removeMember(playerId)
              }}
              ui={groupDetailsPageUi}
            />

            <GroupLeaguesCard
              gameKey={gameKey}
              loading={loading}
              newLeagueName={newLeagueName}
              setNewLeagueName={setNewLeagueName}
              sortedLeagues={sortedLeagues}
              onCreateLeague={createLeague}
              ui={groupDetailsPageUi}
            />
          </div>
        </>
      )}
    </div>
  )
}
