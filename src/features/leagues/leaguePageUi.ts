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
      'radial-gradient(960px 340px at 12% 0%, rgba(148,19,41,0.24), transparent 58%), radial-gradient(760px 240px at 92% 10%, rgba(83,12,24,0.28), transparent 62%), linear-gradient(180deg, rgba(16,6,10,0.96), rgba(8,3,6,0.98))',
    border: 'var(--app-shell-border)',
    boxShadow: 'var(--app-shell-shadow)',
  } as const,

  headerCard: {
    borderRadius: 16,
    padding: 14,
    border: 'var(--app-panel-border)',
    background: 'var(--app-panel-bg)',
    boxShadow: '0 16px 46px rgba(0,0,0,0.42)',
    marginBottom: 12,
  } as const,

  backLink: {
    textDecoration: 'none',
    color: 'var(--app-text)',
    border: 'var(--app-soft-border)',
    borderRadius: 10,
    padding: '8px 12px',
    background: 'var(--app-soft-bg)',
    fontWeight: 900,
    display: 'inline-flex',
    alignItems: 'center',
  } as const,

  refreshBtn: {
    border: 'var(--app-soft-border)',
    borderRadius: 10,
    padding: '8px 12px',
    background: 'var(--app-accent-soft-gradient)',
    color: 'var(--app-text)',
    fontWeight: 900,
    cursor: 'pointer',
  } as const,

  error: {
    padding: 12,
    borderRadius: 12,
    border: 'var(--app-accent-border)',
    background: 'rgba(181,53,31,0.28)',
    marginBottom: 12,
    color: 'var(--app-text)',
  } as const,

  card: {
    borderRadius: 18,
    padding: 16,
    border: 'var(--app-panel-border)',
    background: 'var(--app-panel-bg)',
    boxShadow: 'var(--app-panel-shadow)',
    overflow: 'hidden',
    color: 'var(--app-text)',
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
    border: 'var(--app-soft-border)',
    background: 'var(--app-soft-bg)',
    color: 'rgba(251,239,241,0.84)',
    whiteSpace: 'nowrap',
  } as const,

  title: { margin: 0, fontSize: 18, letterSpacing: 0.2 } as const,
  subtitle: { fontSize: 12, opacity: 0.8, color: 'rgba(var(--app-muted-rgb),0.78)' } as const,

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
    border: 'var(--app-panel-border)',
    background: 'rgba(255,255,255,0.03)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
  } as const,

  labelSmall: { fontSize: 12, opacity: 0.84, fontWeight: 900, color: 'rgba(var(--app-muted-rgb),0.8)' } as const,

  input: {
    width: 120,
    padding: '10px 12px',
    borderRadius: 12,
    border: 'var(--app-soft-border)',
    outline: 'none',
    background: 'var(--app-soft-bg)',
    color: 'var(--app-text)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  } as const,

  segment: {
    display: 'flex',
    padding: 4,
    borderRadius: 999,
    border: 'var(--app-panel-border)',
    background: 'rgba(255,255,255,0.03)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.24)',
  } as const,

  segBtn: (active: boolean) =>
    ({
      padding: '10px 12px',
      borderRadius: 999,
      border: '1px solid transparent',
      background: active
        ? 'var(--app-accent-soft-gradient)'
        : 'transparent',
      color: active ? 'var(--app-text)' : 'rgba(var(--app-muted-rgb),0.74)',
      fontWeight: 1000,
      letterSpacing: 0.3,
      cursor: 'pointer',
      transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
      boxShadow: active ? 'var(--app-accent-glow)' : 'none',
      userSelect: 'none',
      whiteSpace: 'nowrap',
    }) as const,

  switch: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: 14,
    border: 'var(--app-panel-border)',
    background: 'rgba(255,255,255,0.03)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.24)',
  } as const,

  createBtn: (enabled: boolean) =>
    ({
      padding: '12px 14px',
      borderRadius: 14,
      border: enabled ? 'var(--app-accent-border)' : 'var(--app-soft-border)',
      background: enabled
        ? 'var(--app-accent-gradient)'
        : 'rgba(255,255,255,0.04)',
      color: enabled ? 'var(--app-text)' : 'rgba(var(--app-text-rgb),0.45)',
      fontWeight: 1000,
      cursor: enabled ? 'pointer' : 'not-allowed',
      boxShadow: enabled ? 'var(--app-accent-glow)' : 'none',
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
      border: isSelected ? 'var(--app-accent-border)' : '1px solid rgba(173,55,69,0.24)',
      background: isSelected
        ? 'linear-gradient(180deg, rgba(144,20,39,0.24), rgba(255,255,255,0.04))'
        : 'rgba(255,255,255,0.03)',
      boxShadow: isSelected ? '0 16px 34px rgba(121,15,33,0.24)' : '0 10px 24px rgba(0,0,0,0.24)',
      cursor: 'pointer',
      transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
      color: 'var(--app-text)',
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
    color: 'var(--app-text)',
    background: 'var(--app-accent-soft-gradient)',
    border: 'var(--app-soft-border)',
  } as const,

  playerName: { fontWeight: 1000, letterSpacing: 0.2 } as const,

  historyCard: {
    background: 'var(--app-panel-bg)',
    border: 'var(--app-panel-border)',
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
    boxShadow: 'var(--app-panel-shadow)',
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
    color: 'var(--app-text)',
  } as const,

  historyMeta: {
    fontSize: 12,
    opacity: 0.8,
    color: 'rgba(var(--app-muted-rgb),0.76)',
  } as const,

  historyEmpty: {
    padding: 14,
    borderRadius: 14,
    border: 'var(--app-dashed-border)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(var(--app-muted-rgb),0.78)',
  } as const,

  historyGrid: {
    display: 'grid',
    gap: 10,
  } as const,

  matchRow: {
    borderRadius: 16,
    border: 'var(--app-panel-border)',
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
    color: 'var(--app-text)',
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
    border: 'var(--app-soft-border)',
    background: 'var(--app-soft-bg)',
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
      border: 'var(--app-soft-border)',
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
      border: 'var(--app-soft-border)',
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
          ? 'var(--app-accent-border)'
          : variant === 'open'
            ? 'var(--app-accent-border)'
            : 'var(--app-soft-border)',
      background:
        variant === 'danger'
          ? 'var(--app-accent-gradient)'
          : variant === 'open'
            ? 'var(--app-accent-soft-gradient)'
            : 'rgba(255,255,255,0.04)',
      color: 'var(--app-text)',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      pointerEvents: disabled ? 'none' : 'auto',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'danger'
          ? 'var(--app-accent-glow)'
          : variant === 'open'
            ? 'var(--app-accent-glow)'
            : 'none',
      transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
      userSelect: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap',
    }) as const,

  standingsCardDark: {
    background: 'var(--app-panel-bg)',
    border: 'var(--app-panel-border)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    boxShadow: 'var(--app-panel-shadow)',
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
    color: 'var(--app-text)',
  } as const,

  standingsMetaDark: {
    fontSize: 12,
    opacity: 0.8,
    color: 'rgba(var(--app-muted-rgb),0.76)',
  } as const,

  standingsBadgeDark: {
    fontSize: 12,
    fontWeight: 900,
    padding: '8px 10px',
    borderRadius: 999,
    border: 'var(--app-soft-border)',
    background: 'var(--app-soft-bg)',
    color: 'rgba(251,239,241,0.84)',
  } as const,

  standingsEmptyDark: {
    padding: 14,
    borderRadius: 14,
    border: 'var(--app-dashed-border)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(var(--app-muted-rgb),0.78)',
  } as const,

  standingsTableWrapDark: {
    overflowX: 'auto',
    borderRadius: 14,
    border: 'var(--app-panel-border)',
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
    color: 'rgba(var(--app-muted-rgb),0.74)',
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
      border: 'var(--app-soft-border)',
      background:
        rank === 1
          ? 'linear-gradient(135deg, rgba(184,140,66,0.34), rgba(255,255,255,0.04))'
          : rank === 2
            ? 'linear-gradient(135deg, rgba(139,117,121,0.3), rgba(255,255,255,0.04))'
            : rank === 3
              ? 'linear-gradient(135deg, rgba(143,86,62,0.3), rgba(255,255,255,0.04))'
              : 'rgba(255,255,255,0.04)',
      boxShadow: rank <= 3 ? '0 12px 26px rgba(0,0,0,0.32)' : '0 10px 22px rgba(0,0,0,0.22)',
      color: 'var(--app-text)',
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
      border: 'var(--app-soft-border)',
      background:
        rank === 1
          ? 'linear-gradient(135deg, rgba(184,140,66,0.34), rgba(121,15,33,0.22))'
          : 'linear-gradient(135deg, rgba(159,27,49,0.34), rgba(81,10,20,0.22))',
      color: 'var(--app-text)',
    }) as const,

  standingsPointsDark: {
    fontWeight: 1000,
    letterSpacing: 0.2,
    color: 'var(--app-text)',
  } as const,

  standingsStatPillDark: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 999,
    border: 'var(--app-soft-border)',
    background: 'var(--app-soft-bg)',
    fontSize: 12,
    fontWeight: 900,
    color: 'rgba(251,239,241,0.82)',
  } as const,
}

export const leaguePageUi = ui
export type LeaguePageUi = typeof leaguePageUi



