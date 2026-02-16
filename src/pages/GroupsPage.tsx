import GroupsHeaderCard from '../features/groups/components/GroupsHeaderCard'
import GroupsList from '../features/groups/components/GroupsList'
import { useGroupsPageController } from '../features/groups/hooks/useGroupsPageController'
import { groupsPageUi } from '../features/groups/groupsPageUi'

type Props = {
  gameKey: string
}

export default function GroupsPage({ gameKey }: Props) {
  const {
    sortedGroups,
    name,
    loading,
    error,
    setName,
    loadGroups,
    createGroup,
  } = useGroupsPageController(gameKey)

  return (
    <div style={groupsPageUi.page}>
      <div style={groupsPageUi.backdrop}>
        <GroupsHeaderCard
          name={name}
          loading={loading}
          error={error}
          onNameChange={setName}
          onCreateGroup={createGroup}
          onRefresh={loadGroups}
          ui={groupsPageUi}
        />

        <GroupsList groups={sortedGroups} gameKey={gameKey} ui={groupsPageUi} />
      </div>
    </div>
  )
}
