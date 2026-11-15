import { getLocation, getRoom, type Booking } from './data'
import { checkoutLabel, durationText, formatDate, formatMoney, maskPhone } from './utils'

export type TicketImageInput = {
  code: string
  locationName: string
  place: string
  roomLabel: string
  guestName: string
  phone: string
  dateLabel: string
  checkIn: string
  checkOut: string
  duration: string
  total: string
  doorCode?: string
}

export function ticketImageFromBooking(booking: Booking): TicketImageInput {
  const location = getLocation(booking.locationId)
  const room = getRoom(booking.roomId)
  const end = checkoutLabel(booking.time, booking.duration)
  return {
    code: booking.code,
    locationName: location?.name ?? 'Kabin',
    place: location ? `${location.district}, ${location.city}` : '',
    roomLabel: room ? `Phòng ${room.number} · ${room.type}` : 'Phòng',
    guestName: booking.guestName,
    phone: maskPhone(booking.phone),
    dateLabel: formatDate(booking.date),
    checkIn: booking.time,
    checkOut: end.text,
    duration: durationText(booking.duration),
    total: formatMoney(Math.max(0, booking.price - booking.discount)),
    doorCode: booking.gateCode || booking.roomCode,
  }
}

export async function downloadTicketImage(input: TicketImageInput) {
  await document.fonts.load('700 28px "Be Vietnam Pro"')
  await document.fonts.load('600 16px "Be Vietnam Pro"')
  const scale = 2
  const width = 720
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = 1600 * scale
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas')
  context.scale(scale, scale)
  context.clearRect(0, 0, width, 1600)
  const height = drawTicket(context, width, input)
  const cropped = document.createElement('canvas')
  cropped.width = width * scale
  cropped.height = Math.ceil(height * scale)
  const croppedContext = cropped.getContext('2d')
  if (!croppedContext) throw new Error('canvas')
  croppedContext.drawImage(canvas, 0, 0, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height)
  const blob = await new Promise<Blob | null>((resolve) => cropped.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('blob')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Kabin-${input.code}.png`
  link.click()
  URL.revokeObjectURL(url)
}

function drawTicket(context: CanvasRenderingContext2D, width: number, input: TicketImageInput) {
  const pad = 28
  context.fillStyle = '#c4624a'
  roundRect(context, 16, 16, width - 32, 108, 24)
  context.fill()
  context.fillRect(16, 80, width - 32, 44)
  context.fillStyle = '#fffdfb'
  context.font = '700 13px "Be Vietnam Pro", sans-serif'
  context.fillText('KABIN SELF CHECK-IN', pad + 8, 48)
  context.font = '700 32px "Be Vietnam Pro", sans-serif'
  context.fillText('Vé đặt phòng', pad + 8, 88)

  let y = 168
  context.fillStyle = '#746b63'
  context.font = '500 14px "Be Vietnam Pro", sans-serif'
  context.fillText('Mã đặt phòng', pad + 8, y)
  context.fillStyle = '#1c1612'
  context.font = '700 22px "Be Vietnam Pro", sans-serif'
  context.fillText(input.code, pad + 8, y + 36)
  y += 78

  const rows: [string, string][] = [
    ['Cơ sở', input.locationName],
    ['Địa điểm', input.place],
    ['Phòng', input.roomLabel],
    ['Khách', input.guestName],
    ['Số điện thoại', input.phone],
    ['Ngày', input.dateLabel],
    ['Nhận phòng', input.checkIn],
    ['Trả phòng', input.checkOut],
    ['Thời lượng', input.duration],
    ['Thanh toán', input.total],
  ]
  for (const [label, value] of rows) {
    y = drawRow(context, pad + 8, y, width - pad * 2 - 8, label, value)
  }

  y += 18
  if (input.doorCode) {
    y = drawCode(context, pad + 8, y, width - pad * 2 - 8, 'Mã cổng và phòng', input.doorCode)
    y += 22
  }

  context.fillStyle = '#c4624a'
  context.font = '700 15px "Be Vietnam Pro", sans-serif'
  context.fillText('Nội quy cần nhớ', pad + 8, y)
  y += 22
  const notes: { label: string; icon: 'paw' | 'two' | 'age' | 'smoke' }[] = [
    { label: 'Không thú cưng', icon: 'paw' },
    { label: 'Tối đa 2 người', icon: 'two' },
    { label: 'Khách trên 16 tuổi', icon: 'age' },
    { label: 'Cấm hút thuốc', icon: 'smoke' },
  ]
  const gap = 10
  const boxW = (width - pad * 2 - 8 - gap * 3) / 4
  const boxH = 118
  notes.forEach((note, index) => {
    const x = pad + 8 + index * (boxW + gap)
    roundRect(context, x, y, boxW, boxH, 14)
    context.fillStyle = '#fff7f4'
    context.fill()
    context.lineWidth = 2
    context.strokeStyle = '#c4624a'
    context.stroke()
    drawRuleIcon(context, x + boxW / 2, y + 36, note.icon)
    context.fillStyle = '#1c1612'
    context.font = '700 12px "Be Vietnam Pro", sans-serif'
    const lineWidth = context.measureText(note.label).width
    context.fillText(note.label, x + (boxW - lineWidth) / 2, y + 78)
  })
  y += boxH + 28
  context.fillStyle = '#746b63'
  context.font = '500 13px "Be Vietnam Pro", sans-serif'
  context.fillText('Một mã cho cổng và phòng, nhớ dấu #. Hotline 1800.2230', pad + 8, y)
  const end = y + 36
  context.globalCompositeOperation = 'destination-over'
  roundRect(context, 16, 16, width - 32, end - 32, 24)
  context.fillStyle = '#fffdfb'
  context.fill()
  context.fillStyle = '#f6f1ea'
  context.fillRect(0, 0, width, end)
  context.globalCompositeOperation = 'source-over'
  return end
}

function drawRow(context: CanvasRenderingContext2D, x: number, y: number, width: number, label: string, value: string) {
  const rowH = 52
  const baseline = y + 32
  context.fillStyle = '#746b63'
  context.font = '500 14px "Be Vietnam Pro", sans-serif'
  context.fillText(label, x, baseline)
  context.fillStyle = '#1c1612'
  context.font = '600 16px "Be Vietnam Pro", sans-serif'
  const valueWidth = context.measureText(value).width
  context.fillText(value, x + width - valueWidth, baseline)
  context.strokeStyle = '#e7dfd6'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(x, y + rowH)
  context.lineTo(x + width, y + rowH)
  context.stroke()
  return y + rowH
}

function drawCode(context: CanvasRenderingContext2D, x: number, y: number, width: number, label: string, value: string) {
  const height = 96
  roundRect(context, x, y, width, height, 16)
  context.fillStyle = '#fffdfb'
  context.fill()
  context.lineWidth = 1
  context.strokeStyle = '#e7dfd6'
  context.stroke()
  context.fillStyle = '#746b63'
  context.font = '500 14px "Be Vietnam Pro", sans-serif'
  context.fillText(label, x + 18, y + 34)
  context.fillStyle = '#c4624a'
  context.font = '700 30px "Be Vietnam Pro", sans-serif'
  context.fillText(value, x + 18, y + 72)
  return y + height
}

function drawRuleIcon(context: CanvasRenderingContext2D, cx: number, cy: number, icon: 'paw' | 'two' | 'age' | 'smoke') {
  if (icon === 'age') {
    context.beginPath()
    context.arc(cx, cy, 16, 0, Math.PI * 2)
    context.fillStyle = '#c4624a'
    context.fill()
    context.fillStyle = '#fffdfb'
    context.font = '700 13px "Be Vietnam Pro", sans-serif'
    const width = context.measureText('16+').width
    context.fillText('16+', cx - width / 2, cy + 5)
    return
  }
  context.save()
  context.translate(cx - 16, cy - 16)
  context.scale(32 / 24, 32 / 24)
  context.strokeStyle = '#c4624a'
  context.lineWidth = 2
  context.lineCap = 'round'
  context.lineJoin = 'round'
  if (icon === 'two') {
    context.stroke(new Path2D('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'))
    context.stroke(new Path2D('M16 3.128a4 4 0 0 1 0 7.744'))
    context.stroke(new Path2D('M22 21v-2a4 4 0 0 0-3-3.87'))
    context.beginPath()
    context.arc(9, 7, 4, 0, Math.PI * 2)
    context.stroke()
  } else if (icon === 'paw') {
    for (const [x, y] of [
      [11, 4],
      [18, 8],
      [20, 16],
    ] as const) {
      context.beginPath()
      context.arc(x, y, 2, 0, Math.PI * 2)
      context.stroke()
    }
    context.stroke(new Path2D('M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z'))
  } else {
    for (const path of [
      'M12 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h13',
      'M18 8c0-2.5-2-2.5-2-5',
      'M2 2l20 20',
      'M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-.5.866',
      'M22 8c0-2.5-2-2.5-2-5',
      'M7 12v4',
    ]) {
      context.stroke(new Path2D(path))
    }
  }
  context.restore()
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + width, y, x + width, y + height, radius)
  context.arcTo(x + width, y + height, x, y + height, radius)
  context.arcTo(x, y + height, x, y, radius)
  context.arcTo(x, y, x + width, y, radius)
  context.closePath()
}
