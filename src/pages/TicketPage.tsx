import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Download, MapPin, Phone } from 'lucide-react'
import { displayStatus, getLocation, getRoom } from '../data'
import { useStore } from '../store'
import { CopyButton, Photo, StatusPill, useTitle } from '../components/ui'
import { checkoutLabel, formatDate, formatMoney, mapsUrl, maskPhone } from '../utils'

export function TicketPage() {
  const { code = '' } = useParams()
  const { bookings } = useStore()
  const booking = bookings.find((item) => item.code === code)
  useTitle(booking ? 'Vé đặt phòng' : 'Không thấy vé')

  if (!booking) {
    return (
      <div className="wrap page">
        <h1>Không tìm thấy vé</h1>
        <p className="lead">Kiểm tra lại mã đặt phòng hoặc tra cứu bằng số điện thoại.</p>
        <Link to="/tra-cuu" className="btn btn-primary">
          Tra cứu đặt phòng
        </Link>
      </div>
    )
  }

  const location = getLocation(booking.locationId)
  const room = getRoom(booking.roomId)
  const status = displayStatus(booking)
  const end = checkoutLabel(booking.time, booking.duration)
  const total = Math.max(0, booking.price - booking.discount)
  const showCodes = (status === 'upcoming' || status === 'active') && Boolean(booking.gateCode)

  return (
    <div className="wrap page">
      <div className="success-head">
        <span className="state-icon ok">
          <BadgeCheck size={28} />
        </span>
        <h1>{status === 'pending' ? 'Đang chờ xử lý' : status === 'expired' ? 'Đặt phòng đã hết hạn' : 'Đặt phòng thành công!'}</h1>
        <p className="lead">
          {status === 'pending'
            ? 'Tiền đã được ghi nhận và đang chờ Kabin sắp xếp.'
            : status === 'expired'
              ? 'Khung giờ này không còn được giữ.'
              : 'Kabin đã xác nhận khoảng nghỉ của bạn.'}
        </p>
      </div>
      <div className="ticket-grid">
        <article className="panel ticket">
          <div className="summary-head">
            <h2>Vé đặt phòng</h2>
            <StatusPill status={status} />
          </div>
          <p className="code-line">
            Mã đặt phòng: <b>{booking.code}</b>
            <CopyButton value={booking.code} quiet />
          </p>
          {room ? <Photo src={room.photos[0]} alt="" /> : null}
          <h3>{location?.name}</h3>
          <p className="hint">
            {location?.district}, {location?.city}
          </p>
          <ul className="facts two">
            <li>
              <span>Phòng</span>Phòng {room?.number} · {room?.type}
            </li>
            <li>
              <span>Khách đặt phòng</span>
              {booking.guestName}
            </li>
            <li>
              <span>Ngày nghỉ</span>
              {formatDate(booking.date)}
            </li>
            <li>
              <span>Số điện thoại</span>
              {maskPhone(booking.phone)}
            </li>
            <li>
              <span>Giờ nhận phòng</span>
              {booking.time}
            </li>
            <li>
              <span>Email</span>
              {booking.email || '—'}
            </li>
            <li>
              <span>Giờ trả phòng</span>
              {end.text}
            </li>
            <li>
              <span>Thanh toán</span>
              <em className="pill pill-upcoming">{formatMoney(total)}</em>
            </li>
            <li>
              <span>Thời lượng</span>
              {booking.duration} giờ
            </li>
          </ul>
        </article>
        <aside className="panel">
          {showCodes ? (
            <>
              <h2>Mã vào cửa</h2>
              <p className="hint">Sử dụng các mã dưới đây để vào cổng tòa nhà và phòng nghỉ.</p>
              <CodeBox label="Mã cổng" value={booking.gateCode} />
              <CodeBox label={`Mã phòng ${room?.number ?? ''}`} value={booking.roomCode} />
              <Link to={`/huong-dan/${booking.code}`} className="btn btn-primary btn-block">
                Hướng dẫn nhận phòng
              </Link>
            </>
          ) : (
            <>
              <h2>{status === 'pending' ? 'Chưa có mã cửa' : 'Mã cửa không còn hiệu lực'}</h2>
              <p>
                {status === 'pending'
                  ? 'Mã cổng và mã phòng được gửi khi booking được xác nhận.'
                  : 'Bạn có thể đặt lại một khung giờ còn trống.'}
              </p>
              <Link to={location ? `/co-so/${location.id}/chon-phong` : '/co-so'} className="btn btn-primary btn-block">
                {status === 'done' ? 'Đặt lại' : 'Tìm phòng'}
              </Link>
            </>
          )}
          <div className="btn-row">
            {location ? (
              <a className="btn btn-line" href={mapsUrl(location.name, location.district)} target="_blank" rel="noreferrer">
                <MapPin size={16} /> Chỉ đường
              </a>
            ) : null}
            <button type="button" className="btn btn-line" onClick={() => window.print()}>
              <Download size={16} /> Lưu vé
            </button>
          </div>
          <p className="hint">Thông tin đặt phòng đã được gửi qua SMS và email.</p>
          <Link to="/tro-giup" className="text-btn">
            <Phone size={15} /> Cần hỗ trợ nhận phòng?
          </Link>
        </aside>
      </div>
    </div>
  )
}

function CodeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="code-box">
      <span>{label}</span>
      <strong>{value}</strong>
      <CopyButton value={value} quiet />
    </div>
  )
}
