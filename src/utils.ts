export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function todayISO() {
  const d = new Date()
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return tz.toISOString().slice(0, 10)
}

export function shiftISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return tz.toISOString().slice(0, 10)
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ'
}

export function slotPrice(price3h: number, hours: number) {
  return Math.round((price3h / 3) * hours / 1000) * 1000
}

export function checkoutLabel(time: string, duration: number) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + duration * 60
  const mins = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const hh = String(Math.floor(mins / 60)).padStart(2, '0')
  const mm = String(mins % 60).padStart(2, '0')
  const nextDay = total >= 24 * 60
  return { time: `${hh}:${mm}`, nextDay, text: `${hh}:${mm}${nextDay ? ' hôm sau' : ''}` }
}

export function isPastSlot(date: string, time: string) {
  return new Date(`${date}T${time}:00`).getTime() < Date.now()
}

export function normalizePhone(input: string) {
  let d = input.replace(/\D/g, '')
  if (d.startsWith('84')) d = '0' + d.slice(2)
  if (d.length === 9) d = '0' + d
  return d
}

export function isPhone(input: string) {
  return /^0\d{9}$/.test(normalizePhone(input))
}

export function maskPhone(phone: string) {
  const d = normalizePhone(phone)
  if (d.length < 10) return phone
  return `${d.slice(0, 2)}•• ••• ${d.slice(-3)}`
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'K'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  const a = parts[parts.length - 2][0] ?? ''
  const b = parts[parts.length - 1][0] ?? ''
  return (a + b).toUpperCase()
}

export function mapsUrl(name: string, district: string) {
  const q = encodeURIComponent(`${name}, ${district}, Hà Nội`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}
