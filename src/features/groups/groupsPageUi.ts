// Extracted from GroupsPage to keep page component thin.
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

  header: { marginBottom: 8, letterSpacing: 0.4 } as const,
  sub: { marginTop: 0, opacity: 0.84, color: 'rgba(var(--app-muted-rgb),0.8)', lineHeight: 1.6 } as const,

  card: {
    borderRadius: 18,
    padding: 16,
    border: 'var(--app-panel-border)',
    background: 'var(--app-panel-bg)',
    boxShadow: 'var(--app-panel-shadow)',
    overflow: 'hidden',
  } as const,

  glowTop: {
    borderRadius: 18,
    padding: 16,
    border: 'var(--app-shell-border)',
    background:
      'var(--app-shell-bg)',
    boxShadow: 'var(--app-shell-shadow)',
    overflow: 'hidden',
  } as const,

  controls: {
    display: 'flex',
    gap: 10,
    margin: '16px 0',
    flexWrap: 'wrap',
    alignItems: 'center',
  } as const,

  input: {
    flex: 1,
    minWidth: 220,
    padding: '12px 12px',
    borderRadius: 14,
    border: 'var(--app-input-border)',
    background: 'var(--app-input-bg)',
    color: 'var(--app-text)',
    outline: 'none',
    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  btn: (variant: 'primary' | 'ghost' | 'gold', disabled: boolean) =>
    ({
      padding: '12px 14px',
      borderRadius: 14,
      border:
        variant === 'primary'
          ? 'var(--app-accent-border)'
          : variant === 'gold'
            ? '1px solid rgba(211,160,85,0.44)'
            : 'var(--app-soft-border)',
      background:
        variant === 'primary'
          ? 'var(--app-accent-gradient)'
          : variant === 'gold'
            ? 'linear-gradient(135deg, rgba(211,160,85,0.26), rgba(211,160,85,0.08))'
            : 'var(--app-soft-bg)',
      color: 'var(--app-text)',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'primary'
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
    borderRadius: 16,
    border: 'var(--app-accent-border)',
    background: 'rgba(181,53,31,0.28)',
    color: 'var(--app-text)',
    fontWeight: 900,
    marginBottom: 12,
    boxShadow: '0 16px 44px rgba(0,0,0,0.35)',
  } as const,

  list: { display: 'grid', gap: 10 } as const,

  groupLink: {
    textDecoration: 'none',
    color: 'inherit',
    border: 'var(--app-panel-border)',
    borderRadius: 16,
    padding: 14,
    background: 'var(--app-input-bg)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 14px 38px rgba(0,0,0,0.42)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease, background 120ms ease',
  } as const,

  groupName: { fontWeight: 1000, letterSpacing: 0.2 } as const,
  openHint: { opacity: 0.82, fontWeight: 900 } as const,

  empty: {
    opacity: 0.78,
    padding: 14,
    border: 'var(--app-dashed-border)',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.03)',
  } as const,
}

export const groupsPageUi = ui
export type GroupsPageUi = typeof groupsPageUi


