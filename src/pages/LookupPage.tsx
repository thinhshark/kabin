import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Headphones, MapPin, Phone } from 'lucide-react'
import { displayStatus, getLocation, getRoom, PHOTOS, type Booking, type BookingStatus } from '../data'
import { useStore } from '../store'
import { CopyButton, useTitle } from '../components/ui'
import { checkoutLabel, formatDate, formatMoney, isPhone, mapsUrl, maskPhone, normalizePhone } from '../utils'

const STATUS_ORDER: Record<BookingStatus, number> = {
  active: 0,
  upcoming: 1,
  pending: 2,
  done: 3,
  expired: 4,
}

export function LookupPage() {
  useTitle('Tra cứu đặt phòng')
  const { openOtp, lookupPhone, setLookupPhone, bookings } = useStore()
  const [phone, setPhone] = useState(lookupPhone)
  const [error, setError] = useState('')
  const unlocked = Boolean(lookupPhone) && normalizePhone(phone) === lookupPhone
  const matches = unlocked ? bookings.filter((item) => item.phone === lookupPhone) : []
  const found = matches
    .filter((item) => {
      const status = displayStatus(item)
      return status === 'upcoming' || status === 'active'
    })
    .sort((a, b) => STATUS_ORDER[displayStatus(a)] - STATUS_ORDER[displayStatus(b)])

  const send = () => {
    if (!isPhone(phone)) {
      setError('Nhập đúng số điện thoại đã dùng khi đặt.')
      return
    }
    const normalized = normalizePhone(phone)
    setError('')
    openOtp({
      phone: normalized,
      purpose: 'lookup',
      onSuccess: () => setLookupPhone(normalized),
    })
  }

  return (
    <div className="wrap page lookup">
      <div className={unlocked && found.length > 0 ? 'lookup-card results' : 'lookup-card'}>
        <span className="pill pill-pending">Không cần tạo tài khoản</span>
        <ol className="stepper compact">
          <li className="step on">
            <b>1</b> Số điện thoại
          </li>
          <li className={unlocked ? 'step done' : 'step'}>
            <b>2</b> Xác thực OTP
          </li>
          <li className={unlocked ? 'step on' : 'step'}>
            <b>3</b> Xem thông tin
          </li>
        </ol>
        <h1>Tra cứu đặt phòng</h1>
        <p className="lead">Xem thông tin đã đặt, mã cửa và hướng dẫn sử dụng.</p>
        {unlocked ? (
          <div className="stack">
            {found.length === 0 ? (
              <div className="empty">
                <strong>{matches.length === 0 ? 'Không thấy đặt phòng' : 'Không có đặt phòng còn hiệu lực'}</strong>
                <p>
                  {matches.length === 0
                    ? `Số ${phone} chưa có đặt phòng trên hệ thống minh họa.`
                    : 'Các đặt phòng đã hết hạn được ẩn. Chỉ đặt phòng còn trong khung giờ đã đặt mới hiện ở đây.'}
                </p>
                <Link to="/co-so" className="btn btn-primary">
                  Đặt phòng
                </Link>
              </div>
            ) : (
              found.map((booking) => <LookupStay key={booking.code} booking={booking} />)
            )}
            <button type="button" className="text-btn" onClick={() => setLookupPhone('')}>
              Tra cứu số khác
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              send()
            }}
          >
            <label className="field">
              Số điện thoại đã đặt phòng
              <span className="phone-row">
                <select aria-label="Mã quốc gia" defaultValue="+84">
                  <option>+84</option>
                </select>
                <input value={phone} placeholder="Nhập số điện thoại" onChange={(event) => setPhone(event.target.value)} />
              </span>
              <span className="hint">Mã xác thực sẽ được gửi qua SMS.</span>
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button className="btn btn-primary btn-block" type="submit">
              Nhận mã OTP <ArrowRight size={16} />
            </button>
          </form>
        )}
        <p className="hint center">
          <Headphones size={14} /> <Link to="/tro-giup">Tôi cần hỗ trợ tra cứu</Link>
        </p>
        <p className="hint center">Dùng đúng số điện thoại đã nhập khi đặt phòng.</p>
      </div>
    </div>
  )
}

function LookupStay({ booking }: { booking: Booking }) {
  const location = getLocation(booking.locationId)
  const room = getRoom(booking.roomId)
  const status = displayStatus(booking)
  const end = checkoutLabel(booking.time, booking.duration)
  const total = Math.max(0, booking.price - booking.discount)
  const valid = status === 'upcoming' || status === 'active'
  const showCodes = valid && Boolean(booking.gateCode)

  return (
    <article className="lookup-stay">
      <section>
        <div className="summary-head">
          <h2>Thông tin đã đặt</h2>
          <span className={valid ? 'pill pill-valid' : 'pill pill-invalid'}>{valid ? 'Còn hiệu lực' : 'Hết hạn'}</span>
        </div>
        <ul className="facts two">
          <li>
            <span>Khách</span>
            {booking.guestName}
          </li>
          <li>
            <span>Số điện thoại</span>
            {maskPhone(booking.phone)}
          </li>
          <li>
            <span>Cơ sở</span>
            {location?.name}
          </li>
          <li>
            <span>Phòng</span>
            Phòng {room?.number} · {room?.type}
          </li>
          <li>
            <span>Ngày</span>
            {formatDate(booking.date)}
          </li>
          <li>
            <span>Mã đặt phòng</span>
            {booking.code}
          </li>
          <li>
            <span>Giờ nhận phòng</span>
            {booking.time}
          </li>
          <li>
            <span>Giờ trả phòng</span>
            {end.text}
          </li>
          <li>
            <span>Thời lượng</span>
            {booking.duration} giờ
          </li>
          <li>
            <span>Thanh toán</span>
            {formatMoney(total)}
          </li>
        </ul>
      </section>

      <section>
        <h2>Mã cửa và phòng</h2>
        {showCodes ? (
          <>
            <p className="hint">Nhập đủ cả dấu # ở cuối mỗi mã.</p>
            <div className="code-box">
              <span>Mã cổng</span>
              <strong>{booking.gateCode}</strong>
              <CopyButton value={booking.gateCode} quiet />
            </div>
            <div className="code-box">
              <span>Mã phòng {room?.number}</span>
              <strong>{booking.roomCode}</strong>
              <CopyButton value={booking.roomCode} quiet />
            </div>
            <p className="hint">Mã chỉ có hiệu lực trong khung giờ mà khách đặt.</p>
          </>
        ) : (
          <p className="callout">
            {status === 'pending'
              ? 'Mã cổng và mã phòng được gửi khi đặt phòng được xác nhận.'
              : 'Mã cửa không còn hiệu lực vì khung giờ này đã kết thúc.'}
          </p>
        )}
      </section>

      <section>
        <h2>Hướng dẫn sử dụng</h2>
        <ol className="lookup-steps">
          <li>
            <b>1</b>
            <div>
              <strong>Đến cơ sở</strong>
              <p>Tới {location?.name ?? 'cơ sở trên thông tin đặt'} và vào khu cổng. Không cần quầy lễ tân.</p>
              {location ? (
                <a className="text-btn" href={mapsUrl(location.name, location.district)} target="_blank" rel="noreferrer">
                  <MapPin size={15} /> Chỉ đường
                </a>
              ) : null}
            </div>
            <img src={PHOTOS.exterior} alt="Mặt ngoài cơ sở" />
          </li>
          <li>
            <b>2</b>
            <div>
              <strong>Mở cổng</strong>
              <p>Nhập mã cổng trên bàn phím khóa, kể cả dấu #.</p>
            </div>
            <img src={PHOTOS.gateLock} alt="Khóa mã trên cổng" />
          </li>
          <li>
            <b>3</b>
            <div>
              <strong>Nhập mã phòng {room?.number ?? ''}</strong>
              <p>Kiểm tra đúng số phòng, rồi nhập mã phòng để mở cửa.</p>
            </div>
            <img src={PHOTOS.roomLock} alt="Khóa mã trên cửa phòng" />
          </li>
        </ol>
        <p className="hint">Mật khẩu Wi-Fi dán ở mặt trong cửa. Đến giờ trả phòng, quý khách vui lòng tắt điều hòa, đóng cửa trước khi rời phòng.</p>
        <a className="btn btn-block hotline-btn" href="tel:18002230">
          <Phone size={18} /> Liên hệ Hotline hỗ trợ <strong>18002230</strong>
        </a>
      </section>
    </article>
  )
}

export function NotFoundPage() {
  useTitle('Không tìm thấy trang')
  return (
    <div className="wrap page">
      <h1>Trang này không có trên Kabin</h1>
      <p className="lead">Có thể đường dẫn đã đổi. Quay về trang chủ để chọn phòng.</p>
      <Link to="/" className="btn btn-primary">
        Về trang chủ
      </Link>
    </div>
  )
}
