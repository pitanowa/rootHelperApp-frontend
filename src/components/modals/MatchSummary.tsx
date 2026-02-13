import React, { useEffect, useRef } from "react";

type Variant = "default" | "war";

export function MatchSummaryModal({
  open,
  loading,
  saving,
  title,
  subtitle,
  accentHex = "#dc2626",
  variant = "war",
  backgroundUrl,
  backgroundCss,

  onClose,
  onSave,
  hideSave,
  children,
}: {
  open: boolean;
  loading?: boolean;
  saving?: boolean;
  title: string;
  subtitle?: string;
  accentHex?: string;
  variant?: Variant;

  backgroundUrl?: string;
  backgroundCss?: string;

  onClose: () => void;
  onSave?: () => void;
  hideSave?: boolean;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => cardRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const mix = (hex: string, a: number) => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const num = parseInt(full, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // =========================
  // WAR THEME (brutal)
  // =========================
  const isWar = variant === "war";
  const blood = accentHex || "#dc2626";

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 2147483647,
    padding: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: isWar
      ? [
        `radial-gradient(1200px 900px at 18% 8%, ${mix(blood, 0.22)}, transparent 60%)`,
        `radial-gradient(900px 680px at 82% 18%, rgba(220,38,38,0.18), transparent 58%)`,
        `radial-gradient(700px 520px at 50% 95%, rgba(0,0,0,0.75), transparent 60%)`,
        `linear-gradient(180deg, rgba(0,0,0,0.86), rgba(0,0,0,0.92))`,
      ].join(",")
      : `rgba(0,0,0,0.78)`,
    backdropFilter: "blur(7px) saturate(120%)",
  };

  const card: React.CSSProperties = {
    width: "min(1100px, 100%)",
    maxHeight: "min(92vh, 980px)",
    borderRadius: 28,
    border: isWar ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(255,255,255,0.12)",
    background: isWar
      ? [
        `radial-gradient(1000px 520px at 12% 0%, ${mix(blood, 0.18)}, transparent 60%)`,
        `radial-gradient(700px 420px at 92% 10%, ${mix(blood, 0.10)}, transparent 60%)`,
        `linear-gradient(180deg, rgba(10,10,12,0.98), rgba(6,6,7,0.98))`,
      ].join(",")
      : [
        `radial-gradient(1000px 520px at 15% 0%, ${mix(blood, 0.18)}, transparent 60%)`,
        `linear-gradient(180deg, rgba(18,18,26,0.98), rgba(10,10,12,0.98))`,
      ].join(","),
    boxShadow: isWar
      ? [
        `0 65px 210px rgba(0,0,0,0.85)`,
        `0 0 140px ${mix(blood, 0.20)}`,
        `0 0 80px rgba(220,38,38,0.12)`,
        `0 0 0 1px rgba(255,255,255,0.03) inset`,
      ].join(", ")
      : [
        `0 55px 180px rgba(0,0,0,0.78)`,
        `0 0 120px ${mix(blood, 0.22)}`,
        `0 0 70px rgba(220,38,38,0.10)`,
      ].join(", "),
    overflow: "hidden",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    color: "#ffffff",
  };

  // ✅ background layer INSIDE the card
  // - This gives "battlefield" texture behind content, but still readable.
  const cardBgLayer: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: isWar ? 1 : 0.7,
    background:
      backgroundCss ??
      (backgroundUrl
        ? `linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.86)), url(${backgroundUrl})`
        : [
          // default brutal texture (no image needed)
          `radial-gradient(900px 520px at 20% 15%, rgba(220,38,38,0.12), transparent 62%)`,
          `radial-gradient(700px 420px at 80% 20%, rgba(220,38,38,0.08), transparent 60%)`,
          `radial-gradient(1200px 900px at 50% 120%, rgba(0,0,0,0.85), transparent 55%)`,
          `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
        ].join(",")),
    backgroundSize: backgroundUrl ? "cover" : undefined,
    backgroundPosition: backgroundUrl ? "center" : undefined,
    filter: isWar ? "contrast(1.08) saturate(1.05)" : "none",
  };

  // subtle “grain” overlay
  const grainLayer: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: isWar ? 0.18 : 0.10,
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)",
    mixBlendMode: "overlay",
  };

  const header: React.CSSProperties = {
    padding: 16,
    borderBottom: isWar ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.10)",
    background: isWar
      ? [
        `linear-gradient(180deg, rgba(18,8,10,1), rgba(10,10,12,1))`,
        `radial-gradient(900px 240px at 20% 0%, ${mix(blood, 0.24)}, transparent 60%)`,
      ].join(",")
      : `linear-gradient(180deg, rgba(22,22,32,1), rgba(14,14,18,1))`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    position: "relative",
    zIndex: 2,
  };

  const titleWrap: React.CSSProperties = {
    minWidth: 0,
    display: "grid",
    gap: 4,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 1000,
    letterSpacing: -0.2,
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const pill: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 1000,
    letterSpacing: 0.4,
    padding: "7px 11px",
    borderRadius: 999,
    border: isWar ? `1px solid ${mix(blood, 0.28)}` : `1px solid ${mix(blood, 0.25)}`,
    background: isWar
      ? `linear-gradient(135deg, ${mix(blood, 0.26)}, rgba(255,255,255,0.03))`
      : `linear-gradient(135deg, ${mix(blood, 0.18)}, rgba(255,255,255,0.04))`,
    color: "rgba(255,255,255,0.92)",
    boxShadow: isWar ? `0 18px 50px ${mix(blood, 0.14)}` : `0 14px 36px ${mix(blood, 0.12)}`,
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  };

  const sub: React.CSSProperties = {
    fontSize: 12,
    opacity: 0.80,
    fontWeight: 900,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "rgba(255,255,255,0.78)",
  };

  const body: React.CSSProperties = {
    padding: 16,
    overflow: "auto",
    position: "relative",
    zIndex: 2,
  };

  const footer: React.CSSProperties = {
    padding: 14,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background: isWar
      ? [
        `linear-gradient(180deg, rgba(8,8,10,1), rgba(6,6,7,1))`,
        `radial-gradient(1000px 200px at 50% 0%, ${mix(blood, 0.14)}, transparent 60%)`,
      ].join(",")
      : "linear-gradient(180deg, rgba(14,14,18,1), rgba(10,10,12,1))",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    position: "relative",
    zIndex: 2,
  };

  const btnBase = (variantBtn: "ghost" | "primary" | "danger", disabled?: boolean): React.CSSProperties => {
    const isPrimary = variantBtn === "primary";
    const isDanger = variantBtn === "danger";

    const border = isDanger
      ? "1px solid rgba(248,113,113,0.35)"
      : isPrimary
        ? `1px solid ${mix(blood, 0.40)}`
        : "1px solid rgba(255,255,255,0.14)";

    const background = isDanger
      ? "linear-gradient(135deg, rgba(220,38,38,0.92), rgba(90,10,10,0.92))"
      : isPrimary
        ? `linear-gradient(135deg, ${mix(blood, 0.95)}, rgba(190,18,60,0.80))`
        : "rgba(255,255,255,0.05)";

    const boxShadow = isDanger
      ? "0 18px 48px rgba(220,38,38,0.24)"
      : isPrimary
        ? `0 18px 48px ${mix(blood, 0.20)}`
        : "none";

    return {
      padding: "10px 12px",
      borderRadius: 14,
      border,
      background,
      color: "rgba(255,255,255,0.92)",
      fontWeight: 1000,
      letterSpacing: 0.3,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      userSelect: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      boxShadow,
      transition: "transform 120ms ease, filter 120ms ease, opacity 120ms ease",
      textTransform: isWar ? "uppercase" : undefined,
    };
  };

  return (
    <div
      style={overlay}
      onMouseDown={() => {
        if (!saving) onClose();
      }}
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        style={{ ...card, position: "relative" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ✅ Background inside modal */}
        <div style={cardBgLayer} />
        <div style={grainLayer} />

        <div style={header}>
          <div style={titleWrap}>
            <div style={titleStyle}>
              <span style={pill}>{isWar ? "☠️" : "🏁"} {title}</span>
              {subtitle ? <span style={sub}>{subtitle}</span> : null}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {loading ? (
                <span style={{ ...pill, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
                  Loading…
                </span>
              ) : null}
              {saving ? (
                <span style={{ ...pill, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
                  Saving…
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div style={body}>{children}</div>

        <div style={footer}>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              style={btnBase("ghost", !!saving)}
              disabled={!!saving}
              onClick={onClose}
              onMouseEnter={(e) => {
                if (saving) return;
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.filter = "none";
              }}
            >
              Back
            </button>

            {!hideSave && onSave ? (
              <button
                style={btnBase("primary", !!saving)}
                disabled={!!saving}
                onClick={onSave}
                onMouseEnter={(e) => {
                  if (saving) return;
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.filter = "brightness(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.filter = "none";
                }}
              >
                💾 Save & return
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
