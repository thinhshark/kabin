import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, RefreshCw, Search } from 'lucide-react'
import { displayStatus, getLocation, getRoom, type BookingStatus } from '../data'
import { useStore } from '../store'
import { AccountNav, Photo, StatusPill, useTitle } from '../components/ui'
import { checkoutLabel, formatDate, formatMoney } from '../utils'

const TABS: Array<{ id: 'all' | BookingStatus; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'upcoming', label: 'Sắp tới' },
  { id: 'active', label: 'Đang sử dụng' },
  { id: 'done', label: 'Đã hoàn tất' },
  { id: 'expired', label: 'Hết hạn' },
]

export function BookingsPage() {
  useTitle('Đặt phòng của tôi')
  const { user, bookings } = useStore()
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('all')
  const [query, setQuery] = useState('')
  if (!user) return <Navigate to="/dang-nhap" replace state={{ from: '/dat-phong-cua-toi' }} />

  const mine = bookings.filter((item) => item.phone === user.phone)
  const shown = mine.filter((item) => {
    const status = displayStatus(item)
    if (tab !== 'all' && status !== tab) return false
    const location = getLocation(item.locationId)
    const hay = `${item.code} ${location?.name ?? ''}`.toLowerCase()
    return hay.includes(query.trim().toLowerCase())
  })

  return (
    <div className="wrap page">
      <div className="account-layout">
        <AccountNav />
        <div>
          <h1>Đặt phòng của tôi</h1>
          <p className="lead">Theo dõi và quản lý những khoảng nghỉ của bạn.</p>
          <label className="control search-inline">
            <Search size={16} />
            <input placeholder="Tìm mã đặt phòng hoặc cơ sở" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="tabs">
            {TABS.map((item) => (
              <button key={item.id} type="button" className={tab === item.id ? 'on' : ''} onClick={() => setTab(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="stack">
            {shown.length === 0 ? (
              <div className="empty">
                <strong>Chưa có đặt phòng trong mục này</strong>
                <p>Khi bạn đặt xong, vé sẽ hiện ở đây.</p>
                <Link to="/co-so" className="btn btn-primary">
                  Tìm phòng
                </Link>
              </div>
            ) : (
              shown.map((booking) => <BookingCard key={booking.code} code={booking.code} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BookingCard({ code }: { code: string }) {
  const { bookings } = useStore()
  const booking = bookings.find((item) => item.code === code)
  if (!booking) return null
  const location = getLocation(booking.locationId)
  const room = getRoom(booking.roomId)
  const status = displayStatus(booking)
  const end = checkoutLabel(booking.time, booking.duration)
  const total = Math.max(0, booking.price - booking.discount)
  return (
    <article className="booking-card">
      <span className={`flag flag-${status}`}>{status === 'upcoming' ? 'Sắp tới' : status === 'active' ? 'Đang sử dụng' : status === 'done' ? 'Đã hoàn tất' : status === 'pending' ? 'Đang xử lý' : 'Hết hạn'}</span>
      {room ? <Photo src={room.photos[0]} alt="" /> : null}
      <div>
        <h2>{location?.name}</h2>
        <p>
          Phòng {room?.number} · {room?.type}
        </p>
        <p className="meta-line">
          <span>{formatDate(booking.date)}</span>
          <span>
            {booking.time}–{end.time}
          </span>
          <span>{booking.duration} giờ</span>
        </p>
        <b className="price">{formatMoney(total)}</b>
        <p className="hint">
          <StatusPill status={status} /> Mã đặt phòng: {booking.code}
        </p>
      </div>
      <div className="booking-actions">
        {status === 'upcoming' || status === 'active' ? (
          <>
            <Link to={`/ve/${booking.code}`} className="btn btn-primary">
              Xem vé <ArrowRight size={16} />
            </Link>
            <Link to={`/huong-dan/${booking.code}`} className="btn btn-line">
              Hướng dẫn nhận phòng
            </Link>
          </>
        ) : status === 'done' ? (
          <>
            <Link to={location ? `/co-so/${location.id}/chon-phong` : '/co-so'} className="btn btn-line">
              <RefreshCw size={16} /> Đặt lại
            </Link>
            <Link to={`/ve/${booking.code}`} className="text-btn">
              Xem chi tiết <ArrowRight size={15} />
            </Link>
          </>
        ) : (
          <>
            <Link to={location ? `/co-so/${location.id}/chon-phong` : '/co-so'} className="btn btn-line">
              <Search size={16} /> Tìm phòng
            </Link>
            <Link to={`/ve/${booking.code}`} className="text-btn">
              Xem chi tiết <ArrowRight size={15} />
            </Link>
          </>
        )}
      </div>
    </article>
  )
}
