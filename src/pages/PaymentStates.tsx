import { Link, useNavigate } from 'react-router-dom'
import { Home, Headphones, RefreshCw } from 'lucide-react'
import { quoteOf } from '../data'
import { useStore } from '../store'
import { Photo, useTitle } from '../components/ui'
import { checkoutLabel, formatDate, formatMoney, maskPhone } from '../utils'

export function ExpiredPage() {
  useTitle('Hết thời gian giữ phòng')
  const { draft, resetHold, markLate } = useStore()
  const navigate = useNavigate()
  const quoted = quoteOf(draft.roomId, draft.duration, draft.promoCode)
  const end = checkoutLabel(draft.time, draft.duration)

  return (
    <div className="wrap page narrow center-page">
      <div className="state-icon bad">
        <RefreshCw size={28} />
      </div>
      <h1>Đã hết thời gian giữ phòng</h1>
      <p className="lead">Phòng đã được mở lại để người khác có thể đặt. Vui lòng kiểm tra lại tình trạng phòng trước khi thanh toán.</p>
      {quoted ? (
        <article className="state-card">
          <Photo src={quoted.room.photos[0]} alt="" />
          <div>
            <div className="summary-head">
              <h2>{quoted.location.name}</h2>
              <span className="pill pill-expired">Hết hạn</span>
            </div>
            <p>
              Phòng {quoted.room.number} · {quoted.room.type}
            </p>
            <ul className="facts">
              <li>
                <span>Ngày</span>
                {formatDate(draft.date)}
              </li>
              <li>
                <span>Nhận phòng</span>
                {draft.time}
              </li>
              <li>
                <span>Trả phòng</span>
                {end.text}
              </li>
              <li>
                <span>Thời lượng</span>
                {draft.duration} giờ
              </li>
            </ul>
            <div className="sum-row">
              <span>Tổng thanh toán</span>
              <b className="price">{formatMoney(quoted.total)}</b>
            </div>
            <div className="sum-row">
              <span>Mã booking</span>
              <b>{draft.bookingCode}</b>
            </div>
          </div>
        </article>
      ) : null}
      <div className="stack-buttons">
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => {
            const id = draft.locationId
            resetHold()
            navigate(id ? `/co-so/${id}/chon-phong` : '/co-so')
          }}
        >
          <RefreshCw size={16} /> Kiểm tra & đặt lại
        </button>
        <button
          type="button"
          className="btn btn-line btn-block"
          onClick={() => {
            markLate()
            navigate('/thanh-toan/den-muon')
          }}
          disabled={!quoted}
        >
          Tôi đã chuyển khoản
        </button>
      </div>
      <p className="hint">Liên hệ hỗ trợ để kiểm tra giao dịch.</p>
      <p className="callout">Không tiếp tục chuyển khoản theo mã thanh toán cũ.</p>
    </div>
  )
}

export function LatePage() {
  useTitle('Thanh toán đến muộn')
  const { draft } = useStore()
  const quoted = quoteOf(draft.roomId, draft.duration, draft.promoCode)
  const end = checkoutLabel(draft.time, draft.duration)

  return (
    <div className="wrap page narrow center-page">
      <div className="state-icon warn">
        <Headphones size={26} />
      </div>
      <h1>Đã nhận tiền, đang chờ xử lý</h1>
      <span className="pill pill-pending">Booking chưa được xác nhận</span>
      <p className="lead">Thanh toán đến sau thời gian giữ phòng. CSKH sẽ liên hệ để kiểm tra và sắp xếp phòng phù hợp.</p>
      <div className="stat-grid">
        <div>
          <span>Đã nhận</span>
          <b className="price">{formatMoney(quoted?.total ?? 0)}</b>
        </div>
        <div>
          <span>Mã chuyển khoản</span>
          <b>{draft.paymentRef || '—'}</b>
        </div>
        <div>
          <span>Mã đặt phòng</span>
          <b>{draft.bookingCode || '—'}</b>
        </div>
      </div>
      {quoted ? (
        <article className="state-card">
          <Photo src={quoted.room.photos[0]} alt="" />
          <div>
            <h2>{quoted.location.name}</h2>
            <p>
              Phòng {quoted.room.number} · {quoted.room.type}
            </p>
            <p>
              {formatDate(draft.date)} · {draft.time}–{end.text} ({draft.duration} giờ)
            </p>
          </div>
        </article>
      ) : null}
      <ol className="timeline">
        <li className="done">Đã nhận tiền</li>
        <li className="current">CSKH đang kiểm tra</li>
        <li>Thông báo kết quả</li>
      </ol>
      <p className="hint">Kabin sẽ hỗ trợ đặt lại, đổi phòng, đổi khung giờ hoặc hoàn tiền sau khi trao đổi với bạn.</p>
      {draft.phone ? <p className="hint">Số liên hệ: {maskPhone(draft.phone)}</p> : null}
      <div className="btn-row center-row">
        <Link to="/tro-giup" className="btn btn-primary">
          <Headphones size={16} /> Liên hệ hỗ trợ
        </Link>
        <Link to="/" className="btn btn-line">
          <Home size={16} /> Về trang chủ
        </Link>
      </div>
    </div>
  )
}
