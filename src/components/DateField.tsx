import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate, todayISO } from '../utils'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

function monthParts(iso: string) {
  const [year, month] = iso.split('-').map(Number)
  return { year, month }
}

function shiftMonth(iso: string, delta: number) {
  const { year, month } = monthParts(iso)
  const date = new Date(year, month - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function DateField({
  label,
  value,
  onChange,
  hideLabel = false,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  hideLabel?: boolean
}) {
  const today = todayISO()
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(value.slice(0, 7) || today.slice(0, 7))
  const rootRef = useRef<HTMLDivElement>(null)
  const { year, month } = monthParts(`${cursor}-01`)
  const first = new Date(year, month - 1, 1)
  const lead = (first.getDay() + 6) % 7
  const days = new Date(year, month, 0).getDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)]

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

  return (
    <div className="time-field" ref={rootRef}>
      {hideLabel ? null : <span className="control-label">{label}</span>}
      <button
        type="button"
        className="time-trigger"
        aria-label={hideLabel ? label : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setCursor((value < today ? today : value).slice(0, 7))
          setOpen((current) => !current)
        }}
      >
        {formatDate(value)}
      </button>
      {open ? (
        <div className="date-pop" role="dialog" aria-label={label}>
          <div className="date-nav">
            <button
              type="button"
              aria-label="Tháng trước"
              disabled={cursor <= today.slice(0, 7)}
              onClick={() => setCursor((current) => shiftMonth(current, -1))}
            >
              <ChevronLeft size={16} />
            </button>
            <strong>
              Tháng {month}, {year}
            </strong>
            <button type="button" aria-label="Tháng sau" onClick={() => setCursor((current) => shiftMonth(current, 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="date-grid">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
            {cells.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} />
              const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const past = iso < today
              return (
                <button
                  key={iso}
                  type="button"
                  className={iso === value ? 'on' : undefined}
                  disabled={past}
                  onClick={() => {
                    onChange(iso)
                    setOpen(false)
                  }}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
