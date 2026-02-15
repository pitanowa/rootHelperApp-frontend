// Extracted from GroupsPage to keep page component thin.
const ui = {
  page: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 16,
    fontFamily: 'system-ui, sans-serif',
    color: 'rgba(255,255,255,0.92)',
  } as const,

  header: { marginBottom: 8, letterSpacing: 0.4 } as const,
  sub: { marginTop: 0, opacity: 0.78, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 } as const,

  card: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
    boxShadow: '0 18px 55px rgba(0,0,0,0.45), 0 0 50px rgba(220,38,38,0.08)',
    overflow: 'hidden',
  } as const,

  glowTop: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.10)',
    background:
      'radial-gradient(900px 260px at 10% 0%, rgba(220,38,38,0.22), transparent 60%), radial-gradient(800px 260px at 90% 20%, rgba(59,130,246,0.16), transparent 55%), linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
    boxShadow: '0 22px 70px rgba(0,0,0,0.50), 0 0 60px rgba(220,38,38,0.10)',
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
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))',
    color: 'rgba(255,255,255,0.92)',
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
          ? '1px solid rgba(59,130,246,0.40)'
          : variant === 'gold'
            ? '1px solid rgba(250,204,21,0.28)'
            : '1px solid rgba(255,255,255,0.14)',
      background:
        variant === 'primary'
          ? 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(99,102,241,0.92))'
          : variant === 'gold'
            ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(255,255,255,0.04))'
            : 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.92)',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'primary'
          ? '0 16px 34px rgba(59,130,246,0.22)'
          : variant === 'gold'
            ? '0 16px 34px rgba(250,204,21,0.10)'
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
    border: '1px solid rgba(248,113,113,0.30)',
    background: 'rgba(220,38,38,0.12)',
    color: 'rgba(255,255,255,0.92)',
    fontWeight: 900,
    marginBottom: 12,
    boxShadow: '0 16px 44px rgba(0,0,0,0.35)',
  } as const,

  list: { display: 'grid', gap: 10 } as const,

  groupLink: {
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 14,
    background: 'linear-gradient(180deg, rgba(18,18,22,1), rgba(12,12,14,1))',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 14px 38px rgba(0,0,0,0.35)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease, background 120ms ease',
  } as const,

  groupName: { fontWeight: 1000, letterSpacing: 0.2 } as const,
  openHint: { opacity: 0.75, fontWeight: 900 } as const,

  empty: {
    opacity: 0.78,
    padding: 14,
    border: '1px dashed rgba(255,255,255,0.22)',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.04)',
  } as const,
}

export const groupsPageUi = ui
export type GroupsPageUi = typeof groupsPageUi
