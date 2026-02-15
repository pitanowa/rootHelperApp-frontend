import { createPortal } from 'react-dom'
import type { CSSProperties } from 'react'
import type { MatchPlayerState } from '../../features/matches/types'

type SetupModalUi = {
  overlay: CSSProperties
  modal: (hex: string) => CSSProperties
  modalTitle: CSSProperties
  modalBody: CSSProperties
  modalFooter: CSSProperties
  icon: (hex: string) => CSSProperties
  btn: (variant: 'ghost' | 'race', disabled: boolean, hex?: string) => CSSProperties
}

type Props = {
  open: boolean
  loading: boolean

  playersInMatchOrder: MatchPlayerState[]
  setupIndex: number
  setSetupIndex: React.Dispatch<React.SetStateAction<number>>

  mid: number
  setFlowStage: React.Dispatch<React.SetStateAction<'NONE' | 'SETUP'>>

  raceKey: (race?: string | null) => string
  raceLabel: (race?: string | null) => string
  setupTextForRace: (race?: string | null) => string

  RACE_COLOR: Record<string, string>
  RACE_ICON: Record<string, string>

  lsSetBool: (key: string, val: boolean) => void
  LS_SETUP: (mid: number) => string

  ui: SetupModalUi
}

export default function SetupModal(props: Props) {
  const {
    open,
    loading,
    playersInMatchOrder,
    setupIndex,
    setSetupIndex,
    mid,
    setFlowStage,
    raceKey,
    raceLabel,
    setupTextForRace,
    RACE_COLOR,
    RACE_ICON,
    lsSetBool,
    LS_SETUP,
    ui,
  } = props

  if (!open) return null

  return createPortal(
    (() => {
      const p = playersInMatchOrder[setupIndex]
      const race = p?.race ?? null
      const rk = raceKey(race)
      const hex = RACE_COLOR[rk] ?? '#dc2626'
      const icon = RACE_ICON[rk] ?? ''
      const hint = setupTextForRace(race)

      return (
        <div style={ui.overlay}>
          <div style={ui.modal(hex)}>
            <div style={ui.modalTitle}>
              Setup: {p?.playerName ?? '—'} ({setupIndex + 1}/{playersInMatchOrder.length})
            </div>

            <div style={ui.modalBody}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                {icon ? <img src={icon} alt={raceLabel(race)} style={{ ...ui.icon(hex), width: 54, height: 54 }} /> : null}

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 1000, fontSize: 16, marginBottom: 4 }}>{raceLabel(race)}</div>

                  <div style={{ opacity: 0.86, whiteSpace: 'pre-line', lineHeight: 1.45 }}>{hint}</div>

                  <div style={{ marginTop: 10, opacity: 0.72 }}>
                    Rozstaw frakcję gracza i kliknij <b>Next</b>.
                  </div>
                </div>
              </div>
            </div>

            <div style={ui.modalFooter}>
              <button
                style={ui.btn('ghost', loading)}
                onClick={() => {
                  lsSetBool(LS_SETUP(mid), true)
                  setFlowStage('NONE')
                }}
                disabled={loading}
              >
                Skip
              </button>

              <button
                style={{
                  ...ui.btn('race', loading, hex),
                  color: 'rgba(255,255,255,0.92)',
                }}
                onClick={() => {
                  const last = setupIndex >= playersInMatchOrder.length - 1
                  if (last) {
                    lsSetBool(LS_SETUP(mid), true)
                    setFlowStage('NONE')
                    return
                  }
                  setSetupIndex((i) => i + 1)
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (loading) return
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )
    })(),
    document.body,
  )
}
