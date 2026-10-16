import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Headphones } from 'lucide-react'
import { displayStatus, getLocation, getRoom } from '../data'
import { useStore } from '../store'
import { Photo, StatusPill, useTitle } from '../components/ui'
import { formatDate, formatMoney, isPhone, normalizePhone } from '../utils'

export function LookupPage() {
  useTitle('Tra cứu đặt phòng')
  const { openOtp, lookupPhone, setLookupPhone, bookings } = useStore()
  const navigate = useNavigate()
  const [phone, setPhone] = useState(lookupPhone)
  const [error, setError] = useState('')
  const unlocked = Boolean(lookupPhone) && normalizePhone(phone) === lookupPhone
  const found = unlocked ? bookings.filter((item) => item.phone === lookupPhone) : []

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
      <div className="lookup-card">
        <span className="pill pill-pending">Không cần tạo tài khoản</span>
        <ol className="stepper compact">
          <li className="step on">
            <b>1</b> Số điện thoại
          </li>
          <li className={unlocked ? 'step done' : 'step'}>
            <b>2</b> Xác thực OTP
          </li>
          <li className={unlocked ? 'step on' : 'step'}>
            <b>3</b> Xem vé
          </li>
        </ol>
        <h1>Tra cứu đặt phòng</h1>
        <p className="lead">Xem lại vé và thông tin nhận phòng của bạn.</p>
        {unlocked ? (
          <div className="stack">
            {found.length === 0 ? (
              <div className="empty">
                <strong>Không thấy đặt phòng</strong>
                <p>Số {phone} chưa có booking trên hệ thống minh họa.</p>
                <Link to="/co-so" className="btn btn-primary">
                  Đặt phòng
                </Link>
              </div>
            ) : (
              found.map((booking) => {
                const location = getLocation(booking.locationId)
                const room = getRoom(booking.roomId)
                const status = displayStatus(booking)
                return (
                  <article key={booking.code} className="mini-room">
                    {room ? <Photo src={room.photos[0]} alt="" /> : null}
                    <div>
                      <strong>{location?.name}</strong>
                      <p>
                        Phòng {room?.number} · {formatDate(booking.date)}
                      </p>
                      <StatusPill status={status} />
                    </div>
                    <div className="mini-room-end">
                      <b className="price">{formatMoney(Math.max(0, booking.price - booking.discount))}</b>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate(`/ve/${booking.code}`)}>
                        Xem vé
                      </button>
                    </div>
                  </article>
                )
              })
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
        <p className="hint center">
          Đã có tài khoản? <Link to="/dang-nhap" state={{ from: '/dat-phong-cua-toi' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
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
