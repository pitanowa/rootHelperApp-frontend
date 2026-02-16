import { Navigate, Route, Routes } from 'react-router-dom'

import { DEFAULT_GAME_KEY } from './core/games/registry'
import GameLayout from './core/routing/GameLayout'
import LegacyGameLayoutRedirect from './core/routing/LegacyGameLayoutRedirect'
import GameSelectPage from './pages/GameSelectPage'
import { gameGroupsPath, gameHomePath, gamePlayersPath } from './routing/paths'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GameSelectPage />} />
      <Route path="/select-game" element={<GameSelectPage />} />
      <Route path="/:gameKey/*" element={<GameLayout />} />

      <Route path="/g/:gameKey/*" element={<LegacyGameLayoutRedirect />} />
      <Route path="/players" element={<Navigate to={gamePlayersPath(DEFAULT_GAME_KEY)} replace />} />
      <Route path="/groups" element={<Navigate to={gameGroupsPath(DEFAULT_GAME_KEY)} replace />} />
      <Route path="/groups/:groupId" element={<Navigate to={gameGroupsPath(DEFAULT_GAME_KEY)} replace />} />
      <Route path="/leagues/:leagueId" element={<Navigate to={gameHomePath(DEFAULT_GAME_KEY)} replace />} />
      <Route path="/matches/:matchId" element={<Navigate to={gameHomePath(DEFAULT_GAME_KEY)} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
