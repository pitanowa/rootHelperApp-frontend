import { createPortal } from 'react-dom'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { LeaguePageConfig } from '../../../core/games/types'
import type { Player } from '../../../types'
import type { LeaguePageUi } from '../leaguePageUi'

type Props = {
  players: Player[]
  selected: number[]
  timerSeconds: number
  ranked: boolean
  landmarksEnabled: boolean
  raceDraftEnabled: boolean
  loading: boolean
  leagueConfig: LeaguePageConfig
  onTimerChange: (next: number) => void
  onRankedChange: (next: boolean) => void
  onLandmarksEnabledChange: (next: boolean) => void
  onRaceDraftEnabledChange: (next: boolean) => void
  onTogglePlayer: (id: number) => void
  onCreateMatch: () => void | Promise<void>
  ui: LeaguePageUi
}

type WizardStep = {
  key: string
  label: string
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(5, 3, 4, 0.78)',
  backdropFilter: 'blur(8px)',
  display: 'grid',
  placeItems: 'center',
  padding: 16,
}

const modalStyle: CSSProperties = {
  width: 'min(920px, 100%)',
  maxHeight: 'min(88vh, 920px)',
  overflow: 'auto',
  borderRadius: 24,
  padding: 20,
  border: 'var(--app-panel-border)',
  background:
    'radial-gradient(820px 260px at 0% 0%, rgba(193, 38, 61, 0.2), transparent 55%), linear-gradient(180deg, rgba(24, 9, 13, 0.98), rgba(10, 4, 7, 0.99))',
  boxShadow: '0 34px 90px rgba(0,0,0,0.62)',
  color: 'var(--app-text)',
}

const topBarStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'flex-start',
  marginBottom: 18,
}

const closeBtnStyle: CSSProperties = {
  borderRadius: 12,
  border: 'var(--app-soft-border)',
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--app-text)',
  padding: '10px 12px',
  fontWeight: 900,
  cursor: 'pointer',
}

const stepRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  marginBottom: 18,
}

const twoColStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 12,
}

const optionCardStyle: CSSProperties = {
  borderRadius: 18,
  border: 'var(--app-panel-border)',
  background: 'rgba(255,255,255,0.03)',
  padding: 14,
  boxShadow: '0 12px 28px rgba(0,0,0,0.24)',
}

const sectionTitleStyle: CSSProperties = {
  fontSize: 12,
  opacity: 0.8,
  fontWeight: 900,
  letterSpacing: 0.4,
  textTransform: 'uppercase',
  marginBottom: 8,
}

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap',
  marginTop: 20,
  paddingTop: 16,
  borderTop: '1px solid rgba(255,255,255,0.09)',
}

const footerActionsStyle: CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
}

const ghostBtnStyle = (disabled: boolean): CSSProperties => ({
  padding: '11px 14px',
  borderRadius: 14,
  border: 'var(--app-soft-border)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--app-text)',
  fontWeight: 1000,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
})

const selectedPlayerIdsToNames = (players: Player[], selected: number[]) => {
  const byId = new Map(players.map((player) => [player.id, player.name]))
  return selected.map((id) => byId.get(id) ?? `Player #${id}`)
}

export default function LeagueCreateMatchCard({
  players,
  selected,
  timerSeconds,
  ranked,
  landmarksEnabled,
  raceDraftEnabled,
  loading,
  leagueConfig,
  onTimerChange,
  onRankedChange,
  onLandmarksEnabledChange,
  onRaceDraftEnabledChange,
  onTogglePlayer,
  onCreateMatch,
  ui,
}: Props) {
  const [open, setOpen] = useState(false)
  const supportsOptions = leagueConfig.supportsLandmarks || leagueConfig.supportsRaceDraft

  const steps = useMemo<WizardStep[]>(
    () =>
      [
        { key: 'mode', label: 'Mode' },
        supportsOptions ? { key: 'options', label: 'Options' } : null,
        { key: 'players', label: 'Players' },
        { key: 'review', label: 'Review' },
      ].filter((step): step is WizardStep => step !== null),
    [supportsOptions],
  )

  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [loading, open])

  const selectedPlayerNames = useMemo(() => selectedPlayerIdsToNames(players, selected), [players, selected])
  const canCreate = !loading && selected.length >= 2

  const openWizard = () => {
    setStepIndex(0)
    setOpen(true)
  }

  const closeWizard = () => {
    if (loading) return
    setOpen(false)
  }

  const goNext = () => setStepIndex((current) => Math.min(current + 1, steps.length - 1))
  const goBack = () => setStepIndex((current) => Math.max(current - 1, 0))

  const currentStep = steps[stepIndex]?.key
  const isReviewStep = currentStep === 'review'

  return (
    <>
      <button onClick={openWizard} disabled={loading} style={ui.createBtn(!loading)}>
        Create match
      </button>

      {open
        ? createPortal(
            <div style={overlayStyle} onClick={closeWizard}>
              <div style={modalStyle} onClick={(event) => event.stopPropagation()}>
                <div style={topBarStyle}>
                  <div>
                    <div style={ui.subtitle}>League match setup</div>
                    <h2 style={{ margin: '6px 0 0', fontSize: 26 }}>Create Match</h2>
                  </div>

                  <button type="button" onClick={closeWizard} disabled={loading} style={closeBtnStyle}>
                    Close
                  </button>
                </div>

                <div style={stepRowStyle}>
                  {steps.map((step, index) => {
                    const active = index === stepIndex
                    const complete = index < stepIndex

                    return (
                      <div
                        key={step.key}
                        style={{
                          ...ui.badge,
                          border: active || complete ? 'var(--app-accent-border)' : 'var(--app-soft-border)',
                          background:
                            active || complete ? 'var(--app-accent-soft-gradient)' : 'rgba(255,255,255,0.04)',
                          color: 'var(--app-text)',
                        }}
                      >
                        {index + 1}. {step.label}
                      </div>
                    )
                  })}
                </div>

                {currentStep === 'mode' ? (
                  <div style={twoColStyle}>
                    <div style={optionCardStyle}>
                      <div style={sectionTitleStyle}>Match Mode</div>
                      <div style={ui.segment} aria-label="match mode">
                        <button
                          type="button"
                          onClick={() => onRankedChange(true)}
                          disabled={loading}
                          style={{ ...ui.segBtn(ranked), opacity: loading ? 0.6 : 1 }}
                        >
                          RANKED
                        </button>

                        <button
                          type="button"
                          onClick={() => onRankedChange(false)}
                          disabled={loading}
                          style={{ ...ui.segBtn(!ranked), opacity: loading ? 0.6 : 1 }}
                        >
                          CASUAL
                        </button>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.74 }}>
                        {ranked ? 'Match liczy się do tabeli i rankingu ligi.' : 'Match treningowy poza rankingiem.'}
                      </div>
                    </div>

                    <div style={optionCardStyle}>
                      <div style={sectionTitleStyle}>Timer</div>
                      <div style={{ ...ui.field, justifyContent: 'space-between' }}>
                        <span style={ui.labelSmall}>Seconds per turn</span>
                        <input
                          type="number"
                          min={60}
                          step={30}
                          value={timerSeconds}
                          onChange={(event) => onTimerChange(Number(event.target.value))}
                          disabled={loading}
                          style={ui.input}
                        />
                      </div>
                      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.74 }}>
                        Szybka wartość startowa dla ligi to zwykle 180 sekund.
                      </div>
                    </div>
                  </div>
                ) : null}

                {currentStep === 'options' ? (
                  <div style={twoColStyle}>
                    {leagueConfig.supportsLandmarks ? (
                      <label style={{ ...optionCardStyle, ...ui.switch, alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          checked={landmarksEnabled}
                          onChange={(event) => onLandmarksEnabledChange(event.target.checked)}
                          disabled={loading}
                          style={ui.checkbox}
                        />
                        <div>
                          <div style={{ fontWeight: 1000 }}>Landmarks</div>
                          <div style={{ marginTop: 4, fontSize: 13, opacity: 0.74 }}>
                            Włącza setup związany z landmarkami dla tego meczu.
                          </div>
                        </div>
                      </label>
                    ) : null}

                    {leagueConfig.supportsRaceDraft ? (
                      <label style={{ ...optionCardStyle, ...ui.switch, alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          checked={raceDraftEnabled}
                          onChange={(event) => onRaceDraftEnabledChange(event.target.checked)}
                          disabled={loading}
                          style={ui.checkbox}
                        />
                        <div>
                          <div style={{ fontWeight: 1000 }}>Draft</div>
                          <div style={{ marginTop: 4, fontSize: 13, opacity: 0.74 }}>
                            Pozwala rozpocząć mecz z draftem frakcji.
                          </div>
                        </div>
                      </label>
                    ) : null}
                  </div>
                ) : null}

                {currentStep === 'players' ? (
                  <>
                    <div style={{ ...ui.headerRow, marginBottom: 14 }}>
                      <div>
                        <div style={sectionTitleStyle}>Players</div>
                        <div style={ui.subtitle}>Wybierz minimum 2 graczy, którzy zagrają ten match.</div>
                      </div>

                      <div style={ui.badge}>
                        Selected: <span style={{ fontWeight: 1000 }}>{selected.length}</span>
                      </div>
                    </div>

                    <div style={ui.list}>
                      {players.map((player) => {
                        const isSelected = selected.includes(player.id)
                        const initials = (player.name || '?')
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0]?.toUpperCase())
                          .join('')

                        return (
                          <label key={player.id} style={ui.playerCard(isSelected)}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => onTogglePlayer(player.id)}
                              disabled={loading}
                              style={ui.checkbox}
                            />

                            <div style={ui.avatar} aria-hidden>
                              {initials || 'P'}
                            </div>

                            <div style={{ display: 'grid', gap: 2 }}>
                              <div style={ui.playerName}>{player.name}</div>
                              <div style={{ fontSize: 12, opacity: 0.7 }}>{isSelected ? 'Selected' : 'Tap to select'}</div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </>
                ) : null}

                {isReviewStep ? (
                  <div style={twoColStyle}>
                    <div style={optionCardStyle}>
                      <div style={sectionTitleStyle}>Configuration</div>
                      <div style={{ display: 'grid', gap: 10 }}>
                        <div style={ui.chip}>Mode: {ranked ? 'Ranked' : 'Casual'}</div>
                        <div style={ui.chip}>Timer: {timerSeconds}s</div>
                        {leagueConfig.supportsLandmarks ? (
                          <div style={ui.chip}>Landmarks: {landmarksEnabled ? 'On' : 'Off'}</div>
                        ) : null}
                        {leagueConfig.supportsRaceDraft ? (
                          <div style={ui.chip}>Draft: {raceDraftEnabled ? 'On' : 'Off'}</div>
                        ) : null}
                      </div>
                    </div>

                    <div style={optionCardStyle}>
                      <div style={sectionTitleStyle}>Selected Players</div>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {selectedPlayerNames.length > 0 ? (
                          selectedPlayerNames.map((name) => (
                            <div key={name} style={ui.chip}>
                              {name}
                            </div>
                          ))
                        ) : (
                          <div style={ui.historyEmpty}>No players selected yet.</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div style={footerStyle}>
                  <div style={{ ...ui.subtitle, alignSelf: 'center' }}>
                    {isReviewStep && !canCreate ? 'Wybierz co najmniej 2 graczy, żeby utworzyć mecz.' : ' '}
                  </div>

                  <div style={footerActionsStyle}>
                    <button type="button" onClick={goBack} disabled={loading || stepIndex === 0} style={ghostBtnStyle(loading || stepIndex === 0)}>
                      Back
                    </button>

                    {!isReviewStep ? (
                      <button type="button" onClick={goNext} disabled={loading} style={ui.createBtn(!loading)}>
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          void onCreateMatch()
                        }}
                        disabled={!canCreate}
                        title={!canCreate ? 'Select at least 2 players' : undefined}
                        style={ui.createBtn(canCreate)}
                      >
                        Create match
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
