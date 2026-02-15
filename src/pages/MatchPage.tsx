import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiGet, apiPost } from '../api'
import RaceDraftView from './RaceDraftPage'
import { RACE_LABEL } from '../constants/races'
import SetupModal from '../components/modals/SetupModal'
import CardsModal from '../components/modals/CardsModal'
import RacePickView from './RacePickPage'
import { type LandmarkId, lmLabel, lmTooltipContent } from '../data/landmarks'
import Tooltip from '../components/Tooltip'
import { MatchSummaryModal } from "../components/modals/MatchSummary"
import { MatchSummaryView } from "../components/match/MatchSummaryView"

// ✅ adjust these imports to your actual icon paths
import cats from '../assets/races/root_cats.png'
import dynasty from '../assets/races/root_dynasty.png'
import alliance from '../assets/races/root_alliance.png'
import crows from '../assets/races/root_crows.png'
import vaga from '../assets/races/root_vaga.png'
import priests from '../assets/races/root_priests.png'
import riverfolk from '../assets/races/root_riverfolk.png'
import knights from '../assets/races/root_knights.png'
import kingdom from '../assets/races/root_kingdom.png'
import rats from '../assets/races/root_rats.png'
import { CARDS, type CardDef, type Clearing, type CraftType, type Item } from '../data/cards'

type MatchPlayerState = {
    playerId: number
    playerName: string
    score: number
    timeLeftSeconds: number
    race?: string | null
}

type MatchState = {
    matchId: number
    leagueId: number
    groupId: number
    status: string
    timerSecondsInitial: number
    raceDraftEnabled?: boolean
    players: MatchPlayerState[]
    landmarksEnabled?: boolean
    landmarkBanned?: string | null
    landmarksRandomCount?: number | null
    landmarksDrawn?: string[]
}

type MatchSummary = {
    matchId: number
    leagueId: number
    ranked: boolean
    finished: boolean
    description: string | null
    players: {
        playerId: number
        playerName: string
        raceId: string | null
        raceLabel?: string | null
        points: number
        roots: number
    }[]
    landmarks: { id: string; label: string }[]
    rankingAfter: {
        position: number
        playerId: number
        playerName: string
        totalPoints: number
        totalRoots: number
        gamesPlayed: number
        wins: number
    }[]
}

type DraftAssignment = {
    playerId: number
    race: string
}

type DraftState = {
    matchId: number
    status: 'DRAFTING' | 'FINISHED'
    phase: 'BAN' | 'PICK'
    currentPickIndex: number
    currentPlayerId: number | null
    pickOrder: number[]
    pool: string[]
    bannedRaces: string[]
    assignments: DraftAssignment[]
}

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n))
}

function mixRgba(baseHex: string, alpha: number) {
    // alias do hexToRgba, żeby czytelniej używać w stylach
    return hexToRgba(baseHex, clamp(alpha, 0, 1))
}

function readableTextOn(hex: string) {
    // prosta heurystyka: jasne kolory -> ciemny tekst, ciemne -> jasny
    const h = hex.replace('#', '')
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
    const num = parseInt(full, 16)
    const r = (num >> 16) & 255
    const g = (num >> 8) & 255
    const b = num & 255
    // luminancja
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    return lum > 0.62 ? '#0b0b0f' : 'rgba(255,255,255,0.92)'
}

type LandmarksStateResponse = {
    enabled: boolean
    banned: string | null
    randomCount: number | null
    drawn: string[]
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
            borderRadius: 22,
            border: timeUp
                ? '2px solid rgba(239,68,68,0.90)'
                : isRunning
                    ? `2px solid ${mixRgba(hex, 0.70)}`
                    : `1px solid ${mixRgba(hex, 0.26)}`,
            background:
                `radial-gradient(700px 260px at 10% 0%, ${mixRgba(hex, 0.18)}, transparent 60%), linear-gradient(180deg, rgba(16,16,20,1), rgba(10,10,12,1))`,
            boxShadow: timeUp
                ? '0 18px 55px rgba(239,68,68,0.20)'
                : isRunning
                    ? `0 18px 55px rgba(0,0,0,0.55), 0 0 60px ${mixRgba(hex, 0.18)}`
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
                        ? '1px solid rgba(59,130,246,0.35)'
                        : variant === 'cards'
                            ? '1px solid rgba(124, 11, 11, 0.4)'
                            : variant === 'race'
                                ? `1px solid ${mixRgba(hex ?? '#ffffff', 0.30)}`
                                : '1px solid rgba(255,255,255,0.14)',
            background:
                variant === 'danger'
                    ? 'linear-gradient(135deg, rgba(220,38,38,0.88), rgba(127,29,29,0.88))'
                    : variant === 'primary'
                        ? 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(99,102,241,0.92))'
                        : variant === 'cards'
                            ? 'linear-gradient(135deg, rgba(109, 15, 21, 0.92), rgba(0, 0, 0, 0.92))'
                            : variant === 'race'
                                ? `linear-gradient(135deg, ${mixRgba(hex ?? '#ffffff', 0.22)}, rgba(255,255,255,0.04))`
                                : 'rgba(255,255,255,0.05)',

            color:
                variant === 'cards'
                    ? 'rgba(255,255,255,0.94)'
                    : variant === 'race'
                        ? readableTextOn(hex ?? '#ffffff')
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
            border: active ? '1px solid rgba(59,130,246,0.42)' : '1px solid rgba(255,255,255,0.14)',
            background: active ? 'rgba(59,130,246,0.16)' : 'rgba(255,255,255,0.05)',
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
        background: 'radial-gradient(1200px 800px at 20% 10%, rgba(59,130,246,0.20), transparent 60%), rgba(0,0,0,0.72)',
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
        boxShadow: '0 40px 140px rgba(0,0,0,0.70), 0 0 80px rgba(59,130,246,0.18)',
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

function fmt(secs: number) {
    const s = Math.max(0, Math.floor(secs))
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${m}:${String(r).padStart(2, '0')}`
}

function normalizeRace(race?: string | null) {
    if (!race) return ''
    return race
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
}

function raceKey(race?: string | null) {
    if (!race) return ''
    // Jeśli backend wysyła np. "RATS" -> zostanie "RATS"
    const raw = race.trim()
    if (RACE_ICON[raw]) return raw

    // jeśli backend wysyła np. "Szczury"/"Rats"/cokolwiek -> ujednolicamy
    const n = normalizeRace(raw)

    const ALIASES: Record<string, string> = {
        // PL (jeśli kiedyś wrócą)
        koty: 'CATS',
        orly: 'EAGLES',
        'sojusz zwierzat': 'ALLIANCE',
        kruki: 'CROWS',
        wedrowiec: 'VAGABOND',
        jaszczury: 'LIZARDS',
        wydry: 'OTTERS',
        borsuki: 'BADGERS',
        krety: 'MOLES',
        szczury: 'RATS',

        // EN (na wszelki wypadek)
        cats: 'CATS',
        eagles: 'EAGLES',
        alliance: 'ALLIANCE',
        crows: 'CROWS',
        vagabond: 'VAGABOND',
        lizards: 'LIZARDS',
        otters: 'OTTERS',
        badgers: 'BADGERS',
        moles: 'MOLES',
        rats: 'RATS',
    }

    return ALIASES[n] ?? raw.toUpperCase()
}

function raceLabel(race?: string | null) {
    const rk = raceKey(race)
    return rk ? (RACE_LABEL[rk] ?? rk) : '—'
}

const RACE_ICON: Record<string, string> = {
    CATS: cats,
    EAGLES: dynasty,
    ALLIANCE: alliance,
    CROWS: crows,
    VAGABOND: vaga,
    LIZARDS: priests,
    OTTERS: riverfolk,
    BADGERS: knights,
    MOLES: kingdom,
    RATS: rats,
}

const RACE_COLOR: Record<string, string> = {
    CATS: '#da8608',
    EAGLES: '#02309c',
    ALLIANCE: '#16a34a',
    CROWS: '#6d28d9',
    VAGABOND: '#553c3c',
    LIZARDS: '#e0cc15',
    OTTERS: '#0fc2aa',
    BADGERS: '#4d4d4d',
    MOLES: '#e69a7b',
    RATS: '#dc2626',
}


function hexToRgba(hex: string, alpha: number) {
    const h = hex.replace('#', '')
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
    const num = parseInt(full, 16)
    const r = (num >> 16) & 255
    const g = (num >> 8) & 255
    const b = num & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function playAlarm() {
    try {
        const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined
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
                ctx.close()
            } catch { }
        }, 1300)
    } catch { }
}

type FlowStage = 'NONE' | 'SETUP'

const LS_SETUP = (mid: number) => `rootleague:match:${mid}:setupDone`
const LS_RACE = (mid: number) => `rootleague:match:${mid}:raceByPlayer`
const LS_MANUAL_ORDER = (mid: number) => `rootleague:match:${mid}:manualPickOrder`

function lsGetJson<T>(key: string, fallback: T): T {
    try {
        const raw = window.localStorage.getItem(key)
        if (!raw) return fallback
        return JSON.parse(raw) as T
    } catch {
        return fallback
    }
}
function lsSetJson(key: string, val: any) {
    window.localStorage.setItem(key, JSON.stringify(val))
}

function lsGetRaceMap(mid: number): Record<number, string> {
    try { return JSON.parse(localStorage.getItem(LS_RACE(mid)) || '{}') } catch { return {} }
}
function lsSetRace(mid: number, playerId: number, race: string) {
    const map = lsGetRaceMap(mid)
    map[playerId] = race
    localStorage.setItem(LS_RACE(mid), JSON.stringify(map))
}
function lsClearRaces(mid: number) {
    localStorage.removeItem(LS_RACE(mid))
}

function lsGetBool(key: string) {
    return window.localStorage.getItem(key) === '1'
}
function lsSetBool(key: string, val: boolean) {
    window.localStorage.setItem(key, val ? '1' : '0')
}

const SETUP_HINT: Record<string, string> = {
    CATS: '1. Wybierz 3 sąsiadujące ze sobą polany ojczyste.\n2. Na każdej z nich umieść 2 wojowników.\n3. Na KAŻDEJ pozostałej połóż po jednym wojowniku.\n4. Token twierdzy połóż na jednej z polan ojczystych, która nie sąsiaduje z polanami ojczystymi przeciwników, jeśli to możliwe.\n5. Rozmieść 1 tartak, koszary oraz warsztat na każdej swojej innej polanie ojczystej.\n6. Umieść pozostałe żetony budynków na swojej planszy frakcji.',
    EAGLES: '1. Wybierz polanę ojczystą przy krawędzi Mapy, oddaloną o co najmniej 2 polany od polan ojczystych przeciwników.\n2. Umieść na niej gniazdo i 6 wojowników.\n3. Wybierz Przywódcę i umieść go na swojej planszy; pozostałych odłóż na bok.\n4. Umieść swoich 2 Lojalnych Wezyrów pod odpowiednimi kolumnami dekretu, wskazanymi przez wybranego Przywódcę.\n5. Umieść pozostałe gniazda na planszy swojej frakcji.',
    ALLIANCE: '1. Dobierz 3 karty i umieść je w swojej talii sympatyków.\n2. Umieść tokeny sympatyków oraz żetony baz na planszy swojej frakcji.',
    CROWS: '1. Wybierz polanę ojczystą i umieść na niej 1 wojownika i 1 dowolny żeton intrygi.\n2. Umieść 1 wojownika na 3 polanach różnego typu (czyli łącznie na planszy będzie 4 wojowników).',
    VAGABOND: '1. Umieść swoją figurkę w dowolnym lesie.\n2. Potasuj talię misji. Dobierz z niej 3 karty i ułóż je odkryte w pobliżu.\n3. Umieść losowo 4 przedmioty w ruinach, chyba że zrobiłto już inny gracz nie grający Włóczęgą.\n4. Wybierz Włóczęgę którym zamierzasz grać i umieść jego kartę na planszy frakcji, łącznie z przedmiotami startowymi S.\n5. Umieść znaczniki relacji pozostałych frakcji na torze Relacji na polu "Neutralny".',
    LIZARDS: '1. Wybierz polanę ojczystą, nie sąsiadującą z żadną wrogą polaną ojczystą.\n2. Umieść na niej 4 wojowników i 1 ogród zgodny z typem polany. Umieść 3 wojowników na sąsiadujących polanach, tak równo jak to możliwe.\n3. Umieść 2 wojowników na polu Akolitów.\n4. Umieść ogrody na swojej planszy frakcji.\n5. Umieść żeton Wygnańców na wybranym przez siebie typie polan, stroną Wygnańców do góry.',
    OTTERS: '1. Umieść 4 wojowników na dowolnych polanach wzdłuż rzeki.\n2. Rozmieść 3 wojowników na polu Płatności.\n3. Rozmieść faktorie na odpowiednich torach faktorii. \n4. Ustal początkowe ceny usług.',
    BADGERS: '1. Potajemnie przetasuj wszystkie 12 Reliktów i bez podglądania umieść po jednym w każdym lesie. Pozostałe będą potrzebne w kroku 3.\n2. Wybierz 2 sąsiadujące ojczyste polany na obrzeżach Mapy, każdą oddaloną o conajmniej 2 polany od polan ojczystych przeciwników.\n3. Umieść wszystkie pozostałe relikty w lasach tak, aby były jak najrówniej rozłożone. Nie mogą sąsiadować z twoimi polanami ojczystymi.\n4. Umieść Wierne Sługi pod każdą kolumną swojej Świty.',
    MOLES: '1. Wybierz ojczystą polanę, nie sąsiadującą z wrogą ojczystą polaną.\n2. Umieść na niej 2 wojowników i 1 tunel. Umieść 5 wojowników na sąsiadujących polanach tak równo, jak to możliwe.\n3. Umieść Norę obok mapy. Umieść budynki cytadel i targów na planszy frakcji.\n4. Umieść 9 kart Ministrów na polu Nieprzekonanych Ministrów oraz po 3 korony w odpowiednich miejscach na planszy frakcji.',
    RATS: '1. Wybierz polanę ojczystą przy krawędzi mapy, oddaloną o conajmniej 2 polany od polan ojczystych przeciwników.\n2. Umieść swojego Lorda, 4 wojowników i Warownię na tej polanie.\n3. Umieść kartę nastroju Uparty na polu Karty Nastroju.\n4. Umieść 4 przedmioty w ruinach (jesli jeszcze nie zostało to zrobione).',
}

function setupTextForRace(race?: string | null) {
    const rk = raceKey(race)
    return SETUP_HINT[rk] ?? 'Rozstaw frakcję zgodnie z planszetką.'
}

export default function MatchPage() {
    const { matchId } = useParams()
    const mid = Number(matchId)

    const [state, setState] = useState<MatchState | null>(null)
    const [draft, setDraft] = useState<DraftState | null>(null)

    const [localTime, setLocalTime] = useState<Record<number, number>>({})
    const [runningPlayerId, setRunningPlayerId] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [activeIndex, setActiveIndex] = useState(0)

    const alertedRef = useRef<Record<number, boolean>>({})
    const lastSaveRef = useRef<Record<number, number>>({})
    const loadInFlightRef = useRef(false)

    const [flowStage, setFlowStage] = useState<FlowStage>('NONE')
    const [setupIndex, setSetupIndex] = useState(0)

    const [scoreInput, setScoreInput] = useState<Record<number, string>>({})

    const [summaryOpen, setSummaryOpen] = useState(false)
    const [summary, setSummary] = useState<MatchSummary | null>(null)
    const [summaryDesc, setSummaryDesc] = useState('')
    const [summarySaving, setSummarySaving] = useState(false)

    // ✅ Cards modal
    const [cardsOpen, setCardsOpen] = useState(false)
    const [cardsSearch, setCardsSearch] = useState('')
    const [fClearings, setFClearings] = useState<Record<Clearing, boolean>>({
        MOUSE: false,
        FOX: false,
        RABBIT: false,
        BIRD: false,
    })
    const [fCraft, setFCraft] = useState<Record<CraftType, boolean>>({
        POINTS: false,
        ABILITY: false,
        DOMINANCE: false,
    })
    const [fItems, setFItems] = useState<Record<Item, boolean>>({
        SACK: false,
        BOOT: false,
        SWORD: false,
        CROSSBOW: false,
        HAMMER: false,
        TEAPOT: false,
        COIN: false,
        TORCH: false,
    })
    const [previewCard, setPreviewCard] = useState<CardDef | null>(null)

    function resetCardFilters() {
        setCardsSearch('')
        setFClearings({ MOUSE: false, FOX: false, RABBIT: false, BIRD: false })
        setFCraft({ POINTS: false, ABILITY: false, DOMINANCE: false })
        setFItems({
            SACK: false,
            BOOT: false,
            SWORD: false,
            CROSSBOW: false,
            HAMMER: false,
            TEAPOT: false,
            COIN: false,
            TORCH: false,
        })
    }

    const prevDraftPhaseRef = useRef<DraftState['phase'] | null>(null)
    const prevDraftStatusRef = useRef<DraftState['status'] | null>(null)


    const presetSeconds = state?.timerSecondsInitial ?? 180

    const playersInMatchOrder = useMemo(() => {
        if (!state) return []

        // ✅ DRAFT: zostaje jak było (reverse)
        const draftOrder = draft?.pickOrder?.length ? [...draft.pickOrder].reverse() : null
        if (draftOrder) {
            const byId = new Map(state.players.map((p) => [p.playerId, p]))
            const arranged = draftOrder.map((id) => byId.get(id)).filter(Boolean) as MatchPlayerState[]
            const used = new Set(arranged.map((p) => p.playerId))
            const rest = state.players.filter((p) => !used.has(p.playerId))
            return [...arranged, ...rest]
        }

        // ✅ MANUAL PICK: kolejność = kolejność przypisywania na froncie
        if (state.raceDraftEnabled === false) {
            const manual = [...lsGetJson<number[]>(LS_MANUAL_ORDER(mid), [])].reverse()
            if (manual.length) {
                const byId = new Map(state.players.map((p) => [p.playerId, p]))
                const arranged = manual.map((id) => byId.get(id)).filter(Boolean) as MatchPlayerState[]
                const used = new Set(arranged.map((p) => p.playerId))
                const rest = state.players.filter((p) => !used.has(p.playerId))
                return [...arranged, ...rest]
            }
        }

        return [...state.players]
    }, [state, draft?.pickOrder, mid])


    useEffect(() => {
        if (!playersInMatchOrder.length) return
        setActiveIndex((prev) => Math.min(Math.max(prev, 0), playersInMatchOrder.length - 1))
    }, [playersInMatchOrder.length])

    const activePlayer = playersInMatchOrder[activeIndex] ?? null

    async function load() {
        if (!Number.isFinite(mid)) return
        if (loadInFlightRef.current) return
        loadInFlightRef.current = true

        setLoading(true)
        setError(null)

        try {
            const s = await apiGet<MatchState>(`/api/matches/${mid}`)

            // ✅ zbuduj nextState na bazie tego co przyszło z backendu (s), a nie na bazie "prev"
            const raceMap = lsGetRaceMap(mid)

            let nextState: MatchState = {
                ...s,
                players: s.players.map((p) => ({
                    ...p,
                    race: raceMap[p.playerId] ?? p.race ?? null,
                })),
            }

            // score input
            setScoreInput((prev) => {
                const next = { ...prev }
                for (const p of s.players) {
                    if (next[p.playerId] === undefined) next[p.playerId] = String(p.score ?? 0)
                }
                return next
            })

            // local time
            setLocalTime((prev) => {
                const next = { ...prev }
                for (const p of s.players) {
                    if (next[p.playerId] === undefined) next[p.playerId] = p.timeLeftSeconds
                }
                return next
            })

            if (s.raceDraftEnabled) {
                try {
                    const d = await apiGet<DraftState>(`/api/matches/${mid}/draft`)
                    setDraft(d)

                    const raceByPlayerId = new Map(d.assignments.map((a) => [a.playerId, a.race]))
                    nextState = {
                        ...nextState,
                        players: nextState.players.map((p) => ({
                            ...p,
                            race: p.race ?? raceByPlayerId.get(p.playerId) ?? null,
                        })),
                    }
                } catch {
                    setDraft(null)
                }
            } else {
                setDraft(null)
            }

            setState(nextState)

        } catch (e: any) {
            setError(e?.message ?? 'Failed to load match')
        } finally {
            setLoading(false)
            loadInFlightRef.current = false
        }
    }

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mid])

    // local countdown for running player (stops at 0)
    useEffect(() => {
        if (runningPlayerId == null) return
        const id = window.setInterval(() => {
            setLocalTime((prev) => {
                const cur = prev[runningPlayerId]
                if (cur == null || cur <= 0) return prev
                const nextVal = cur - 1
                if (nextVal <= 0) {
                    window.setTimeout(() => setRunningPlayerId(null), 0)
                    return { ...prev, [runningPlayerId]: 0 }
                }
                return { ...prev, [runningPlayerId]: nextVal }
            })
        }, 1000)
        return () => window.clearInterval(id)
    }, [runningPlayerId])

    // alarm when any player hits 0
    useEffect(() => {
        if (!state) return
        for (const p of state.players) {
            const t = localTime[p.playerId] ?? p.timeLeftSeconds
            if (t <= 0 && !alertedRef.current[p.playerId]) {
                alertedRef.current[p.playerId] = true
                playAlarm()
            }
        }
    }, [state, localTime])

    useEffect(() => {
        if (!draft) return

        const prevStatus = prevDraftStatusRef.current

        // Po zakończonym drafcie: pokaż setup (raz na mecz)
        if (
            draft.status === 'FINISHED' &&
            prevStatus !== 'FINISHED' &&
            !lsGetBool(LS_SETUP(mid))
        ) {
            setSetupIndex(0)
            setFlowStage('SETUP')
        }

        prevDraftPhaseRef.current = draft.phase
        prevDraftStatusRef.current = draft.status
    }, [draft, mid])

    useEffect(() => {
        if (!state) return
        if (state.raceDraftEnabled) return
        if (lsGetBool(LS_SETUP(mid))) return

        const allPicked = state.players.every((p) => !!p.race)
        if (allPicked) {
            setSetupIndex(0)
            setFlowStage('SETUP')
        }
    }, [state, mid])

    useEffect(() => {
        if (!state) return
        if (state.raceDraftEnabled) return
        if (state.status !== 'DRAFT') return

        const allPicked = state.players.every((p) => !!p.race)
        if (!allPicked) return

        const landmarksRequired = !!state.landmarksEnabled
        const landmarksOk = (state.landmarksDrawn?.length ?? 0) > 0

        if (landmarksRequired && !landmarksOk) return

            ; (async () => {
                try {
                    await apiPost<void>(`/api/matches/${mid}/start`)
                    await load()
                } catch (e: any) {
                    setError(e?.message ?? 'Failed to start match')
                }
            })()
    }, [state, mid])


    async function startMatch() {
        setLoading(true)
        setError(null)
        try {
            await apiPost<void>(`/api/matches/${mid}/start`)
            await load()
        } catch (e: any) {
            setError(e?.message ?? 'Failed to start match')
        } finally {
            setLoading(false)
        }
    }

    async function saveTime(playerId: number, timeLeftSeconds: number) {
        const now = Date.now()
        const last = lastSaveRef.current[playerId] ?? 0
        if (now - last < 500) return
        lastSaveRef.current[playerId] = now

        await apiPost<void>(`/api/matches/${mid}/players/${playerId}/set-time`, {
            timeLeftSeconds: Math.max(0, Math.floor(timeLeftSeconds)),
        })
    }

    async function setRunning(playerId: number) {
        const t = localTime[playerId] ?? state?.players.find((x) => x.playerId === playerId)?.timeLeftSeconds ?? 0
        if (t <= 0) return

        if (runningPlayerId != null && runningPlayerId !== playerId) {
            const prevT = localTime[runningPlayerId]
            if (prevT != null) {
                try {
                    await saveTime(runningPlayerId, prevT)
                } catch { }
            }
        }
        setRunningPlayerId(playerId)
    }

    async function stopRunning(playerId: number) {
        const t = localTime[playerId]
        setRunningPlayerId((prev) => (prev === playerId ? null : prev))
        if (t == null) return
        try {
            await saveTime(playerId, t)
        } catch { }
    }

    async function addMinute(playerId: number) {
        setLocalTime((prev) => ({ ...prev, [playerId]: (prev[playerId] ?? 0) + 60 }))
        try {
            await apiPost<void>(`/api/matches/${mid}/players/${playerId}/time`, { seconds: 60 })
        } catch { }
    }

    async function removeMinute(playerId: number) {
        setLocalTime((prev) => ({ ...prev, [playerId]: Math.max(0, (prev[playerId] ?? 0) - 60) }))
        try {
            await apiPost<void>(`/api/matches/${mid}/players/${playerId}/time`, { seconds: -60 })
        } catch { }
    }

    async function addSecond(playerId: number) {
        setLocalTime((prev) => ({ ...prev, [playerId]: (prev[playerId] ?? 0) + 1 }))
        try {
            await apiPost<void>(`/api/matches/${mid}/players/${playerId}/time`, { seconds: 1 })
        } catch { }
    }

    async function removeSecond(playerId: number) {
        setLocalTime((prev) => ({ ...prev, [playerId]: Math.max(0, (prev[playerId] ?? 0) - 1) }))
        try {
            await apiPost<void>(`/api/matches/${mid}/players/${playerId}/time`, { seconds: -1 })
        } catch { }
    }


    async function scoreDelta(playerId: number, delta: number) {
        try {
            await apiPost<void>(`/api/matches/${mid}/players/${playerId}/score`, { delta })
            await load()
        } catch { }
    }

    async function setScoreAbsolute(playerId: number, targetScore: number) {
        const current = state?.players.find((p) => p.playerId === playerId)?.score ?? 0
        const delta = targetScore - current
        if (delta === 0) return
        await scoreDelta(playerId, delta)
    }


    async function refreshTimer(playerId: number) {
        // ✅ natychmiast w UI
        setRunningPlayerId((prev) => (prev === playerId ? null : prev))
        alertedRef.current[playerId] = false
        setLocalTime((prev) => ({ ...prev, [playerId]: presetSeconds }))

        // ✅ zapis do backendu
        try {
            await apiPost<void>(`/api/matches/${mid}/players/${playerId}/set-time`, {
                timeLeftSeconds: presetSeconds,
            })
            await load()
        } catch (e: any) {
            setError(e?.message ?? 'Failed to refresh timer')
        }
    }
    async function openSummaryModal() {
        const s = await apiGet<MatchSummary>(`/api/matches/${mid}/summary`)
        setSummary(s)
        setSummaryDesc((s.description ?? '').toString())
        setSummaryOpen(true)
    }

    async function saveSummaryAndExit() {
        if (!summary) return
        setSummarySaving(true)
        try {
            await apiPost<void>(`/api/matches/${mid}/description`, { description: summaryDesc })
            // po zapisie wracamy do ligi
            window.location.href = `/leagues/${summary.leagueId}`
        } catch (e: any) {
            setError(e?.message ?? 'Failed to save description')
        } finally {
            setSummarySaving(false)
        }
    }


    async function finish() {
        const ok = confirm('Finish match? This will update league standings.')
        if (!ok) return

        setLoading(true)
        try {
            if (runningPlayerId != null) {
                const t = localTime[runningPlayerId]
                setRunningPlayerId(null)
                if (t != null) {
                    try {
                        await saveTime(runningPlayerId, t)
                    } catch { }
                }
            }
            await apiPost<void>(`/api/matches/${mid}/finish`)
            await load()
            await openSummaryModal()

        } finally {
            setLoading(false)
        }
    }

    const matchStarted = state?.status === 'RUNNING'
    const filteredCards = useMemo(() => {
        const search = cardsSearch.trim().toLowerCase()

        const anyClearing = Object.values(fClearings).some(Boolean)
        const anyCraft = Object.values(fCraft).some(Boolean)
        const anyItem = Object.values(fItems).some(Boolean)

        return CARDS.filter((c) => {
            if (search) {
                const okName =
                    c.name.toLowerCase().includes(search) ||
                    c.id.toLowerCase().includes(search)
                if (!okName) return false
            }

            if (anyClearing && !fClearings[c.clearing]) return false
            if (anyCraft && !fCraft[c.craftType]) return false

            if (anyItem) {
                if (!c.item) return false
                if (!fItems[c.item]) return false
            }

            return true
        })
    }, [cardsSearch, fClearings, fCraft, fItems])

    // BLOCKING DRAFT VIEW
    if (state?.raceDraftEnabled && draft && draft.status === 'DRAFTING') {
        return (
            <RaceDraftView
                matchId={mid}
                draft={draft}
                players={state.players}
                loading={loading}
                error={error}
                landmarksEnabled={state.landmarksEnabled}
                landmarksBanned={state.landmarkBanned}
                landmarksRandomCount={(state.landmarksRandomCount ?? null) as any}
                landmarksDrawn={state.landmarksDrawn ?? []}
                onLandmarksBan={async (banned, randomCount) => {
                    await apiPost(`/api/matches/${mid}/landmarks/ban`, { banned, randomCount })
                    await load()
                }}
                onPick={async (playerId, race) => {
                    try {
                        await apiPost(`/api/matches/${mid}/draft/pick`, { playerId, race })
                        await load()
                    } catch (e: any) {
                        setError(e?.message ?? 'Failed to pick race')
                    }
                }}
                onSetBans={async (bannedRaces) => {
                    try {
                        await apiPost(`/api/matches/${mid}/draft/bans`, { bannedRaces })
                        await load()
                    } catch (e: any) {
                        setError(e?.message ?? 'Failed to set bans')
                    }
                }}
                onResetPick={() => apiPost(`/api/matches/${mid}/draft/reset-pick`)}
                onRefresh={load}
            />
        )
    }

    const needsRacePick =
        state &&
        state.raceDraftEnabled === false &&
        state.players.some((p) => !p.race)

    if (needsRacePick) {
        return (
            <RacePickView
                matchId={mid}
                players={state!.players}
                loading={loading}
                error={error}
                raceKey={raceKey}
                raceLabel={raceLabel}
                RACE_ICON={RACE_ICON}
                RACE_COLOR={RACE_COLOR}
                ui={ui}
                landmarksEnabled={state?.landmarksEnabled}
                landmarkBanned={state?.landmarkBanned}
                landmarksRandomCount={state?.landmarksRandomCount}
                landmarksDrawn={state?.landmarksDrawn ?? []}
                onSetLandmarksManual={async (picked) => {
                    try {
                        const resp = await apiPost<LandmarksStateResponse>(`/api/matches/${mid}/landmarks/manual`, { picked })
                        console.log('landmarks/manual resp', resp)

                        setState((prev) => {
                            if (!prev) return prev
                            return {
                                ...prev,
                                landmarkBanned: resp.banned ?? null,
                                landmarksRandomCount: resp.randomCount ?? null,
                                landmarksDrawn: resp.drawn ?? [],
                            }
                        })

                        await load()
                    } catch (e: any) {
                        setError(e?.message ?? 'Failed to set landmarks')
                    }
                }}

                onPick={async (playerId, race) => {
                    try {
                        // 1) optimistic UI
                        setState(prev => {
                            if (!prev) return prev
                            return {
                                ...prev,
                                players: prev.players.map(p => p.playerId === playerId ? { ...p, race } : p),
                            }
                        })

                        const key = LS_MANUAL_ORDER(mid)
                        const order = lsGetJson<number[]>(key, [])
                        if (!order.includes(playerId)) {
                            order.push(playerId)
                            lsSetJson(key, order)
                        }

                        // 2) persist lokalnie (żeby inni też widzieli po refreshu)
                        lsSetRace(mid, playerId, race)

                        // 3) backend
                        await apiPost(`/api/matches/${mid}/race-pick`, { playerId, race })

                        // 4) jeśli ostatni pick -> zamknij pick view
                        const allPickedNow =
                            (state?.players ?? []).every(p => p.playerId === playerId ? true : !!(p.race || lsGetRaceMap(mid)[p.playerId]))

                        if (allPickedNow) {
                            await load() // żeby odświeżyć match status itp.
                            // widok sam przejdzie, bo needsRacePick będzie false
                            return
                        }

                        await load()
                    } catch (e: any) {
                        setError(e?.message ?? 'Failed to pick race')
                    }
                }}

                onRefresh={async () => {
                    try {
                        // 1) lokalnie wyczyść cache
                        lsClearRaces(mid)

                        // 2) wyczyść UI
                        setState(prev => {
                            if (!prev) return prev
                            return {
                                ...prev,
                                players: prev.players.map(p => ({ ...p, race: null })),
                            }
                        })

                        // 3) backend reset
                        await apiPost(`/api/matches/${mid}/race-pick/reset`)

                        // 4) reload
                        await load()
                    } catch (e: any) {
                        setError(e?.message ?? 'Failed to reset race picks')
                    }
                }}
            />
        )
    }

    return (
        <div style={ui.page}>
            <div style={ui.shell}>
                {/* TOPBAR */}
                <div style={ui.topbar}>
                    <Link to="/groups" style={ui.backLink}>
                        ← back
                    </Link>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {state && (
                            <span style={ui.badge}>
                                match {state.matchId} • league {state.leagueId} • {state.status}
                            </span>
                        )}

                        <button
                            onClick={load}
                            disabled={loading}
                            style={ui.btn('ghost', loading)}
                            onMouseEnter={(e) => {
                                if (loading) return
                                e.currentTarget.style.transform = 'translateY(-1px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            Refresh
                        </button>
                    </div>

                    {/* SETUP MODAL */}
                    <SetupModal
                        open={flowStage !== 'NONE'}
                        loading={loading}
                        playersInMatchOrder={playersInMatchOrder}
                        setupIndex={setupIndex}
                        setSetupIndex={setSetupIndex}
                        mid={mid}
                        setFlowStage={setFlowStage}
                        raceKey={raceKey}
                        raceLabel={raceLabel}
                        setupTextForRace={setupTextForRace}
                        RACE_COLOR={RACE_COLOR}
                        RACE_ICON={RACE_ICON}
                        lsSetBool={lsSetBool}
                        LS_SETUP={LS_SETUP}
                        ui={ui}
                    />

                </div>

                {/* TOP PAGE ACTIONS */}
                {state && (
                    <div style={ui.actionsTop}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            {!matchStarted ? (
                                <button
                                    onClick={startMatch}
                                    disabled={loading || draft?.status === 'DRAFTING'}
                                    style={ui.btn('primary', loading || draft?.status === 'DRAFTING')}
                                    title={draft?.status === 'DRAFTING' ? 'Finish draft first' : undefined}
                                    onMouseEnter={(e) => {
                                        if (loading || draft?.status === 'DRAFTING') return
                                        e.currentTarget.style.transform = 'translateY(-1px)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                    }}
                                >
                                    Start match
                                </button>
                            ) : (
                                <button
                                    onClick={finish}
                                    disabled={loading || state?.status === 'FINISHED'}
                                    style={ui.btn('danger', loading || state?.status === 'FINISHED')}
                                    onMouseEnter={(e) => {
                                        if (loading || state?.status === 'FINISHED') return
                                        e.currentTarget.style.transform = 'translateY(-1px)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                    }}
                                >
                                    Finish match
                                </button>
                            )}

                            <span style={ui.badge}>
                                preset: <b>{presetSeconds}s</b>
                            </span>

                            {draft?.status === 'FINISHED' && !lsGetBool(LS_SETUP(mid)) && (
                                <button
                                    style={ui.btn('ghost', loading)}
                                    disabled={loading}
                                    onClick={() => {
                                        setSetupIndex(0)
                                        setFlowStage('SETUP')
                                    }}
                                >
                                    Setup hints
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {runningPlayerId != null && (
                                <span style={ui.badgeStrong('#22c55e')}>
                                    Running: <b>{state?.players.find((p) => p.playerId === runningPlayerId)?.playerName ?? runningPlayerId}</b>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ERROR */}
                {error && <div style={ui.errorBox}>Error: {error}</div>}

                {/* BODY */}
                {!state ? (
                    <div style={{ opacity: 0.78, color: 'rgba(255,255,255,0.72)' }}>{loading ? 'Loading…' : 'Match not found'}</div>
                ) : (
                    <div style={ui.layout}>
                        {/* CENTER: ALL PLAYER CARDS */}
                        <div style={ui.centerWrap}>
                            <div style={{ width: 'min(980px, 100%)' }}>
                                <div style={ui.cardsGrid}>
                                    {playersInMatchOrder.map((p) => {
                                        const rk = raceKey(p.race)
                                        const hex = RACE_COLOR[rk] ?? '#dc2626'
                                        const icon = RACE_ICON[rk] ?? ''

                                        const t = localTime[p.playerId] ?? p.timeLeftSeconds
                                        const timeUp = t <= 0
                                        const isRunning = runningPlayerId === p.playerId
                                        const matchStarted = state?.status === 'RUNNING'

                                        return (
                                            <div key={p.playerId} style={ui.playerCard(hex, timeUp, isRunning)}>
                                                {/* TOP */}
                                                <div style={ui.cardTopRow}>
                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={ui.smallName} title={p.playerName}>
                                                            {p.playerName}
                                                        </div>

                                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 6 }}>
                                                            <span style={ui.badgeStrong(hex)}>{raceLabel(p.race)}</span>

                                                            {timeUp ? (
                                                                <span style={ui.badgeStrong('#ef4444')}>TIME UP</span>
                                                            ) : isRunning ? (
                                                                <span style={ui.badgeStrong('#22c55e')}>RUNNING</span>
                                                            ) : (
                                                                <span style={ui.badge}>STOPPED</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {icon ? (
                                                        <img
                                                            src={icon}
                                                            alt={raceLabel(p.race)}
                                                            title={raceLabel(p.race)}
                                                            style={{ ...ui.heroIcon(hex), width: 56, height: 56, padding: 8, borderRadius: 16 }}
                                                        />
                                                    ) : null}
                                                </div>

                                                {/* TIMER + QUICK TIME CONTROLS */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={ui.timerRow}>
                                                            <div>
                                                                <div style={ui.smallTimer(timeUp)}>{fmt(t)}</div>
                                                                <div style={{ fontSize: 12, opacity: 0.72, color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>
                                                                    time left
                                                                </div>
                                                            </div>

                                                            {/* ✅ TIME BUTTONS */}
                                                            <div style={ui.timeControls}>
                                                                <button
                                                                    onClick={() => removeSecond(p.playerId)}
                                                                    disabled={loading || !matchStarted}
                                                                    style={ui.timeBtn('sub', loading || !matchStarted)}
                                                                    onMouseEnter={(e) => {
                                                                        if (loading || !matchStarted) return
                                                                        e.currentTarget.style.transform = 'translateY(-1px)'
                                                                        e.currentTarget.style.filter = 'brightness(1.08)'
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.transform = 'translateY(0)'
                                                                        e.currentTarget.style.filter = 'none'
                                                                    }}
                                                                    title="-1 second"
                                                                >
                                                                    −1s
                                                                </button>

                                                                <button
                                                                    onClick={() => addSecond(p.playerId)}
                                                                    disabled={loading || !matchStarted}
                                                                    style={ui.timeBtn('add', loading || !matchStarted)}
                                                                    onMouseEnter={(e) => {
                                                                        if (loading || !matchStarted) return
                                                                        e.currentTarget.style.transform = 'translateY(-1px)'
                                                                        e.currentTarget.style.filter = 'brightness(1.08)'
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.transform = 'translateY(0)'
                                                                        e.currentTarget.style.filter = 'none'
                                                                    }}
                                                                    title="+1 second"
                                                                >
                                                                    +1s
                                                                </button>

                                                                <button
                                                                    onClick={() => removeMinute(p.playerId)}
                                                                    disabled={loading || !matchStarted}
                                                                    style={ui.timeBtn('sub', loading || !matchStarted)}
                                                                    onMouseEnter={(e) => {
                                                                        if (loading || !matchStarted) return
                                                                        e.currentTarget.style.transform = 'translateY(-1px)'
                                                                        e.currentTarget.style.filter = 'brightness(1.08)'
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.transform = 'translateY(0)'
                                                                        e.currentTarget.style.filter = 'none'
                                                                    }}
                                                                    title="-1 minute"
                                                                >
                                                                    −1m
                                                                </button>

                                                                <button
                                                                    onClick={() => addMinute(p.playerId)}
                                                                    disabled={loading || !matchStarted}
                                                                    style={ui.timeBtn('add', loading || !matchStarted)}
                                                                    onMouseEnter={(e) => {
                                                                        if (loading || !matchStarted) return
                                                                        e.currentTarget.style.transform = 'translateY(-1px)'
                                                                        e.currentTarget.style.filter = 'brightness(1.08)'
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.transform = 'translateY(0)'
                                                                        e.currentTarget.style.filter = 'none'
                                                                    }}
                                                                    title="+1 minute"
                                                                >
                                                                    +1m
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: 12, opacity: 0.72, color: 'rgba(255,255,255,0.72)' }}>score</div>
                                                        <div style={{ fontSize: 26, fontWeight: 1000, fontVariantNumeric: 'tabular-nums' }}>{p.score}</div>
                                                    </div>
                                                </div>

                                                {/* ACTIONS */}
                                                <div style={ui.miniActionsRow}>
                                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                        <input
                                                            type="number"
                                                            value={scoreInput[p.playerId] ?? String(p.score ?? 0)}
                                                            disabled={loading || !matchStarted}
                                                            onChange={(e) =>
                                                                setScoreInput((prev) => ({ ...prev, [p.playerId]: e.target.value }))
                                                            }
                                                            onKeyDown={async (e) => {
                                                                if (e.key !== 'Enter') return
                                                                const raw = (scoreInput[p.playerId] ?? '').trim()
                                                                if (raw === '') return
                                                                const n = Number(raw)
                                                                if (!Number.isFinite(n)) return
                                                                await setScoreAbsolute(p.playerId, Math.trunc(n))
                                                            }}
                                                            style={{
                                                                width: 80,
                                                                padding: '10px 12px',
                                                                borderRadius: 14,
                                                                border: '1px solid rgba(255,255,255,0.14)',
                                                                background: 'rgba(255,255,255,0.06)',
                                                                color: 'rgba(255,255,255,0.92)',
                                                                outline: 'none',
                                                                fontWeight: 900,
                                                                fontVariantNumeric: 'tabular-nums',
                                                            }}
                                                            title="Wpisz docelowy wynik i naciśnij Enter"
                                                        />

                                                        <button
                                                            onClick={async () => {
                                                                const raw = (scoreInput[p.playerId] ?? '').trim()
                                                                if (raw === '') return
                                                                const n = Number(raw)
                                                                if (!Number.isFinite(n)) return
                                                                await setScoreAbsolute(p.playerId, Math.trunc(n))
                                                            }}
                                                            disabled={loading || !matchStarted}
                                                            style={ui.btn('ghost', loading || !matchStarted)}
                                                        >
                                                            Set
                                                        </button>

                                                        <button
                                                            onClick={() => refreshTimer(p.playerId)}
                                                            disabled={loading || !matchStarted}
                                                            style={ui.btn('ghost', loading || !matchStarted)}
                                                            title={`Set timer back to ${presetSeconds}s`}
                                                        >
                                                            ⟳ Timer
                                                        </button>
                                                    </div>

                                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                        {!isRunning ? (
                                                            <button
                                                                onClick={() => setRunning(p.playerId)}
                                                                disabled={loading || !matchStarted}
                                                                style={{
                                                                    ...ui.btn('race', loading || !matchStarted, hex),
                                                                    color: 'rgba(255,255,255,0.92)',
                                                                }}
                                                            >
                                                                Start
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => stopRunning(p.playerId)}
                                                                disabled={loading || !matchStarted}
                                                                style={ui.btn('danger', loading || !matchStarted)}
                                                            >
                                                                Stop
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: SCOREBOARD*/}
                        <div style={{ display: 'grid', gap: 12 }}>

                            <div style={ui.panel}>
                                <div style={ui.panelHead}>
                                    <div>Scoreboard</div>
                                    {activePlayer && (
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                            <span style={ui.badgeStrong('#dc2626')}>
                                                Active: <b>{activePlayer.playerName}</b>
                                            </span>

                                        </div>
                                    )}
                                </div>

                                <div style={ui.tableHeadRow}>
                                    <div style={{ ...ui.tableCell, fontWeight: 1000, opacity: 0.78 }}>Player / Race</div>
                                    <div style={{ ...ui.tableCell, fontWeight: 1000, opacity: 0.78, textAlign: 'right' }}>Score</div>
                                </div>

                                <div style={ui.tableWrap}>
                                    {playersInMatchOrder.map((p) => {
                                        const rk = raceKey(p.race)
                                        const icon = RACE_ICON[rk] ?? ''
                                        const hex = RACE_COLOR[rk] ?? '#dc2626'
                                        const isActiveRow = runningPlayerId === p.playerId

                                        return (
                                            <div
                                                key={p.playerId}
                                                style={ui.scoreboardRow(hex, isActiveRow)}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = mixRgba(hex, isActiveRow ? 0.20 : 0.14)
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = isActiveRow ? mixRgba(hex, 0.16) : mixRgba(hex, 0.08)
                                                }}
                                            >
                                                <div style={{ ...ui.tableCell, display: 'flex', gap: 10, alignItems: 'center' }}>
                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={ui.playerName}>{p.playerName}</div>

                                                        <div style={ui.raceLine}>
                                                            {icon ? <img src={icon} alt={raceLabel(p.race)} style={ui.miniIcon(hex)} /> : null}
                                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {raceLabel(p.race)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={ui.score}>{p.score}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <button
                                disabled={loading}
                                onClick={() => setCardsOpen(true)}
                                style={{
                                    ...ui.btn('cards', loading),

                                    width: '100%',
                                    height: 56,

                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                    fontSize: 20,
                                    fontWeight: 1000,
                                    letterSpacing: 1.2,

                                    textTransform: 'uppercase',

                                    transition:
                                        'transform 140ms ease, box-shadow 140ms ease, filter 140ms ease',
                                }}
                                onMouseEnter={(e) => {
                                    if (loading) return
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow =
                                        '0 26px 70px rgba(0,0,0,0.65), 0 0 90px rgba(59,130,246,0.28)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow =
                                        '0 20px 50px rgba(0,0,0,0.55), 0 0 60px rgba(59,130,246,0.18)'
                                }}
                            >
                                CARD LIST
                            </button>
                        </div>
                    </div>
                )}

                {/* CARDS MODAL */}
                <CardsModal
                    open={cardsOpen}
                    loading={loading}
                    cardsSearch={cardsSearch}
                    setCardsSearch={setCardsSearch}
                    fClearings={fClearings}
                    setFClearings={setFClearings}
                    fCraft={fCraft}
                    setFCraft={setFCraft}
                    fItems={fItems}
                    setFItems={setFItems}
                    previewCard={previewCard}
                    setPreviewCard={setPreviewCard}
                    filteredCards={filteredCards}
                    totalCards={CARDS.length}
                    onResetFilters={resetCardFilters}
                    onClose={() => {
                        setCardsOpen(false)
                        setPreviewCard(null)
                    }}
                    ui={ui}
                />
                {/* SUMMARY MODAL (ULTRA) */}
                <MatchSummaryModal
                    open={summaryOpen && !!summary}
                    loading={loading}
                    saving={summarySaving}
                    title="Match Summary"
                    subtitle={
                        summary
                            ? `match #${summary.matchId} • league #${summary.leagueId} • ${summary.ranked ? "ranked" : "casual"}`
                            : undefined
                    }
                    accentHex="#3b82f6"
                    onClose={() => setSummaryOpen(false)}
                    onSave={saveSummaryAndExit}
                >
                    {summary ? (
                        <MatchSummaryView
                            summary={summary}
                            mode="edit"
                            description={summaryDesc}
                            setDescription={setSummaryDesc}
                            raceKey={raceKey}
                            raceLabel={raceLabel}
                            RACE_ICON={RACE_ICON}
                            RACE_COLOR={RACE_COLOR}
                        />
                    ) : null}
                </MatchSummaryModal>

                
                {state?.landmarksEnabled && (
                    <div style={{ ...ui.panel, margin: '0 auto 14px' }}>
                        <div style={ui.panelHead}>
                            <div>Landmarks</div>
                            <span style={ui.badge}>
                                banned: <b>{state.landmarkBanned ?? '—'}</b> • draw:{' '}
                                <b>{(state.landmarksDrawn?.length ?? state.landmarksRandomCount) ?? '—'}</b>
                            </span>
                        </div>

                        <div style={{ padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {(state.landmarksDrawn ?? []).map((id) => (
                                <Tooltip
                                    key={id}
                                    placement="top"
                                    content={lmTooltipContent(id as LandmarkId)}
                                >
                                    <span style={{ ...ui.badge, cursor: 'help' }}>
                                        {lmLabel(id as LandmarkId)}
                                    </span>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

}
