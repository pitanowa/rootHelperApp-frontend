import Tooltip from "../../components/Tooltip";
import { lmTooltipContent, type LandmarkId, lmLabel } from "../../data/landmarks";
import { raceKey, raceLabel, RACE_COLOR, RACE_ICON } from "../../constants/races";

type Mode = "edit" | "readonly";

type SummaryPlayer = {
    playerId: number;
    playerName: string;
    raceId: string | null;
    raceLabel?: string | null;
    points: number;
    roots: number;
};

type SummaryRanking = {
    position: number;
    playerId: number;
    playerName: string;
    totalPoints: number;
    totalRoots: number;
    gamesPlayed: number;
    wins: number;
};

type SummaryLandmark = { id: string; label?: string | null };

export function MatchSummaryView({
    summary,
    mode,
    description,
    setDescription,
}: {
    summary: {
        matchId: number;
        leagueId: number;
        ranked: boolean;
        finished: boolean;
        description: string | null;
        players: SummaryPlayer[];
        landmarks: SummaryLandmark[];
        rankingAfter: SummaryRanking[];
    };

    mode: Mode;
    description?: string;
    setDescription?: (v: string) => void;
}) {
    const mix = (hex: string, a: number) => {
        const h = hex.replace("#", "");
        const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
        const num = parseInt(full, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    const accent = "#3b82f6";

    const grid: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        gap: 14,
    };

    const col: React.CSSProperties = {
        display: "grid",
        gap: 14,
    };

    const card: React.CSSProperties = {
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.10)",
        background:
            "radial-gradient(700px 260px at 10% 0%, rgba(59,130,246,0.10), transparent 60%), rgba(255,255,255,0.04)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
        overflow: "hidden",
    };

    const cardHead: React.CSSProperties = {
        padding: 12,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.03)",
    };

    const cardTitle: React.CSSProperties = {
        fontWeight: 1000,
        letterSpacing: 0.2,
        opacity: 0.92,
    };

    const badge: React.CSSProperties = {
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.86)",
        whiteSpace: "nowrap",
        fontWeight: 1000,
        letterSpacing: 0.2,
    };

    const body: React.CSSProperties = {
        padding: 12,
    };

    const row: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        gap: 10,
        padding: 10,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.18)",
        alignItems: "center",
    };

    const rankRow: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto",
        gap: 10,
        padding: 10,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.14)",
        alignItems: "center",
    };

    const miniIcon = (hex: string): React.CSSProperties => ({
        width: 22,
        height: 22,
        borderRadius: 8,
        objectFit: "contain",
        background: "rgba(255,255,255,0.08)",
        border: `1px solid ${mix(hex, 0.22)}`,
        padding: 3,
    });

    const badgeStrong = (hex: string): React.CSSProperties => ({
        ...badge,
        border: `1px solid ${mix(hex, 0.28)}`,
        background: `linear-gradient(135deg, ${mix(hex, 0.22)}, rgba(255,255,255,0.04))`,
        boxShadow: `0 14px 30px ${mix(hex, 0.12)}`,
        color: "rgba(255,255,255,0.92)",
    });

    const textarea: React.CSSProperties = {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.92)",
        outline: "none",
        fontWeight: 800,
        letterSpacing: 0.2,
        resize: "vertical",
        minHeight: 140,
    };

    const sectionGap: React.CSSProperties = { display: "grid", gap: 8 };

    return (
        <div style={grid}>
            {/* LEFT */}
            <div style={col}>
                {/* Players */}
                <div style={card}>
                    <div style={cardHead}>
                        <div style={cardTitle}>Players</div>
                        <span style={badge}>{summary.players.length} players</span>
                    </div>

                    <div style={{ ...body, display: "grid", gap: 8 }}>
                        {summary.players.map((p) => {
                            const rk = raceKey(p.raceId ?? "");
                            const hex = RACE_COLOR[rk] ?? accent;
                            const icon = RACE_ICON[rk] ?? "";
                            return (
                                <div key={p.playerId} style={row}>
                                    <div style={{ minWidth: 0, display: "flex", gap: 10, alignItems: "center" }}>
                                        {icon ? <img src={icon} style={miniIcon(hex)} alt={raceLabel(p.raceId ?? "")} /> : null}
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 1000, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {p.playerName}
                                            </div>
                                            <div style={{ fontSize: 12, opacity: 0.75, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {raceLabel(p.raceId ?? "")}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 11, opacity: 0.7 }}>points</div>
                                        <div style={{ fontWeight: 1000, fontVariantNumeric: "tabular-nums" }}>{p.points}</div>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 11, opacity: 0.7 }}>roots</div>
                                        <div style={{ fontWeight: 1000, fontVariantNumeric: "tabular-nums" }}>{p.roots}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Description */}
                <div style={card}>
                    <div style={cardHead}>
                        <div style={cardTitle}>Match description</div>
                    </div>

                    <div style={body}>
                        {mode === "edit" ? (
                            <textarea
                                value={description ?? ""}
                                onChange={(e) => setDescription?.(e.target.value)}
                                style={textarea}
                                placeholder="Write a short match summary..."
                            />
                        ) : (
                            <div style={{ whiteSpace: "pre-wrap", opacity: 0.9, lineHeight: 1.5 }}>
                                {summary.description?.trim() ? summary.description : "—"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div style={col}>
                {/* Ranking */}
                <div style={card}>
                    <div style={cardHead}>
                        <div style={cardTitle}>Overall ranking</div>
                    </div>

                    <div style={{ ...body, ...sectionGap }}>
                        {summary.rankingAfter.map((r) => (
                            <div key={r.playerId} style={rankRow}>
                                <div style={{ ...badge, width: 44, textAlign: "center", background: "rgba(255,255,255,0.05)" }}>
                                    {r.position}
                                </div>

                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 1000, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {r.playerName}
                                    </div>
                                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                                        games: <b>{r.gamesPlayed}</b> • wins: <b>{r.wins}</b>
                                    </div>
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 11, opacity: 0.7 }}>roots</div>
                                    <div style={{ fontWeight: 1000, fontVariantNumeric: "tabular-nums" }}>{r.totalRoots}</div>
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 11, opacity: 0.7 }}>points</div>
                                    <div style={{ fontWeight: 1000, fontVariantNumeric: "tabular-nums" }}>{r.totalPoints}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Landmarks */}
                <div style={card}>
                    <div style={cardHead}>
                        <div style={cardTitle}>Landmarks</div>
                        <span style={badge}>{(summary.landmarks ?? []).length || "—"}</span>
                    </div>

                    <div style={body}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {(summary.landmarks ?? []).length === 0 ? (
                                <span style={badge}>—</span>
                            ) : (
                                summary.landmarks.map((l) => (
                                    <Tooltip
                                        key={l.id}
                                        placement="bottom"
                                        content={lmTooltipContent(l.id as LandmarkId)}
                                    >
                                        <span style={{ ...badgeStrong("#10b981"), cursor: "help" }}>
                                            🏷️ {lmLabel(l.id)}
                                        </span>
                                    </Tooltip>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
