import { Link } from 'react-router-dom'
import type { Group } from '../../../types'
import type { GroupsPageUi } from '../groupsPageUi'

type Props = {
  groups: Group[]
  ui: GroupsPageUi
}

export default function GroupsList({ groups, ui }: Props) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={ui.list}>
        {groups.map((g) => (
          <Link
            key={g.id}
            to={`/groups/${g.id}`}
            style={ui.groupLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.borderColor = 'rgba(220,38,38,0.18)'
              e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,0.42), 0 0 40px rgba(220,38,38,0.10)'
              e.currentTarget.style.background =
                'radial-gradient(700px 260px at 10% 0%, rgba(220,38,38,0.14), transparent 60%), linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
              e.currentTarget.style.boxShadow = '0 14px 38px rgba(0,0,0,0.35)'
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))'
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={ui.groupName}>{g.name}</div>
              <div style={{ fontSize: 12, opacity: 0.72, marginTop: 3, color: 'rgba(255,255,255,0.70)' }}>
                Open leagues and matches →
              </div>
            </div>

            <div style={ui.openHint}>Open →</div>
          </Link>
        ))}

        {groups.length === 0 && (
          <div style={ui.empty}>No groups yet. Create the first one above.</div>
        )}
      </div>
    </div>
  )
}
