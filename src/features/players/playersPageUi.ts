// Extracted from PlayersPage to keep page component thin.
const ui = {
  page: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '18px 16px 28px',
    fontFamily: 'system-ui, sans-serif',
    color: 'var(--app-text)',
  } as const,

  backdrop: {
    borderRadius: 22,
    padding: 18,
    background:
      'var(--app-shell-bg)',
    border: 'var(--app-shell-border)',
    boxShadow: 'var(--app-shell-shadow)',
    backdropFilter: 'blur(10px)',
  } as const,

  h1: { margin: 0, letterSpacing: 0.6, fontSize: 26, fontWeight: 1000 } as const,
  p: { marginTop: 6, opacity: 0.84, color: 'rgba(var(--app-muted-rgb),0.8)' } as const,

  controls: {
    display: 'flex',
    gap: 10,
    margin: '16px 0 12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  } as const,

  input: {
    flex: 1,
    minWidth: 220,
    padding: '12px 12px',
    borderRadius: 14,
    border: 'var(--app-input-border)',
    outline: 'none',
    background: 'var(--app-soft-bg)',
    color: 'var(--app-text)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  btn: (variant: 'gold' | 'ghost' | 'danger', disabled: boolean) =>
    ({
      padding: '12px 14px',
      borderRadius: 14,
      border:
        variant === 'danger'
          ? 'var(--app-accent-border)'
          : variant === 'gold'
            ? '1px solid rgba(211,160,85,0.46)'
            : '1px solid rgba(213,128,139,0.28)',
      background:
        variant === 'danger'
          ? 'var(--app-accent-gradient)'
          : variant === 'gold'
            ? 'linear-gradient(135deg, rgba(211,160,85,0.26), rgba(211,160,85,0.08))'
            : 'var(--app-soft-bg)',
      color: 'var(--app-text)',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'danger'
          ? 'var(--app-accent-glow)'
          : variant === 'gold'
            ? '0 16px 34px rgba(96,70,34,0.25)'
            : 'none',
      transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
      userSelect: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap',
    }) as const,

  err: {
    padding: 12,
    borderRadius: 14,
    border: 'var(--app-accent-border)',
    background: 'rgba(181,53,31,0.28)',
    marginTop: 10,
    marginBottom: 12,
    color: 'rgba(255,255,255,0.9)',
  } as const,

  loading: { opacity: 0.8, color: 'rgba(var(--app-muted-rgb),0.78)' } as const,

  list: { display: 'grid', gap: 10, marginTop: 12 } as const,

  playerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    border: 'var(--app-panel-border)',
    background: 'var(--app-panel-bg)',
    boxShadow: '0 18px 55px rgba(0,0,0,0.4)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  left: { display: 'flex', alignItems: 'center', gap: 10 } as const,

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 14,
    display: 'grid',
    placeItems: 'center',
    fontWeight: 1000,
    border: 'var(--app-soft-border)',
    background: 'var(--app-accent-soft-gradient)',
    color: 'var(--app-text)',
  } as const,

  name: { fontWeight: 1000, letterSpacing: 0.2 } as const,

  empty: {
    opacity: 0.78,
    padding: 12,
    border: 'var(--app-dashed-border)',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    color: 'rgba(var(--app-muted-rgb),0.82)',
  } as const,
}

export const playersPageUi = ui
export type PlayersPageUi = typeof playersPageUi


