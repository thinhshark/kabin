import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronDown, Headphones, Home, LogOut, Search } from 'lucide-react'
import { useStore } from '../store'
import { cx, initials } from '../utils'
import { Logo } from './ui'

const NAV = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/co-so', label: 'Cơ sở', end: false },
  { to: '/huong-dan', label: 'Hướng dẫn', end: false },
]

export function Shell() {
  const { user, logout } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const path = location.pathname
  const slim = path === '/dat-phong' || path === '/thanh-toan' || path === '/thanh-toan/het-han'

  useEffect(() => {
    setMenu(false)
  }, [path])

  useEffect(() => {
    if (!menu) return
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenu(false)
    }
    window.addEventListener('mousedown', onPointer)
    return () => window.removeEventListener('mousedown', onPointer)
  }, [menu])

  return (
    <div className={cx('app', slim && 'slim')}>
      <a className="skip" href="#content">
        Đi tới nội dung
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          {slim ? null : (
            <nav className="nav-center" aria-label="Chính">
              {NAV.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cx('nav-link', isActive && 'active')}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
          <div className="header-actions">
            <Link to="/tra-cuu" className="lookup-link">
              <Search size={16} />
              <span>Tra cứu đặt phòng</span>
            </Link>
            {user ? (
              <div className="user-menu" ref={menuRef}>
                <button type="button" className="avatar-btn" onClick={() => setMenu((open) => !open)} aria-expanded={menu}>
                  <span className="avatar">{initials(user.name)}</span>
                  <span className="user-name">{user.name}</span>
                  <ChevronDown size={16} />
                </button>
                {menu ? (
                  <div className="menu">
                    <Link to="/tai-khoan">Tài khoản</Link>
                    <Link to="/dat-phong-cua-toi">Đặt phòng của tôi</Link>
                    <Link to="/uu-dai">Ưu đãi</Link>
                    <Link to="/tro-giup">Trợ giúp</Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        navigate('/')
                      }}
                    >
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
            <Link to="/tro-giup" className={cx('support-btn', user && 'icon-only-desktop')}>
              <Headphones size={16} />
              <span>Hỗ trợ</span>
            </Link>
          </div>
        </div>
      </header>
      <main id="content" className="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <Logo />
          <nav aria-label="Chân trang">
            <Link to="/chinh-sach">Chính sách</Link>
            <Link to="/tro-giup">Câu hỏi thường gặp</Link>
            <Link to="/tra-cuu">Tra cứu</Link>
            <Link to="/tro-giup">Liên hệ</Link>
          </nav>
        </div>
      </footer>
      {slim ? null : (
        <nav className="bottom-nav" aria-label="Điều hướng điện thoại">
          <NavLink to="/" end className={({ isActive }) => cx('tab', isActive && 'active')}>
            <Home size={20} />
            Trang chủ
          </NavLink>
          <NavLink to="/dat-phong-cua-toi" className={({ isActive }) => cx('tab', isActive && 'active')}>
            <CalendarDays size={20} />
            Đặt phòng của tôi
          </NavLink>
          <NavLink to="/tro-giup" className={({ isActive }) => cx('tab', isActive && 'active')}>
            <Headphones size={20} />
            Hỗ trợ
          </NavLink>
        </nav>
      )}
    </div>
  )
}
