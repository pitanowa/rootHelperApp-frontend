import type { ThemeTokens } from '../games/types'

export function applyGameTheme(tokens: ThemeTokens) {
  const root = document.documentElement
  root.style.setProperty('--app-bg-image', tokens.backgroundImage)
  root.style.setProperty('--app-accent', tokens.accent)
}
