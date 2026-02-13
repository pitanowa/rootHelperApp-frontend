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
  maxWidth = 360,
  disabled,
  offset = 10,
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
      } as const,
      bubble: {
        position: 'fixed' as const,
        zIndex: 2147483647,
        maxWidth,
        padding: '10px 12px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.14)',
        background:
          'linear-gradient(180deg, rgba(18,18,22,0.98), rgba(10,10,12,0.98))',
        color: 'rgba(255,255,255,0.94)',
        boxShadow:
          '0 18px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)',
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: 0.15,
        lineHeight: 1.35,
        pointerEvents: 'none' as const, // tooltip nie “kradnie” hovera
        transform: 'translateZ(0)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        whiteSpace: 'normal' as const,
        wordBreak: 'break-word' as const,
      } as const,
      title: {
        fontSize: 12,
        fontWeight: 1000,
        opacity: 0.8,
        marginBottom: 6,
        letterSpacing: 0.25,
        textTransform: 'uppercase' as const,
      } as const,
      desc: {
        fontSize: 13,
        fontWeight: 850,
        opacity: 0.96,
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

    // najpierw ustawimy “w przybliżeniu”, potem dopniemy clampem do ekranu
    let top = placement === 'top' ? yTop - offset : yBottom + offset
    let left = centerX

    // clamp (żeby nie wyjechać za ekran)
    const margin = 10
    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    // left jest środkiem, więc ograniczamy tak, aby bubble się mieścił
    const half = maxWidth / 2
    left = Math.max(margin + half, Math.min(viewportW - margin - half, left))

    // top też clampujemy (prosto)
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
        tabIndex={0} // focusable (klawiatura)
        aria-describedby="tooltip"
      >
        {children}
      </span>
      {bubble}
    </>
  )
}
