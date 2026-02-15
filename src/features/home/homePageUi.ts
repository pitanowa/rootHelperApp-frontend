export const homeHeroPills = [
  'ROOT League Control',
  'Matchmaking',
  'Draft ras i landmarków',
  'Ranked i casual',
]

export const homeSetupSteps = [
  {
    title: '1. Zbuduj skład',
    description: 'Dodaj graczy, aby przygotować bazę pod ligi i mecze.',
  },
  {
    title: '2. Utwórz grupy',
    description: 'Organizuj ludzi w grupy i przypisuj do nich ligi.',
  },
  {
    title: '3. Uruchom mecz',
    description: 'Przejdź do aktywnego meczu i prowadź draft oraz timer bez chaosu.',
  },
]

export function getLeagueLabel(leagueName: string | undefined) {
  return leagueName ?? 'Nieznana liga'
}

export function getGroupLabel(groupName: string | undefined) {
  return groupName ?? 'Brak grupy'
}

export function getRankBadge(rank: number) {
  if (rank === 1) return 'I'
  if (rank === 2) return 'II'
  if (rank === 3) return 'III'
  return String(rank)
}
