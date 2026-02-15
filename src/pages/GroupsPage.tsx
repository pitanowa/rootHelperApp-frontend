import GroupsHeaderCard from '../features/groups/components/GroupsHeaderCard'
import GroupsList from '../features/groups/components/GroupsList'
import { useGroupsPageController } from '../features/groups/hooks/useGroupsPageController'
import { groupsPageUi } from '../features/groups/groupsPageUi'

export default function GroupsPage() {
  const {
    sortedGroups,
    name,
    loading,
    error,
    setName,
    loadGroups,
    createGroup,
  } = useGroupsPageController()

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

        <GroupsList groups={sortedGroups} ui={groupsPageUi} />
      </div>
    </div>
  )
}
