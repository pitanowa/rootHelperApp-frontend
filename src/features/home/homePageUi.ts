export const homeHeroPills = [
  'League Control',
  'Matchmaking',
  'Race and Landmark Draft',
  'Ranked and Casual',
]

export const homeSetupSteps = [
  {
    title: '1. Build roster',
    description: 'Add players to prepare your core league pool.',
  },
  {
    title: '2. Create groups',
    description: 'Organize players into groups and assign leagues.',
  },
  {
    title: '3. Start match',
    description: 'Open an active match and run draft and timer in one place.',
  },
]

export function getLeagueLabel(leagueName: string | undefined) {
  return leagueName ?? 'Unknown league'
}

export function getGroupLabel(groupName: string | undefined) {
  return groupName ?? 'No group'
}

export function getRankBadge(rank: number) {
  if (rank === 1) return 'I'
  if (rank === 2) return 'II'
  if (rank === 3) return 'III'
  return String(rank)
}
