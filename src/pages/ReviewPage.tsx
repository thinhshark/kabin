import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, Lock } from 'lucide-react'
import { quoteOf } from '../data'
import { useStore } from '../store'
import { Photo, Stepper, useTitle } from '../components/ui'
import { checkoutLabel, formatDate, formatMoney, isEmail, isPastSlot, isPhone, maskPhone, normalizePhone } from '../utils'

export function ReviewPage() {
  useTitle('Kiểm tra đặt phòng')
  const { draft, setDraft, user, openOtp, showToast, startHold } = useStore()
  const navigate = useNavigate()
  const quoted = quoteOf(draft.roomId, draft.duration, draft.promoCode)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) return
    setDraft({
      name: draft.name || user.name,
      email: draft.email || user.email,
      phone: draft.phone || user.phone,
      phoneVerified: draft.phoneVerified || Boolean(user.phone),
    })
    // Chỉ điền khi phiên đăng nhập thay đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!quoted) {
    return (
      <div className="wrap page">
        <h1>Chưa chọn phòng</h1>
        <p className="lead">Hãy chọn cơ sở và phòng trước khi kiểm tra đặt chỗ.</p>
        <Link to="/co-so" className="btn btn-primary">
          Xem cơ sở
        </Link>
      </div>
    )
  }

  const { room, location, base, discount, total, promo } = quoted
  const end = checkoutLabel(draft.time, draft.duration)

  const verifyPhone = () => {
    if (!isPhone(draft.phone)) {
      setErrors((current) => ({ ...current, phone: 'Nhập số điện thoại hợp lệ.' }))
      return
    }
    const phone = normalizePhone(draft.phone)
    openOtp({
      phone,
      purpose: 'checkout',
      onSuccess: () => {
        setDraft({ phone, phoneVerified: true })
        setErrors((current) => ({ ...current, phone: '' }))
        showToast('Đã xác thực số điện thoại')
      },
    })
  }

  const submit = () => {
    const next: Record<string, string> = {}
    if (draft.name.trim().length < 2) next.name = 'Nhập họ và tên.'
    if (!isPhone(draft.phone)) next.phone = 'Nhập số điện thoại hợp lệ.'
    else if (!draft.phoneVerified) next.phone = 'Xác thực số điện thoại để tiếp tục.'
    if (!isEmail(draft.email)) next.email = 'Nhập email để nhận thông tin đặt phòng.'
    if (!draft.agreed) next.agreed = 'Bạn cần đồng ý quy định đặt phòng.'
    if (isPastSlot(draft.date, draft.time)) next.slot = 'Khung giờ này đã qua. Hãy chọn lại phòng.'
    if (draft.promoCode && !promo.ok) next.promo = promo.message
    setErrors(next)
    if (Object.values(next).some(Boolean)) return
    setDraft({ phone: normalizePhone(draft.phone), promoCode: draft.promoCode.trim().toUpperCase() })
    startHold()
    navigate('/thanh-toan')
  }

  return (
    <div className="wrap page narrow">
      <Link to={`/co-so/${location.id}/chon-phong`} className="text-btn back-link">
        <ArrowLeft size={16} /> Quay lại chọn phòng
      </Link>
      <Stepper step={2} />
      <h1>Kiểm tra đặt phòng</h1>
      <p className="lead">Vui lòng kiểm tra phòng, thời gian và thông tin liên hệ.</p>
      {errors.slot ? <p className="form-error">{errors.slot}</p> : null}

      <div className="checkout">
        <form
          className="co-form"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <section className="panel">
            <h2>Thông tin liên hệ</h2>
            <label className="field">
              Họ và tên
              <input
                value={draft.name}
                onChange={(event) => setDraft({ name: event.target.value })}
                placeholder="Nguyễn Văn A"
              />
              {errors.name ? <span className="form-error">{errors.name}</span> : null}
            </label>
            <label className="field">
              Số điện thoại
              <span className="phone-row">
                <input
                  value={draft.phoneVerified ? maskPhone(draft.phone) : draft.phone}
                  readOnly={draft.phoneVerified}
                  onChange={(event) => setDraft({ phone: event.target.value, phoneVerified: false })}
                  placeholder="09xx xxx xxx"
                />
                {draft.phoneVerified ? (
                  <span className="verified">
                    <BadgeCheck size={16} /> Đã xác thực
                  </span>
                ) : (
                  <button type="button" className="btn btn-line btn-sm" onClick={verifyPhone}>
                    Nhận mã OTP
                  </button>
                )}
                {draft.phoneVerified ? (
                  <button type="button" className="text-btn" onClick={() => setDraft({ phoneVerified: false })}>
                    Đổi số
                  </button>
                ) : null}
              </span>
              {errors.phone ? <span className="form-error">{errors.phone}</span> : null}
            </label>
            <label className="field">
              Email
              <input
                type="email"
                value={draft.email}
                onChange={(event) => setDraft({ email: event.target.value })}
                placeholder="ban@email.com"
              />
              <span className="hint">Thông tin nhận phòng sẽ được gửi qua SMS và email.</span>
              {errors.email ? <span className="form-error">{errors.email}</span> : null}
            </label>
          </section>

          <section className="panel">
            <h2>Mã ưu đãi</h2>
            <div className="promo-row">
              <input
                value={draft.promoCode}
                placeholder="Nhập mã ưu đãi"
                onChange={(event) => setDraft({ promoCode: event.target.value.toUpperCase() })}
              />
              <button
                type="button"
                className="btn btn-line"
                onClick={() => {
                  if (!draft.promoCode.trim()) return
                  if (!promo.ok) {
                    setErrors((current) => ({ ...current, promo: promo.message }))
                    return
                  }
                  setErrors((current) => ({ ...current, promo: '' }))
                  showToast(promo.message)
                }}
              >
                Áp dụng
              </button>
            </div>
            {errors.promo ? <span className="form-error">{errors.promo}</span> : null}
            {draft.promoCode && promo.ok ? <span className="hint ok">{promo.message}</span> : null}
          </section>

          <div className="pay-box mobile-pay">
            <PayLines base={base} discount={discount} total={total} />
          </div>

          <label className="check agree">
            <input type="checkbox" checked={draft.agreed} onChange={(event) => setDraft({ agreed: event.target.checked })} />
            <span>
              Tôi đã đọc và đồng ý với <Link to="/chinh-sach/dat-phong">quy định đặt phòng</Link>
            </span>
          </label>
          {errors.agreed ? <span className="form-error">{errors.agreed}</span> : null}

          <button className="btn btn-primary btn-block mobile-pay" type="submit">
            Giữ phòng & thanh toán <ArrowRight size={16} />
          </button>
          <p className="hint lock-hint mobile-pay">
            <Lock size={14} /> Phòng được giữ trong 10 phút để bạn hoàn tất thanh toán.
          </p>
        </form>

        <aside className="side">
          <article className="summary">
            <Photo src={room.photos[0]} alt={room.type} />
            <div className="summary-head">
              <div>
                <h2>{location.name}</h2>
                <p>
                  Phòng {room.number} · {room.type}
                </p>
              </div>
              <Link to={`/co-so/${location.id}/chon-phong`}>Thay đổi</Link>
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
            <PayLines base={base} discount={discount} total={total} />
            <button className="btn btn-primary btn-block desktop-pay" type="button" onClick={submit}>
              Giữ phòng & thanh toán <ArrowRight size={16} />
            </button>
            <p className="hint lock-hint desktop-pay">
              <Lock size={14} /> Phòng được giữ trong 10 phút để bạn hoàn tất thanh toán.
            </p>
          </article>
        </aside>
      </div>
    </div>
  )
}

function PayLines({ base, discount, total }: { base: number; discount: number; total: number }) {
  return (
    <div className="pay-lines">
      <div className="sum-row">
        <span>Tiền phòng</span>
        <span>{formatMoney(base)}</span>
      </div>
      <div className="sum-row">
        <span>Giảm giá</span>
        <span>{discount ? `-${formatMoney(discount)}` : formatMoney(0)}</span>
      </div>
      <div className="sum-row total">
        <span>Tổng thanh toán</span>
        <b className="price">{formatMoney(total)}</b>
      </div>
    </div>
  )
}
