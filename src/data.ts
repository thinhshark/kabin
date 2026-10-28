import { asset, formatMoney, shiftISO, slotPrice, todayISO } from './utils'

export type Amenity =
  | 'Máy chiếu'
  | 'Bồn tắm'
  | 'Chỗ để oto'
  | 'Thang máy'
  | 'Mini mart'
  | 'View hồ'
  | 'Ban công'
  | 'Boardgame'
  | 'Playstation'

export type Location = {
  id: string
  name: string
  district: string
  city: string
  distance: number
  amenities: Amenity[]
  blurb: string
  description: string
  cover: string
  photos: string[]
}

export type Room = {
  id: string
  locationId: string
  number: string
  type: 'Cozy' | 'Cinema' | 'Relax'
  amenities: Amenity[]
  price3h: number
  available: boolean
  description: string
  photos: string[]
}

export type Promo = {
  code: string
  title: string
  kind: 'percent' | 'amount'
  value: number
  cap?: number
  min: number
  locationId?: string
  until: string
}

export type Faq = {
  id: string
  topic: 'Đặt phòng' | 'Thanh toán' | 'Nhận phòng' | 'Tài khoản'
  q: string
  a: string
}

export type PolicyBlock = {
  title: string
  body?: string
  highlight?: string
  bullets?: string[]
}

export type Policy = {
  id: string
  title: string
  blocks: PolicyBlock[]
}

export type BookingStatus = 'upcoming' | 'active' | 'done' | 'expired' | 'pending'

export type Booking = {
  id: string
  code: string
  locationId: string
  roomId: string
  date: string
  time: string
  duration: number
  price: number
  discount: number
  guestName: string
  phone: string
  email: string
  status: BookingStatus
  gateCode: string
  roomCode: string
  paymentRef: string
}

export const PHOTOS = {
  hero: asset('/photos/hero.jpg'),
  cozy: asset('/photos/cozy.jpg'),
  cinema: asset('/photos/cinema.jpg'),
  relax: asset('/photos/relax.jpg'),
  bath: asset('/photos/bath.jpg'),
  corner: asset('/photos/corner.jpg'),
  entrance: asset('/photos/entrance.jpg'),
  keypad: asset('/photos/keypad.jpg'),
  door: asset('/photos/door.jpg'),
  exterior: asset('/photos/exterior.jpg'),
  gateLock: asset('/photos/gate-lock.jpg'),
  roomLock: asset('/photos/room-lock.jpg'),
  promo: asset('/photos/promo.jpg'),
}

export const TIMES = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
export const DURATIONS = [2, 3, 4, 5, 6]
export const DISTRICTS = ['Cầu Giấy', 'Tây Hồ', 'Ba Đình', 'Đống Đa']
export const FILTER_AMENITIES: Amenity[] = [
  'Máy chiếu',
  'Bồn tắm',
  'Chỗ để oto',
  'Thang máy',
  'Mini mart',
  'View hồ',
  'Ban công',
  'Boardgame',
  'Playstation',
]

export const DEMO_PHONE = '0912345678'

export const LOCATIONS: Location[] = [
  {
    id: 'cau-giay',
    name: 'Kabin Cầu Giấy',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    distance: 2.2,
    amenities: ['Máy chiếu', 'Thang máy', 'Mini mart', 'Boardgame'],
    blurb: 'Một khoảng riêng giữa lòng Hà Nội',
    description:
      'Không gian ấm cúng, đầy đủ tiện nghi để nghỉ ngơi, xem phim và tận hưởng thời gian của bạn.',
    cover: PHOTOS.cozy,
    photos: [PHOTOS.cozy, PHOTOS.cinema, PHOTOS.bath],
  },
  {
    id: 'tay-ho',
    name: 'Kabin Tây Hồ',
    district: 'Tây Hồ',
    city: 'Hà Nội',
    distance: 3.8,
    amenities: ['Bồn tắm', 'View hồ', 'Ban công', 'Playstation'],
    blurb: 'Đóng cửa lại là một khoảng nghỉ cạnh hồ',
    description:
      'Phòng rộng, ánh đèn ấm và bồn tắm cho những khung giờ cần chậm lại. Tự nhận phòng, không cần quầy lễ tân.',
    cover: PHOTOS.relax,
    photos: [PHOTOS.relax, PHOTOS.bath, PHOTOS.corner],
  },
  {
    id: 'ba-dinh',
    name: 'Kabin Ba Đình',
    district: 'Ba Đình',
    city: 'Hà Nội',
    distance: 4.6,
    amenities: ['Máy chiếu', 'Thang máy', 'Chỗ để oto', 'Playstation'],
    blurb: 'Yên giữa phố cũ',
    description:
      'Một căn phòng đủ ánh sáng và máy chiếu cho giấc ngắn hoặc một buổi tối riêng. Vào cửa bằng mã sau khi thanh toán.',
    cover: PHOTOS.cinema,
    photos: [PHOTOS.cinema, PHOTOS.cozy, PHOTOS.corner],
  },
  {
    id: 'dong-da',
    name: 'Kabin Đống Đa',
    district: 'Đống Đa',
    city: 'Hà Nội',
    distance: 5.1,
    amenities: ['Chỗ để oto', 'Mini mart', 'Ban công', 'Boardgame'],
    blurb: 'Gần trung tâm, có chỗ để xe',
    description:
      'Phù hợp nếu bạn cần nghỉ vài giờ giữa ngày. Có chỗ để xe và mã cửa gửi ngay khi booking được xác nhận.',
    cover: PHOTOS.corner,
    photos: [PHOTOS.corner, PHOTOS.cozy, PHOTOS.bath],
  },
]

export const ROOMS: Room[] = [
  {
    id: 'r201',
    locationId: 'cau-giay',
    number: '201',
    type: 'Cozy',
    amenities: [],
    price3h: 199000,
    available: true,
    description:
      'Không gian được thiết kế ấm áp với tông gỗ và ánh sáng dịu nhẹ, mang đến cảm giác thoải mái và riêng tư cho những khoảng nghỉ ngơi ngắn.',
    photos: [PHOTOS.cozy, PHOTOS.corner, PHOTOS.bath],
  },
  {
    id: 'r202',
    locationId: 'cau-giay',
    number: '202',
    type: 'Cinema',
    amenities: ['Máy chiếu'],
    price3h: 249000,
    available: true,
    description: 'Màn chiếu lớn, rèm dày và giường đôi cho một buổi xem phim không phải ra khỏi phòng.',
    photos: [PHOTOS.cinema, PHOTOS.cozy, PHOTOS.bath],
  },
  {
    id: 'r203',
    locationId: 'cau-giay',
    number: '203',
    type: 'Cozy',
    amenities: [],
    price3h: 199000,
    available: false,
    description: 'Phòng Cozy cùng tầng, hiện đã có khách trong khung giờ đang chọn.',
    photos: [PHOTOS.corner, PHOTOS.cozy, PHOTOS.bath],
  },
  {
    id: 'r301',
    locationId: 'tay-ho',
    number: '301',
    type: 'Relax',
    amenities: ['Bồn tắm'],
    price3h: 299000,
    available: true,
    description: 'Bồn tắm, ánh đèn ấm và khoảng giường rộng cho những giờ cần thả lỏng.',
    photos: [PHOTOS.relax, PHOTOS.bath, PHOTOS.corner],
  },
  {
    id: 'r302',
    locationId: 'tay-ho',
    number: '302',
    type: 'Cozy',
    amenities: [],
    price3h: 249000,
    available: true,
    description: 'Phòng nhỏ, yên, nhìn về phía hồ. Phù hợp nghỉ trưa hoặc tối ngắn.',
    photos: [PHOTOS.cozy, PHOTOS.corner, PHOTOS.bath],
  },
  {
    id: 'r101',
    locationId: 'ba-dinh',
    number: '101',
    type: 'Cozy',
    amenities: [],
    price3h: 229000,
    available: true,
    description: 'Phòng ấm, cách phố một lớp rèm. Tự nhận phòng bằng mã cổng và mã cửa.',
    photos: [PHOTOS.cozy, PHOTOS.bath, PHOTOS.corner],
  },
  {
    id: 'r102',
    locationId: 'ba-dinh',
    number: '102',
    type: 'Cinema',
    amenities: ['Máy chiếu'],
    price3h: 259000,
    available: true,
    description: 'Máy chiếu và âm thanh trong phòng, phù hợp một buổi tối riêng.',
    photos: [PHOTOS.cinema, PHOTOS.cozy, PHOTOS.corner],
  },
  {
    id: 'r401',
    locationId: 'dong-da',
    number: '401',
    type: 'Cozy',
    amenities: ['Chỗ để oto'],
    price3h: 199000,
    available: true,
    description: 'Phòng gọn, có chỗ để xe tại cơ sở. Nhận và trả phòng bằng mã, không cần lễ tân.',
    photos: [PHOTOS.corner, PHOTOS.cozy, PHOTOS.bath],
  },
  {
    id: 'r402',
    locationId: 'dong-da',
    number: '402',
    type: 'Cozy',
    amenities: [],
    price3h: 199000,
    available: true,
    description: 'Cùng mức giá Cozy, đủ tiện ích của cơ sở.',
    photos: [PHOTOS.cozy, PHOTOS.bath, PHOTOS.corner],
  },
]

export function roomAmenities(room: Room): Amenity[] {
  const place = LOCATIONS.find((item) => item.id === room.locationId)
  return [...new Set([...(place?.amenities ?? []), ...room.amenities])]
}

export const ROOM_TYPES: Array<{ type: Room['type']; priceFrom: number; amenities: string; photo: string }> = [
  { type: 'Cozy', priceFrom: 199000, amenities: '', photo: PHOTOS.cozy },
  { type: 'Cinema', priceFrom: 249000, amenities: 'Máy chiếu', photo: PHOTOS.cinema },
  { type: 'Relax', priceFrom: 299000, amenities: 'Bồn tắm', photo: PHOTOS.relax },
]

export const PROMOS: Promo[] = [
  {
    code: 'KABIN10',
    title: 'Chào bạn đến Kabin',
    kind: 'percent',
    value: 10,
    cap: 30000,
    min: 199000,
    locationId: 'cau-giay',
    until: shiftISO(15),
  },
  {
    code: 'NGHITHU',
    title: 'Một khoảng nghỉ dễ chịu',
    kind: 'amount',
    value: 30000,
    min: 249000,
    locationId: 'cau-giay',
    until: shiftISO(15),
  },
  {
    code: 'CHAOKABIN',
    title: 'Cảm ơn bạn đã đồng hành',
    kind: 'amount',
    value: 20000,
    min: 299000,
    locationId: 'cau-giay',
    until: shiftISO(-1),
  },
]

export const FAQS: Faq[] = [
  {
    id: 'hold',
    topic: 'Thanh toán',
    q: 'Phòng được giữ trong bao lâu?',
    a: 'Phòng được giữ 5 phút kể từ khi tạo yêu cầu thanh toán. Hết 5 phút chưa nhận tiền, phòng được mở lại cho khách khác.',
  },
  {
    id: 'code',
    topic: 'Nhận phòng',
    q: 'Tôi nhận mã mở cửa ở đâu?',
    a: 'Sau khi booking được xác nhận, mã cổng và mã phòng hiện trên vé. Khách đặt qua web nhận thêm thông tin qua SMS và email.',
  },
  {
    id: 'account',
    topic: 'Tài khoản',
    q: 'Tôi có cần tài khoản để đặt phòng không?',
    a: 'Không. Bạn có thể đặt trên web bằng số điện thoại và email. Tài khoản giúp xem lại vé, ưu đãi và lịch sử ở một nơi.',
  },
  {
    id: 'late',
    topic: 'Thanh toán',
    q: 'Tôi đã chuyển khoản nhưng booking chưa xác nhận?',
    a: 'Nếu tiền đến sau thời gian giữ phòng, Kabin chuyển yêu cầu cho bộ phận hỗ trợ. Bạn có thể được đổi phòng, đổi giờ hoặc hoàn tiền sau khi đối soát.',
  },
  {
    id: 'door',
    topic: 'Nhận phòng',
    q: 'Tôi không mở được cửa, cần làm gì?',
    a: 'Kiểm tra đúng mã cổng và mã phòng, gồm cả dấu #. Nếu vẫn không vào được, bấm liên hệ hỗ trợ và đọc mã đặt phòng.',
  },
  {
    id: 'otp',
    topic: 'Đặt phòng',
    q: 'Vì sao cần mã OTP?',
    a: 'OTP xác nhận số điện thoại để gửi mã cửa và để bạn tra cứu vé khi không đăng nhập.',
  },
  {
    id: 'change',
    topic: 'Đặt phòng',
    q: 'Tôi muốn đổi giờ hoặc hủy thì làm thế nào?',
    a: 'Trong thời gian giữ phòng bạn có thể đặt lại. Sau khi đã thanh toán, hãy gửi yêu cầu hỗ trợ để được kiểm tra đổi lịch hoặc hoàn tiền.',
  },
]

export const POLICIES: Policy[] = [
  {
    id: 'dat-phong',
    title: 'Đặt phòng & thanh toán',
    blocks: [
      {
        title: 'Thông tin đặt phòng',
        body: 'Khách đặt qua app cần đăng nhập. Khách đặt qua web xác thực số điện thoại bằng OTP và cung cấp email.',
      },
      {
        title: 'Giữ phòng và xác nhận',
        highlight: 'Phòng được giữ 5 phút khi tạo yêu cầu thanh toán.',
        bullets: ['Nhận tiền đúng hạn: booking tự xác nhận.', 'Hết hạn chưa nhận tiền: phòng được mở lại.'],
      },
      {
        title: 'Thanh toán đến muộn',
        body: 'CSKH liên hệ để kiểm tra và hỗ trợ đặt lại, đổi phòng, đổi giờ hoặc hoàn tiền sau khi trao đổi với khách.',
      },
      {
        title: 'Nhận thông tin vào phòng',
        body: 'Mã cổng và mã phòng được gửi sau khi booking được xác nhận. Khách dùng app xem trên vé; khách đặt qua web nhận SMS và email.',
      },
    ],
  },
  {
    id: 'nhan-tra',
    title: 'Nhận và trả phòng',
    blocks: [
      {
        title: 'Tự nhận phòng',
        bullets: [
          'Đến đúng cơ sở trên vé.',
          'Nhập mã cổng tại bàn phím khóa sảnh.',
          'Nhập mã phòng tại cửa phòng đã đặt.',
        ],
      },
      {
        title: 'Trả phòng',
        body: 'Rời phòng đúng giờ trên vé. Khóa cửa khi ra về. Không cần trả chìa khóa.',
      },
    ],
  },
  {
    id: 'doi-huy',
    title: 'Hủy, đổi lịch & hoàn tiền',
    blocks: [
      {
        title: 'Trước khi thanh toán',
        body: 'Bạn có thể rời luồng đặt phòng. Hết 5 phút giữ chỗ, phòng tự mở lại và không phát sinh phí.',
      },
      {
        title: 'Sau khi đã nhận tiền',
        body: 'Đổi giờ, đổi phòng hoặc hoàn tiền được hỗ trợ xem xét từng trường hợp. Gửi yêu cầu kèm mã đặt phòng.',
      },
    ],
  },
  {
    id: 'rieng-tu',
    title: 'Quyền riêng tư',
    blocks: [
      {
        title: 'Dữ liệu Kabin giữ',
        body: 'Họ tên, số điện thoại, email và thông tin đặt phòng dùng để xác nhận booking, gửi mã cửa và hỗ trợ khi cần.',
      },
      {
        title: 'Mã cửa',
        body: 'Mã cổng và mã phòng chỉ hiển thị với khách của booking đã xác nhận. Hết thời gian sử dụng, mã không còn hiệu lực.',
      },
    ],
  },
  {
    id: 'dieu-khoan',
    title: 'Điều khoản sử dụng',
    blocks: [
      {
        title: 'Sử dụng phòng',
        body: 'Phòng dành cho nghỉ ngơi trong thời gian đã đặt. Vui lòng giữ yên tĩnh và để lại phòng gọn khi trả.',
      },
      {
        title: 'Nội dung minh họa',
        body: 'Giá, ảnh, thông tin ngân hàng và mã cửa trên bản giao diện này là dữ liệu minh họa để duyệt sản phẩm.',
      },
    ],
  },
]

export function getLocation(id: string) {
  return LOCATIONS.find((item) => item.id === id)
}

export function getRoom(id: string) {
  return ROOMS.find((item) => item.id === id)
}

export function roomsAt(locationId: string) {
  return ROOMS.filter((item) => item.locationId === locationId)
}

export function priceFrom(locationId: string) {
  const list = roomsAt(locationId).map((room) => room.price3h)
  return Math.min(...list)
}

export function isPromoExpired(promo: Promo) {
  return promo.until < todayISO()
}

export function promoValueLabel(promo: Promo) {
  if (promo.kind === 'percent') return `${promo.value}%`
  return formatMoney(promo.value)
}

export function applyPromo(code: string, price: number, locationId: string) {
  const normalized = code.trim().toUpperCase()
  if (!normalized) return { amount: 0, message: '', ok: true }
  const promo = PROMOS.find((item) => item.code === normalized)
  if (!promo) return { amount: 0, message: 'Không tìm thấy mã này.', ok: false }
  if (isPromoExpired(promo)) return { amount: 0, message: 'Mã đã hết hạn.', ok: false }
  if (promo.locationId && promo.locationId !== locationId) {
    const location = getLocation(promo.locationId)
    return { amount: 0, message: `Mã chỉ dùng tại ${location?.name ?? 'một cơ sở'}.`, ok: false }
  }
  if (price < promo.min) {
    return { amount: 0, message: `Áp dụng cho booking từ ${formatMoney(promo.min)}.`, ok: false }
  }
  const raw = promo.kind === 'percent' ? Math.round((price * promo.value) / 100) : promo.value
  const amount = Math.min(promo.cap ?? raw, raw)
  return { amount, message: 'Đã áp dụng mã ưu đãi.', ok: true }
}

export function quoteOf(roomId: string, duration: number, promoCode: string) {
  const room = getRoom(roomId)
  if (!room) return null
  const location = getLocation(room.locationId)
  if (!location) return null
  const base = slotPrice(room.price3h, duration)
  const promo = applyPromo(promoCode, base, room.locationId)
  return {
    room,
    location,
    base,
    discount: promo.ok ? promo.amount : 0,
    total: Math.max(0, base - (promo.ok ? promo.amount : 0)),
    promo,
  }
}

export function displayStatus(booking: Booking, now = new Date()): BookingStatus {
  if (booking.status !== 'upcoming') return booking.status
  const start = new Date(`${booking.date}T${booking.time}:00`)
  const end = new Date(start.getTime() + booking.duration * 3600000)
  if (now >= start && now < end) return 'active'
  if (now >= end) return 'done'
  return 'upcoming'
}

export function statusLabel(status: BookingStatus) {
  switch (status) {
    case 'upcoming':
      return 'Sắp tới'
    case 'active':
      return 'Đang sử dụng'
    case 'done':
      return 'Đã hoàn tất'
    case 'expired':
      return 'Hết hạn'
    case 'pending':
      return 'Đang xử lý'
  }
}

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'b-upcoming',
    code: 'KB-261016-0124',
    locationId: 'cau-giay',
    roomId: 'r201',
    date: todayISO(),
    time: '14:00',
    duration: 3,
    price: 199000,
    discount: 0,
    guestName: 'Nguyễn Minh Anh',
    phone: DEMO_PHONE,
    email: 'minhanh@example.com',
    status: 'upcoming',
    gateCode: '246810#',
    roomCode: '731942#',
    paymentRef: 'KABIN8K2M',
  },
  {
    id: 'b-done',
    code: 'KB-261012-0086',
    locationId: 'cau-giay',
    roomId: 'r202',
    date: shiftISO(-4),
    time: '18:00',
    duration: 3,
    price: 249000,
    discount: 0,
    guestName: 'Nguyễn Minh Anh',
    phone: DEMO_PHONE,
    email: 'minhanh@example.com',
    status: 'done',
    gateCode: '135790#',
    roomCode: '246801#',
    paymentRef: 'KABIN4N7Q',
  },
  {
    id: 'b-expired',
    code: 'KB-261015-0108',
    locationId: 'cau-giay',
    roomId: 'r203',
    date: shiftISO(-1),
    time: '20:00',
    duration: 3,
    price: 199000,
    discount: 0,
    guestName: 'Nguyễn Minh Anh',
    phone: DEMO_PHONE,
    email: 'minhanh@example.com',
    status: 'expired',
    gateCode: '',
    roomCode: '',
    paymentRef: 'KABIN9P2L',
  },
]

export const DEMO_USER = {
  name: 'Nguyễn Minh Anh',
  phone: DEMO_PHONE,
  email: 'minhanh@example.com',
  promoNotify: false,
  savedPromos: ['KABIN10', 'NGHITHU'],
}
