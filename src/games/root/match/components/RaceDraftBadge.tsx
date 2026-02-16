import { raceDraftUi } from '../raceDraftUi'

type Props = {
  text: string
  variant: 'hot' | 'ghost' | 'ok' | 'info'
}

export default function RaceDraftBadge({ text, variant }: Props) {
  return <span style={raceDraftUi.badge(variant)}>{text}</span>
}

