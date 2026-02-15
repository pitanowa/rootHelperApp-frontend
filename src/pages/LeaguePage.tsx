import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiDelete, apiGet, apiPost } from '../api'
import type { Player } from '../types'
import { MatchSummaryModal } from "../components/modals/MatchSummary"
import { MatchSummaryView } from "../components/match/MatchSummaryView"
import { toErrorMessage } from '../shared/errors'
import battlefield from "../assets/backgrounds/root_match_summary.png";


type StandingRow = {
    playerId: number
    playerName: string
    rootsTotal: number
    pointsTotal: number
    gamesPlayed: number
    wins: number
}


type CreatedMatch = {
    id: number
    leagueId: number
    groupId: number
    status: string
    timerSecondsInitial: number
}

type MatchListItem = {
    id: number
    status: string
    timerSecondsInitial: number
    ranked: boolean
    name?: string | null
}

type MatchSummary = {
    matchId: number
    leagueId: number
    matchName: string | null
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


// --- MODERN INLINE STYLES (drop-in) ---
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


export default function LeaguePage() {
    const { leagueId } = useParams()
    const lid = Number(leagueId)
    const nav = useNavigate()

    const [standings, setStandings] = useState<StandingRow[]>([])
    const [matches, setMatches] = useState<MatchListItem[]>([])
    const [selected, setSelected] = useState<number[]>([])
    const [ranked, setRanked] = useState(true)
    const [timerSeconds, setTimerSeconds] = useState(180)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [landmarksEnabled, setLandmarksEnabled] = useState(false)
    const [raceDraftEnabled, setRaceDraftEnabled] = useState(false)
    const [excludedRaces, setExcludedRaces] = useState<string[]>([])
    const [summaryOpen, setSummaryOpen] = useState(false)
    const [summary, setSummary] = useState<MatchSummary | null>(null)
    const [summaryLoading, setSummaryLoading] = useState(false)

    const players: Player[] = useMemo(
        () => standings.map((s) => ({ id: s.playerId, name: s.playerName, createdAt: '' })),
        [standings],
    )

    useEffect(() => {
        if (!raceDraftEnabled) setExcludedRaces([])
    }, [raceDraftEnabled])

    async function load() {
        setLoading(true)
        setError(null)
        try {
            const [rows, ms] = await Promise.all([
                apiGet<StandingRow[]>(`/api/leagues/${lid}/standings`),
                apiGet<MatchListItem[]>(`/api/leagues/${lid}/matches`),
            ])

            rows.sort((a, b) => (b.rootsTotal ?? 0) - (a.rootsTotal ?? 0) || a.playerName.localeCompare(b.playerName))
            setStandings(rows)
            setMatches(ms)

            const ids = new Set(rows.map((r) => r.playerId))
            setSelected((prev) => prev.filter((id) => ids.has(id)))
        } catch (e: unknown) {
            setError(toErrorMessage(e, 'Failed to load league'))
        } finally {
            setLoading(false)
        }
    }

    async function openMatchSummary(matchId: number) {
        setSummary(null)
        setSummaryOpen(true)
        setSummaryLoading(true)
        setError(null)
        try {
            const s = await apiGet<MatchSummary>(`/api/matches/${matchId}/summary`)
            setSummary(s)
        } catch (e: unknown) {
            setError(toErrorMessage(e, 'Failed to load match summary'))
            setSummaryOpen(false)
        } finally {
            setSummaryLoading(false)
        }
    }

    async function deleteMatch(matchId: number) {
        const ok = confirm('Delete match? If FINISHED+RANKED it will rollback standings.')
        if (!ok) return
        setLoading(true)
        setError(null)
        try {
            await apiDelete<void>(`/api/matches/${matchId}`)
            await load()
        } catch (e: unknown) {
            setError(toErrorMessage(e, 'Failed to delete match'))
        } finally {
            setLoading(false)
        }
    }

    async function updateMatchRanked(matchId: number, rankedNext: boolean) {
        setLoading(true)
        setError(null)
        try {
            await apiPost<void>(`/api/matches/${matchId}/ranked`, { ranked: rankedNext })
            await load()
        } catch (e: unknown) {
            setError(toErrorMessage(e, 'Failed to update match ranked flag'))
        } finally {
            setLoading(false)
        }
    }

    async function saveMatchName(matchId: number, name: string) {
        setLoading(true)
        setError(null)
        try {
            await apiPost<void>(`/api/matches/${matchId}/name`, { name })
            await load()
        } catch (e: unknown) {
            setError(toErrorMessage(e, 'Failed to set match name'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!Number.isFinite(lid)) return
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lid])

    function toggle(id: number) {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }

    async function createMatch() {
        if (selected.length < 2) {
            setError('Select at least 2 players')
            return
        }

        setLoading(true)
        setError(null)
        try {
            const match = await apiPost<CreatedMatch>(`/api/leagues/${lid}/matches`, {
                timerSeconds,
                playerIds: selected,
                ranked,
                raceDraftEnabled,
                excludedRaces: raceDraftEnabled ? excludedRaces : [],
                landmarksEnabled,
            })
            nav(`/matches/${match.id}`)
        } catch (e: unknown) {
            setError(toErrorMessage(e, 'Failed to create match'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ marginTop: 12, marginBottom: 8 }}>League</h1>

            {error && (
                <div style={{ padding: 12, borderRadius: 12, border: '1px solid #f3c', marginBottom: 12 }}>
                    <b>Error:</b> {error}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/groups" style={{ textDecoration: 'none' }}>
                    ← back
                </Link>
                <button
                    onClick={load}
                    disabled={loading}
                    style={{ background: '#ffffff', padding: '8px 12px', borderRadius: 10, border: '1px solid #ccc', cursor: 'pointer' }}
                >
                    Refresh
                </button>
            </div>

            <div style={ui.standingsCardDark}>
                <div style={ui.standingsHeaderDark}>
                    <div>
                        <h2 style={ui.standingsTitleDark}>Standings</h2>
                        <div style={ui.standingsMetaDark}>
                            Bloodline ranking • Sorted by roots
                        </div>
                    </div>

                    <div style={ui.standingsBadgeDark}>
                        Players: <span style={{ fontWeight: 1000 }}>{standings.length}</span>
                    </div>
                </div>

                {standings.length === 0 ? (
                    <div style={ui.standingsEmptyDark}>No standings yet.</div>
                ) : (
                    <div style={ui.standingsTableWrapDark}>
                        <table style={ui.standingsTableDark}>
                            <thead>
                                <tr>
                                    <th style={ui.standingsThDark}>#</th>
                                    <th style={ui.standingsThDark}>Player</th>
                                    <th style={ui.standingsThDark}>Roots</th>
                                    <th style={ui.standingsThDark}>Games</th>
                                    <th style={ui.standingsThDark}>Wins</th>
                                </tr>
                            </thead>

                            <tbody>
                                {standings.map((r, idx) => {
                                    const rank = idx + 1
                                    const initials = (r.playerName || '?')
                                        .split(' ')
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((x) => x[0]?.toUpperCase())
                                        .join('')

                                    const zebra = idx % 2 === 0
                                    const baseBg =
                                        rank <= 3
                                            ? 'rgba(220,38,38,0.08)'
                                            : zebra
                                                ? 'rgba(255,255,255,0.04)'
                                                : 'rgba(255,255,255,0.02)'

                                    return (
                                        <tr
                                            key={r.playerId}
                                            title={`Roots: ${r.rootsTotal} | Points: ${r.pointsTotal} | Games: ${r.gamesPlayed} | Wins: ${r.wins}`}
                                            style={{ ...ui.standingsTrBaseDark, background: baseBg }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(220,38,38,0.12)'
                                                e.currentTarget.style.boxShadow = '0 18px 50px rgba(0,0,0,0.35)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = baseBg
                                                e.currentTarget.style.boxShadow = 'none'
                                            }}
                                        >
                                            <td style={{ ...ui.standingsTdDark, width: 70 }}>
                                                <span style={ui.standingsRankPillDark(rank)}>
                                                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                                                </span>
                                            </td>

                                            <td style={ui.standingsTdDark}>
                                                <div style={ui.standingsPlayerCellDark}>
                                                    <div style={ui.standingsAvatarDark(rank)} aria-hidden>
                                                        {initials || 'P'}
                                                    </div>
                                                    <div style={{ display: 'grid', gap: 2 }}>
                                                        <div style={{ fontWeight: 1000 }}>{r.playerName}</div>
                                                        <div style={{ fontSize: 12, opacity: 0.75, color: 'rgba(255,255,255,0.72)' }}>
                                                            {rank === 1 ? 'Legend' : rank <= 3 ? 'Champion' : 'Warrior'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={ui.standingsTdDark}>
                                                <div style={{ display: 'grid', gap: 2 }}>
                                                    <span style={ui.standingsPointsDark}>{r.rootsTotal} 🌿</span>
                                                    <span style={{ fontSize: 11, opacity: 0.72, color: 'rgba(255,255,255,0.75)' }}>
                                                        {r.pointsTotal} pts
                                                    </span>
                                                </div>
                                            </td>

                                            <td style={ui.standingsTdDark}>
                                                <span style={ui.standingsStatPillDark}>🎮 {r.gamesPlayed}</span>
                                            </td>

                                            <td style={ui.standingsTdDark}>
                                                <span style={ui.standingsStatPillDark}>🏆 {r.wins}</span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            <div style={ui.card}>
                <div style={ui.headerRow}>
                    <div>
                        <h2 style={ui.title}>Create match</h2>
                        <div style={ui.subtitle}>
                            Choose players, set timer and mode, then start.
                        </div>
                    </div>

                    <div style={ui.badge}>
                        Selected: <span style={{ fontWeight: 1000 }}>{selected.length}</span>
                    </div>
                </div>

                <div style={ui.controlsWrap}>
                    {/* Timer */}
                    <div style={ui.field}>
                        <span style={ui.labelSmall}>Timer (sec)</span>
                        <input
                            type="number"
                            min={60}
                            value={timerSeconds}
                            onChange={(e) => setTimerSeconds(Number(e.target.value))}
                            disabled={loading}
                            style={ui.input}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)'
                                e.currentTarget.style.boxShadow = '0 18px 40px rgba(220,38,38,0.18)'
                                e.currentTarget.style.transform = 'translateY(-1px)'
                            }}
                            onBlur={(e) => {
                                // ✅ wracamy do wartości bazowych z ui.input
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                                e.currentTarget.style.boxShadow = 'none'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}

                        />
                    </div>

                    {/* Ranked/Casual segmented control */}
                    <div style={ui.segment} aria-label="match mode">
                        <button
                            onClick={() => setRanked(true)}
                            disabled={loading}
                            style={{
                                ...ui.segBtn(ranked),
                                opacity: loading ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (loading) return
                                e.currentTarget.style.transform = ranked ? 'translateY(-1px)' : 'translateY(-1px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            RANKED
                        </button>

                        <button
                            onClick={() => setRanked(false)}
                            disabled={loading}
                            style={{
                                ...ui.segBtn(!ranked),
                                opacity: loading ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (loading) return
                                e.currentTarget.style.transform = 'translateY(-1px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            CASUAL
                        </button>
                    </div>

                    {/* Landmarks */}
                    <label style={ui.switch} title="Enable Landmarks setup flow">
                        <input
                            type="checkbox"
                            checked={landmarksEnabled}
                            onChange={(e) => setLandmarksEnabled(e.target.checked)}
                            disabled={loading}
                            style={ui.checkbox}
                        />
                        <span style={{ fontWeight: 900 }}>Landmarks</span>
                    </label>

                    {/* Race draft */}
                    <label style={ui.switch}>
                        <input
                            type="checkbox"
                            checked={raceDraftEnabled}
                            onChange={(e) => setRaceDraftEnabled(e.target.checked)}
                            disabled={loading}
                            style={ui.checkbox}
                        />
                        <span style={{ fontWeight: 900 }}>Draft</span>
                    </label>

                    {/* Create */}
                    <button
                        onClick={createMatch}
                        disabled={loading || selected.length < 2}
                        title={selected.length < 2 ? 'Select at least 2 players' : undefined}
                        style={ui.createBtn(!loading && selected.length >= 2)}
                        onMouseEnter={(e) => {
                            if (loading || selected.length < 2) return
                            e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        Create match
                    </button>
                </div>

                {/* Players grid */}
                <div style={ui.list}>
                    {players.map((p) => {
                        const isSelected = selected.includes(p.id)
                        const initials = (p.name || '?')
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((x) => x[0]?.toUpperCase())
                            .join('')

                        return (
                            <label
                                key={p.id}
                                style={ui.playerCard(isSelected)}
                                onMouseEnter={(e) => {
                                    if (loading) return
                                    e.currentTarget.style.transform = 'translateY(-1px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggle(p.id)}
                                    disabled={loading}
                                    style={ui.checkbox}
                                />

                                <div style={ui.avatar} aria-hidden>
                                    {initials || 'P'}
                                </div>

                                <div style={{ display: 'grid', gap: 2 }}>
                                    <div style={ui.playerName}>{p.name}</div>
                                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                                        {isSelected ? 'Selected' : 'Tap to select'}
                                    </div>
                                </div>
                            </label>
                        )
                    })}
                </div>
            </div>

            <div style={ui.historyCard}>
                <div style={ui.historyHeaderRow}>
                    <div>
                        <h2 style={ui.historyTitle}>Match history</h2>
                        <div style={ui.historyMeta}>
                            Blood, glory, and permanent records.
                        </div>
                    </div>

                    <div style={{ ...ui.badge, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.82)' }}>
                        Matches: <span style={{ fontWeight: 1000 }}>{matches.length}</span>
                    </div>
                </div>

                {matches.length === 0 ? (
                    <div style={ui.historyEmpty}>No matches yet.</div>
                ) : (
                    <div style={ui.historyGrid}>
                        {matches.map((m) => {
                            const disabled = loading

                            return (
                                <div
                                    key={m.id}
                                    style={ui.matchRow}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-1px)'
                                        e.currentTarget.style.borderColor = 'rgba(248,113,113,0.20)'
                                        e.currentTarget.style.boxShadow =
                                            '0 22px 60px rgba(0,0,0,0.36), 0 0 40px rgba(220,38,38,0.12)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.30)'
                                    }}
                                >
                                    <div style={ui.matchLeft}>
                                        <div style={ui.matchTopLine}>
                                            <span style={ui.matchId}>
                                                {m.name && m.name.trim() ? m.name : `Match #${m.id}`}
                                            </span>
                                            <span style={ui.statusChip(m.status)}>
                                                {m.status === 'FINISHED' ? '✅' : m.status === 'DRAFT' ? '🧪' : '⚔️'} {m.status}
                                            </span>
                                            <span style={ui.modeChip(m.ranked)}>
                                                {m.ranked ? '🏆 RANKED' : '🍻 CASUAL'}
                                            </span>
                                        </div>

                                        <div style={ui.chipRow}>
                                            <span style={ui.chip}>⏱ {m.timerSecondsInitial}s</span>
                                        </div>
                                    </div>

                                    <div style={ui.actions}>
                                        {m.status !== 'FINISHED' && (
                                            <Link
                                                to={`/matches/${m.id}`}
                                                style={ui.linkBtn('open', disabled)}
                                                onClick={(e) => {
                                                    if (disabled) e.preventDefault()
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (disabled) return
                                                    e.currentTarget.style.transform = 'translateY(-1px)'
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)'
                                                }}
                                            >
                                                ⚔️ Open
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => openMatchSummary(m.id)}
                                            disabled={disabled || summaryLoading || m.status !== 'FINISHED'}
                                            title={m.status !== 'FINISHED' ? 'Summary available after FINISHED' : undefined}
                                            style={ui.linkBtn('ghost', disabled || summaryLoading || m.status !== 'FINISHED')}
                                            onMouseEnter={(e) => {
                                                if (disabled || summaryLoading || m.status !== 'FINISHED') return
                                                e.currentTarget.style.transform = 'translateY(-1px)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)'
                                            }}
                                        >
                                            📜 Summary
                                        </button>

                                        {/* ✅ Toggle ranked/casual — zawsze widoczne */}
                                        <button
                                            onClick={() => updateMatchRanked(m.id, !m.ranked)}
                                            disabled={disabled}
                                            style={ui.linkBtn('ghost', disabled)}
                                            onMouseEnter={(e) => {
                                                if (disabled) return
                                                e.currentTarget.style.transform = 'translateY(-1px)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)'
                                            }}
                                        >
                                            🔁 Set {m.ranked ? 'CASUAL' : 'RANKED'}
                                        </button>

                                        {/* ✅ Rename (Twoje) */}
                                        <button
                                            disabled={disabled}
                                            style={ui.linkBtn('ghost', disabled)}
                                            onClick={async () => {
                                                const next = prompt('Match name:', m.name ?? '')
                                                if (next === null) return
                                                await saveMatchName(m.id, next)
                                            }}
                                        >
                                            ✏️ Rename
                                        </button>

                                        {/* ✅ Delete — tylko gdy CASUAL */}
                                        <button
                                            onClick={() => deleteMatch(m.id)}
                                            disabled={disabled || m.ranked}
                                            title={m.ranked ? 'Cannot delete RANKED match. Set it to CASUAL first.' : undefined}
                                            style={ui.linkBtn('danger', disabled || m.ranked)}
                                            onMouseEnter={(e) => {
                                                if (disabled || m.ranked) return
                                                e.currentTarget.style.transform = 'translateY(-1px)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)'
                                            }}
                                        >
                                            🩸 Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <MatchSummaryModal
                open={summaryOpen && !!summary}
                loading={summaryLoading}
                saving={false}
                title={
                    summary?.matchName?.trim()
                        ? summary.matchName
                        : `Match #${summary?.matchId}`
                }
                subtitle={
                    summary
                        ? `League #${summary.leagueId} • ${summary.ranked ? "RANKED WAR" : "CASUAL BLOODBATH"}`
                        : undefined
                }
                accentHex="#dc2626"
                variant="war"
                backgroundUrl={battlefield}
                onClose={() => setSummaryOpen(false)}
                hideSave
            >
                {summary ? (
                    <MatchSummaryView
                        summary={summary}
                        mode="readonly"
                    />
                ) : null}
            </MatchSummaryModal>
        </div>
    )
}




