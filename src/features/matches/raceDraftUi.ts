import type { CSSProperties } from 'react'

export const raceDraftUi = {
  page: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 16,
    fontFamily: 'system-ui, sans-serif',
    color: '#fbeff1',
  } as const,

  backdrop: {
    borderRadius: 20,
    padding: 16,
    background:
      'radial-gradient(960px 340px at 12% 0%, rgba(148,19,41,0.24), transparent 58%), radial-gradient(760px 240px at 92% 10%, rgba(83,12,24,0.28), transparent 62%), linear-gradient(180deg, rgba(16,6,10,0.96), rgba(8,3,6,0.98))',
    border: '1px solid rgba(173,55,69,0.28)',
    boxShadow: '0 28px 80px rgba(0,0,0,0.58), 0 0 44px rgba(121,15,33,0.2)',
    backdropFilter: 'blur(10px)',
  } as const,

  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 12,
  } as const,

  title: {
    margin: 0,
    letterSpacing: 0.6,
    fontSize: 26,
    fontWeight: 1000,
  } as const,

  metaLine: {
    marginTop: 6,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 14,
    border: '1px solid rgba(209,110,122,0.3)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(233,200,205,0.78)',
    fontSize: 12,
  } as const,

  rightBadges: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
  } as const,

  card: {
    marginTop: 12,
    borderRadius: 18,
    padding: 14,
    border: '1px solid rgba(173,55,69,0.28)',
    background: 'linear-gradient(180deg, rgba(20,7,12,0.96), rgba(10,4,7,0.98))',
    boxShadow: '0 18px 55px rgba(0,0,0,0.46), 0 0 34px rgba(121,15,33,0.14)',
  } as const,

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 12,
  } as const,

  h2: {
    margin: 0,
    fontSize: 18,
    letterSpacing: 0.4,
    color: '#fbeff1',
  } as const,

  sub: {
    fontSize: 12,
    opacity: 0.78,
    color: 'rgba(233,200,205,0.78)',
    marginTop: 4,
  } as const,

  badge: (variant: 'hot' | 'ghost' | 'ok' | 'info') => {
    const base: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '7px 10px',
      borderRadius: 999,
      border: '1px solid rgba(209,110,122,0.3)',
      fontWeight: 1000,
      fontSize: 12,
      letterSpacing: 0.4,
      userSelect: 'none',
    }

    const map: Record<'hot' | 'ghost' | 'ok' | 'info', CSSProperties> = {
      hot: {
        background: 'linear-gradient(135deg, rgba(193,38,61,0.9), rgba(117,15,31,0.92))',
        color: '#fbeff1',
        boxShadow: '0 16px 34px rgba(121,15,33,0.32)',
      },
      ok: {
        background: 'linear-gradient(135deg, rgba(184,140,66,0.3), rgba(255,255,255,0.04))',
        color: 'rgba(251,239,241,0.88)',
      },
      info: {
        background: 'linear-gradient(135deg, rgba(159,27,49,0.6), rgba(81,10,20,0.5))',
        color: 'rgba(251,239,241,0.88)',
      },
      ghost: {
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(233,200,205,0.78)',
        opacity: 0.9,
      },
    }

    return { ...base, ...map[variant] }
  },

  btn: (variant: 'open' | 'danger' | 'ghost' | 'gold', disabled: boolean) =>
    ({
      padding: '10px 12px',
      borderRadius: 12,
      border:
        variant === 'danger'
          ? '1px solid rgba(255,95,116,0.45)'
          : variant === 'open'
            ? '1px solid rgba(255,95,116,0.42)'
            : variant === 'gold'
              ? '1px solid rgba(250,204,21,0.30)'
              : '1px solid rgba(209,110,122,0.28)',
      background:
        variant === 'danger'
          ? 'linear-gradient(135deg, rgba(193,38,61,0.86), rgba(117,15,31,0.9))'
          : variant === 'open'
            ? 'linear-gradient(135deg, rgba(159,27,49,0.64), rgba(81,10,20,0.5))'
            : variant === 'gold'
              ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(255,255,255,0.04))'
              : 'rgba(255,255,255,0.04)',
      color: '#fbeff1',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'danger'
          ? '0 16px 34px rgba(121,15,33,0.32)'
          : variant === 'open'
            ? '0 16px 34px rgba(121,15,33,0.24)'
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

  tileGrid: {
    marginTop: 12,
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  } as const,

  raceTile: (state: 'neutral' | 'banned' | 'pick', disabled: boolean) =>
    ({
      padding: '10px 12px',
      borderRadius: 16,
      border:
        state === 'banned'
          ? '1px solid rgba(255,95,116,0.45)'
          : state === 'pick'
            ? '1px solid rgba(255,95,116,0.42)'
            : '1px solid rgba(209,110,122,0.28)',
      background:
        state === 'banned'
          ? 'linear-gradient(180deg, rgba(193,38,61,0.28), rgba(255,255,255,0.04))'
          : state === 'pick'
            ? 'linear-gradient(180deg, rgba(159,27,49,0.24), rgba(255,255,255,0.04))'
            : 'rgba(255,255,255,0.04)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      boxShadow:
        state === 'banned'
          ? '0 18px 45px rgba(0,0,0,0.34), 0 0 40px rgba(121,15,33,0.16)'
          : '0 16px 40px rgba(0,0,0,0.28)',
      transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
    }) as const,

  icon32: { width: 44, height: 44 } as const,

  hint: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.78,
    color: 'rgba(233,200,205,0.78)',
  } as const,

  playerRow: (isCurrent: boolean) =>
    ({
      borderRadius: 16,
      padding: 12,
      border: isCurrent ? '1px solid rgba(255,95,116,0.42)' : '1px solid rgba(173,55,69,0.28)',
      background: isCurrent
        ? 'linear-gradient(180deg, rgba(159,27,49,0.34), rgba(255,255,255,0.04))'
        : 'rgba(255,255,255,0.03)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      boxShadow: isCurrent ? '0 20px 55px rgba(0,0,0,0.42), 0 0 32px rgba(121,15,33,0.14)' : '0 16px 40px rgba(0,0,0,0.28)',
      transition: 'transform 120ms ease, box-shadow 120ms ease',
    }) as const,

  playerLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    flexWrap: 'wrap',
  } as const,

  playerName: {
    fontWeight: 1000,
    letterSpacing: 0.2,
    color: '#fbeff1',
  } as const,

  playerRight: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
  } as const,

  racePill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(209,110,122,0.3)',
    background: 'rgba(255,255,255,0.04)',
  } as const,

  err: {
    padding: 12,
    borderRadius: 14,
    border: '1px solid rgba(255,95,116,0.45)',
    background: 'rgba(181,53,31,0.28)',
    marginTop: 12,
    color: '#fbeff1',
  } as const,

  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.62)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    zIndex: 2147483647,
  } as const,

  modal: {
    width: 'min(640px, 100%)',
    borderRadius: 18,
    border: '1px solid rgba(173,55,69,0.3)',
    background: 'linear-gradient(180deg, rgba(16,6,10,0.98), rgba(8,3,6,1))',
    boxShadow: '0 30px 90px rgba(0,0,0,0.6), 0 0 70px rgba(121,15,33,0.18)',
    padding: 16,
  } as const,

  modalTitle: {
    fontSize: 18,
    fontWeight: 1000,
    letterSpacing: 0.2,
    marginBottom: 6,
    color: '#fbeff1',
  } as const,

  modalBody: {
    fontSize: 14,
    opacity: 0.86,
    lineHeight: 1.6,
    marginBottom: 12,
    color: 'rgba(233,200,205,0.86)',
  } as const,

  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    flexWrap: 'wrap',
  } as const,
}

export type RaceDraftUi = typeof raceDraftUi
