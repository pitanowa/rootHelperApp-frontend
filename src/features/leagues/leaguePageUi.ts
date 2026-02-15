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
      'radial-gradient(960px 340px at 12% 0%, rgba(148,19,41,0.24), transparent 58%), radial-gradient(760px 240px at 92% 10%, rgba(83,12,24,0.28), transparent 62%), linear-gradient(180deg, rgba(16,6,10,0.96), rgba(8,3,6,0.98))',
    border: '1px solid rgba(173,55,69,0.3)',
    boxShadow: '0 28px 80px rgba(0,0,0,0.58), 0 0 44px rgba(121,15,33,0.2)',
  } as const,

  headerCard: {
    borderRadius: 16,
    padding: 14,
    border: '1px solid rgba(173,55,69,0.28)',
    background: 'linear-gradient(180deg, rgba(23,8,13,0.94), rgba(11,4,7,0.98))',
    boxShadow: '0 16px 46px rgba(0,0,0,0.42)',
    marginBottom: 12,
  } as const,

  backLink: {
    textDecoration: 'none',
    color: '#fbeff1',
    border: '1px solid rgba(209,110,122,0.3)',
    borderRadius: 10,
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.04)',
    fontWeight: 900,
    display: 'inline-flex',
    alignItems: 'center',
  } as const,

  refreshBtn: {
    border: '1px solid rgba(209,110,122,0.35)',
    borderRadius: 10,
    padding: '8px 12px',
    background: 'linear-gradient(135deg, rgba(155,27,47,0.48), rgba(92,11,24,0.44))',
    color: '#fbeff1',
    fontWeight: 900,
    cursor: 'pointer',
  } as const,

  error: {
    padding: 12,
    borderRadius: 12,
    border: '1px solid rgba(255,95,116,0.45)',
    background: 'rgba(181,53,31,0.28)',
    marginBottom: 12,
    color: '#fbeff1',
  } as const,

  card: {
    borderRadius: 18,
    padding: 16,
    border: '1px solid rgba(173,55,69,0.28)',
    background: 'linear-gradient(180deg, rgba(20,7,12,0.96), rgba(10,4,7,0.98))',
    boxShadow: '0 18px 55px rgba(0,0,0,0.46), 0 0 34px rgba(121,15,33,0.14)',
    overflow: 'hidden',
    color: '#fbeff1',
  } as const,

  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  } as const,

  badge: {
    fontSize: 12,
    fontWeight: 900,
    padding: '8px 10px',
    borderRadius: 999,
    border: '1px solid rgba(209,110,122,0.32)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(251,239,241,0.84)',
    whiteSpace: 'nowrap',
  } as const,

  title: { margin: 0, fontSize: 18, letterSpacing: 0.2 } as const,
  subtitle: { fontSize: 12, opacity: 0.8, color: 'rgba(233,200,205,0.78)' } as const,

  controlsWrap: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 14,
  } as const,

  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 12,
    marginTop: 12,
  } as const,

  field: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: 14,
    border: '1px solid rgba(173,55,69,0.24)',
    background: 'rgba(255,255,255,0.03)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
  } as const,

  labelSmall: { fontSize: 12, opacity: 0.84, fontWeight: 900, color: 'rgba(233,200,205,0.8)' } as const,

  input: {
    width: 120,
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(209,110,122,0.3)',
    outline: 'none',
    background: 'rgba(255,255,255,0.04)',
    color: '#fbeff1',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  segment: {
    display: 'flex',
    padding: 4,
    borderRadius: 999,
    border: '1px solid rgba(173,55,69,0.24)',
    background: 'rgba(255,255,255,0.03)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.24)',
  } as const,

  segBtn: (active: boolean) =>
    ({
      padding: '10px 12px',
      borderRadius: 999,
      border: '1px solid transparent',
      background: active
        ? 'linear-gradient(135deg, rgba(159,27,49,0.62), rgba(81,10,20,0.52))'
        : 'transparent',
      color: active ? '#fbeff1' : 'rgba(233,200,205,0.74)',
      fontWeight: 1000,
      letterSpacing: 0.3,
      cursor: 'pointer',
      transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
      boxShadow: active ? '0 14px 30px rgba(121,15,33,0.24)' : 'none',
      userSelect: 'none',
      whiteSpace: 'nowrap',
    }) as const,

  switch: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: 14,
    border: '1px solid rgba(173,55,69,0.24)',
    background: 'rgba(255,255,255,0.03)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.24)',
  } as const,

  createBtn: (enabled: boolean) =>
    ({
      padding: '12px 14px',
      borderRadius: 14,
      border: enabled ? '1px solid rgba(255,95,116,0.45)' : '1px solid rgba(209,110,122,0.24)',
      background: enabled
        ? 'linear-gradient(135deg, rgba(193,38,61,0.9), rgba(117,15,31,0.92))'
        : 'rgba(255,255,255,0.04)',
      color: enabled ? '#fbeff1' : 'rgba(251,239,241,0.45)',
      fontWeight: 1000,
      cursor: enabled ? 'pointer' : 'not-allowed',
      boxShadow: enabled ? '0 16px 34px rgba(121,15,33,0.32)' : 'none',
      transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
      userSelect: 'none',
      whiteSpace: 'nowrap',
    }) as const,

  playerCard: (isSelected: boolean) =>
    ({
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      borderRadius: 16,
      padding: 12,
      border: isSelected ? '1px solid rgba(255,95,116,0.42)' : '1px solid rgba(173,55,69,0.24)',
      background: isSelected
        ? 'linear-gradient(180deg, rgba(144,20,39,0.24), rgba(255,255,255,0.04))'
        : 'rgba(255,255,255,0.03)',
      boxShadow: isSelected ? '0 16px 34px rgba(121,15,33,0.24)' : '0 10px 24px rgba(0,0,0,0.24)',
      cursor: 'pointer',
      transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
      color: '#fbeff1',
    }) as const,

  checkbox: {
    width: 18,
    height: 18,
    accentColor: '#b91c3a',
  } as const,

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
    fontWeight: 1000,
    color: '#fbeff1',
    background: 'linear-gradient(135deg, rgba(193,38,61,0.36), rgba(117,15,31,0.24))',
    border: '1px solid rgba(209,110,122,0.3)',
  } as const,

  playerName: { fontWeight: 1000, letterSpacing: 0.2 } as const,

  historyCard: {
    background: 'linear-gradient(180deg, rgba(15,6,10,0.96), rgba(8,3,6,0.98))',
    border: '1px solid rgba(173,55,69,0.28)',
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
    boxShadow: '0 24px 70px rgba(0,0,0,0.5), 0 0 34px rgba(121,15,33,0.16)',
  } as const,

  historyHeaderRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  } as const,

  historyTitle: {
    margin: 0,
    fontSize: 18,
    letterSpacing: 0.3,
    color: '#fbeff1',
  } as const,

  historyMeta: {
    fontSize: 12,
    opacity: 0.8,
    color: 'rgba(233,200,205,0.76)',
  } as const,

  historyEmpty: {
    padding: 14,
    borderRadius: 14,
    border: '1px dashed rgba(209,110,122,0.34)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(233,200,205,0.78)',
  } as const,

  historyGrid: {
    display: 'grid',
    gap: 10,
  } as const,

  matchRow: {
    borderRadius: 16,
    border: '1px solid rgba(173,55,69,0.26)',
    background: 'linear-gradient(180deg, rgba(23,8,13,0.9), rgba(11,4,7,0.96))',
    padding: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 16px 40px rgba(0,0,0,0.36)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  matchLeft: {
    display: 'grid',
    gap: 6,
    minWidth: 220,
  } as const,

  matchTopLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  } as const,

  matchId: {
    fontWeight: 1000,
    letterSpacing: 0.2,
    color: '#fbeff1',
  } as const,

  chipRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  } as const,

  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(209,110,122,0.3)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(251,239,241,0.82)',
    fontSize: 12,
    fontWeight: 900,
  } as const,

  statusChip: (status: string) =>
    ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 10px',
      borderRadius: 999,
      border: '1px solid rgba(209,110,122,0.3)',
      background:
        status === 'FINISHED'
          ? 'linear-gradient(135deg, rgba(56,80,47,0.35), rgba(255,255,255,0.04))'
          : status === 'DRAFT'
            ? 'linear-gradient(135deg, rgba(120,46,58,0.32), rgba(255,255,255,0.04))'
            : 'linear-gradient(135deg, rgba(159,27,49,0.35), rgba(255,255,255,0.04))',
      color: 'rgba(251,239,241,0.86)',
      fontSize: 12,
      fontWeight: 1000,
      letterSpacing: 0.3,
    }) as const,

  modeChip: (ranked: boolean) =>
    ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 10px',
      borderRadius: 999,
      border: '1px solid rgba(209,110,122,0.3)',
      background: ranked
        ? 'linear-gradient(135deg, rgba(184,140,66,0.3), rgba(255,255,255,0.04))'
        : 'linear-gradient(135deg, rgba(122,81,87,0.26), rgba(255,255,255,0.04))',
      color: 'rgba(251,239,241,0.86)',
      fontSize: 12,
      fontWeight: 1000,
      letterSpacing: 0.3,
    }) as const,

  actions: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  } as const,

  linkBtn: (variant: 'open' | 'danger' | 'ghost', disabled: boolean) =>
    ({
      textDecoration: 'none',
      padding: '9px 12px',
      borderRadius: 12,
      border:
        variant === 'danger'
          ? '1px solid rgba(255,95,116,0.45)'
          : variant === 'open'
            ? '1px solid rgba(255,95,116,0.42)'
            : '1px solid rgba(209,110,122,0.28)',
      background:
        variant === 'danger'
          ? 'linear-gradient(135deg, rgba(193,38,61,0.86), rgba(117,15,31,0.9))'
          : variant === 'open'
            ? 'linear-gradient(135deg, rgba(159,27,49,0.64), rgba(81,10,20,0.5))'
            : 'rgba(255,255,255,0.04)',
      color: '#fbeff1',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      pointerEvents: disabled ? 'none' : 'auto',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'danger'
          ? '0 14px 30px rgba(121,15,33,0.32)'
          : variant === 'open'
            ? '0 14px 30px rgba(121,15,33,0.24)'
            : 'none',
      transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
      userSelect: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap',
    }) as const,

  standingsCardDark: {
    background: 'linear-gradient(180deg, rgba(15,6,10,0.96), rgba(8,3,6,0.98))',
    border: '1px solid rgba(173,55,69,0.28)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0 24px 70px rgba(0,0,0,0.5), 0 0 34px rgba(121,15,33,0.16)',
  } as const,

  standingsHeaderDark: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  } as const,

  standingsTitleDark: {
    margin: 0,
    fontSize: 18,
    letterSpacing: 0.3,
    color: '#fbeff1',
  } as const,

  standingsMetaDark: {
    fontSize: 12,
    opacity: 0.8,
    color: 'rgba(233,200,205,0.76)',
  } as const,

  standingsBadgeDark: {
    fontSize: 12,
    fontWeight: 900,
    padding: '8px 10px',
    borderRadius: 999,
    border: '1px solid rgba(209,110,122,0.3)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(251,239,241,0.84)',
  } as const,

  standingsEmptyDark: {
    padding: 14,
    borderRadius: 14,
    border: '1px dashed rgba(209,110,122,0.34)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(233,200,205,0.78)',
  } as const,

  standingsTableWrapDark: {
    overflowX: 'auto',
    borderRadius: 14,
    border: '1px solid rgba(173,55,69,0.28)',
    background: 'rgba(255,255,255,0.03)',
  } as const,

  standingsTableDark: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    minWidth: 560,
  } as const,

  standingsThDark: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 1,
    textAlign: 'left' as const,
    padding: '10px 12px',
    fontSize: 12,
    letterSpacing: 0.3,
    textTransform: 'uppercase' as const,
    color: 'rgba(233,200,205,0.74)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
    borderBottom: '1px solid rgba(209,110,122,0.24)',
  } as const,

  standingsTdDark: {
    padding: '12px 12px',
    borderBottom: '1px solid rgba(209,110,122,0.2)',
    color: 'rgba(251,239,241,0.88)',
    verticalAlign: 'middle' as const,
  } as const,

  standingsTrBaseDark: {
    transition: 'background 120ms ease, transform 120ms ease, box-shadow 120ms ease',
  } as const,

  standingsRankPillDark: (rank: number) =>
    ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 36,
      height: 28,
      padding: '0 10px',
      borderRadius: 999,
      fontWeight: 1000,
      border: '1px solid rgba(209,110,122,0.3)',
      background:
        rank === 1
          ? 'linear-gradient(135deg, rgba(184,140,66,0.34), rgba(255,255,255,0.04))'
          : rank === 2
            ? 'linear-gradient(135deg, rgba(139,117,121,0.3), rgba(255,255,255,0.04))'
            : rank === 3
              ? 'linear-gradient(135deg, rgba(143,86,62,0.3), rgba(255,255,255,0.04))'
              : 'rgba(255,255,255,0.04)',
      boxShadow: rank <= 3 ? '0 12px 26px rgba(0,0,0,0.32)' : '0 10px 22px rgba(0,0,0,0.22)',
      color: '#fbeff1',
    }) as const,

  standingsPlayerCellDark: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  } as const,

  standingsAvatarDark: (rank: number) =>
    ({
      width: 34,
      height: 34,
      borderRadius: 12,
      display: 'grid',
      placeItems: 'center',
      fontWeight: 1000,
      border: '1px solid rgba(209,110,122,0.3)',
      background:
        rank === 1
          ? 'linear-gradient(135deg, rgba(184,140,66,0.34), rgba(121,15,33,0.22))'
          : 'linear-gradient(135deg, rgba(159,27,49,0.34), rgba(81,10,20,0.22))',
      color: '#fbeff1',
    }) as const,

  standingsPointsDark: {
    fontWeight: 1000,
    letterSpacing: 0.2,
    color: '#fbeff1',
  } as const,

  standingsStatPillDark: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(209,110,122,0.3)',
    background: 'rgba(255,255,255,0.04)',
    fontSize: 12,
    fontWeight: 900,
    color: 'rgba(251,239,241,0.82)',
  } as const,
}

export const leaguePageUi = ui
export type LeaguePageUi = typeof leaguePageUi
