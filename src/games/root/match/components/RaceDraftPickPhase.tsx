import { RACE_ICON, raceLabel } from '../../../../constants/races'
import Tooltip from '../../../../components/Tooltip'
import { lmLabel, lmTooltipContent, type LandmarkId } from '../../../../data/landmarks'
import type { DraftState, MatchPlayerState } from '../../../../features/matches/types'
import { raceDraftUi as ui } from '../raceDraftUi'
import RaceDraftBadge from './RaceDraftBadge'

type Props = {
  draft: DraftState
  loading: boolean
  landmarksEnabled?: boolean
  landmarksBanned?: string | null
  landmarksRandomCount?: number | null
  landmarksDrawn?: string[]
  currentPlayer: MatchPlayerState | null
  currentPlayerId: number | null
  assignedCount: number
  totalPlayers: number
  isLastPick: boolean
  setPendingPick: (pick: { playerId: number; race: string } | null) => void
  setConfirmLastPickOpen: (open: boolean) => void
  onPick: (playerId: number, race: string) => void | Promise<void>
  order: number[]
  playersById: Map<number, MatchPlayerState>
}

export default function RaceDraftPickPhase({
  draft,
  loading,
  landmarksEnabled,
  landmarksBanned,
  landmarksRandomCount,
  landmarksDrawn,
  currentPlayer,
  currentPlayerId,
  assignedCount,
  totalPlayers,
  isLastPick,
  setPendingPick,
  setConfirmLastPickOpen,
  onPick,
  order,
  playersById,
}: Props) {
  if (draft.phase !== 'PICK') return null

  return (
    <>
      {landmarksEnabled && (
        <div style={ui.card}>
          <div style={ui.cardHeader}>
            <div>
              <h2 style={ui.h2}>Landmarks drawn</h2>
              <div style={ui.sub}>
                Banned: <b>{landmarksBanned ?? '—'}</b> • Draw count: <b>{landmarksDrawn?.length ?? landmarksRandomCount ?? '—'}</b>
              </div>
            </div>
            <div style={ui.rightBadges}>
              <RaceDraftBadge variant="info" text={`Drawn: ${(landmarksDrawn ?? []).length}`} />
            </div>
          </div>

          {(landmarksDrawn ?? []).length === 0 ? (
            <div style={ui.sub}>Not drawn yet.</div>
          ) : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {landmarksDrawn!.map((id) => (
                <Tooltip key={id} placement="bottom" content={lmTooltipContent(id as LandmarkId)}>
                  <span style={{ ...ui.badge('ghost'), cursor: 'help' }}>🏷️ {lmLabel(id as LandmarkId)}</span>
                </Tooltip>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={ui.card}>
        <div style={ui.cardHeader}>
          <div>
            <div style={ui.sub}>Now picking</div>
            <div style={{ fontSize: 20, fontWeight: 1000, letterSpacing: 0.3 }}>
              {currentPlayer ? currentPlayer.playerName : currentPlayerId != null ? `playerId=${currentPlayerId}` : '—'}
            </div>
          </div>

          <div style={ui.rightBadges}>
            <RaceDraftBadge variant="ghost" text={`Pool: ${draft.pool.length}`} />
            <RaceDraftBadge variant="ghost" text={`Assigned: ${assignedCount}/${totalPlayers}`} />
          </div>
        </div>
      </div>

      <div style={ui.card}>
        <h2 style={ui.h2}>Available races</h2>

        {draft.pool.length === 0 ? (
          <div style={ui.sub}>No races in pool.</div>
        ) : (
          <div style={ui.tileGrid}>
            {draft.pool.map((race, idx) => {
              const disabled = loading || draft.status !== 'DRAFTING' || draft.currentPlayerId == null
              return (
                <button
                  key={`${race}-${idx}`}
                  onClick={() => {
                    if (draft.currentPlayerId == null) return
                    if (isLastPick) {
                      setPendingPick({ playerId: draft.currentPlayerId, race })
                      setConfirmLastPickOpen(true)
                      return
                    }
                    onPick(draft.currentPlayerId, race)
                  }}
                  disabled={disabled}
                  title={raceLabel(race)}
                  style={ui.raceTile('pick', disabled)}
                  onMouseEnter={(e) => {
                    if (disabled) return
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <img src={RACE_ICON[race]} alt={race} style={ui.icon32} />
                </button>
              )
            })}
          </div>
        )}

        <div style={ui.hint}>Tip: click a race to assign it to the current player. (Backend enforces turn order.)</div>
      </div>

      <div style={ui.card}>
        <h2 style={ui.h2}>Players</h2>

        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {order.map((pid, idx) => {
            const p = playersById.get(pid)
            const isCurrent = pid === draft.currentPlayerId && draft.status === 'DRAFTING'
            const race = p?.race ?? null

            return (
              <div
                key={pid}
                style={ui.playerRow(isCurrent)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={ui.playerLeft}>
                  <div style={ui.playerName}>
                    {idx + 1}. {p?.playerName ?? `playerId=${pid}`}
                  </div>
                  {isCurrent && <RaceDraftBadge variant="hot" text="PICKING" />}
                </div>

                <div style={ui.playerRight}>
                  <RaceDraftBadge variant="ghost" text={raceLabel(race)} />
                  {race ? (
                    <span title={raceLabel(race)} style={ui.racePill}>
                      <img src={RACE_ICON[race]} alt={raceLabel(race)} style={{ width: 22, height: 22 }} />
                    </span>
                  ) : (
                    <RaceDraftBadge variant="ghost" text="—" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

