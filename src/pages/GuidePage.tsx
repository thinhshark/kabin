import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Wifi } from 'lucide-react'
import { displayStatus, getLocation, getRoom, PHOTOS } from '../data'
import { useStore } from '../store'
import { Accordion, CopyButton, Photo, StatusPill, useTitle } from '../components/ui'
import { checkoutLabel, formatDate, mapsUrl } from '../utils'

export function GuidePage() {
  useTitle('Hướng dẫn nhận phòng')
  const { code } = useParams()
  const { bookings } = useStore()
  const booking = code ? bookings.find((item) => item.code === code) : undefined
  const location = booking ? getLocation(booking.locationId) : undefined
  const room = booking ? getRoom(booking.roomId) : undefined
  const status = booking ? displayStatus(booking) : null
  const showCodes = booking && status && (status === 'upcoming' || status === 'active') && booking.gateCode
  const end = booking ? checkoutLabel(booking.time, booking.duration) : null

  return (
    <div className="wrap page">
      {booking ? (
        <Link to={`/ve/${booking.code}`} className="text-btn back-link">
          <ArrowLeft size={16} /> Về vé đặt phòng
        </Link>
      ) : null}
      <CrumbLike />
      <h1>Nhận phòng thật dễ dàng</h1>
      <p className="lead">Làm theo từng bước để vào khoảng riêng của bạn.</p>

      {booking && location && room && end && status ? (
        <article className="stay-bar">
          <Photo src={room.photos[0]} alt="" />
          <div>
            <strong>{location.name}</strong>
            <p>
              Phòng {room.number} · {room.type}
            </p>
          </div>
          <ul>
            <li>
              <span>Ngày nghỉ</span>
              {formatDate(booking.date)}
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
          </ul>
          <StatusPill status={status} />
        </article>
      ) : (
        <p className="callout">
          Chưa chọn một đặt phòng. <Link to="/tra-cuu">Tra cứu vé</Link> hoặc <Link to="/dat-phong-cua-toi">mở đặt phòng của tôi</Link> để xem mã cửa.
        </p>
      )}

      <div className="guide-grid">
        <article className="guide-card">
          <img src={PHOTOS.exterior} alt="Mặt ngoài cơ sở" />
          <span>01</span>
          <h2>Đến cơ sở</h2>
          <p>Tới {location?.name ?? 'cơ sở trên vé'} và đi chuyển đến khu vực cổng ra vào.</p>
          {location ? (
            <a className="btn btn-line btn-block" href={mapsUrl(location.name, location.district)} target="_blank" rel="noreferrer">
              <MapPin size={16} /> Chỉ đường
            </a>
          ) : (
            <Link to="/co-so" className="btn btn-line btn-block">
              Xem cơ sở
            </Link>
          )}
        </article>
        <article className="guide-card">
          <img src={PHOTOS.gateLock} alt="Khóa mã trên cổng" />
          <span>02</span>
          <h2>Mở cổng</h2>
          <p>Nhập mã cổng trên bàn phím khóa, kể cả phím #.</p>
          {showCodes ? (
            <div className="code-box">
              <span>Mã cổng</span>
              <strong>{booking?.gateCode}</strong>
              <CopyButton value={booking?.gateCode ?? ''} quiet />
            </div>
          ) : (
            <p className="hint">Mã cổng hiện trên vé sau khi booking được xác nhận.</p>
          )}
        </article>
        <article className="guide-card">
          <img src={PHOTOS.roomLock} alt="Khóa mã trên cửa phòng" />
          <span>03</span>
          <h2>{room?.number ? `Nhập mã phòng ${room.number}` : 'Nhập mã phòng'}</h2>
          <p>Kiểm tra đúng số phòng và nhập mã để mở cửa.</p>
          {showCodes ? (
            <div className="code-box">
              <span>Mã phòng {room?.number}</span>
              <strong>{booking?.roomCode}</strong>
              <CopyButton value={booking?.roomCode ?? ''} quiet />
            </div>
          ) : (
            <p className="hint">Mã phòng đi kèm mã cổng trên cùng một vé.</p>
          )}
        </article>
      </div>

      <Accordion
        items={[
          {
            title: 'Wi-Fi và thiết bị trong phòng',
            content: (
              <p>
                <Wifi size={15} /> Tên mạng và mật khẩu được dán ở mặt trong cửa phòng. Điều hòa và đèn dùng công tắc cạnh giường.
              </p>
            ),
          },
          {
            title: 'Hướng dẫn trả phòng',
            content: <p>Rời phòng đúng giờ trên vé, tắt điều hòa và khóa cửa. Không cần trả chìa khóa.</p>,
          },
        ]}
      />
      <div className="help-bar">
        <div>
          <strong>Không mở được cửa?</strong>
          <p>Đội ngũ Kabin luôn sẵn sàng hỗ trợ bạn.</p>
        </div>
        <Link to="/tro-giup" className="btn btn-primary">
          Liên hệ hỗ trợ
        </Link>
      </div>
    </div>
  )
}

function CrumbLike() {
  return (
    <p className="crumb">
      <Link to="/">Trang chủ</Link> <span>/</span> <Link to="/co-so">Hệ thống cơ sở</Link> <span>/</span> Hướng dẫn tự nhận phòng
    </p>
  )
}
