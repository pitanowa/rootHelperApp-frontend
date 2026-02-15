const ui = {
    card: {
        borderRadius: 18,
        padding: 16,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
        boxShadow: '0 18px 55px rgba(0,0,0,0.45), 0 0 50px rgba(220,38,38,0.08)',
        overflow: 'hidden',
        color: 'rgba(255,255,255,0.92)',
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
        fontWeight: 1000,
        padding: '8px 10px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.85)',
        whiteSpace: 'nowrap',
    } as const,


    // ---- STANDINGS ----
    tableCard: {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.78))',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        boxShadow: '0 18px 50px rgba(15, 23, 42, 0.10)',
        backdropFilter: 'blur(10px)',
    },

    tableHeaderRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
    },

    tableTitle: { margin: 0, fontSize: 18 },

    tableMeta: { fontSize: 12, opacity: 0.7 },

    tableWrap: {
        overflowX: 'auto',
        borderRadius: 14,
        border: '1px solid rgba(0,0,0,0.08)',
        background: 'rgba(255,255,255,0.65)',
    } as const,


    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        minWidth: 520,
    } as const,

    th: {
        position: 'sticky' as const,
        top: 0,
        textAlign: 'left' as const,
        padding: '10px 12px',
        fontSize: 12,
        textTransform: 'uppercase' as const,
        opacity: 0.7,
        background: 'rgba(255,255,255,0.9)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
    },

    td: {
        padding: '12px 12px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
    },

    rankPill: (rank: number) => ({
        minWidth: 32,
        height: 26,
        borderRadius: 999,
        fontWeight: 900,
        display: 'grid',
        placeItems: 'center',
        background:
            rank === 1 ? '#fde047' :
                rank === 2 ? '#e5e7eb' :
                    rank === 3 ? '#fdba74' :
                        '#fff',
        border: '1px solid rgba(0,0,0,0.1)',
    }),

    empty: {
        padding: 14,
        borderRadius: 14,
        border: '1px dashed rgba(0,0,0,0.18)',
        opacity: 0.7,
    },

    title: { margin: 0, fontSize: 18, letterSpacing: 0.2 } as const,

    subtitle: { fontSize: 12, opacity: 0.7 } as const,

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
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.05)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
    } as const,

    labelSmall: { fontSize: 12, opacity: 0.78, fontWeight: 900, color: 'rgba(255,255,255,0.75)' } as const,

    input: {
        width: 120,
        padding: '10px 12px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.16)',
        outline: 'none',
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.92)',
        transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
    } as const,

    segment: {
        display: 'flex',
        padding: 4,
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.05)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.22)',
    } as const,

    segBtn: (active: boolean) =>
        ({
            padding: '10px 12px',
            borderRadius: 999,
            border: '1px solid transparent',
            background: active
                ? 'linear-gradient(135deg, rgba(220,38,38,0.55), rgba(59,130,246,0.25))'
                : 'transparent',
            color: active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.72)',
            fontWeight: 1000,
            letterSpacing: 0.3,
            cursor: 'pointer',
            transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
            boxShadow: active ? '0 18px 36px rgba(220,38,38,0.18)' : 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
        }) as const,

    switch: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        padding: '10px 12px',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.05)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.22)',
    } as const,

    createBtn: (enabled: boolean) =>
        ({
            padding: '12px 14px',
            borderRadius: 14,
            border: enabled ? '1px solid rgba(220,38,38,0.35)' : '1px solid rgba(255,255,255,0.12)',
            background: enabled
                ? 'linear-gradient(135deg, rgba(220,38,38,0.92), rgba(127,29,29,0.92))'
                : 'rgba(255,255,255,0.06)',
            color: enabled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
            fontWeight: 1000,
            cursor: enabled ? 'pointer' : 'not-allowed',
            boxShadow: enabled ? '0 18px 40px rgba(220,38,38,0.20)' : 'none',
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
            border: isSelected ? '1px solid rgba(220,38,38,0.35)' : '1px solid rgba(255,255,255,0.10)',
            background: isSelected
                ? 'linear-gradient(180deg, rgba(220,38,38,0.14), rgba(255,255,255,0.04))'
                : 'rgba(255,255,255,0.04)',
            boxShadow: isSelected ? '0 18px 45px rgba(220,38,38,0.12)' : '0 10px 24px rgba(0,0,0,0.22)',
            cursor: 'pointer',
            transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
            color: 'rgba(255,255,255,0.92)',
        }) as const,

    checkbox: {
        width: 18,
        height: 18,
        accentColor: '#dc2626',
    } as const,

    trBase: {
        transition: 'background 120ms ease, transform 120ms ease',
    } as const,

    playerCell: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    } as const,

    playerAvatar: (rank: number) =>
        ({
            width: 34,
            height: 34,
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 1000,
            border: '1px solid rgba(0,0,0,0.08)',
            background:
                rank === 1
                    ? 'linear-gradient(135deg, rgba(250,204,21,0.70), rgba(59,130,246,0.18))'
                    : 'linear-gradient(135deg, rgba(200,239,30,0.70), rgba(59,130,246,0.18))',
            color: 'rgba(0,0,0,0.75)',
        }) as const,

    points: {
        fontWeight: 1000,
        letterSpacing: 0.2,
    } as const,

    statPill: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid rgba(0,0,0,0.08)',
        background: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        fontWeight: 900,
        opacity: 0.85,
    } as const,

    avatar: {
        width: 34,
        height: 34,
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        fontWeight: 1000,
        color: 'rgba(255,255,255,0.92)',
        background: 'linear-gradient(135deg, rgba(220,38,38,0.40), rgba(59,130,246,0.22))',
        border: '1px solid rgba(255,255,255,0.12)',
    } as const,

    rowHoverOn: (el: HTMLDivElement | HTMLTableRowElement) => {
        el.style.transform = 'translateY(-1px)'
        el.style.boxShadow = '0 22px 70px rgba(0,0,0,0.38), 0 0 40px rgba(220,38,38,0.10)'
        el.style.borderColor = 'rgba(220,38,38,0.18)'
    },

    rowHoverOff: (el: HTMLDivElement | HTMLTableRowElement) => {
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = 'rgba(255,255,255,0.10)'
    },


    // ---- MATCH HISTORY (legendary / dark / bloody) ----
    historyCard: {
        background: 'linear-gradient(180deg, rgba(10,10,12,0.92), rgba(20,10,12,0.88))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        boxShadow:
            '0 24px 70px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 40px rgba(220,38,38,0.10)',
        backdropFilter: 'blur(10px)',
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
        letterSpacing: 0.4,
        color: 'rgba(255,255,255,0.92)',
    } as const,

    historyMeta: {
        fontSize: 12,
        opacity: 0.75,
        color: 'rgba(255,255,255,0.72)',
    } as const,

    historyEmpty: {
        padding: 14,
        borderRadius: 14,
        border: '1px dashed rgba(255,255,255,0.18)',
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.75)',
    } as const,

    historyGrid: {
        display: 'grid',
        gap: 10,
    } as const,

    matchRow: {
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.10)',
        background:
            'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
        padding: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 16px 40px rgba(0,0,0,0.30)',
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
        color: 'rgba(255,255,255,0.95)',
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
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.78)',
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
            border: '1px solid rgba(255,255,255,0.12)',
            background:
                status === 'FINISHED'
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(255,255,255,0.04))'
                    : status === 'DRAFT'
                        ? 'linear-gradient(135deg, rgba(59,130,246,0.22), rgba(255,255,255,0.04))'
                        : 'linear-gradient(135deg, rgba(220,38,38,0.18), rgba(255,255,255,0.04))',
            color: 'rgba(255,255,255,0.85)',
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
            border: '1px solid rgba(255,255,255,0.12)',
            background: ranked
                ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(255,255,255,0.04))'
                : 'linear-gradient(135deg, rgba(148,163,184,0.20), rgba(255,255,255,0.04))',
            color: 'rgba(255,255,255,0.85)',
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
                    ? '1px solid rgba(248,113,113,0.35)'
                    : variant === 'open'
                        ? '1px solid rgba(59,130,246,0.35)'
                        : '1px solid rgba(255,255,255,0.14)',
            background:
                variant === 'danger'
                    ? 'linear-gradient(135deg, rgba(220,38,38,0.85), rgba(127,29,29,0.85))'
                    : variant === 'open'
                        ? 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(99,102,241,0.92))'
                        : 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 1000,
            cursor: disabled ? 'not-allowed' : 'pointer',
            pointerEvents: disabled ? 'none' : 'auto',
            opacity: disabled ? 0.55 : 1,
            boxShadow:
                variant === 'danger'
                    ? '0 16px 34px rgba(220,38,38,0.22)'
                    : variant === 'open'
                        ? '0 16px 34px rgba(59,130,246,0.22)'
                        : 'none',
            transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
            userSelect: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
        }) as const,

    // ---- STANDINGS (legendary / dark / bloody) ----
    standingsCardDark: {
        background: 'linear-gradient(180deg, rgba(10,10,12,0.92), rgba(20,10,12,0.88))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        boxShadow:
            '0 24px 70px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 40px rgba(220,38,38,0.10)',
        backdropFilter: 'blur(10px)',
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
        letterSpacing: 0.4,
        color: 'rgba(255,255,255,0.92)',
    } as const,

    standingsMetaDark: {
        fontSize: 12,
        opacity: 0.75,
        color: 'rgba(255,255,255,0.72)',
    } as const,

    standingsBadgeDark: {
        fontSize: 12,
        fontWeight: 900,
        padding: '8px 10px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.85)',
    } as const,

    standingsEmptyDark: {
        padding: 14,
        borderRadius: 14,
        border: '1px dashed rgba(255,255,255,0.18)',
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.75)',
    } as const,

    standingsTableWrapDark: {
        overflowX: 'auto',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.04)',
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
        color: 'rgba(255,255,255,0.72)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(10px)',
    } as const,

    standingsTdDark: {
        padding: '12px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.88)',
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
            border: '1px solid rgba(255,255,255,0.14)',
            background:
                rank === 1
                    ? 'linear-gradient(135deg, rgba(250,204,21,0.26), rgba(255,255,255,0.04))'
                    : rank === 2
                        ? 'linear-gradient(135deg, rgba(203,213,225,0.22), rgba(255,255,255,0.04))'
                        : rank === 3
                            ? 'linear-gradient(135deg, rgba(251,146,60,0.22), rgba(255,255,255,0.04))'
                            : 'rgba(255,255,255,0.05)',
            boxShadow:
                rank <= 3 ? '0 16px 34px rgba(0,0,0,0.30), 0 0 30px rgba(220,38,38,0.10)' : '0 12px 26px rgba(0,0,0,0.22)',
            color: 'rgba(255,255,255,0.92)',
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
            border: '1px solid rgba(255,255,255,0.14)',
            background:
                rank === 1
                    ? 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(220,38,38,0.10))'
                    : 'linear-gradient(135deg, rgba(220,38,38,0.18), rgba(59,130,246,0.10))',
            color: 'rgba(255,255,255,0.92)',
        }) as const,

    standingsPointsDark: {
        fontWeight: 1000,
        letterSpacing: 0.2,
        color: 'rgba(255,255,255,0.95)',
    } as const,

    standingsStatPillDark: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'rgba(255,255,255,0.05)',
        fontSize: 12,
        fontWeight: 900,
        color: 'rgba(255,255,255,0.82)',
    } as const,

    playerName: { fontWeight: 1000, letterSpacing: 0.2 } as const,
}

export const leaguePageUi = ui
export type LeaguePageUi = typeof leaguePageUi
