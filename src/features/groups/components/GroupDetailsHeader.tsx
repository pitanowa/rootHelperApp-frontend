import { Link } from 'react-router-dom'
import type { GroupDetails } from '../../../types'
import { gameGroupsPath } from '../../../routing/paths'
import type { GroupDetailsPageUi } from '../groupDetailsPageUi'

type Props = {
  group: GroupDetails
  membersCount: number
  leaguesCount: number
  ui: GroupDetailsPageUi
}

export default function GroupDetailsHeader({ group, membersCount, leaguesCount, ui }: Props) {
  return (
    <div style={{ ...ui.glowHeader, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 1000, fontSize: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.name}</div>
          <div style={{ fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>id: {group.id}</div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span style={ui.badge}>👥 {membersCount} members</span>
          <span style={ui.badge}>🏆 {leaguesCount} leagues</span>
        </div>
      </div>
    </div>
  )
}

type TopBarProps = {
  gameKey: string
  ui: GroupDetailsPageUi
}

export function GroupDetailsTopBar({ gameKey, ui }: TopBarProps) {
  return (
    <div style={ui.topBar}>
      <div>
        <h1 style={ui.title}>Group</h1>
        <div style={ui.subtitle}>Manage members and leagues inside this group.</div>
      </div>

      <Link
        to={gameGroupsPath(gameKey)}
        style={ui.backLink}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.borderColor = 'rgba(220,38,38,0.18)'
          e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.35), 0 0 40px rgba(220,38,38,0.10)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        ← back
      </Link>
    </div>
  )
}
