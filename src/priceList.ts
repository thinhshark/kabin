export const RATE_BANDS = [
  { id: 'gold', label: 'Giờ vàng', note: 'T2–T6 trước 15h' },
  { id: 'regular', label: 'Giờ thường', note: 'T2–T6 từ 15h' },
  { id: 'weekend', label: 'Cuối tuần', note: 'T7–CN cả ngày' },
] as const

export type RateBand = (typeof RATE_BANDS)[number]['id']

const EXTRA_HOUR = 30_000

function hourlyRates(early: Record<RateBand, number[]>, cap: Record<RateBand, number>) {
  return Object.fromEntries(
    RATE_BANDS.map(({ id }) => {
      const list = [...early[id]]
      const base = list[list.length - 1]
      for (let hour = 9; hour <= 24; hour += 1) {
        list.push(Math.min(base + (hour - 8) * EXTRA_HOUR, cap[id]))
      }
      return [id, list]
    }),
  ) as Record<RateBand, number[]>
}

export const PRICE_ROOMS = [
  {
    id: 'lake',
    name: 'Phòng view hồ',
    hours: hourlyRates(
      {
        gold: [275_000, 325_000, 350_000, 389_000, 419_000, 435_000, 449_000],
        regular: [309_000, 359_000, 399_000, 429_000, 449_000, 469_000, 489_000],
        weekend: [329_000, 379_000, 419_000, 459_000, 499_000, 529_000, 549_000],
      },
      { gold: 890_000, regular: 940_000, weekend: 990_000 },
    ),
    overnight: { weekday: 419_000, weekend: 469_000 },
  },
  {
    id: 'bath',
    name: 'Phòng view hồ có bồn tắm',
    hours: hourlyRates(
      {
        gold: [305_000, 365_000, 400_000, 459_000, 489_000, 525_000, 549_000],
        regular: [339_000, 399_000, 449_000, 499_000, 519_000, 559_000, 589_000],
        weekend: [359_000, 419_000, 469_000, 529_000, 569_000, 619_000, 649_000],
      },
      { gold: 890_000, regular: 940_000, weekend: 990_000 },
    ),
    overnight: { weekday: 489_000, weekend: 569_000 },
  },
] as const

export const PRICE_HOURS = Array.from({ length: 23 }, (_, index) => index + 2)

export function listedFrom(kind: 'lake' | 'bath') {
  const room = PRICE_ROOMS.find((item) => item.id === kind) ?? PRICE_ROOMS[0]
  return room.hours.gold[1]
}

export function listedHourly(kind: 'lake' | 'bath', band: RateBand, hours: number) {
  const room = PRICE_ROOMS.find((item) => item.id === kind) ?? PRICE_ROOMS[0]
  const rounded = Math.min(24, Math.max(2, Math.round(hours)))
  return room.hours[band][rounded - 2]
}

export function listedOvernight(kind: 'lake' | 'bath', premiumNight: boolean) {
  const room = PRICE_ROOMS.find((item) => item.id === kind) ?? PRICE_ROOMS[0]
  return premiumNight ? room.overnight.weekend : room.overnight.weekday
}
