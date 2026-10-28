import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BadgeCheck, CalendarDays, ChevronRight, Headphones, LogOut, Tag } from 'lucide-react'
import { useStore } from '../store'
import { AccountNav, useTitle } from '../components/ui'
import { initials, isEmail, isPhone, maskPhone, normalizePhone } from '../utils'

export function AccountPage() {
  useTitle('Tài khoản')
  const { user, updateUser, logout, openOtp, showToast } = useStore()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [nextPhone, setNextPhone] = useState('')
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  if (!user) return <Navigate to="/" replace />

  const save = () => {
    if (name.trim().length < 2) {
      setError('Nhập họ và tên.')
      return
    }
    if (email && !isEmail(email)) {
      setError('Email chưa đúng định dạng.')
      return
    }
    updateUser({ name: name.trim(), email: email.trim() })
    setError('')
    showToast('Đã lưu thay đổi')
  }

  const changePhone = () => {
    if (!isPhone(nextPhone)) {
      setError('Nhập số điện thoại mới hợp lệ.')
      return
    }
    const phone = normalizePhone(nextPhone)
    openOtp({
      phone,
      purpose: 'change-phone',
      onSuccess: () => {
        updateUser({ phone })
        setEditing(false)
        setNextPhone('')
        setError('')
        showToast('Đã đổi số điện thoại')
      },
    })
  }

  return (
    <div className="wrap page">
      <div className="account-layout">
        <AccountNav />
        <div>
          <h1>Tài khoản của tôi</h1>
          <p className="lead">Cập nhật thông tin để Kabin liên hệ đúng với bạn.</p>
          <div className="who mobile-who">
            <span className="avatar">{initials(user.name)}</span>
            <strong>{user.name}</strong>
          </div>
          <section className="panel">
            <h2>Thông tin cá nhân</h2>
            <label className="field">
              Họ và tên
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="field">
              Số điện thoại
              {editing ? (
                <span className="phone-row">
                  <input value={nextPhone} placeholder="Số mới" onChange={(event) => setNextPhone(event.target.value)} />
                  <button type="button" className="btn btn-line btn-sm" onClick={changePhone}>
                    Gửi mã
                  </button>
                  <button type="button" className="text-btn" onClick={() => setEditing(false)}>
                    Hủy
                  </button>
                </span>
              ) : (
                <span className="phone-row">
                  <input readOnly value={maskPhone(user.phone)} />
                  <span className="verified">
                    <BadgeCheck size={16} /> Đã xác thực
                  </span>
                  <button type="button" className="text-btn" onClick={() => setEditing(true)}>
                    Thay đổi
                  </button>
                </span>
              )}
            </label>
            <label className="field">
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ban@email.com" />
              <span className="hint">Thông tin đặt phòng được gửi qua SMS và email.</span>
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="button" className="btn btn-primary btn-block" onClick={save}>
              Lưu thay đổi
            </button>
          </section>
          <section className="panel toggle-row">
            <div>
              <h2>Thông báo ưu đãi</h2>
              <p>Nhận thông tin ưu đãi mới từ Kabin.</p>
            </div>
            <button
              type="button"
              className={user.promoNotify ? 'switch on' : 'switch'}
              role="switch"
              aria-checked={user.promoNotify}
              onClick={() => updateUser({ promoNotify: !user.promoNotify })}
            >
              <i />
            </button>
          </section>
          <div className="mobile-links">
            <Link to="/dat-phong-cua-toi">
              <CalendarDays size={18} /> Đặt phòng của tôi <ChevronRight size={18} />
            </Link>
            <Link to="/uu-dai">
              <Tag size={18} /> Ưu đãi của tôi <ChevronRight size={18} />
            </Link>
            <Link to="/tro-giup">
              <Headphones size={18} /> Trợ giúp <ChevronRight size={18} />
            </Link>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              <LogOut size={18} /> Đăng xuất <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
