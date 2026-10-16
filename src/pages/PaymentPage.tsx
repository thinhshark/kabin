import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Download, Lock, RefreshCw, Timer } from 'lucide-react'
import { quoteOf } from '../data'
import { useStore } from '../store'
import { CopyButton, DemoQr, Photo, useTitle } from '../components/ui'
import { checkoutLabel, formatDate, formatMoney } from '../utils'

export function PaymentPage() {
  useTitle('Thanh toán')
  const { draft, confirmPaid, expireHold } = useStore()
  const navigate = useNavigate()
  const [now, setNow] = useState(Date.now())
  const [checking, setChecking] = useState(false)
  const quoted = quoteOf(draft.roomId, draft.duration, draft.promoCode)

  useEffect(() => {
    if (draft.phase === 'paid') navigate(`/ve/${draft.bookingCode}`, { replace: true })
    else if (draft.phase === 'expired') navigate('/thanh-toan/het-han', { replace: true })
    else if (draft.phase === 'late') navigate('/thanh-toan/den-muon', { replace: true })
    else if (draft.phase === 'idle') navigate('/dat-phong', { replace: true })
  }, [draft.phase, draft.bookingCode, navigate])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [])

  const seconds = Math.max(0, Math.ceil(((draft.holdUntil ?? now) - now) / 1000))

  useEffect(() => {
    if (draft.phase === 'holding' && draft.holdUntil && now >= draft.holdUntil) {
      expireHold()
      navigate('/thanh-toan/het-han')
    }
  }, [now, draft.phase, draft.holdUntil, expireHold, navigate])

  if (!quoted || draft.phase !== 'holding') return null

  const { room, location, base, discount, total } = quoted
  const end = checkoutLabel(draft.time, draft.duration)
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const account = '000000000000'
  const content = [
    `Ngân hàng: Ngân hàng demo`,
    `Chủ tài khoản: KABIN DEMO`,
    `Số tài khoản: ${account}`,
    `Nội dung: ${draft.paymentRef}`,
    `Số tiền: ${total}`,
  ].join('\n')

  const downloadQr = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect width="320" height="320" fill="white"/><text x="160" y="150" text-anchor="middle" font-size="28" font-family="sans-serif" fill="#C4624A">DEMO</text><text x="160" y="190" text-anchor="middle" font-size="14" font-family="sans-serif" fill="#1c1410">${draft.paymentRef}</text><text x="160" y="214" text-anchor="middle" font-size="14" font-family="sans-serif" fill="#1c1410">${formatMoney(total)}</text></svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${draft.paymentRef}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  const check = () => {
    setChecking(true)
    window.setTimeout(() => {
      const code = confirmPaid()
      navigate(`/ve/${code}`)
    }, 700)
  }

  return (
    <div className="wrap page narrow">
      <h1>Hoàn tất thanh toán</h1>
      <p className="lead">Vui lòng chuyển khoản theo thông tin bên dưới. Booking sẽ tự động xác nhận khi hệ thống nhận được tiền.</p>
      <div className="hold">
        <div>
          <span className="hold-icon">
            <Timer size={18} />
          </span>
          <div>
            <strong>Phòng đang được giữ cho bạn</strong>
            <p>Thanh toán trong thời gian còn lại để xác nhận booking.</p>
          </div>
        </div>
        <b className={seconds < 60 ? 'danger' : ''}>{mm}:{ss}</b>
      </div>

      <div className="pay-layout">
        <section className="panel">
          <h2>Thanh toán booking</h2>
          <p className="hint">Chuyển đúng số tiền và nội dung. Booking tự xác nhận khi hệ thống nhận được tiền.</p>
          <div className="qr-layout">
            <div>
              <DemoQr />
              <p className="hint center">Thông tin thanh toán minh họa</p>
            </div>
            <div className="qr-meta">
              <p className="hint">Số tiền thanh toán</p>
              <b className="price price-lg">{formatMoney(total)}</b>
              <PayRow label="Ngân hàng" value="Ngân hàng demo" />
              <PayRow label="Chủ tài khoản" value="KABIN DEMO" />
              <PayRow label="Số tài khoản" value="0000 0000 0000" copyValue={account} />
              <PayRow label="Nội dung" value={draft.paymentRef} />
              <PayRow label="Số tiền" value={formatMoney(total)} copyValue={String(total)} />
            </div>
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-line" onClick={downloadQr}>
              <Download size={16} /> Tải mã QR
            </button>
            <CopyButton value={content} label="Sao chép nội dung" />
          </div>
          <div className="wait-row">
            <p>
              <RefreshCw size={16} className="spin" /> Đang chờ nhận thanh toán...
              <span>Hệ thống sẽ tự động kiểm tra và xác nhận booking khi nhận được tiền.</span>
            </p>
            <button type="button" className="btn btn-primary" onClick={check} disabled={checking}>
              <RefreshCw size={16} /> {checking ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
            </button>
          </div>
        </section>

        <aside className="side">
          <article className="summary">
            <Photo src={room.photos[0]} alt="" />
            <div className="summary-head">
              <h2>{location.name}</h2>
              <span>
                Phòng {room.number} · {room.type}
              </span>
            </div>
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
              <span>Tiền phòng</span>
              <span>{formatMoney(base)}</span>
            </div>
            {discount ? (
              <div className="sum-row">
                <span>Giảm giá</span>
                <span>-{formatMoney(discount)}</span>
              </div>
            ) : null}
            <div className="sum-row total">
              <span>Tổng thanh toán</span>
              <b className="price">{formatMoney(total)}</b>
            </div>
            <div className="sum-row">
              <span>Mã booking</span>
              <b>{draft.bookingCode}</b>
            </div>
            <div className="sum-row">
              <span>Trạng thái</span>
              <b className="price">Đang chờ thanh toán</b>
            </div>
          </article>
          <div className="callout">
            <strong>Lưu ý quan trọng</strong>
            <p>Chuyển đúng số tiền và nội dung như trên. Không chỉnh sửa nội dung chuyển khoản. Booking sẽ tự động xác nhận khi hệ thống nhận được tiền.</p>
          </div>
          <Link to="/tro-giup?chu-de=Thanh%20to%C3%A1n" className="text-btn">
            Gặp vấn đề khi thanh toán?
          </Link>
        </aside>
      </div>
      <p className="hint lock-hint">
        <Lock size={14} /> Đây là thông tin ngân hàng minh họa, không phải tài khoản nhận tiền thật.
      </p>
    </div>
  )
}

function PayRow({ label, value, copyValue }: { label: string; value: string; copyValue?: string }) {
  return (
    <div className="kv">
      <span>{label}</span>
      <strong>{value}</strong>
      <CopyButton value={copyValue ?? value} quiet />
    </div>
  )
}
