import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bath,
  BedDouble,
  Car,
  ChevronDown,
  Copy,
  Droplets,
  Snowflake,
  Tv,
  Wifi,
} from 'lucide-react'
import type { Amenity, BookingStatus } from '../data'
import { statusLabel } from '../data'
import { useStore } from '../store'
import { copyText, cx, formatMoney, initials } from '../utils'

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title === 'Kabin' ? 'Kabin — Self check-in' : `${title} · Kabin`
  }, [title])
}

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Kabin, về trang chủ">
      <span className="logo-name">Kabin</span>
      <span className="logo-sub">SELF-CHECKIN</span>
    </Link>
  )
}

export function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        const img = event.currentTarget
        if (img.dataset.fallback) return
        img.dataset.fallback = '1'
        img.src = '/photos/fallback.svg'
      }}
    />
  )
}

export function Price({ value, unit }: { value: number; unit?: string }) {
  return (
    <span className="price">
      {formatMoney(value)}
      {unit ? <small> / {unit}</small> : null}
    </span>
  )
}

export function AmenityIcon({ name }: { name: string }) {
  const props = { size: 16, strokeWidth: 1.75 }
  switch (name) {
    case 'Máy chiếu':
      return <Tv {...props} />
    case 'Giường đôi':
      return <BedDouble {...props} />
    case 'Wi-Fi':
      return <Wifi {...props} />
    case 'Bồn tắm':
      return <Bath {...props} />
    case 'Chỗ để xe':
      return <Car {...props} />
    case 'Điều hòa':
      return <Snowflake {...props} />
    case 'Phòng tắm riêng':
      return <Droplets {...props} />
    default:
      return null
  }
}

export function AmenityList({ items }: { items: string[] }) {
  return (
    <ul className="amenity-row">
      {items.map((item) => (
        <li key={item}>
          <AmenityIcon name={item} />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function StatusPill({ status }: { status: BookingStatus }) {
  return <span className={cx('pill', `pill-${status}`)}>{statusLabel(status)}</span>
}

export function Crumb({ items }: { items: Array<{ label: string; to?: string }> }) {
  return (
    <nav className="crumb" aria-label="Đường dẫn">
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 ? <span className="crumb-sep">/</span> : null}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const labels = ['Chọn phòng', 'Thông tin', 'Thanh toán']
  return (
    <ol className="stepper">
      {labels.map((label, index) => {
        const number = index + 1
        const done = number < step
        const on = number === step
        return (
          <li key={label} className="step-wrap">
            {index > 0 ? <span className={cx('step-line', done && 'done')} /> : null}
            <span className={cx('step', on && 'on', done && 'done')}>
              <b>{done ? '✓' : number}</b>
              <span>{label}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function Accordion({
  items,
  initial = null,
}: {
  items: Array<{ title: string; content: ReactNode }>
  initial?: number | null
}) {
  const [open, setOpen] = useState<number | null>(initial)
  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <div key={item.title} className={cx('acc-item', isOpen && 'open')}>
            <button
              type="button"
              className="acc-btn"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              {item.title}
              <ChevronDown size={18} />
            </button>
            {isOpen ? <div className="acc-body">{item.content}</div> : null}
          </div>
        )
      })}
    </div>
  )
}

export function Gallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const side = photos.slice(1, 3)
  return (
    <>
      <div className="gallery">
        <button type="button" className="frame gallery-main" onClick={() => { setIndex(0); setOpen(true) }}>
          <Photo src={photos[0]} alt={alt} />
        </button>
        <div className="gallery-side">
          {side.map((src, i) => (
            <button
              key={src}
              type="button"
              className="frame"
              onClick={() => {
                setIndex(i + 1)
                setOpen(true)
              }}
            >
              <Photo src={src} alt="" />
            </button>
          ))}
          <button type="button" className="gallery-all" onClick={() => { setIndex(0); setOpen(true) }}>
            Xem tất cả ảnh
          </button>
        </div>
      </div>
      {open ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Ảnh phòng" onClick={() => setOpen(false)}>
          <button type="button" className="lightbox-x" aria-label="Đóng" onClick={() => setOpen(false)}>
            ×
          </button>
          <img src={photos[index]} alt={alt} onClick={(event) => event.stopPropagation()} />
          <div className="lightbox-nav" onClick={(event) => event.stopPropagation()}>
            {photos.map((src, i) => (
              <button key={`${src}-${i}`} type="button" className={cx(i === index && 'on')} onClick={() => setIndex(i)}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}

export function CopyButton({ value, label, quiet = false }: { value: string; label?: string; quiet?: boolean }) {
  const { showToast } = useStore()
  return (
    <button
      type="button"
      className={cx('copy-btn', quiet && 'quiet')}
      onClick={async () => {
        const ok = await copyText(value)
        showToast(ok ? 'Đã sao chép' : 'Không sao chép được')
      }}
    >
      <Copy size={15} />
      {label ?? (quiet ? null : 'Sao chép')}
    </button>
  )
}

export function DemoQr() {
  const size = 25
  const cells: boolean[] = []
  let seed = 20261016
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed
  }
  const finder = (x: number, y: number) => {
    const boxes = [
      [0, 0],
      [size - 7, 0],
      [0, size - 7],
    ]
    for (const [bx, by] of boxes) {
      if (x < bx || y < by || x >= bx + 7 || y >= by + 7) continue
      const lx = x - bx
      const ly = y - by
      const edge = lx === 0 || ly === 0 || lx === 6 || ly === 6
      const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4
      return edge || core
    }
    return null
  }
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const inBadge = x > 8 && x < 16 && y > 10 && y < 15
      const found = finder(x, y)
      if (inBadge) cells.push(false)
      else if (found !== null) cells.push(found)
      else cells.push(next() % 3 !== 0)
    }
  }
  return (
    <div className="qr" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }} aria-hidden="true">
      {cells.map((on, index) => (
        <i key={index} className={on ? 'on' : ''} />
      ))}
      <span className="qr-badge">DEMO</span>
    </div>
  )
}

export function AccountNav() {
  const { user, logout } = useStore()
  const navigate = useNavigate()
  if (!user) return null
  const items = [
    { to: '/tai-khoan', label: 'Thông tin cá nhân' },
    { to: '/dat-phong-cua-toi', label: 'Đặt phòng của tôi' },
    { to: '/uu-dai', label: 'Ưu đãi của tôi' },
    { to: '/tro-giup', label: 'Trợ giúp' },
  ]
  return (
    <aside className="account-nav">
      <div className="who">
        <span className="avatar">{initials(user.name)}</span>
        <strong>{user.name}</strong>
      </div>
      <nav>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/tai-khoan'}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        className="text-btn"
        onClick={() => {
          logout()
          navigate('/')
        }}
      >
        Đăng xuất
      </button>
    </aside>
  )
}

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      <p>{text}</p>
      {action}
    </div>
  )
}

export function amenityText(items: Amenity[]) {
  return items.slice(0, 3).join(' · ')
}
