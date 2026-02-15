import { createPortal } from 'react-dom'
import type { CSSProperties } from 'react'
import type { CardDef, Clearing, CraftType, Item } from '../../data/cards'

type CardsModalUi = {
  overlay: CSSProperties
  cardsModal: CSSProperties
  cardsHeadRow: CSSProperties
  cardsFiltersRow: CSSProperties
  btn: (variant: 'ghost' | 'danger', disabled: boolean) => CSSProperties
  input: CSSProperties
  chip: (active: boolean) => CSSProperties
  cardsGridMini: CSSProperties
  cardTile: CSSProperties
  cardImgMiniWrap: CSSProperties
  cardImgMini: CSSProperties
  cardMeta: CSSProperties
  cardName: CSSProperties
  cardMetaLine: CSSProperties
  badge: CSSProperties
  badgeStrong: (hex: string) => CSSProperties
  previewWrap: CSSProperties
  previewCard: CSSProperties
  previewTop: CSSProperties
  previewBody: CSSProperties
  previewImg: CSSProperties
}

type Props = {
  open: boolean
  loading: boolean

  cardsSearch: string
  setCardsSearch: React.Dispatch<React.SetStateAction<string>>

  fClearings: Record<Clearing, boolean>
  setFClearings: React.Dispatch<React.SetStateAction<Record<Clearing, boolean>>>

  fCraft: Record<CraftType, boolean>
  setFCraft: React.Dispatch<React.SetStateAction<Record<CraftType, boolean>>>

  fItems: Record<Item, boolean>
  setFItems: React.Dispatch<React.SetStateAction<Record<Item, boolean>>>

  previewCard: CardDef | null
  setPreviewCard: React.Dispatch<React.SetStateAction<CardDef | null>>

  filteredCards: CardDef[]
  totalCards: number

  onClose: () => void
  onResetFilters: () => void

  ui: CardsModalUi
}

export default function CardsModal(props: Props) {
  const {
    open,
    cardsSearch,
    setCardsSearch,
    fClearings,
    setFClearings,
    fCraft,
    setFCraft,
    fItems,
    setFItems,
    previewCard,
    setPreviewCard,
    filteredCards,
    totalCards,
    onClose,
    onResetFilters,
    ui,
  } = props

  if (!open) return null

  return createPortal(
    <div
      style={ui.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
          setPreviewCard(null)
        }
      }}
    >
      <div style={ui.cardsModal}>
        <div style={ui.cardsHeadRow}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 1000, letterSpacing: -0.2 }}>Cards</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>
              Showing <b>{filteredCards.length}</b> / {totalCards}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button style={ui.btn('ghost', false)} onClick={onResetFilters}>
              Reset filters
            </button>

            <button
              style={ui.btn('danger', false)}
              onClick={() => {
                onClose()
                setPreviewCard(null)
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div style={ui.cardsFiltersRow}>
          <input
            style={ui.input}
            value={cardsSearch}
            onChange={(e) => setCardsSearch(e.target.value)}
            placeholder="Search by name…"
          />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {/* Clearings */}
            {(['MOUSE', 'FOX', 'RABBIT', 'BIRD'] as Clearing[]).map((k) => (
              <span
                key={k}
                style={ui.chip(!!fClearings[k])}
                onClick={() => setFClearings((p) => ({ ...p, [k]: !p[k] }))}
              >
                {k}
              </span>
            ))}

            {/* Craft type */}
            {(['POINTS', 'ABILITY', 'DOMINANCE'] as CraftType[]).map((k) => (
              <span key={k} style={ui.chip(!!fCraft[k])} onClick={() => setFCraft((p) => ({ ...p, [k]: !p[k] }))}>
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Items row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, opacity: 0.78, fontWeight: 900 }}>Items (only for POINTS cards):</div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {(Object.keys(fItems) as Item[]).map((it) => (
              <span key={it} style={ui.chip(!!fItems[it])} onClick={() => setFItems((p) => ({ ...p, [it]: !p[it] }))}>
                {it}
              </span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={ui.cardsGridMini}>
          {filteredCards.map((c) => (
            <div
              key={c.id}
              style={ui.cardTile}
              onClick={() => setPreviewCard(c)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'
                e.currentTarget.style.boxShadow = '0 22px 60px rgba(0,0,0,0.55)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,0.35)'
              }}
              title={c.name}
            >
              <div style={{ ...ui.cardImgMiniWrap, position: 'relative' }}>
                <img src={c.img} alt={c.name} style={ui.cardImgMini} loading="lazy" />

                {/* numberOfCards badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    padding: '6px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 1000,
                    letterSpacing: 0.2,
                    color: 'rgba(255,255,255,0.92)',
                    background: 'rgba(0,0,0,0.55)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  title={`Copies: ${c.numberOfCards}`}
                >
                  ×{c.numberOfCards}
                </div>
              </div>

              <div style={ui.cardMeta}>
                <div style={ui.cardName}>{c.name}</div>
                <div style={ui.cardMetaLine}>
                  <span style={ui.badge}>{c.clearing}</span>
                  <span style={ui.badge}>{c.craftType}</span>
                  {c.item ? <span style={ui.badgeStrong('#22c55e')}>{c.item}</span> : <span style={ui.badge}>—</span>}
                </div>
              </div>
            </div>
          ))}

          {filteredCards.length === 0 && <div style={{ opacity: 0.75, padding: 10 }}>No cards match current filters.</div>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={ui.badge}>Tip: click a card to preview</span>
          <span style={ui.badge}>Filters rule: empty category = shows all</span>
        </div>
      </div>

      {/* Preview overlay */}
      {previewCard && (
        <div
          style={ui.previewWrap}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPreviewCard(null)
          }}
        >
          <div style={ui.previewCard}>
            <div style={ui.previewTop}>
              <div style={{ fontWeight: 1000, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {previewCard.name}
              </div>
              <button style={ui.btn('ghost', false)} onClick={() => setPreviewCard(null)}>
                Close
              </button>
            </div>

            <div style={ui.previewBody}>
              <img src={previewCard.img} alt={previewCard.name} style={ui.previewImg} />
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}
