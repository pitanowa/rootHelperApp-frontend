import { RACE_ICON, RACE_IDS, raceLabel } from '../../../constants/races'
import Tooltip from '../../../components/Tooltip'
import { LANDMARKS, lmLabel, lmTooltipContent, type LandmarkId } from '../../../data/landmarks'
import type { DraftState } from '../types'
import { raceDraftUi as ui } from '../raceDraftUi'
import RaceDraftBadge from './RaceDraftBadge'

const ALL_RACES = RACE_IDS
const VAGABOND = 'VAGABOND'

type Props = {
  draft: DraftState
  loading: boolean
  maxBans: number
  drawCount: number
  bansCount: number
  bansLeft: number
  clearBans: () => void
  localBans: string[]
  canAddMoreBans: boolean
  nonVagabondBans: Set<string>
  vagabondBanCount: number
  maxVagabondCopies: number
  canBanSecondVagabond: boolean
  toggleBan: (race: string) => void
  addSecondVagabondBan: () => void
  landmarksEnabled?: boolean
  landmarksBanned?: string | null
  landmarksDrawn?: string[]
  localLandmarkBanned: string
  setLocalLandmarkBanned: (id: string) => void
  localLandmarkRandomCount: 1 | 2
  setLocalLandmarkRandomCount: (count: 1 | 2) => void
  onLandmarksBan?: (banned: string, randomCount: 1 | 2) => void | Promise<void>
  onRefresh?: () => void
  onSetBans?: (bans: string[]) => void | Promise<void>
  bansValid: boolean
}

export default function RaceDraftBanPhase({
  draft,
  loading,
  maxBans,
  drawCount,
  bansCount,
  bansLeft,
  clearBans,
  localBans,
  canAddMoreBans,
  nonVagabondBans,
  vagabondBanCount,
  maxVagabondCopies,
  canBanSecondVagabond,
  toggleBan,
  addSecondVagabondBan,
  landmarksEnabled,
  landmarksBanned,
  landmarksDrawn,
  localLandmarkBanned,
  setLocalLandmarkBanned,
  localLandmarkRandomCount,
  setLocalLandmarkRandomCount,
  onLandmarksBan,
  onRefresh,
  onSetBans,
  bansValid,
}: Props) {
  if (draft.phase !== 'BAN') return null

  return (
    <div style={ui.card}>
      <div style={ui.cardHeader}>
        <div>
          <h2 style={ui.h2}>Ban phase</h2>
          <div style={ui.sub}>
            You can ban up to <b>{maxBans}</b> (must leave <b>{drawCount}</b> races for the draft pool).
          </div>
        </div>

        <div style={ui.rightBadges}>
          <RaceDraftBadge variant="ghost" text={`Bans: ${bansCount}/${maxBans}`} />
          <RaceDraftBadge variant="ghost" text={`Left: ${bansLeft}`} />
          <button onClick={clearBans} disabled={loading || draft.status !== 'DRAFTING'} style={ui.btn('ghost', loading || draft.status !== 'DRAFTING')}>
            🧹 Clear
          </button>
        </div>
      </div>

      <div style={ui.tileGrid}>
        {ALL_RACES.map((race) => {
          const isVaga = race === VAGABOND
          const isBanned = isVaga ? vagabondBanCount > 0 : nonVagabondBans.has(race)
          const disabledAdd = !isBanned && !canAddMoreBans
          const disabled = loading || draft.status !== 'DRAFTING' || disabledAdd

          return (
            <button
              key={race}
              onClick={() => toggleBan(race)}
              disabled={disabled}
              title={isVaga ? `VAGABOND ban count: ${vagabondBanCount}/2 (click toggles 0<->1; use +1 for second ban)` : raceLabel(race)}
              style={ui.raceTile(isBanned ? 'banned' : 'neutral', disabled)}
              onMouseEnter={(e) => {
                if (disabled) return
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <img src={RACE_ICON[race]} alt={race} style={ui.icon32} />
              {isVaga && <span style={{ fontSize: 12, fontWeight: 1000 }}>{vagabondBanCount}/{maxVagabondCopies}</span>}
            </button>
          )
        })}

        {canBanSecondVagabond && (
          <button
            onClick={addSecondVagabondBan}
            disabled={loading || draft.status !== 'DRAFTING' || !canAddMoreBans || vagabondBanCount >= 2}
            style={ui.raceTile('neutral', loading || draft.status !== 'DRAFTING' || !canAddMoreBans || vagabondBanCount >= 2)}
            title="Add second VAGABOND ban (ban 2 of 2 copies)"
          >
            🗡️ +1 VAGABOND ban
          </button>
        )}
      </div>

      {landmarksEnabled && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <div style={ui.cardHeader}>
            <div>
              <h2 style={ui.h2}>Landmarks</h2>
              <div style={ui.sub}>Select 1 landmark to exclude from random draw, then choose how many to draw.</div>
            </div>

            <div style={ui.rightBadges}>
              {landmarksBanned && landmarksDrawn?.length ? (
                <RaceDraftBadge variant="ok" text={`Locked: ${landmarksBanned} • draw ${landmarksDrawn.length}`} />
              ) : (
                <RaceDraftBadge variant="ghost" text="Not set" />
              )}
            </div>
          </div>

          {LANDMARKS.map((lm) => {
            const picked = localLandmarkBanned === lm.id
            const disabled = loading || draft.status !== 'DRAFTING'

            return (
              <Tooltip key={lm.id} placement="top" content={lmTooltipContent(lm.id as LandmarkId)} disabled={disabled}>
                <button disabled={disabled} onClick={() => setLocalLandmarkBanned(lm.id)} style={ui.raceTile(picked ? 'banned' : 'neutral', disabled)}>
                  {picked ? '🚫' : '🏷️'} {lmLabel(lm.id as LandmarkId)}
                </button>
              </Tooltip>
            )
          })}

          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={ui.sub}>Random draw:</span>

            <button disabled={loading || draft.status !== 'DRAFTING'} onClick={() => setLocalLandmarkRandomCount(1)} style={ui.btn('ghost', loading || draft.status !== 'DRAFTING')}>
              {localLandmarkRandomCount === 1 ? '✅ ' : ''}1 landmark
            </button>

            <button disabled={loading || draft.status !== 'DRAFTING'} onClick={() => setLocalLandmarkRandomCount(2)} style={ui.btn('ghost', loading || draft.status !== 'DRAFTING')}>
              {localLandmarkRandomCount === 2 ? '✅ ' : ''}2 landmarks
            </button>

            <div style={{ marginLeft: 'auto' }}>
              <button
                onClick={async () => {
                  if (!onLandmarksBan || !localLandmarkBanned) return
                  await onLandmarksBan(localLandmarkBanned, localLandmarkRandomCount)
                  onRefresh?.()
                }}
                disabled={loading || draft.status !== 'DRAFTING' || !onLandmarksBan || !localLandmarkBanned || !!(landmarksBanned && (landmarksDrawn?.length ?? 0) > 0)}
                style={ui.btn('gold', loading || draft.status !== 'DRAFTING' || !onLandmarksBan || !localLandmarkBanned)}
              >
                🏷️ Confirm landmarks
              </button>
            </div>
          </div>

          {localLandmarkBanned ? (
            <div style={ui.hint}>
              Banned: <b>{localLandmarkBanned}</b> • Will randomly draw <b>{localLandmarkRandomCount}</b> from remaining.
            </div>
          ) : (
            <div style={ui.hint}>Pick exactly one landmark above to exclude it from the draw.</div>
          )}
        </div>
      )}

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={ui.sub}>Selected bans are sent as a list. VAGABOND can appear twice to ban both copies.</div>

        <button
          onClick={() => onSetBans?.(localBans)}
          disabled={loading || draft.status !== 'DRAFTING' || !bansValid || !onSetBans}
          style={ui.btn('danger', loading || draft.status !== 'DRAFTING' || !bansValid || !onSetBans)}
        >
          🩸 Confirm bans & start draft
        </button>
      </div>
    </div>
  )
}
