import { Navigate, useParams } from 'react-router-dom'
import { resolveGameModule } from '../games/registry'
import { gameHomePath } from '../../routing/paths'

export default function LegacyGameLayoutRedirect() {
  const { gameKey } = useParams()
  const module = resolveGameModule(gameKey)

  if (!module) {
    return <Navigate to="/" replace />
  }

  return <Navigate to={gameHomePath(module.key)} replace />
}
