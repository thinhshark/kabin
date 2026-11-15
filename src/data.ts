import { asset, clockMinutes, formatMoney, shiftISO, todayISO } from './utils'
import { listedFrom, listedFromDetail, listedHourly, listedOvernight, type PriceKind, type RateBand } from './priceList'

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
  openingSoon?: boolean
}

export type Room = {
  id: string
  locationId: string
  number: string
  type: 'Classic' | 'Cozy' | 'Signature' | 'Cinema' | 'Relax'
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
  topic: 'Đặt phòng' | 'Hủy phòng' | 'Thanh toán' | 'Nhận phòng' | 'Tài khoản'
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

export type BookingStatus = 'upcoming' | 'active' | 'done' | 'expired' | 'pending' | 'cancelled'

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

function roomShots(folder: string, count: number) {
  return Array.from({ length: count }, (_, index) =>
    asset(`/photos/rooms/${folder}/${String(index + 1).padStart(2, '0')}.jpg`),
  )
}

export const CLASSIC_PHOTOS = roomShots('classic', 7)
export const COZY_PHOTOS = roomShots('cozy', 6)
export const SIGNATURE_PHOTOS = roomShots('signature', 6)

function gallery(photos: string[], shift = 0) {
  const start = shift % photos.length
  return [...photos.slice(start), ...photos.slice(0, start)]
}

export const TIMES = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
export const DURATIONS = [2, 3, 4, 5, 6]
export const DISTRICTS = ['Cầu Giấy', 'Tây Hồ', 'Ba Đình', 'Xã Đàn']
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
    openingSoon: true,
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
    openingSoon: true,
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
    openingSoon: true,
  },
  {
    id: 'dong-da',
    name: 'Kabin Xã Đàn',
    district: 'Xã Đàn',
    city: 'Hà Nội',
    distance: 5.1,
    amenities: ['Chỗ để oto', 'Mini mart', 'Ban công', 'Boardgame'],
    blurb: 'Gần trung tâm, có chỗ để xe',
    description:
      'Phù hợp nếu bạn cần nghỉ vài giờ giữa ngày. Có chỗ để xe và mã cửa gửi ngay khi booking được xác nhận.',
    cover: CLASSIC_PHOTOS[0],
    photos: [CLASSIC_PHOTOS[0], COZY_PHOTOS[0], SIGNATURE_PHOTOS[0]],
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
    photos: gallery(COZY_PHOTOS, 0),
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
    photos: gallery(COZY_PHOTOS, 1),
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
    photos: gallery(COZY_PHOTOS, 2),
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
    photos: gallery(COZY_PHOTOS, 3),
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
    id: 'xd201',
    locationId: 'dong-da',
    number: 'XD201',
    type: 'Classic',
    amenities: [],
    price3h: listedFrom('lake'),
    available: true,
    description: 'Phòng Classic, hạng view hồ. Không gian gọn cho khoảng nghỉ ngắn.',
    photos: gallery(CLASSIC_PHOTOS, 0),
  },
  {
    id: 'xd301',
    locationId: 'dong-da',
    number: 'XD301',
    type: 'Classic',
    amenities: [],
    price3h: listedFrom('lake'),
    available: true,
    description: 'Phòng Classic, hạng view hồ, cùng tiện nghi của cơ sở.',
    photos: gallery(CLASSIC_PHOTOS, 1),
  },
  {
    id: 'xd401',
    locationId: 'dong-da',
    number: 'XD401',
    type: 'Classic',
    amenities: [],
    price3h: listedFrom('lake'),
    available: true,
    description: 'Phòng Classic, hạng view hồ. Tự nhận phòng bằng mã cửa.',
    photos: gallery(CLASSIC_PHOTOS, 2),
  },
  {
    id: 'xd501',
    locationId: 'dong-da',
    number: 'XD501',
    type: 'Cozy',
    amenities: [],
    price3h: listedFrom('bench'),
    available: true,
    description: 'Phòng Cozy, view hồ, có băng ghế gỗ gần cửa sổ.',
    photos: gallery(COZY_PHOTOS, 0),
  },
  {
    id: 'xd701',
    locationId: 'dong-da',
    number: 'XD701',
    type: 'Cozy',
    amenities: [],
    price3h: listedFrom('bench'),
    available: true,
    description: 'Phòng Cozy, view hồ, có băng ghế gỗ gần cửa sổ.',
    photos: gallery(COZY_PHOTOS, 1),
  },
  {
    id: 'xd601',
    locationId: 'dong-da',
    number: 'XD601',
    type: 'Signature',
    amenities: ['Bồn tắm'],
    price3h: listedFrom('bath'),
    available: true,
    description: 'Phòng Signature, view hồ và bồn tắm.',
    photos: gallery(SIGNATURE_PHOTOS, 0),
  },
]

export function roomAmenities(room: Room): Amenity[] {
  const place = LOCATIONS.find((item) => item.id === room.locationId)
  return [...new Set([...(place?.amenities ?? []), ...room.amenities])]
}

export const ROOM_TYPES: Array<{ type: Room['type']; priceFrom: number; fromLabel: string; amenities: string; photo: string }> = [
  { type: 'Classic', ...fromFields('lake'), amenities: 'View hồ', photo: CLASSIC_PHOTOS[0] },
  { type: 'Cozy', ...fromFields('bench'), amenities: 'Băng ghế gỗ gần cửa sổ', photo: COZY_PHOTOS[0] },
  { type: 'Signature', ...fromFields('bath'), amenities: 'Bồn tắm', photo: SIGNATURE_PHOTOS[0] },
]

function fromFields(kind: PriceKind) {
  const from = listedFromDetail(kind)
  return { priceFrom: from.price, fromLabel: from.hours > 0 ? `${from.hours} giờ, ${from.when}` : from.when }
}

export const PROMOS: Promo[] = [
  {
    code: 'KABIN10',
    title: 'Chào bạn đến Kabin',
    kind: 'percent',
    value: 10,
    cap: 30000,
    min: 199000,
    locationId: 'dong-da',
    until: shiftISO(15),
  },
  {
    code: 'NGHITHU',
    title: 'Một khoảng nghỉ dễ chịu',
    kind: 'amount',
    value: 30000,
    min: 249000,
    locationId: 'dong-da',
    until: shiftISO(15),
  },
  {
    code: 'CHAOKABIN',
    title: 'Cảm ơn bạn đã đồng hành',
    kind: 'amount',
    value: 20000,
    min: 299000,
    locationId: 'dong-da',
    until: shiftISO(-1),
  },
]

export const REFUND_POINTS = [
  'Ngày thường, hủy trước giờ nhận phòng ít nhất 8 tiếng: hoàn 100% tiền.',
  'Ngày thường, hủy trước giờ nhận phòng ít nhất 4 tiếng: hoàn 50% tiền.',
  'Ngày thường, hủy dưới 4 tiếng: không hoàn tiền.',
  'Ngày lễ, hủy trước giờ nhận phòng ít nhất 24 tiếng: hoàn 100% tiền. Hủy trong vòng 24 tiếng: không hoàn tiền.',
]

export const REFUND_NOTE = 'Thời điểm hủy được tính theo giờ nhận phòng đã đặt.'

export const KEY_RULES = [
  { id: 'pet', title: 'Không thú cưng', text: 'Không mang theo thú cưng' },
  { id: 'people', title: 'Tối đa 2 người', text: 'Mỗi phòng tối đa 2 người' },
  { id: 'age', title: 'Trên 16 tuổi', text: 'Chỉ nhận khách trên 16 tuổi' },
  { id: 'smoke', title: 'Cấm hút thuốc', text: 'Nghiêm cấm hút thuốc' },
] as const

export const HOUSE_RULES = [
  'Lưu trú đúng số lượng khách đã đăng ký. Mỗi phòng tối đa 2 người.',
  'Chỉ nhận khách từ 16 tuổi trở lên.',
  'Giữ gìn vệ sinh chung: không vứt rác bừa bãi, bỏ rác đúng nơi quy định.',
  'Không làm bẩn không gian phòng. Tránh để chất bẩn có màu dính lên chăn ga, khăn, sofa, tường và đồ trang trí.',
  'Không mang xe điện và không sạc xe điện tại cơ sở.',
  'Ra ngoài vui lòng đóng cửa và khóa đúng quy định.',
  'Giữ trật tự, đặc biệt sau 22:00.',
  'Không tự ý di dời, tháo dỡ trang thiết bị và đồ đạc trong phòng.',
  'Khi trả phòng, tắt toàn bộ thiết bị điện, khóa cửa và kiểm tra tài sản cá nhân. Kabin không chịu trách nhiệm nếu đồ cá nhân bị mất.',
]

export const BAN_GROUPS: { penalty: string; items: string[] }[] = [
  {
    penalty: 'Phạt từ 200.000đ đến 1.000.000đ khi phát hiện',
    items: [
      'Không hút thuốc, sử dụng chất gây cháy hoặc nổ trong cơ sở',
      'Không tự ý di chuyển đồ đạc, máy chiếu',
      'Không tự ý cung cấp mật mã cho người ngoài ra vào',
      'Không mang theo thú cưng',
      'Không làm bẩn hoặc dùng sai mục đích sofa, chăn, gối, nệm, rèm, tường và đồ trang trí',
    ],
  },
  {
    penalty: 'Ngừng phục vụ và mời ra khỏi cơ sở',
    items: [
      'Tuyệt đối không mang hoặc sử dụng chất kích thích, chất cấm',
      'Tuyệt đối không tổ chức cờ bạc hoặc hành vi vi phạm pháp luật',
    ],
  },
]

export const FAQS: Faq[] = [
  {
    id: 'hold',
    topic: 'Thanh toán',
    q: 'Phòng được giữ trong bao lâu?',
    a: 'Phòng được giữ 10 phút kể từ khi tạo yêu cầu thanh toán. Hết 10 phút chưa nhận tiền, phòng được mở lại cho khách khác.',
  },
  {
    id: 'code',
    topic: 'Nhận phòng',
    q: 'Tôi nhận mã mở cửa ở đâu?',
    a: 'Sau khi booking được xác nhận, một mã dùng chung cho cổng và cửa phòng hiện trên vé. Khách đặt qua web nhận thêm thông tin qua SMS.',
  },
  {
    id: 'account',
    topic: 'Tài khoản',
    q: 'Tôi có cần tài khoản để đặt phòng không?',
    a: 'Không. Bạn có thể đặt trên web bằng số điện thoại. Tài khoản giúp xem lại vé, ưu đãi và lịch sử ở một nơi.',
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
    a: 'Cổng và cửa phòng dùng chung một mã, gồm cả dấu #. Nếu vẫn không vào được, bấm liên hệ hỗ trợ và đọc mã đặt phòng.',
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
    a: 'Trong thời gian giữ phòng bạn có thể đặt lại. Sau khi đã thanh toán, liên hệ Hotline 1800.2230 hoặc gửi yêu cầu hỗ trợ kèm mã đặt phòng. Mức hoàn tiền theo mục Hủy phòng.',
  },
  {
    id: 'cancel-rate',
    topic: 'Hủy phòng',
    q: 'Hủy phòng được hoàn bao nhiêu?',
    a: 'Ngày thường, hủy trước giờ nhận phòng ít nhất 8 tiếng: hoàn 100% tiền. Hủy trước ít nhất 4 tiếng: hoàn 50% tiền. Hủy dưới 4 tiếng: không hoàn tiền. Ngày lễ cần hủy trước ít nhất 24 tiếng để được hoàn 100% tiền; hủy trong vòng 24 tiếng thì không hoàn tiền.',
  },
  {
    id: 'cancel-weekend',
    topic: 'Hủy phòng',
    q: 'Ngày lễ hủy phòng được hoàn tiền không?',
    a: 'Ngày lễ cần hủy trước giờ nhận phòng ít nhất 24 tiếng để được hoàn 100% tiền. Hủy trong vòng 24 tiếng thì không hoàn tiền. Ngày thường áp dụng mốc 8 tiếng và 4 tiếng.',
  },
  {
    id: 'cancel-how',
    topic: 'Hủy phòng',
    q: 'Tôi hủy phòng bằng cách nào?',
    a: 'Mở trang Tra cứu, xác thực số điện thoại đã đặt, rồi chọn Hủy phòng. Có thể liên hệ Hotline 1800.2230 nếu cần hỗ trợ. Thời điểm hủy được tính theo giờ nhận phòng đã đặt.',
  },
]

export const POLICIES: Policy[] = [
  {
    id: 'dat-phong',
    title: 'Đặt phòng & thanh toán',
    blocks: [
      {
        title: 'Thông tin đặt phòng',
        body: 'Khách đặt qua app cần đăng nhập. Khách đặt qua web xác thực số điện thoại bằng OTP.',
      },
      {
        title: 'Giữ phòng và xác nhận',
        highlight: 'Phòng được giữ 10 phút khi tạo yêu cầu thanh toán.',
        bullets: ['Nhận tiền đúng hạn: booking tự xác nhận.', 'Hết hạn chưa nhận tiền: phòng được mở lại.'],
      },
      {
        title: 'Thanh toán đến muộn',
        body: 'CSKH liên hệ để kiểm tra và hỗ trợ đặt lại, đổi phòng, đổi giờ hoặc hoàn tiền sau khi trao đổi với khách.',
      },
      {
        title: 'Nhận thông tin vào phòng',
        body: 'Một mã dùng chung cho cổng và cửa phòng được gửi sau khi booking được xác nhận. Khách xem trên vé hoặc nhận SMS.',
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
          'Nhập mã cổng và phòng tại bàn phím khóa sảnh.',
          'Dùng lại đúng mã đó tại cửa phòng đã đặt.',
        ],
      },
      {
        title: 'Trả phòng',
        body: 'Rời phòng đúng giờ trên vé. Khóa cửa khi ra về. Không cần trả chìa khóa.',
      },
    ],
  },
  {
    id: 'noi-quy',
    title: 'Nội quy cơ sở',
    blocks: [
      {
        title: 'Quy định nổi bật',
        highlight: 'Không mang thú cưng. Mỗi phòng tối đa 2 người. Chỉ nhận khách trên 16 tuổi. Nghiêm cấm hút thuốc.',
      },
      {
        title: 'Nội quy lưu trú',
        bullets: HOUSE_RULES,
      },
      {
        title: 'Quy định cấm',
        bullets: BAN_GROUPS.flatMap((group) => group.items.map((item) => `${item}. ${group.penalty}.`)),
      },
      {
        title: 'Thời gian lưu trú',
        body: 'Trả phòng muộn quá 30 phút sẽ phụ thu 200.000đ. Nếu muốn dùng thêm phòng, quý khách quét mã QR hoặc đặt thêm qua web/app khi khung giờ tiếp theo còn trống và chưa có khách đặt. Quá số người đã đăng ký mà không báo: phạt 200.000đ.',
        highlight: 'Hotline hỗ trợ: 1800.2230',
      },
    ],
  },
  {
    id: 'doi-huy',
    title: 'Hủy, đổi lịch & hoàn tiền',
    blocks: [
      {
        title: 'Trước khi thanh toán',
        body: 'Bạn có thể rời luồng đặt phòng. Hết 10 phút giữ chỗ, phòng tự mở lại và không phát sinh phí.',
      },
      {
        title: 'Sau khi đã nhận tiền',
        body: REFUND_POINTS.join(' '),
        highlight: REFUND_NOTE,
      },
    ],
  },
  {
    id: 'rieng-tu',
    title: 'Quyền riêng tư',
    blocks: [
      {
        title: 'Dữ liệu Kabin giữ',
        body: 'Họ tên, số điện thoại và thông tin đặt phòng dùng để xác nhận booking, gửi mã cửa và hỗ trợ khi cần.',
      },
      {
        title: 'Mã cửa',
        body: 'Mã cổng và phòng chỉ hiển thị với khách của booking đã xác nhận. Hết thời gian sử dụng, mã không còn hiệu lực.',
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

export function locationsOpenFirst<T extends { openingSoon?: boolean }>(locations: T[]) {
  return [...locations].sort((a, b) => Number(Boolean(a.openingSoon)) - Number(Boolean(b.openingSoon)))
}

export function typeOffers<T extends Room>(rooms: T[], isOpen: (room: T) => boolean) {
  const order: string[] = []
  const groups = new Map<string, T[]>()
  for (const room of rooms) {
    const key = `${room.locationId}\0${room.type}`
    if (!groups.has(key)) order.push(key)
    const list = groups.get(key) ?? []
    list.push(room)
    groups.set(key, list)
  }
  return order.map((key) => {
    const list = groups.get(key) ?? []
    const open = list.find(isOpen)
    return { room: open ?? list[0], open: Boolean(open) }
  })
}

export function rateKind(room: Pick<Room, 'type' | 'amenities'>): PriceKind {
  if (room.type === 'Signature' || room.type === 'Relax' || room.amenities.includes('Bồn tắm')) return 'bath'
  if (room.type === 'Cozy') return 'bench'
  return 'lake'
}

function stayWeekday(date: string) {
  return new Date(`${date}T12:00:00`).getDay()
}

function rateBand(date: string, time: string): RateBand {
  const day = stayWeekday(date)
  if (day === 0 || day === 6) return 'weekend'
  return clockMinutes(time) < 15 * 60 ? 'gold' : 'regular'
}

const HOLIDAYS = new Set([
  '2026-01-01',
  '2026-02-16',
  '2026-02-17',
  '2026-02-18',
  '2026-02-19',
  '2026-02-20',
  '2026-04-27',
  '2026-04-30',
  '2026-05-01',
  '2026-09-02',
  '2027-01-01',
  '2027-04-30',
  '2027-05-01',
  '2027-09-02',
])

function premiumNight(date: string) {
  const day = stayWeekday(date)
  return day === 5 || day === 6 || HOLIDAYS.has(date)
}

export function quotedStay(
  room: Pick<Room, 'type' | 'amenities'>,
  stay: { date: string; time: string; duration: number; overnight: boolean },
) {
  const kind = rateKind(room)
  if (stay.overnight) return listedOvernight(kind, premiumNight(stay.date))
  return listedHourly(kind, rateBand(stay.date, stay.time), stay.duration)
}

export function priceFromDetail(locationId: string) {
  const list = roomsAt(locationId).map((room) => listedFromDetail(rateKind(room)))
  return list.reduce((best, item) => (item.price < best.price ? item : best))
}

export function priceFrom(locationId: string) {
  return priceFromDetail(locationId).price
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

export function quoteOf(
  roomId: string,
  duration: number,
  promoCode: string,
  stay: { date: string; time: string; overnight: boolean },
) {
  const room = getRoom(roomId)
  if (!room) return null
  const location = getLocation(room.locationId)
  if (!location) return null
  const base = quotedStay(room, { ...stay, duration })
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

export function refundEstimate(booking: Booking, now = new Date()) {
  const paid = Math.max(0, booking.price - booking.discount)
  const start = new Date(`${booking.date}T${booking.time}:00`)
  const remaining = start.getTime() - now.getTime()
  const hour = 3600000
  if (HOLIDAYS.has(booking.date)) return { amount: remaining >= 24 * hour ? paid : 0, paid }
  if (remaining >= 8 * hour) return { amount: paid, paid }
  if (remaining >= 4 * hour) return { amount: Math.round(paid / 2), paid }
  return { amount: 0, paid }
}

export function displayStatus(booking: Booking, now = new Date()): BookingStatus {
  if (booking.status !== 'upcoming') return booking.status
  const start = new Date(`${booking.date}T${booking.time}:00`)
  const end = new Date(start.getTime() + booking.duration * 3600000)
  if (now >= start && now < end) return 'active'
  if (now >= end) return 'done'
  return 'upcoming'
}

function rangesOverlap(
  date: string,
  time: string,
  hours: number,
  booking: { date: string; time: string; duration: number },
) {
  const startOf = (day: string, clock: string) => new Date(`${day}T00:00:00`).getTime() + clockMinutes(clock) * 60000
  const start = startOf(date, time)
  const end = start + hours * 3600000
  const bookedStart = startOf(booking.date, booking.time)
  const bookedEnd = bookedStart + booking.duration * 3600000
  return start < bookedEnd && bookedStart < end
}

export function roomTaken(
  roomId: string,
  date: string,
  time: string,
  duration: number,
  bookings: Booking[],
  now = new Date(),
) {
  return bookings.some((booking) => {
    if (booking.roomId !== roomId) return false
    const status = displayStatus(booking, now)
    if (status !== 'upcoming' && status !== 'active' && status !== 'pending') return false
    return rangesOverlap(date, time, duration, booking)
  })
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
    case 'cancelled':
      return 'Đã hủy'
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
    roomCode: '246810#',
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
    roomCode: '135790#',
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
