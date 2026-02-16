import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Placement = 'top' | 'bottom'

type TooltipProps = {
  content: ReactNode
  children: ReactNode
  placement?: Placement
  maxWidth?: number
  disabled?: boolean
  offset?: number
}

export default function Tooltip({
  content,
  children,
  placement = 'top',
  maxWidth = 380,
  disabled,
  offset = 12,
}: TooltipProps) {
  const anchorRef = useRef<HTMLSpanElement | null>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  const ui = useMemo(
    () => ({
      wrap: {
        display: 'inline-flex',
        alignItems: 'center',
        maxWidth: '100%',
        outline: 'none',
      } as const,

      bubble: {
        position: 'fixed' as const,
        zIndex: 2147483647,
        maxWidth,
        padding: '12px 14px',
        borderRadius: 14,

        // brutal frame
        border: '1px solid rgba(255,255,255,0.12)',

        // â€śblood & ashâ€ť background with scars
        background:
          'linear-gradient(180deg, rgba(12,10,12,0.98), rgba(8,8,10,0.98)),' +
          'repeating-linear-gradient(135deg, rgba(var(--app-accent-rgb),0.14) 0px, rgba(var(--app-accent-rgb),0.14) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 10px)',

        color: '#fff',
        boxShadow:
          '0 26px 80px rgba(0,0,0,0.75),' +
          '0 0 0 1px rgba(255,255,255,0.05) inset,' +
          '0 0 90px rgba(var(--app-accent-rgb),0.18), ' +
          '0 0 40px rgba(var(--app-accent-rgb),0.10)',

        fontSize: 13,
        fontWeight: 850,
        letterSpacing: 0.15,
        lineHeight: 1.35,

        pointerEvents: 'none' as const,
        transform: 'translateZ(0)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        whiteSpace: 'normal' as const,
        wordBreak: 'break-word' as const,

        // readable on any bg
        textShadow: '0 2px 12px rgba(0,0,0,0.85)',
      } as const,

      // pointer triangle
      arrow: (dir: Placement) =>
        ({
          position: 'absolute' as const,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          ...(dir === 'top'
            ? {
                bottom: -10,
                borderTop: '10px solid rgba(12,10,12,0.98)',
                filter: 'drop-shadow(0 -8px 16px rgba(var(--app-accent-rgb),0.18))',
              }
            : {
                top: -10,
                borderBottom: '10px solid rgba(12,10,12,0.98)',
                filter: 'drop-shadow(0 8px 16px rgba(var(--app-accent-rgb),0.18))',
              }),
        }) as const,

      // red â€śrim glowâ€ť overlay
      rim: {
        position: 'absolute' as const,
        inset: 0,
        borderRadius: 14,
        pointerEvents: 'none' as const,
        boxShadow:
          '0 0 0 1px rgba(var(--app-accent-rgb),0.22) inset, 0 0 34px rgba(var(--app-accent-rgb),0.10) inset',
        maskImage:
          'radial-gradient(120% 90% at 20% 0%, black 0%, black 60%, transparent 100%)',
      } as const,
    }),
    [maxWidth]
  )

  function compute() {
    const el = anchorRef.current
    if (!el) return
    const r = el.getBoundingClientRect()

    const centerX = r.left + r.width / 2
    const yTop = r.top
    const yBottom = r.bottom

    let top = placement === 'top' ? yTop - offset : yBottom + offset
    let left = centerX

    const margin = 10
    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    const half = maxWidth / 2
    left = Math.max(margin + half, Math.min(viewportW - margin - half, left))
    top = Math.max(margin, Math.min(viewportH - margin, top))

    setPos({ left, top })
  }

  useEffect(() => {
    if (!open) return
    compute()

    const onScroll = () => compute()
    const onResize = () => compute()

    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement, maxWidth, offset])

  const bubble =
    open && pos
      ? createPortal(
          <div
            style={{
              ...ui.bubble,
              left: pos.left,
              top: pos.top,
              transform:
                placement === 'top'
                  ? 'translate(-50%, -100%)'
                  : 'translate(-50%, 0)',
            }}
            role="tooltip"
          >
            <div style={ui.rim} aria-hidden />
            <div style={ui.arrow(placement)} aria-hidden />
            {content}
          </div>,
          document.body
        )
      : null

  if (disabled) return <>{children}</>

  return (
    <>
      <span
        ref={anchorRef}
        style={ui.wrap}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        tabIndex={0}
        aria-describedby="tooltip"
      >
        {children}
      </span>
      {bubble}
    </>
  )
}

