import type { CSSProperties } from 'react'

export const raceDraftUi = {
  page: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 16,
    fontFamily: 'system-ui, sans-serif',
    color: 'rgba(255,255,255,0.92)',
  } as const,

  backdrop: {
    borderRadius: 20,
    padding: 16,
    background:
      'radial-gradient(900px 400px at 20% 0%, rgba(220,38,38,0.22), transparent 55%), radial-gradient(800px 360px at 85% 10%, rgba(59,130,246,0.18), transparent 60%), linear-gradient(180deg, rgba(10,10,12,0.92), rgba(16,10,12,0.88))',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 28px 80px rgba(0,0,0,0.45), 0 0 60px rgba(220,38,38,0.10)',
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
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.78)',
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
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
    boxShadow: '0 18px 55px rgba(0,0,0,0.35)',
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
    color: 'rgba(255,255,255,0.92)',
  } as const,

  sub: {
    fontSize: 12,
    opacity: 0.78,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 4,
  } as const,

  badge: (variant: 'hot' | 'ghost' | 'ok' | 'info') => {
    const base: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '7px 10px',
      borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.12)',
      fontWeight: 1000,
      fontSize: 12,
      letterSpacing: 0.4,
      userSelect: 'none',
    }

    const map: Record<'hot' | 'ghost' | 'ok' | 'info', CSSProperties> = {
      hot: {
        background: 'linear-gradient(135deg, rgba(220,38,38,0.90), rgba(127,29,29,0.88))',
        color: 'rgba(255,255,255,0.95)',
        boxShadow: '0 16px 34px rgba(220,38,38,0.22)',
      },
      ok: {
        background: 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(255,255,255,0.04))',
        color: 'rgba(255,255,255,0.88)',
      },
      info: {
        background: 'linear-gradient(135deg, rgba(59,130,246,0.24), rgba(255,255,255,0.04))',
        color: 'rgba(255,255,255,0.88)',
      },
      ghost: {
        background: 'rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.78)',
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
          ? '1px solid rgba(248,113,113,0.35)'
          : variant === 'open'
            ? '1px solid rgba(59,130,246,0.35)'
            : variant === 'gold'
              ? '1px solid rgba(250,204,21,0.30)'
              : '1px solid rgba(255,255,255,0.14)',
      background:
        variant === 'danger'
          ? 'linear-gradient(135deg, rgba(220,38,38,0.88), rgba(127,29,29,0.88))'
          : variant === 'open'
            ? 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(99,102,241,0.92))'
            : variant === 'gold'
              ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(255,255,255,0.04))'
              : 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.92)',
      fontWeight: 1000,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow:
        variant === 'danger'
          ? '0 16px 34px rgba(220,38,38,0.22)'
          : variant === 'open'
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
          ? '1px solid rgba(248,113,113,0.35)'
          : state === 'pick'
            ? '1px solid rgba(59,130,246,0.35)'
            : '1px solid rgba(255,255,255,0.14)',
      background:
        state === 'banned'
          ? 'linear-gradient(180deg, rgba(220,38,38,0.18), rgba(255,255,255,0.04))'
          : state === 'pick'
            ? 'linear-gradient(180deg, rgba(59,130,246,0.18), rgba(255,255,255,0.04))'
            : 'rgba(255,255,255,0.05)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      boxShadow:
        state === 'banned'
          ? '0 18px 45px rgba(0,0,0,0.34), 0 0 40px rgba(220,38,38,0.10)'
          : '0 16px 40px rgba(0,0,0,0.28)',
      transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
    }) as const,

  icon32: { width: 34, height: 34 } as const,

  hint: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.78,
    color: 'rgba(255,255,255,0.72)',
  } as const,

  playerRow: (isCurrent: boolean) =>
    ({
      borderRadius: 16,
      padding: 12,
      border: isCurrent ? '1px solid rgba(220,38,38,0.25)' : '1px solid rgba(255,255,255,0.10)',
      background: isCurrent
        ? 'linear-gradient(180deg, rgba(220,38,38,0.14), rgba(255,255,255,0.03))'
        : 'rgba(255,255,255,0.04)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      boxShadow: isCurrent ? '0 20px 55px rgba(0,0,0,0.36)' : '0 16px 40px rgba(0,0,0,0.28)',
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
    color: 'rgba(255,255,255,0.92)',
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
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.05)',
  } as const,

  err: {
    padding: 12,
    borderRadius: 14,
    border: '1px solid rgba(248,113,113,0.40)',
    background: 'rgba(220,38,38,0.12)',
    marginTop: 12,
    color: 'rgba(255,255,255,0.9)',
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
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
    boxShadow: '0 30px 90px rgba(0,0,0,0.60), 0 0 70px rgba(220,38,38,0.10)',
    padding: 16,
  } as const,

  modalTitle: {
    fontSize: 18,
    fontWeight: 1000,
    letterSpacing: 0.2,
    marginBottom: 6,
    color: 'rgba(255,255,255,0.92)',
  } as const,

  modalBody: {
    fontSize: 14,
    opacity: 0.86,
    lineHeight: 1.6,
    marginBottom: 12,
    color: 'rgba(255,255,255,0.80)',
  } as const,

  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    flexWrap: 'wrap',
  } as const,
}

export type RaceDraftUi = typeof raceDraftUi

