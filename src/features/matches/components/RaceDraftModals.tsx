import { raceLabel } from '../../../constants/races'
import { raceDraftUi as ui } from '../raceDraftUi'

type Props = {
  confirmLastPickOpen: boolean
  pendingPick: { playerId: number; race: string } | null
  loading: boolean
  setConfirmLastPickOpen: (open: boolean) => void
  setPendingPick: (pick: { playerId: number; race: string } | null) => void
  onPick: (playerId: number, race: string) => void | Promise<void>
  onRefresh?: () => void
  finishOpen: boolean
  setFinishOpen: (open: boolean) => void
}

export default function RaceDraftModals({
  confirmLastPickOpen,
  pendingPick,
  loading,
  setConfirmLastPickOpen,
  setPendingPick,
  onPick,
  onRefresh,
  finishOpen,
  setFinishOpen,
}: Props) {
  return (
    <>
      {confirmLastPickOpen && pendingPick && (
        <div style={ui.overlay}>
          <div style={ui.modal}>
            <div style={ui.modalTitle}>Ostatni pick</div>

            <div style={ui.modalBody}>
              To jest <b>ostatni pick</b>. Po nim draft zostanie zakończony i przejdziesz dalej do meczu.
              <div style={{ marginTop: 10, opacity: 0.9 }}>
                Wybrana rasa: <b>{raceLabel(pendingPick.race)}</b>
              </div>
            </div>

            <div style={ui.modalFooter}>
              <button
                style={ui.btn('ghost', loading)}
                disabled={loading}
                onClick={() => {
                  setConfirmLastPickOpen(false)
                  setPendingPick(null)
                }}
              >
                Anuluj
              </button>

              <button
                style={ui.btn('open', loading)}
                disabled={loading}
                onClick={async () => {
                  try {
                    await onPick(pendingPick.playerId, pendingPick.race)
                  } finally {
                    setConfirmLastPickOpen(false)
                    setPendingPick(null)
                    onRefresh?.()
                  }
                }}
              >
                Zakończ draft →
              </button>
            </div>
          </div>
        </div>
      )}

      {finishOpen && (
        <div style={ui.overlay}>
          <div style={ui.modal}>
            <div style={ui.modalTitle}>Draft zakończony</div>
            <div style={ui.modalBody}>
              Ostatni pick został wykonany i draft jest <b>FINISHED</b>. Kliknij <b>Przejdź dalej</b>, aby wrócić do meczu.
            </div>
            <div style={ui.modalFooter}>
              <button style={ui.btn('ghost', loading)} disabled={loading} onClick={() => setFinishOpen(false)}>
                Zostań tutaj
              </button>
              <button
                style={ui.btn('open', loading)}
                disabled={loading}
                onClick={() => {
                  setFinishOpen(false)
                  onRefresh?.()
                }}
              >
                Przejdź dalej →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
