import type { CSSProperties } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'

import PlayersPage from './core/pages/PlayersPage'
import GroupsPage from './core/pages/GroupsPage'
import GroupDetailsPage from './core/pages/GroupDetailsPage'
import HomePage from './core/pages/HomePage'
import GameSelectPage from './core/pages/GameSelectPage'

import { createGroupLeague, listGroupLeagues, listGroups } from './features/groups/api'
import { DEFAULT_GAME_KEY, GAME_MODULES, resolveGameModule } from './core/games/registry'
import { applyGameTheme } from './core/theme/applyGameTheme'
import { gameGroupsPath, gameHomePath, gameLeaguePath, gamePlayersPath } from './routing/paths'
import type { Group, League } from './types'
import type { GameModule } from './core/games/types'
import { useAppCtx } from './useAppCtx'

function TopNav({ module }: { module: GameModule }) {
  const gameKey = module.key
  const { selectedGameKey, setSelectedGameKey, selectedGroupId, setSelectedGroupId, selectedLeagueId, setSelectedLeagueId } = useAppCtx()
  const nav = useNavigate()

  const [groups, setGroups] = useState<Group[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [loadingLeagues, setLoadingLeagues] = useState(false)

  const [showLeagueCreate, setShowLeagueCreate] = useState(false)
  const [newLeagueName, setNewLeagueName] = useState('')
  const [creatingLeague, setCreatingLeague] = useState(false)
  const [leagueError, setLeagueError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedGameKey !== gameKey) {
      setSelectedGameKey(gameKey)
      setSelectedGroupId(null)
      setSelectedLeagueId(null)
    }
  }, [gameKey, selectedGameKey, setSelectedGameKey, setSelectedGroupId, setSelectedLeagueId])

  const loadLeagues = useCallback(
    async (groupId: number) => {
      setLoadingLeagues(true)
      setLeagueError(null)
      try {
        const data = await listGroupLeagues(gameKey, groupId)
        const nextLeagues = data ?? []
        setLeagues(nextLeagues)

        const hasSelected = nextLeagues.some((league) => league.id === selectedLeagueId)
        if (!hasSelected) {
          setSelectedLeagueId(nextLeagues[0]?.id ?? null)
        }
      } catch {
        setLeagues([])
        setSelectedLeagueId(null)
        setLeagueError('Failed to fetch leagues for this group.')
      } finally {
        setLoadingLeagues(false)
      }
    },
    [gameKey, selectedLeagueId, setSelectedLeagueId],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadingGroups(true)
      try {
        const data = await listGroups(gameKey)
        if (cancelled) return
        setGroups(data ?? [])
      } finally {
        if (!cancelled) setLoadingGroups(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [gameKey])

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
      const created = await createGroupLeague(gameKey, selectedGroupId, newLeagueName.trim())
      setNewLeagueName('')
      setShowLeagueCreate(false)
      await loadLeagues(selectedGroupId)
      setSelectedLeagueId(created.id)
    } catch {
      setLeagueError('Failed to create league.')
    } finally {
      setCreatingLeague(false)
    }
  }

  return (
    <div style={barWrap}>
      <nav style={bar}>
        <NavLink to={gameHomePath(gameKey)} style={linkStyle} end>
          Home
        </NavLink>
        <NavLink to={gamePlayersPath(gameKey)} style={linkStyle}>
          Players
        </NavLink>
        <NavLink to={gameGroupsPath(gameKey)} style={linkStyle}>
          Groups
        </NavLink>

        <div style={contextWrap}>
          <select
            style={selectStyle}
            value={gameKey}
            onChange={(e) => {
              const nextModule = GAME_MODULES.find((game) => game.key === e.target.value)
              if (!nextModule) return
              setSelectedGameKey(nextModule.key)
              setSelectedGroupId(null)
              setSelectedLeagueId(null)
              nav(gameHomePath(nextModule.key))
            }}
          >
            {GAME_MODULES.map((game) => (
              <option key={game.key} value={game.key}>
                {game.name}
              </option>
            ))}
          </select>

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
            <option value="">{loadingGroups ? 'Loading groups...' : 'Select group'}</option>
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
              {!selectedGroupId ? 'Select group first' : loadingLeagues ? 'Loading leagues...' : 'No leagues'}
            </option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>

          <Link to={selectedLeagueId ? gameLeaguePath(gameKey, selectedLeagueId) : '#'} style={openLeagueLinkStyle}>
            Open League
          </Link>

          {!showLeagueCreate ? (
            <button
              type="button"
              onClick={() => setShowLeagueCreate(true)}
              disabled={!selectedGroupId}
              style={minorButton(!selectedGroupId)}
            >
              + League
            </button>
          ) : (
            <>
              <input
                value={newLeagueName}
                onChange={(e) => setNewLeagueName(e.target.value)}
                placeholder="League name..."
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
                {creatingLeague ? 'Creating...' : 'Create'}
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
                Cancel
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

function GameRoutes({ module }: { module: GameModule }) {
  const LeaguePage = module.LeaguePage
  const MatchPage = module.MatchPage

  return (
    <Routes>
      <Route index element={<HomePage gameKey={module.key} />} />
      <Route path="players" element={<PlayersPage gameKey={module.key} />} />
      <Route path="groups" element={<GroupsPage gameKey={module.key} />} />
      <Route path="groups/:groupId" element={<GroupDetailsPage gameKey={module.key} />} />
      <Route path="leagues/:leagueId" element={<LeaguePage gameKey={module.key} />} />
      <Route path="matches/:matchId" element={<MatchPage gameKey={module.key} />} />
      <Route path="*" element={<Navigate to={gameHomePath(module.key)} replace />} />
    </Routes>
  )
}

function GameLayout() {
  const { gameKey: routeGameKey } = useParams()
  const fallback = resolveGameModule(DEFAULT_GAME_KEY)
  const module = resolveGameModule(routeGameKey) ?? fallback

  useEffect(() => {
    if (module) applyGameTheme(module.themeTokens)
  }, [module])

  if (!module) {
    return <Navigate to="/" replace />
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <TopNav module={module} />
      <GameRoutes module={module} />
    </div>
  )
}

function LegacyGameLayoutRedirect() {
  const { gameKey } = useParams()
  const module = resolveGameModule(gameKey) ?? resolveGameModule(DEFAULT_GAME_KEY)
  return <Navigate to={gameHomePath(module?.key ?? DEFAULT_GAME_KEY)} replace />
}

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
