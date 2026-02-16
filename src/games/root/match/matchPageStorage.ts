import { raceKey } from '../../../constants/races'

// Extracted from MatchPage local-storage and setup-flow helpers.
export type FlowStage = 'NONE' | 'SETUP'

export const LS_SETUP = (mid: number) => `rootleague:match:${mid}:setupDone`
export const LS_RACE = (mid: number) => `rootleague:match:${mid}:raceByPlayer`
export const LS_MANUAL_ORDER = (mid: number) => `rootleague:match:${mid}:manualPickOrder`

export function lsGetJson<T>(key: string, fallback: T): T {
    try {
        const raw = window.localStorage.getItem(key)
        if (!raw) return fallback
        return JSON.parse(raw) as T
    } catch {
        return fallback
    }
}
export function lsSetJson(key: string, val: unknown) {
    window.localStorage.setItem(key, JSON.stringify(val))
}

export function lsGetRaceMap(mid: number): Record<number, string> {
    try { return JSON.parse(localStorage.getItem(LS_RACE(mid)) || '{}') } catch { return {} }
}
export function lsSetRace(mid: number, playerId: number, race: string) {
    const map = lsGetRaceMap(mid)
    map[playerId] = race
    localStorage.setItem(LS_RACE(mid), JSON.stringify(map))
}
export function lsClearRaces(mid: number) {
    localStorage.removeItem(LS_RACE(mid))
}

export function lsGetBool(key: string) {
    return window.localStorage.getItem(key) === '1'
}
export function lsSetBool(key: string, val: boolean) {
    window.localStorage.setItem(key, val ? '1' : '0')
}

export const SETUP_HINT: Record<string, string> = {
    CATS: '1. Wybierz 3 sąsiadujące ze sobą polany ojczyste.\n2. Na każdej z nich umieść 2 wojowników.\n3. Na KAŻDEJ pozostałej połóż po jednym wojowniku.\n4. Token twierdzy połóż na jednej z polan ojczystych, która nie sąsiaduje z polanami ojczystymi przeciwników, jeśli to możliwe.\n5. Rozmieść 1 tartak, koszary oraz warsztat na każdej swojej innej polanie ojczystej.\n6. Umieść pozostałe żetony budynków na swojej planszy frakcji.',
    EAGLES: '1. Wybierz polanę ojczystą przy krawędzi mapy, oddaloną o co najmniej 2 polany od polan ojczystych przeciwników.\n2. Umieść na niej gniazdo i 6 wojowników.\n3. Wybierz Przywódcę i umieść go na swojej planszy; pozostałych odłóż na bok.\n4. Umieść swoich 2 Lojalnych Wezyrów pod odpowiednimi kolumnami dekretu, wskazanymi przez wybranego Przywódcę.\n5. Umieść pozostałe gniazda na planszy swojej frakcji.',
    ALLIANCE: '1. Dobierz 3 karty i umieść je w swojej talii sympatyków.\n2. Umieść tokeny sympatyków oraz żetony baz na planszy swojej frakcji.',
    CROWS: '1. Wybierz polanę ojczystą i umieść na niej 1 wojownika oraz 1 dowolny żeton intrygi.\n2. Umieść 1 wojownika na 3 polanach różnego typu (czyli łącznie na planszy będzie 4 wojowników).',
    VAGABOND: '1. Umieść swoją figurkę w dowolnym lesie.\n2. Potasuj talię misji. Dobierz z niej 3 karty i ułóż je odkryte w pobliżu.\n3. Umieść losowo 4 przedmioty w ruinach, chyba że zrobił to już inny gracz niegrający Włóczęgą.\n4. Wybierz Włóczęgę, którym zamierzasz grać, i umieść jego kartę na planszy frakcji, łącznie z przedmiotami startowymi S.\n5. Umieść znaczniki relacji pozostałych frakcji na torze Relacji na polu "Neutralny".',
    LIZARDS: '1. Wybierz polanę ojczystą, niesąsiadującą z żadną wrogą polaną ojczystą.\n2. Umieść na niej 4 wojowników i 1 ogród zgodny z typem polany. Umieść 3 wojowników na sąsiadujących polanach, tak równo, jak to możliwe.\n3. Umieść 2 wojowników na polu Akolitów.\n4. Umieść ogrody na swojej planszy frakcji.\n5. Umieść żeton Wygnańców na wybranym przez siebie typie polan, stroną Wygnańców do góry.',
    OTTERS: '1. Umieść 4 wojowników na dowolnych polanach wzdłuż rzeki.\n2. Rozmieść 3 wojowników na polu Płatności.\n3. Rozmieść faktorie na odpowiednich torach faktorii.\n4. Ustal początkowe ceny usług.',
    BADGERS: '1. Potajemnie przetasuj wszystkie 12 Reliktów i bez podglądania umieść po jednym w każdym lesie. Pozostałe będą potrzebne w kroku 3.\n2. Wybierz 2 sąsiadujące ojczyste polany na obrzeżach mapy, każdą oddaloną o co najmniej 2 polany od polan ojczystych przeciwników. Na każdej umieść 4 wojowników.\n3. Umieść wszystkie pozostałe relikty w lasach tak, aby były jak najrówniej rozłożone. Nie mogą sąsiadować z twoimi polanami ojczystymi.\n4. Umieść Wierne Sługi pod każdą kolumną swojej Świty.',
    MOLES: '1. Wybierz ojczystą polanę, niesąsiadującą z wrogą ojczystą polaną.\n2. Umieść na niej 2 wojowników i 1 tunel. Umieść 5 wojowników na sąsiadujących polanach tak równo, jak to możliwe.\n3. Umieść Norę obok mapy. Umieść budynki cytadel i targów na planszy frakcji.\n4. Umieść 9 kart Ministrów na polu Nieprzekonanych Ministrów oraz po 3 korony w odpowiednich miejscach na planszy frakcji.',
    RATS: '1. Wybierz polanę ojczystą przy krawędzi mapy, oddaloną o co najmniej 2 polany od polan ojczystych przeciwników.\n2. Umieść swojego Lorda, 4 wojowników i Warownię na tej polanie.\n3. Umieść kartę nastroju Uparty na polu Karty Nastroju.\n4. Umieść 4 przedmioty w ruinach (jeśli jeszcze nie zostało to zrobione).',
}

export function setupTextForRace(race?: string | null) {
    const rk = raceKey(race)
    return SETUP_HINT[rk] ?? 'Rozstaw frakcję zgodnie z planszetką.'
}

