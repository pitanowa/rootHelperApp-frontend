import cats from '../assets/races/root_cats.png'
import dynasty from '../assets/races/root_dynasty.png'
import alliance from '../assets/races/root_alliance.png'
import crows from '../assets/races/root_crows.png'
import vaga from '../assets/races/root_vaga.png'
import priests from '../assets/races/root_priests.png'
import riverfolk from '../assets/races/root_riverfolk.png'
import knights from '../assets/races/root_knights.png'
import kingdom from '../assets/races/root_kingdom.png'
import rats from '../assets/races/root_rats.png'

export const RACE_LABEL = {
  CATS: 'Markiza de Kot',
  EAGLES: 'Dynastia Orlich Gniazd',
  ALLIANCE: 'Sojusz Stworzeń Leśnych',
  VAGABOND: 'Włóczęga',
  OTTERS: 'Kompania Plemion Rzecznych',
  LIZARDS: 'Jaszczurzy Kultyści',
  MOLES: 'Podziemne Księstwo',
  RATS: 'Władca Szczurów',
  BADGERS: 'Żelazna Straż',
  CROWS: 'Krucza Konspiracja',
} as const

export type RaceId = keyof typeof RACE_LABEL

export const RACE_ICON: Record<string, string> = {
  CATS: cats,
  EAGLES: dynasty,
  ALLIANCE: alliance,
  CROWS: crows,
  VAGABOND: vaga,
  LIZARDS: priests,
  OTTERS: riverfolk,
  BADGERS: knights,
  MOLES: kingdom,
  RATS: rats,
}

export const RACE_COLOR: Record<string, string> = {
  CATS: '#da8608',
  EAGLES: '#02309c',
  ALLIANCE: '#16a34a',
  CROWS: '#6d28d9',
  VAGABOND: '#553c3c',
  LIZARDS: '#e0cc15',
  OTTERS: '#0fc2aa',
  BADGERS: '#4d4d4d',
  MOLES: '#e69a7b',
  RATS: '#dc2626',
}

export const RACE_IDS = Object.keys(RACE_LABEL) as RaceId[]

const RACE_ALIASES: Record<string, RaceId> = {
  koty: 'CATS',
  orly: 'EAGLES',
  'sojusz zwierzat': 'ALLIANCE',
  kruki: 'CROWS',
  wedrowiec: 'VAGABOND',
  jaszczury: 'LIZARDS',
  wydry: 'OTTERS',
  borsuki: 'BADGERS',
  krety: 'MOLES',
  szczury: 'RATS',

  cats: 'CATS',
  eagles: 'EAGLES',
  alliance: 'ALLIANCE',
  crows: 'CROWS',
  vagabond: 'VAGABOND',
  lizards: 'LIZARDS',
  otters: 'OTTERS',
  badgers: 'BADGERS',
  moles: 'MOLES',
  rats: 'RATS',
}

function normalizeRaceInput(race: string) {
  return race
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}

export function raceKey(race?: string | null): string {
  if (!race) return ''

  const raw = race.trim()
  if ((raw as RaceId) in RACE_LABEL) return raw

  const upper = raw.toUpperCase()
  if ((upper as RaceId) in RACE_LABEL) return upper

  const normalized = normalizeRaceInput(raw)
  return RACE_ALIASES[normalized] ?? upper
}

export function raceLabel(race?: string | null): string {
  const key = raceKey(race)
  if (!key) return '—'
  return RACE_LABEL[key as RaceId] ?? key
}

