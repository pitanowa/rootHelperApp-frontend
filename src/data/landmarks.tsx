import type { ReactNode } from 'react'

export const LANDMARKS = [
  {
    id: 'lost_city',
    label: 'Zaginione miasto',
    setup:
      'Umieść Zaginione Miasto na polanie z rzeką (lub obok jeziora), nieposiadającej innego punktu terenu.',
    effect:
      'Polana z Zaginionym Miastem traktowana jest jak polana dowolnego typu (królik/mysz/lis) na rzecz wszystkich zasad.',
  },
  {
    id: 'black_market',
    label: 'Czarny rynek',
    setup: 'Umieść Czarny Rynek na polanie z jednym slotem na budynek (pierwotnie nadrukowanym na planszy). Polana ta nie może sąsiadować z polaną posiadającą inny punkt terenu.\n\nNastępnie umieść 3 karty z wierzchu talii obok planszy (zdecydujcie czy awersem do góry czy do dołu).',
    effect:
      'Raz na turę gracz posiadający jakikolwiek komponent na polanie z Czarnym Rynkiem może zamienić kartę ze swojej ręki na kartę dostępną na Czarnym Rynku.',
  },
  {
    id: 'legendary_forge',
    label: 'Legendarna Kuźnia',
    setup:
      'Umieść Legendarną Kuźnię na polanie niesąsiadującej z polaną posiadającą inny punkt terenu. Umieść na niej przedmioty z planszy mapy zgodnie z typem polany:\n\nLis: miecze, kusza, młotek.\nKrólik: buty i monety.\nMysz: herbatki i worki.\n',
    effect:
      'Przedmioty te da się wytworzyć zgodnie z normalnymi zasadami wytwarzania, ale tylko jeśli gracz ma jakikolwiek komponent na polanie z Legendarną Kuźnią. Za wytworzenie przedmiotu w Legendarnej Kuźni dostajesz +1 punkt.',
  },
  {
    id: 'tower',
    label: 'Wieża',
    setup:
      'Umieść Wieżę na dowolnej polanie z Ruinami, na której nie ma innego punktu terenu.',
    effect:
      'Na koniec swojej tury, jeśli gracz kontroluje polanę z Wieżą, zdobywa 1 punkt.',
  },
  {
    id: 'ferry',
    label: 'Łódka',
    setup:
      'Umieść Łódkę na dowolnej polanie przylegającej do rzeki (lub jeziora), która nie sąsiaduje z polaną posiadającą inny punkt terenu.',
    effect:
      'Raz w trakcie tury gracz może przemieścić swoje jednostki przez rzekę przy pomocy Łódki. W ten sposób może przepłynąć tylko jedno pole (na mapie z jeziorem: dowolnie). Następnie dobiera 1 kartę.',
  },
  {
    id: 'elder_treetop',
    label: 'Starożytne drzewo',
    setup:
      'Umieść Starożytne Drzewo na dowolnej polanie narożnej, niesąsiadującej z polaną posiadającą inny punkt terenu.',
    effect:
      'Drzewo służy jako dodatkowe miejsce na budynek na polanie, na której się znajduje.',
  },
] as const

export type LandmarkId = (typeof LANDMARKS)[number]['id']
export type LandmarkMeta = (typeof LANDMARKS)[number]

const META: Record<LandmarkId, LandmarkMeta> = LANDMARKS.reduce((acc, lm) => {
  acc[lm.id] = lm
  return acc
}, {} as Record<LandmarkId, LandmarkMeta>)

export function lmMeta(id: string): LandmarkMeta | null {
  return (META as Partial<Record<string, LandmarkMeta>>)[id] ?? null
}

export function lmLabel(id: string) {
  return lmMeta(id)?.label ?? id
}

export function lmSetup(id: string) {
  return lmMeta(id)?.setup ?? ''
}

export function lmEffect(id: string) {
  return lmMeta(id)?.effect ?? 'No description.'
}

export function lmTooltipContent(id: LandmarkId): ReactNode {
  const title = lmLabel(id)
  const setup = lmSetup(id)
  const effect = lmEffect(id)

  const SectionTitle = ({ icon, text }: { icon: string; text: string }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
        marginBottom: 6,
        color: 'rgba(255,255,255,0.92)',
        fontWeight: 1000,
        fontSize: 12,
        letterSpacing: 0.35,
        textTransform: 'uppercase',
        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
      }}
    >
      <span aria-hidden>{icon}</span>
      <span>{text}</span>
      <span
        aria-hidden
        style={{
          flex: 1,
          height: 1,
          background:
            'linear-gradient(90deg, rgba(220,38,38,0.85), rgba(255,255,255,0.06))',
          marginLeft: 8,
        }}
      />
    </div>
  )

  const block: React.CSSProperties = {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    lineHeight: 1.45,
    fontWeight: 850,
    textShadow: '0 2px 10px rgba(0,0,0,0.75)',
    whiteSpace: 'pre-wrap',
  }

  return (
    <div style={{ maxWidth: 380 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 1100,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: '#fff',
            textShadow: '0 2px 14px rgba(0,0,0,0.85)',
          }}
        >
          🩸 {title}
        </div>

        <span
          style={{
            fontSize: 11,
            fontWeight: 1000,
            padding: '4px 8px',
            borderRadius: 999,
            border: '1px solid rgba(220,38,38,0.35)',
            background:
              'linear-gradient(135deg, rgba(220,38,38,0.20), rgba(255,255,255,0.06))',
            color: 'rgba(255,255,255,0.90)',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
          }}
        >
          LANDMARK
        </span>
      </div>

      <div
        aria-hidden
        style={{
          height: 1,
          background:
            'linear-gradient(90deg, rgba(220,38,38,0.9), rgba(255,255,255,0.06))',
          marginBottom: 10,
        }}
      />

      <SectionTitle icon="📍" text="Rozstawienie" />
      <div style={block}>{setup || '—'}</div>

      <SectionTitle icon="⚔️" text="Opis" />
      <div style={block}>{effect || '—'}</div>
    </div>
  )
}
