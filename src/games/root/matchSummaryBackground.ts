import fallbackBackground from '../../assets/backgrounds/root_match_summary.png'

const matchSummaryImages = import.meta.glob('../../assets/match-history/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const imageByName = new Map<string, string>()

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

for (const [path, url] of Object.entries(matchSummaryImages)) {
  const fileName = path.split('/').pop()
  if (!fileName) continue
  const baseName = fileName.replace(/\.[^.]+$/, '')
  const trimmedBaseName = baseName.trim()
  if (!trimmedBaseName) continue

  imageByName.set(trimmedBaseName.toLowerCase(), url)
  imageByName.set(normalize(trimmedBaseName), url)
}

export function getMatchSummaryBackground(matchName: string | null | undefined): string {
  if (!matchName || !matchName.trim()) return fallbackBackground

  const trimmedName = matchName.trim()
  return (
    imageByName.get(trimmedName.toLowerCase()) ??
    imageByName.get(normalize(trimmedName)) ??
    fallbackBackground
  )
}
