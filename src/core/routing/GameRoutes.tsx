import { Navigate, Route, Routes } from 'react-router-dom'

import PlayersPage from '../../pages/PlayersPage'
import GroupsPage from '../../pages/GroupsPage'
import GroupDetailsPage from '../../pages/GroupDetailsPage'
import HomePage from '../../pages/HomePage'

import { gameHomePath } from '../../routing/paths'
import type { GameCapabilities, GameModule } from '../games/types'

type Props = {
  module: GameModule
  capabilities: GameCapabilities
}

export default function GameRoutes({ module, capabilities }: Props) {
  const LeaguePage = module.LeaguePage
  const MatchPage = module.MatchPage

  return (
    <Routes>
      <Route index element={<HomePage gameKey={module.key} />} />
      <Route path="players" element={<PlayersPage gameKey={module.key} />} />
      <Route path="groups" element={<GroupsPage gameKey={module.key} />} />
      <Route path="groups/:groupId" element={<GroupDetailsPage gameKey={module.key} />} />
      <Route path="leagues/:leagueId" element={<LeaguePage gameKey={module.key} capabilities={capabilities} />} />
      <Route path="matches/:matchId" element={<MatchPage gameKey={module.key} capabilities={capabilities} />} />
      <Route path="*" element={<Navigate to={gameHomePath(module.key)} replace />} />
    </Routes>
  )
}
