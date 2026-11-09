import { DURATIONS } from '../data'
import { checkoutLabel, FULL_DAY_HOURS, fullDayStay, OVERNIGHT_CHECKOUT, stayHours } from '../utils'

export function DurationSelect({
  time,
  duration,
  overnight,
  onChange,
}: {
  time: string
  duration: number
  overnight: boolean
  onChange: (next: { duration: number; checkoutTime: string; overnight: boolean }) => void
}) {
  const fullDay = !overnight && duration === FULL_DAY_HOURS
  const hours = overnight || fullDay || DURATIONS.includes(duration) ? DURATIONS : [duration, ...DURATIONS]
  return (
    <select
      aria-label="Thời lượng"
      value={overnight ? 'overnight' : fullDay ? 'full' : String(duration)}
      onChange={(event) => {
        const value = event.target.value
        if (value === 'full') {
          onChange(fullDayStay(time))
          return
        }
        if (value === 'overnight') {
          onChange({
            overnight: true,
            checkoutTime: OVERNIGHT_CHECKOUT,
            duration: stayHours(time, OVERNIGHT_CHECKOUT),
          })
          return
        }
        const next = Number(value)
        onChange({ overnight: false, duration: next, checkoutTime: checkoutLabel(time, next).time })
      }}
    >
      {hours.map((item) => (
        <option key={item} value={item}>
          {item} giờ
        </option>
      ))}
      <option value="full">Full 24 tiếng</option>
      <option value="overnight">Qua đêm</option>
    </select>
  )
}
