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

export type PriceKind = 'lake' | 'bench' | 'bath'

export const PRICE_ROOMS = [
  {
    id: 'lake',
    name: 'View hồ',
    hours: hourlyRates(
      {
        gold: [275_000, 325_000, 350_000, 389_000, 419_000, 435_000, 449_000],
        regular: [309_000, 359_000, 399_000, 429_000, 449_000, 469_000, 489_000],
        weekend: [329_000, 379_000, 419_000, 459_000, 499_000, 529_000, 549_000],
      },
      { gold: 890_000, regular: 940_000, weekend: 990_000 },
    ),
    overnight: { weekday: 419_000, weekend: 459_000 },
  },
  {
    id: 'bench',
    name: 'View hồ có băng ghế gỗ',
    hours: hourlyRates(
      {
        gold: [285_000, 340_000, 370_000, 414_000, 449_000, 470_000, 494_000],
        regular: [319_000, 374_000, 419_000, 454_000, 479_000, 504_000, 534_000],
        weekend: [339_000, 394_000, 439_000, 484_000, 529_000, 564_000, 594_000],
      },
      { gold: 890_000, regular: 940_000, weekend: 990_000 },
    ),
    overnight: { weekday: 435_000, weekend: 475_000 },
  },
  {
    id: 'bath',
    name: 'View hồ có bồn tắm',
    hours: hourlyRates(
      {
        gold: [305_000, 365_000, 400_000, 459_000, 489_000, 525_000, 549_000],
        regular: [339_000, 399_000, 449_000, 499_000, 519_000, 559_000, 589_000],
        weekend: [359_000, 419_000, 469_000, 529_000, 569_000, 619_000, 649_000],
      },
      { gold: 890_000, regular: 940_000, weekend: 990_000 },
    ),
    overnight: { weekday: 459_000, weekend: 499_000 },
  },
] as const

export const PRICE_HOURS = Array.from({ length: 23 }, (_, index) => index + 2)

export type ListedFrom = {
  price: number
  hours: number
  when: string
}

export function listedFromDetail(kind: PriceKind): ListedFrom {
  const room = PRICE_ROOMS.find((item) => item.id === kind) ?? PRICE_ROOMS[0]
  let best: ListedFrom = { price: Number.POSITIVE_INFINITY, hours: 2, when: RATE_BANDS[0].note }
  for (const band of RATE_BANDS) {
    room.hours[band.id].forEach((price, index) => {
      if (price < best.price) best = { price, hours: index + 2, when: band.note }
    })
  }
  const nights = [
    { price: room.overnight.weekday, when: 'Đêm Chủ nhật–Thứ năm' },
    { price: room.overnight.weekend, when: 'Đêm Thứ sáu, Thứ bảy và lễ, Tết' },
  ]
  for (const night of nights) {
    if (night.price < best.price) best = { price: night.price, hours: 0, when: night.when }
  }
  return best
}

export function listedFrom(kind: PriceKind) {
  return listedFromDetail(kind).price
}

export function fromPriceLabel(from: ListedFrom) {
  return from.hours > 0 ? `${from.hours} giờ, ${from.when}` : from.when
}

export function listedHourly(kind: PriceKind, band: RateBand, hours: number) {
  const room = PRICE_ROOMS.find((item) => item.id === kind) ?? PRICE_ROOMS[0]
  const rounded = Math.min(24, Math.max(2, Math.round(hours)))
  return room.hours[band][rounded - 2]
}

export function listedOvernight(kind: PriceKind, premiumNight: boolean) {
  const room = PRICE_ROOMS.find((item) => item.id === kind) ?? PRICE_ROOMS[0]
  return premiumNight ? room.overnight.weekend : room.overnight.weekday
}
