// Extracted from MatchPage for reuse and to keep page component focused.
function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n))
}

export function mixRgba(baseHex: string, alpha: number) {
    // alias do hexToRgba, żeby czytelniej używać w stylach
    return hexToRgba(baseHex, clamp(alpha, 0, 1))
}

type BtnVariant = 'primary' | 'ghost' | 'danger' | 'race' | 'cards'

const ui = {
    page: {
        minHeight: '100vh',
        padding: 22,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        color: 'rgba(255,255,255,0.92)',
    } as const,

    shell: {
        maxWidth: 1300,
        margin: '0 auto',
    } as const,

    topbar: {
        margin: '0 auto 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
        boxShadow: '0 18px 55px rgba(0,0,0,0.45), 0 0 50px rgba(220,38,38,0.08)',
    } as const,

    backLink: {
        textDecoration: 'none',
        fontWeight: 1000,
        color: 'rgba(255,255,255,0.90)',
        opacity: 0.9,
    } as const,

    actionsTop: {
        margin: '0 auto 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
    } as const,

    layout: {
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 16,
        alignItems: 'stretch',
    } as const,

    // badges
    badge: {
        fontSize: 12,
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.80)',
        whiteSpace: 'nowrap',
        fontWeight: 1000,
        letterSpacing: 0.2,
    } as const,

    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 14,
        alignItems: 'stretch',
    } as const,

    playerCard: (hex: string, timeUp: boolean, isRunning: boolean) =>
        ({
            position: 'relative',
            borderRadius: 22,
            border: timeUp
                ? '2px solid rgba(239,68,68,0.90)'
                : isRunning
                    ? `2px solid ${mixRgba(hex, 0.88)}`
                    : `1px solid ${mixRgba(hex, 0.26)}`,
            background:
                `radial-gradient(700px 260px at 10% 0%, ${mixRgba(hex, 0.18)}, transparent 60%), linear-gradient(180deg, rgba(16,16,20,1), rgba(10,10,12,1))`,
            boxShadow: timeUp
                ? '0 18px 55px rgba(239,68,68,0.20)'
                : isRunning
                    ? `0 24px 70px rgba(0,0,0,0.62), 0 0 90px ${mixRgba(hex, 0.34)}, inset 0 0 0 1px ${mixRgba(hex, 0.35)}`
                    : `0 16px 46px rgba(0,0,0,0.50), 0 0 48px ${mixRgba(hex, 0.10)}`,
            padding: 14,
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 10,
        }) as const,

    cardTopRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
    } as const,

    smallName: {
        fontSize: 20,
        fontWeight: 1000,
        letterSpacing: -0.2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    } as const,

    smallTimer: (timeUp: boolean) =>
        ({
            fontSize: 34,
            fontWeight: 1000,
            fontVariantNumeric: 'tabular-nums',
            color: timeUp ? 'rgba(248,113,113,0.92)' : 'rgba(255,255,255,0.92)',
            lineHeight: 1,
        }) as const,

    timerRow: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
    } as const,

    timeControls: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    } as const,

    timeBtn: (variant: 'add' | 'sub', disabled: boolean) =>
        ({
            padding: '6px 9px',
            borderRadius: 999,
            border:
                variant === 'add'
                    ? '1px solid rgba(34,197,94,0.30)'
                    : '1px solid rgba(248,113,113,0.28)',
            background:
                variant === 'add'
                    ? 'rgba(34,197,94,0.10)'
                    : 'rgba(248,113,113,0.08)',
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 1000,
            fontSize: 12,
            letterSpacing: 0.2,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.55 : 1,
            userSelect: 'none',
            transition: 'transform 120ms ease, filter 120ms ease, opacity 120ms ease',
        }) as const,


    miniActionsRow: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    } as const,

    badgeStrong: (hex: string) =>
        ({
            fontSize: 12,
            padding: '6px 10px',
            borderRadius: 999,
            border: `1px solid ${mixRgba(hex, 0.28)}`,
            background: `linear-gradient(135deg, ${mixRgba(hex, 0.22)}, rgba(255,255,255,0.04))`,
            color: 'rgba(255,255,255,0.90)',
            whiteSpace: 'nowrap',
            fontWeight: 1000,
            letterSpacing: 0.2,
            boxShadow: `0 14px 30px ${mixRgba(hex, 0.12)}`,
        }) as const,

    // buttons
    btn: (variant: BtnVariant, disabled: boolean, hex?: string) =>
        ({
            padding: '10px 12px',
            borderRadius: 14,

            border:
                variant === 'danger'
                    ? '1px solid rgba(248,113,113,0.35)'
                    : variant === 'primary'
                        ? '1px solid rgba(255,95,116,0.42)'
                        : variant === 'cards'
                            ? '1px solid rgba(124, 11, 11, 0.4)'
                            : variant === 'race'
                                ? `1px solid ${mixRgba(hex ?? '#ffffff', 0.30)}`
                                : '1px solid rgba(255,255,255,0.14)',
            background:
                variant === 'danger'
                    ? 'linear-gradient(135deg, rgba(220,38,38,0.88), rgba(127,29,29,0.88))'
                    : variant === 'primary'
                        ? 'linear-gradient(135deg, rgba(159,27,49,0.74), rgba(81,10,20,0.64))'
                        : variant === 'cards'
                            ? 'linear-gradient(135deg, rgba(109, 15, 21, 0.92), rgba(0, 0, 0, 0.92))'
                            : variant === 'race'
                                ? `linear-gradient(135deg, ${mixRgba(hex ?? '#ffffff', 0.22)}, rgba(255,255,255,0.04))`
                                : 'rgba(255,255,255,0.05)',

            color:
                variant === 'cards'
                    ? 'rgba(255,255,255,0.94)'
                    : 'rgba(255,255,255,0.92)',

            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.55 : 1,
            fontWeight: 1000,
            letterSpacing: 0.2,

            boxShadow:
                variant === 'danger'
                    ? '0 16px 34px rgba(220,38,38,0.22)'
                    : variant === 'primary'
                        ? '0 16px 34px rgba(246, 59, 100, 0.22)'
                        : variant === 'cards'
                            ? '0 16px 34px rgba(0, 0, 0, 0.25)'
                            : variant === 'race'
                                ? `0 16px 34px ${mixRgba(hex ?? '#ffffff', 0.14)}`
                                : 'none',

            transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease, filter 120ms ease',
            userSelect: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
            position: 'relative',

            // mały “shine”
            overflow: 'hidden',
        }) as const,

    // overlays / modal (setup)
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
    btnInline: (variant: BtnVariant, disabled: boolean, hex?: string) =>
        ({
            ...ui.btn(variant, disabled, hex),
            width: 'fit-content',
            alignSelf: 'flex-start',
            padding: '8px 12px',
            borderRadius: 14,
        }) as const,

    modal: (hex: string) =>
        ({
            width: 'min(760px, 100%)',
            borderRadius: 22,
            border: `1px solid ${mixRgba(hex, 0.22)}`,
            background:
                `radial-gradient(900px 420px at 10% 0%, ${mixRgba(hex, 0.18)}, transparent 60%), linear-gradient(180deg, rgba(16,16,20,1), rgba(10,10,12,1))`,
            boxShadow: `0 30px 90px rgba(0,0,0,0.60), 0 0 70px ${mixRgba(hex, 0.10)}`,
            padding: 18,
            color: 'rgba(255,255,255,0.92)',
        }) as const,

    modalTitle: {
        fontSize: 22,
        fontWeight: 1000,
        letterSpacing: -0.2,
        marginBottom: 6,
    } as const,

    modalBody: {
        fontSize: 15,
        opacity: 0.9,
        lineHeight: 1.45,
        marginBottom: 14,
    } as const,

    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
        flexWrap: 'wrap',
    } as const,

    // active card
    activeCard: (hex: string, timeUp: boolean) =>
        ({
            position: 'relative',
            borderRadius: 28,
            border: timeUp ? '2px solid rgba(239,68,68,0.90)' : `1px solid ${mixRgba(hex, 0.26)}`,
            background:
                `radial-gradient(900px 460px at 10% 0%, ${mixRgba(hex, 0.18)}, transparent 60%), linear-gradient(180deg, rgba(16,16,20,1), rgba(10,10,12,1))`,
            boxShadow: timeUp
                ? '0 22px 70px rgba(239,68,68,0.22)'
                : `0 22px 70px rgba(0,0,0,0.55), 0 0 60px ${mixRgba(hex, 0.10)}`,
            padding: 22,
            minHeight: 420,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }) as const,

    headerRow: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    } as const,

    leftHeader: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        minWidth: 0,
    } as const,

    titleName: {
        fontSize: 44,
        fontWeight: 1000,
        letterSpacing: -0.4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    } as const,

    subtitleRace: {
        fontSize: 14,
        opacity: 0.78,
        marginTop: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    } as const,

    icon: (hex: string) =>
        ({
            width: 36,
            height: 36,
            borderRadius: 12,
            objectFit: 'contain',
            background: 'rgba(255,255,255,0.08)',
            border: `1px solid ${mixRgba(hex, 0.25)}`,
            padding: 5,
            boxShadow: `0 14px 30px ${mixRgba(hex, 0.12)}`,
        }) as const,

    miniIcon: (hex: string) =>
        ({
            width: 22,
            height: 22,
            borderRadius: 8,
            objectFit: 'contain',
            background: 'rgba(255,255,255,0.08)',
            border: `1px solid ${mixRgba(hex, 0.22)}`,
            padding: 3,
        }) as const,

    heroIcon: (hex: string) =>
        ({
            width: 86,
            height: 86,
            borderRadius: 18,
            objectFit: 'contain',
            background: 'rgba(255,255,255,0.10)',
            border: `1px solid ${mixRgba(hex, 0.28)}`,
            padding: 10,
            boxShadow: `0 22px 60px ${mixRgba(hex, 0.18)}`,
        }) as const,

    timerTop: {
        display: 'grid',
        justifyItems: 'center',
        gap: 10,
        marginBottom: 6,
    } as const,


    // timer
    timerGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: 14,
    } as const,

    bigTimer: (timeUp: boolean) =>
        ({
            fontSize: 88,
            fontWeight: 1000,
            letterSpacing: -1.4,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            color: timeUp ? 'rgba(248,113,113,0.92)' : 'rgba(255,255,255,0.92)',
            textShadow: timeUp ? '0 10px 30px rgba(239,68,68,0.25)' : '0 10px 30px rgba(0,0,0,0.35)',
        }) as const,

    sideCol: (align: 'flex-start' | 'flex-end') =>
        ({
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: align,
            justifyContent: 'center',
            minWidth: 140,
        }) as const,

    sideRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
    } as const,

    cardWrap: {
        width: 'min(820px, 100%)',
        display: 'grid',
        gridTemplateRows: '1fr auto',
        gap: 12,
    } as const,

    navDock: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    } as const,

    navDockSide: {
        background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
        borderRadius: 18,
    } as const,

    centerWrap: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        minHeight: 'calc(100vh - 220px)',
    } as const,

    // scoreboard panel (prawa kolumna)
    panel: {
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 18,
        background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
        boxShadow: '0 18px 55px rgba(0,0,0,0.45), 0 0 50px rgba(220,38,38,0.08)',
        overflow: 'hidden',
        maxHeight: 560,
    } as const,

    panelHead: {
        padding: 12,
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        fontWeight: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    } as const,

    tableHeadRow: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
    } as const,

    tableCell: {
        padding: '10px 12px',
        fontSize: 14,
    } as const,

    tableWrap: {
        overflowY: 'auto',
        maxHeight: 480,
    } as const,

    scoreboardRow: (hex: string, isActive: boolean) =>
        ({
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            background: isActive ? mixRgba(hex, 0.16) : mixRgba(hex, 0.08),
            transition: 'background 160ms ease',
            borderTop: '1px solid rgba(255,255,255,0.06)',
        }) as const,

    playerName: {
        fontWeight: 1000,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    } as const,

    raceLine: {
        fontSize: 12,
        opacity: 0.78,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        overflow: 'hidden',
    } as const,

    score: {
        textAlign: 'right',
        fontWeight: 1000,
        fontVariantNumeric: 'tabular-nums',
        padding: '10px 12px',
    } as const,

    errorBox: {
        margin: '0 auto 14px',
        padding: 12,
        borderRadius: 18,
        border: '1px solid rgba(248,113,113,0.30)',
        background: 'rgba(220,38,38,0.10)',
        color: 'rgba(255,255,255,0.92)',
        fontWeight: 900,
    } as const,

    // cards modal
    cardsModal: {
        width: 'min(1120px, 100%)',
        maxHeight: 'min(82vh, 860px)',
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'linear-gradient(180deg, rgba(16,16,20,1), rgba(10,10,12,1))',
        boxShadow: '0 30px 90px rgba(0,0,0,0.60), 0 0 70px rgba(220,38,38,0.10)',
        padding: 16,
        color: 'rgba(255,255,255,0.92)',
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr auto',
        gap: 12,
        overflow: 'hidden',
    } as const,

    cardsHeadRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        flexWrap: 'wrap',
    } as const,

    cardsFiltersRow: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    } as const,

    input: {
        padding: '10px 12px',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.92)',
        outline: 'none',
        fontWeight: 800,
        letterSpacing: 0.2,
        minWidth: 260,
    } as const,

    chip: (active: boolean) =>
        ({
            padding: '8px 10px',
            borderRadius: 999,
            border: active ? '1px solid rgba(255,95,116,0.42)' : '1px solid rgba(255,255,255,0.14)',
            background: active ? 'rgba(159,27,49,0.22)' : 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.92)',
            cursor: 'pointer',
            userSelect: 'none',
            fontWeight: 1000,
            fontSize: 12,
            letterSpacing: 0.2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
        }) as const,

    cardsGridMini: {
        overflow: 'auto',
        paddingRight: 6,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 12,
        alignContent: 'start',
    } as const,

    cardTile: {
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.04)',
        boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
    } as const,

    cardImgMiniWrap: {
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        minHeight: 120,
    } as const,

    cardImgMini: {
        width: '100%',
        height: 140,
        objectFit: 'contain',
        filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.45))',
    } as const,

    cardMeta: {
        padding: 10,
        display: 'grid',
        gap: 6,
    } as const,

    cardName: {
        fontWeight: 1000,
        fontSize: 13,
        lineHeight: 1.2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    } as const,

    cardMetaLine: {
        fontSize: 12,
        opacity: 0.76,
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
    } as const,

    // image preview (inside same modal)
    previewWrap: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        zIndex: 2147483647,
    } as const,

    previewCard: {
        width: 'min(820px, 100%)',
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'linear-gradient(180deg, rgba(16,16,20,1), rgba(10,10,12,1))',
        boxShadow: '0 30px 90px rgba(0,0,0,0.70)',
        overflow: 'hidden',
    } as const,

    previewTop: {
        padding: 12,
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    } as const,

    previewBody: {
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.03)',
    } as const,

    previewImg: {
        width: '100%',
        maxHeight: '72vh',
        objectFit: 'contain',
        filter: 'drop-shadow(0 22px 60px rgba(0,0,0,0.55))',
    } as const,

    summaryOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(1200px 800px at 20% 10%, rgba(159,27,49,0.24), transparent 60%), rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        zIndex: 2147483647,
    } as const,

    summaryModal: {
        width: 'min(980px, 100%)',
        maxHeight: 'min(88vh, 920px)',
        borderRadius: 26,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'linear-gradient(180deg, rgba(16,16,22,1), rgba(10,10,12,1))',
        boxShadow: '0 40px 140px rgba(0,0,0,0.70), 0 0 80px rgba(159,27,49,0.22)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
    } as const,

    summaryHeader: {
        padding: 16,
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        background: 'linear-gradient(180deg, rgba(20,20,28,1), rgba(14,14,18,1))',
    } as const,

    summaryTitle: {
        fontSize: 18,
        fontWeight: 1000,
        letterSpacing: -0.2,
    } as const,

    summarySub: {
        fontSize: 12,
        opacity: 0.75,
        fontWeight: 900,
        marginTop: 2,
    } as const,

    summaryBody: {
        padding: 16,
        overflow: 'auto',
    } as const,

    summaryFooter: {
        padding: 14,
        borderTop: '1px solid rgba(255,255,255,0.10)',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
        alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))',
    } as const,

    summaryGrid: {
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        gap: 14,
    } as const,

    summaryCol: {
        display: 'grid',
        gap: 14,
    } as const,

    summaryCard: {
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.04)',
        boxShadow: '0 18px 60px rgba(0,0,0,0.45)',
        overflow: 'hidden',
    } as const,

    summaryCardHead: {
        padding: 12,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(255,255,255,0.03)',
    } as const,

    summaryCardTitle: {
        fontWeight: 1000,
        letterSpacing: 0.2,
        opacity: 0.9,
    } as const,

    summaryCardBody: {
        padding: 12,
    } as const,

    summaryRow: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: 10,
        padding: 10,
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.18)',
        alignItems: 'center',
    } as const,

    summaryRankRow: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto',
        gap: 10,
        padding: 10,
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.14)',
        alignItems: 'center',
    } as const,

    summaryTextarea: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.92)',
        outline: 'none',
        fontWeight: 800,
        letterSpacing: 0.2,
        resize: 'vertical',
        minHeight: 120,
    } as const,

}
export const matchPageUi = ui
export type MatchPageUi = typeof matchPageUi
function hexToRgba(hex: string, alpha: number) {
    const h = hex.replace('#', '')
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
    const num = parseInt(full, 16)
    const r = (num >> 16) & 255
    const g = (num >> 8) & 255
    const b = num & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback
}

export function playAlarm() {
    const maybeWebkitWindow = window as Window & { webkitAudioContext?: typeof AudioContext }
    try {
        const AudioCtx = window.AudioContext || maybeWebkitWindow.webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()
        const now = ctx.currentTime

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0)

        const o1 = ctx.createOscillator()
        o1.type = 'square'
        o1.frequency.setValueAtTime(880, now)

        const o2 = ctx.createOscillator()
        o2.type = 'square'
        o2.frequency.setValueAtTime(660, now + 0.3)

        o1.connect(gain)
        o2.connect(gain)
        gain.connect(ctx.destination)

        o1.start(now)
        o1.stop(now + 0.3)
        o2.start(now + 0.3)
        o2.stop(now + 1.0)

        window.setTimeout(() => {
            try {
                void ctx.close()
            } catch {
                void 0
            }
        }, 1300)
    } catch {
        void 0
    }
}
