import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Headphones } from 'lucide-react'
import { PHOTOS } from '../data'
import { useStore } from '../store'
import { Logo, useTitle } from '../components/ui'
import { isPhone, normalizePhone } from '../utils'

export function LoginPage() {
  useTitle('Đăng nhập')
  const { openOtp, login } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/tai-khoan'
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const send = () => {
    if (!isPhone(phone)) {
      setError('Nhập số điện thoại 10 số, bắt đầu bằng 0.')
      return
    }
    const normalized = normalizePhone(phone)
    openOtp({
      phone: normalized,
      purpose: 'login',
      onSuccess: () => {
        login(normalized)
        navigate(from)
      },
    })
  }

  return (
    <div className="login-split">
      <section className="login-visual">
        <img src={PHOTOS.hero} alt="Phòng Kabin" />
        <div className="hero-shade" />
        <div className="login-brand">
          <Logo />
          <h1>
            Một khoảng riêng.
            <br />
            Trọn vẹn tự do.
          </h1>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-top">
          <Logo />
          <Link to="/tro-giup" className="support-btn">
            <Headphones size={16} /> Hỗ trợ
          </Link>
        </div>
        <div className="login-card">
          <h2>Chào mừng đến Kabin</h2>
          <p className="subhead">Đăng nhập / Đăng ký</p>
          <p className="hint center">Quản lý đặt phòng và những khoảng nghỉ của bạn.</p>
          <label className="field">
            Số điện thoại
            <span className="phone-row">
              <select aria-label="Mã quốc gia" defaultValue="+84">
                <option>+84</option>
              </select>
              <input
                inputMode="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </span>
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="button" className="btn btn-primary btn-block" onClick={send}>
            Nhận mã OTP <ArrowRight size={16} />
          </button>
          <p className="hint center">Chúng tôi sẽ gửi mã xác thực qua SMS.</p>
          <hr />
          <p className="hint center">Chưa có tài khoản? Hoàn tất xác thực để bắt đầu.</p>
          <p className="hint center">
            Bằng việc tiếp tục, bạn đồng ý với <Link to="/chinh-sach/dieu-khoan">Điều khoản sử dụng</Link>
            {' · '}
            <Link to="/chinh-sach/rieng-tu">Chính sách bảo mật</Link>
          </p>
        </div>
        <Link to={from === '/dat-phong' ? '/dat-phong' : '/'} className="text-btn">
          Tiếp tục đặt phòng trên web <ArrowRight size={16} />
        </Link>
        <p className="hint">Bạn có thể đặt phòng trên web mà không cần tài khoản.</p>
      </section>
    </div>
  )
}
