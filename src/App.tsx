import { NavLink, Route, Routes } from 'react-router-dom'
import PlayersPage from './pages/PlayersPage'
import GroupsPage from './pages/GroupsPage'
import GroupDetailsPage from './pages/GroupDetailsPage'
import LeaguePage from './pages/LeaguePage'
import MatchPage from './pages/MatchPage'
import HomePage from './pages/HomePage'

function Nav() {
  const ui = {
    barWrap: {
      padding: 16,
      maxWidth: 920,
      margin: '0 auto',
    } as const,

    bar: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: 10,
      borderRadius: 18,
      border: '1px solid rgba(255,255,255,0.08)',
      background:
        'radial-gradient(900px 420px at 15% 0%, rgba(220,38,38,0.20), transparent 55%), radial-gradient(800px 360px at 90% 10%, rgba(59,130,246,0.16), transparent 60%), linear-gradient(180deg, rgba(10,10,12,0.92), rgba(16,10,12,0.88))',
      boxShadow: '0 22px 60px rgba(0,0,0,0.40), 0 0 40px rgba(220,38,38,0.08)',
      backdropFilter: 'blur(10px)',
    } as const,

    link: (active: boolean) =>
      ({
        padding: '10px 12px',
        borderRadius: 14,
        textDecoration: 'none',
        border: active ? '1px solid rgba(248,113,113,0.30)' : '1px solid rgba(255,255,255,0.14)',
        background: active
          ? 'linear-gradient(135deg, rgba(220,38,38,0.30), rgba(255,255,255,0.05))'
          : 'rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.90)',
        fontWeight: 1000,
        letterSpacing: 0.2,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: active ? '0 18px 40px rgba(220,38,38,0.12)' : 'none',
        transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
        userSelect: 'none',
      }) as const,

    rightHint: {
      marginLeft: 'auto',
      fontSize: 12,
      color: 'rgba(255,255,255,0.70)',
      padding: '8px 10px',
      borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(255,255,255,0.04)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
    } as const,
  }

  const linkStyle = ({ isActive }: { isActive: boolean }) => ui.link(isActive)

  return (
    <div style={ui.barWrap}>
      <div style={ui.bar}>
        <NavLink
          to="/"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          🏠 Home
        </NavLink>

        <NavLink
          to="/players"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          🧑‍🤝‍🧑 Players
        </NavLink>

        <NavLink
          to="/groups"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          🛡️ Groups
        </NavLink>

        <div style={ui.rightHint}>🩸 ROOT League</div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
        <Route path="/leagues/:leagueId" element={<LeaguePage />} />
        <Route path="/matches/:matchId" element={<MatchPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  )
}
