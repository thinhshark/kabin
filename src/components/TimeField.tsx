import { useEffect, useRef, useState } from 'react'

const HOURS = Array.from({ length: 25 }, (_, hour) => hour)
const MINUTES = [0, 15, 30, 45]

function formatClock(value: string) {
  const [hour = 0, minute = 0] = value.split(':').map(Number)
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function TimeField({
  label,
  value,
  onChange,
  align = 'start',
  hideLabel = false,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  align?: 'start' | 'end'
  hideLabel?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const [hour = 0, minute = 0] = value.split(':').map(Number)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open || !rootRef.current) return
    rootRef.current.querySelectorAll('.time-col').forEach((col) => {
      const selected = col.querySelector('.on')
      if (!(selected instanceof HTMLElement) || !(col instanceof HTMLElement)) return
      col.scrollTop = selected.offsetTop - col.clientHeight / 2 + selected.clientHeight / 2
    })
  }, [open])

  const pick = (nextHour: number, nextMinute: number) => {
    onChange(`${String(nextHour).padStart(2, '0')}:${String(nextHour === 24 ? 0 : nextMinute).padStart(2, '0')}`)
  }

  return (
    <div className="time-field" ref={rootRef}>
      {hideLabel ? null : <span className="control-label">{label}</span>}
      <button
        type="button"
        className="time-trigger"
        aria-label={hideLabel ? label : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {formatClock(value)}
      </button>
      {open ? (
        <div className={`time-pop ${align}`} role="dialog" aria-label={label}>
          <div className="time-col" aria-label="Giờ">
            <span>Giờ</span>
            {HOURS.map((item) => (
              <button key={item} type="button" className={item === hour ? 'on' : undefined} onClick={() => pick(item, minute)}>
                {item}
              </button>
            ))}
          </div>
          <div className="time-col" aria-label="Phút">
            <span>Phút</span>
            {MINUTES.map((item) => (
              <button
                key={item}
                type="button"
                className={item === (hour === 24 ? 0 : minute) ? 'on' : undefined}
                disabled={hour === 24 && item !== 0}
                onClick={() => pick(hour, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
