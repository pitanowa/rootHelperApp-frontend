import type { CSSProperties } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'

import PlayersPage from './pages/PlayersPage'
import GroupsPage from './pages/GroupsPage'
import GroupDetailsPage from './pages/GroupDetailsPage'
import LeaguePage from './pages/LeaguePage'
import MatchPage from './pages/MatchPage'
import HomePage from './pages/HomePage'

import { createGroupLeague, listGroupLeagues, listGroups } from './features/groups/api'
import type { Group, League } from './types'
import { useAppCtx } from './useAppCtx'

function TopNav() {
  const { selectedGroupId, setSelectedGroupId, selectedLeagueId, setSelectedLeagueId } = useAppCtx()

  const [groups, setGroups] = useState<Group[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [loadingLeagues, setLoadingLeagues] = useState(false)

  const [showLeagueCreate, setShowLeagueCreate] = useState(false)
  const [newLeagueName, setNewLeagueName] = useState('')
  const [creatingLeague, setCreatingLeague] = useState(false)
  const [leagueError, setLeagueError] = useState<string | null>(null)

  const loadLeagues = useCallback(
    async (groupId: number) => {
      setLoadingLeagues(true)
      setLeagueError(null)
      try {
        const data = await listGroupLeagues(groupId)
        const nextLeagues = data ?? []
        setLeagues(nextLeagues)

        const hasSelected = nextLeagues.some((league) => league.id === selectedLeagueId)
        if (!hasSelected) {
          setSelectedLeagueId(nextLeagues[0]?.id ?? null)
        }
      } catch {
        setLeagues([])
        setSelectedLeagueId(null)
        setLeagueError('Nie udalo sie pobrac lig dla tej grupy.')
      } finally {
        setLoadingLeagues(false)
      }
    },
    [selectedLeagueId, setSelectedLeagueId],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadingGroups(true)
      try {
        const data = await listGroups()
        if (cancelled) return
        setGroups(data ?? [])
      } finally {
        if (!cancelled) setLoadingGroups(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedGroupId) {
      setLeagues([])
      setSelectedLeagueId(null)
      setShowLeagueCreate(false)
      setLeagueError(null)
      return
    }

    void loadLeagues(selectedGroupId)
  }, [loadLeagues, selectedGroupId, setSelectedLeagueId])

  const barWrap: CSSProperties = {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '14px 16px 0',
  }

  const bar: CSSProperties = {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 16,
    padding: 10,
    border: '1px solid rgba(196,63,75,0.34)',
    background:
      'radial-gradient(900px 220px at 10% 0%, rgba(193,38,61,0.25), transparent 60%), linear-gradient(180deg, rgba(20,7,12,0.95), rgba(10,4,7,0.98))',
    boxShadow: '0 16px 50px rgba(0,0,0,0.5), 0 0 32px rgba(137,19,40,0.18)',
  }

  const linkStyle = ({ isActive }: { isActive: boolean }): CSSProperties => ({
    textDecoration: 'none',
    color: '#fbeff1',
    fontWeight: 900,
    letterSpacing: 0.2,
    borderRadius: 12,
    padding: '10px 14px',
    border: isActive ? '1px solid rgba(255,95,116,0.55)' : '1px solid rgba(213,128,139,0.3)',
    background: isActive
      ? 'linear-gradient(135deg, rgba(193,38,61,0.44), rgba(117,15,31,0.34))'
      : 'rgba(255,255,255,0.04)',
    boxShadow: isActive ? '0 10px 26px rgba(137,19,40,0.3)' : 'none',
    transition: 'transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
  })

  const contextWrap: CSSProperties = {
    marginLeft: 'auto',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  }

  const selectStyle: CSSProperties = {
    height: 38,
    borderRadius: 10,
    border: '1px solid rgba(213,128,139,0.3)',
    background: 'linear-gradient(180deg, rgba(26,9,14,0.95), rgba(14,5,9,0.98))',
    color: '#fbeff1',
    padding: '0 10px',
    minWidth: 170,
    fontWeight: 700,
    outline: 'none',
  }

  const minorButton = (disabled: boolean): CSSProperties => ({
    height: 38,
    borderRadius: 10,
    border: '1px solid rgba(213,128,139,0.3)',
    background: disabled ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, rgba(193,38,61,0.42), rgba(117,15,31,0.34))',
    color: disabled ? 'rgba(251,239,241,0.45)' : '#fbeff1',
    padding: '0 12px',
    fontWeight: 900,
    cursor: disabled ? 'not-allowed' : 'pointer',
  })

  const openLeagueLinkStyle: CSSProperties = {
    ...minorButton(!selectedLeagueId),
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    pointerEvents: selectedLeagueId ? 'auto' : 'none',
  }

  const createLeague = async () => {
    if (!selectedGroupId || !newLeagueName.trim() || creatingLeague) return

    setCreatingLeague(true)
    setLeagueError(null)
    try {
      const created = await createGroupLeague(selectedGroupId, newLeagueName.trim())
      setNewLeagueName('')
      setShowLeagueCreate(false)
      await loadLeagues(selectedGroupId)
      setSelectedLeagueId(created.id)
    } catch {
      setLeagueError('Nie udalo sie utworzyc ligi.')
    } finally {
      setCreatingLeague(false)
    }
  }

  return (
    <div style={barWrap}>
      <nav style={bar}>
        <NavLink to="/" style={linkStyle}>
          Home
        </NavLink>
        <NavLink to="/players" style={linkStyle}>
          Players
        </NavLink>
        <NavLink to="/groups" style={linkStyle}>
          Groups
        </NavLink>

        <div style={contextWrap}>
          <select
            style={selectStyle}
            value={selectedGroupId ?? ''}
            onChange={(e) => {
              const groupId = e.target.value ? Number(e.target.value) : null
              setSelectedGroupId(groupId)
              setSelectedLeagueId(null)
              setShowLeagueCreate(false)
              setLeagueError(null)
            }}
            disabled={loadingGroups || groups.length === 0}
          >
            <option value="">{loadingGroups ? 'Ladowanie grup...' : 'Wybierz grupe'}</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>

          <select
            style={selectStyle}
            value={selectedLeagueId ?? ''}
            onChange={(e) => setSelectedLeagueId(e.target.value ? Number(e.target.value) : null)}
            disabled={!selectedGroupId || loadingLeagues || leagues.length === 0}
          >
            <option value="">
              {!selectedGroupId ? 'Najpierw wybierz grupe' : loadingLeagues ? 'Ladowanie lig...' : 'Brak lig'}
            </option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>

          <Link to={selectedLeagueId ? `/leagues/${selectedLeagueId}` : '#'} style={openLeagueLinkStyle}>
            Otwórz Ligę
          </Link>

          {!showLeagueCreate ? (
            <button
              type="button"
              onClick={() => setShowLeagueCreate(true)}
              disabled={!selectedGroupId}
              style={minorButton(!selectedGroupId)}
            >
              + Liga
            </button>
          ) : (
            <>
              <input
                value={newLeagueName}
                onChange={(e) => setNewLeagueName(e.target.value)}
                placeholder="Nazwa ligi..."
                style={{
                  ...selectStyle,
                  minWidth: 180,
                }}
                disabled={creatingLeague}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void createLeague()
                  }
                }}
              />
              <button
                type="button"
                onClick={() => void createLeague()}
                disabled={creatingLeague || !newLeagueName.trim()}
                style={minorButton(creatingLeague || !newLeagueName.trim())}
              >
                {creatingLeague ? 'Tworze...' : 'Utworz'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeagueCreate(false)
                  setNewLeagueName('')
                  setLeagueError(null)
                }}
                disabled={creatingLeague}
                style={minorButton(creatingLeague)}
              >
                Anuluj
              </button>
            </>
          )}
        </div>
      </nav>
      {leagueError && (
        <div
          style={{
            marginTop: 8,
            color: '#ffd5dc',
            fontSize: 13,
            fontWeight: 700,
            paddingLeft: 4,
          }}
        >
          {leagueError}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <TopNav />
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
