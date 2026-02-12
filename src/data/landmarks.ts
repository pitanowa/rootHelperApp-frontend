export const LANDMARKS = [
  {
    id: 'lost_city',
    label: 'Zaginione miasto',
    desc: 'Polana z Zaginionym miastem traktowana jest jak polana dowolnego typu (królik/mysz/lis).',
  },
  {
    id: 'black_market',
    label: 'Czarny rynek',
    desc: 'Raz w trakcie dnia, gracz posiadający jakikolwiek komponent na polanie z Czarnym Rynkiem może zamienić kartę ze swojej ręki na kartę dostępną na Czarnym Rynku.',
  },
  {
    id: 'legendary_forge',
    label: 'Kuźnia',
    desc: 'Kuźnia "kradnie" 2 sety przedmiotów z planszy na początku gry. Da się je wytworzyć jedynie przy pomocy komponentu do przekuwania, znajdującego się na polanie z Kuźnią (zgodnie z zasadami przekuwania).',
  },
  {
    id: 'tower',
    label: 'Wieża',
    desc: 'Na koniec swojej tury, jeśli gracz kontroluje polanę z Wieżą, zdobywa 1 punkt.',
  },
  {
    id: 'ferry',
    label: 'Łódka',
    desc: 'Raz w trakcie tury, gracz może przemieścić swoje jednostki przez rzekę przy pomocy Łódki. Może w ten sposób przepłynąć tylko jedno pole (w przypadku Mapy z jeziorem - dowolnie). Następnie dobiera 1 kartę.',
  },
  {
    id: 'elder_treetop',
    label: 'Starożytne drzewo',
    desc: 'Drzewo służy jako dodatkowe miejsce na budynek, na polanie na którym się znajduje.',
  },
] as const


export type LandmarkId = (typeof LANDMARKS)[number]['id']

const META = LANDMARKS.reduce((acc, lm) => {
  acc[lm.id] = lm
  return acc
}, {} as Record<LandmarkId, (typeof LANDMARKS)[number]>)

export function lmLabel(id: string) {
  return (META as any)[id]?.label ?? id
}
export function lmDesc(id: string) {
  return (META as any)[id]?.desc ?? 'No description.'
}
