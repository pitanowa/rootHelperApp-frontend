// Extracted from GroupsPage to keep page component thin.
const ui = {
  page: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '18px 16px 28px',
    fontFamily: 'system-ui, sans-serif',
    color: '#fbeff1',
  } as const,

  backdrop: {
    borderRadius: 22,
    padding: 18,
    background:
      'radial-gradient(900px 420px at 15% 0%, rgba(193,38,61,0.28), transparent 55%), radial-gradient(760px 300px at 90% 8%, rgba(115,22,35,0.36), transparent 60%), linear-gradient(180deg, rgba(23,8,13,0.95), rgba(11,4,7,0.98))',
    border: '1px solid rgba(196,63,75,0.34)',
    boxShadow: '0 28px 80px rgba(0,0,0,0.56), 0 0 56px rgba(137,19,40,0.22)',
    backdropFilter: 'blur(10px)',
  } as const,

  header: { marginBottom: 8, letterSpacing: 0.4 } as const,
  sub: { marginTop: 0, opacity: 0.84, color: 'rgba(233,200,205,0.8)', lineHeight: 1.6 } as const,

  card: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(196,63,75,0.32)',
    background: 'linear-gradient(180deg, rgba(25,8,13,0.95), rgba(11,4,7,0.98))',
    boxShadow: '0 18px 55px rgba(0,0,0,0.45), 0 0 40px rgba(137,19,40,0.16)',
    overflow: 'hidden',
  } as const,

  glowTop: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(196,63,75,0.34)',
    background:
      'radial-gradient(900px 260px at 10% 0%, rgba(193,38,61,0.28), transparent 60%), radial-gradient(700px 220px at 90% 20%, rgba(115,22,35,0.3), transparent 55%), linear-gradient(180deg, rgba(25,8,13,0.95), rgba(11,4,7,0.98))',
    boxShadow: '0 22px 70px rgba(0,0,0,0.56), 0 0 56px rgba(137,19,40,0.2)',
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
    border: '1px solid rgba(213,128,139,0.3)',
    background: 'linear-gradient(180deg, rgba(26,9,14,0.95), rgba(14,5,9,0.98))',
    color: '#fbeff1',
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
          ? '1px solid rgba(255,95,116,0.5)'
          : variant === 'gold'
            ? '1px solid rgba(211,160,85,0.44)'
            : '1px solid rgba(213,128,139,0.28)',
      background:
        variant === 'primary'
          ? 'linear-gradient(135deg, rgba(193,38,61,0.9), rgba(117,15,31,0.92))'
          : variant === 'gold'
            ? 'linear-gradient(135deg, rgba(211,160,85,0.26), rgba(211,160,85,0.08))'
            : 'rgba(255,255,255,0.04)',
      color: '#fbeff1',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'primary'
          ? '0 16px 34px rgba(137,19,40,0.35)'
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
    border: '1px solid rgba(255,95,116,0.45)',
    background: 'rgba(181,53,31,0.28)',
    color: '#fbeff1',
    fontWeight: 900,
    marginBottom: 12,
    boxShadow: '0 16px 44px rgba(0,0,0,0.35)',
  } as const,

  list: { display: 'grid', gap: 10 } as const,

  groupLink: {
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid rgba(196,63,75,0.32)',
    borderRadius: 16,
    padding: 14,
    background: 'linear-gradient(180deg, rgba(26,9,14,0.95), rgba(14,5,9,0.98))',
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
    border: '1px dashed rgba(213,128,139,0.32)',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.03)',
  } as const,
}

export const groupsPageUi = ui
export type GroupsPageUi = typeof groupsPageUi
