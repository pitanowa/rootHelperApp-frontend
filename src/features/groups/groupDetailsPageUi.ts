// Extracted from GroupDetailsPage to keep page component thin.
const ui = {
  page: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '18px 16px 28px',
    fontFamily: 'system-ui, sans-serif',
    color: 'var(--app-text)',
  } as const,

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    borderRadius: 18,
    padding: 16,
    flexWrap: 'wrap',
    background:
      'var(--app-shell-bg)',
  } as const,

  title: { margin: 0, lineHeight: 1.1, letterSpacing: 0.4 } as const,
  subtitle: { marginTop: 6, fontSize: 13, opacity: 0.84, color: 'rgba(var(--app-muted-rgb),0.8)' } as const,

  glowHeader: {
    borderRadius: 18,
    padding: 16,
    border: 'var(--app-shell-border)',
    background:
      'var(--app-shell-bg)',
    boxShadow: 'var(--app-shell-shadow)',
    overflow: 'hidden',
  } as const,

  backLink: {
    textDecoration: 'none',
    border: 'var(--app-soft-border)',
    borderRadius: 14,
    padding: '10px 12px',
    color: 'var(--app-text)',
    background: 'var(--app-soft-bg)',
    fontWeight: 1000,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  } as const,

  badge: {
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 999,
    border: 'var(--app-input-border)',
    background: 'var(--app-soft-bg)',
    color: 'rgba(var(--app-muted-rgb),0.86)',
    fontWeight: 1000,
    letterSpacing: 0.2,
    whiteSpace: 'nowrap',
  } as const,

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

  card: {
    borderRadius: 18,
    padding: 16,
    border: 'var(--app-panel-border)',
    background: 'var(--app-panel-bg)',
    boxShadow: 'var(--app-panel-shadow)',
    overflow: 'hidden',
  } as const,

  cardTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  } as const,

  cardTitle: { margin: 0, fontSize: 18, fontWeight: 1000, color: 'var(--app-text)' } as const,
  muted: { opacity: 0.8, color: 'rgba(var(--app-muted-rgb),0.76)' } as const,

  twoCol: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    alignItems: 'start',
  } as const,

  controlsRow: {
    display: 'flex',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  } as const,

  field: {
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

  btn: (variant: 'ghost' | 'primary' | 'danger' | 'gold', disabled: boolean) =>
    ({
      padding: '12px 14px',
      borderRadius: 14,
      border:
        variant === 'danger'
          ? 'var(--app-accent-border)'
          : variant === 'primary'
            ? 'var(--app-accent-border)'
            : variant === 'gold'
              ? '1px solid rgba(211,160,85,0.44)'
              : 'var(--app-soft-border)',
      background:
        variant === 'danger'
          ? 'var(--app-accent-gradient)'
          : variant === 'primary'
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
          : variant === 'primary'
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

  rowCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    border: 'var(--app-panel-border)',
    borderRadius: 16,
    padding: 12,
    background: 'var(--app-soft-bg)',
    boxShadow: '0 14px 38px rgba(0,0,0,0.42)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  rowName: {
    fontWeight: 1000,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'var(--app-text)',
  } as const,

  selectField: {
    flex: 1,
    minWidth: 220,
    padding: '12px 12px',
    borderRadius: 14,
    border: 'var(--app-input-border)',
    background: 'var(--app-input-bg)',
    color: 'var(--app-text)',
    outline: 'none',
    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
  } as const,

  empty: {
    opacity: 0.78,
    padding: 14,
    border: 'var(--app-dashed-border)',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(var(--app-muted-rgb),0.76)',
  } as const,

  leagueLink: {
    textDecoration: 'none',
    color: 'inherit',
    border: 'var(--app-panel-border)',
    borderRadius: 16,
    padding: 12,
    background: 'var(--app-soft-bg)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 14px 38px rgba(0,0,0,0.42)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,
}

export const groupDetailsPageUi = ui
export type GroupDetailsPageUi = typeof groupDetailsPageUi


