import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { createGroupLeague, listGroupLeagues, listGroups } from '../../features/groups/api'
import { GAME_MODULES, resolveGameModule } from '../games/registry'
import { gameGroupsPath, gameHomePath, gameLeaguePath, gamePlayersPath } from '../../routing/paths'
import type { Group, League } from '../../types'
import type { GameModule } from '../games/types'
import { useAppCtx } from '../../useAppCtx'

type GameNavOption = {
  key: string
  label: string
}

function getFallbackOptions(): GameNavOption[] {
  return GAME_MODULES.map((module) => ({ key: module.key, label: module.name }))
}

export default function TopNav({ module }: { module: GameModule }) {
  const gameKey = module.key
  const {
    selectedGameKey,
    setSelectedGameKey,
    selectedGroupId,
    setSelectedGroupId,
    selectedLeagueId,
    setSelectedLeagueId,
    supportedGames,
  } = useAppCtx()
  const nav = useNavigate()

  const gameOptions = useMemo<GameNavOption[]>(() => {
    const dynamic = supportedGames
      .map((game) => {
        const mapped = resolveGameModule(game.key)
        if (!mapped) return null
        return {
          key: mapped.key,
          label: game.displayName,
        }
      })
      .filter((game): game is GameNavOption => game != null)

    return dynamic.length > 0 ? dynamic : getFallbackOptions()
  }, [supportedGames])

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
    border: 'var(--app-shell-border)',
    background: 'var(--app-shell-bg)',
    boxShadow: 'var(--app-shell-shadow)',
  }

  const linkStyle = ({ isActive }: { isActive: boolean }): CSSProperties => ({
    textDecoration: 'none',
    color: 'var(--app-text)',
    fontWeight: 900,
    letterSpacing: 0.2,
    borderRadius: 12,
    padding: '10px 14px',
    border: isActive ? 'var(--app-accent-border)' : 'var(--app-soft-border)',
    background: isActive ? 'var(--app-accent-soft-gradient)' : 'rgba(255,255,255,0.04)',
    boxShadow: isActive ? 'var(--app-accent-glow)' : 'none',
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
    border: 'var(--app-input-border)',
    background: 'var(--app-input-bg)',
    color: 'var(--app-text)',
    padding: '0 10px',
    minWidth: 170,
    fontWeight: 700,
    outline: 'none',
  }

  const optionStyle: CSSProperties = {
    color: '#0b1220',
    backgroundColor: '#f4f7ff',
  }

  const minorButton = (disabled: boolean): CSSProperties => ({
    height: 38,
    borderRadius: 10,
    border: 'var(--app-input-border)',
    background: disabled ? 'rgba(255,255,255,0.03)' : 'var(--app-accent-soft-gradient)',
    color: disabled ? 'rgba(var(--app-text-rgb),0.45)' : 'var(--app-text)',
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
              const nextModule = resolveGameModule(e.target.value)
              if (!nextModule) return
              setSelectedGameKey(nextModule.key)
              setSelectedGroupId(null)
              setSelectedLeagueId(null)
              nav(gameHomePath(nextModule.key))
            }}
          >
            {gameOptions.map((game) => (
              <option key={game.key} value={game.key} style={optionStyle}>
                {game.label}
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
            <option value="" style={optionStyle}>
              {loadingGroups ? 'Loading groups...' : 'Select group'}
            </option>
            {groups.map((group) => (
              <option key={group.id} value={group.id} style={optionStyle}>
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
            <option value="" style={optionStyle}>
              {!selectedGroupId ? 'Select group first' : loadingLeagues ? 'Loading leagues...' : 'No leagues'}
            </option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id} style={optionStyle}>
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
            color: 'rgba(var(--app-text-rgb),0.86)',
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
