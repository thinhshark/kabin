import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Copy } from 'lucide-react'
import { getLocation, isPromoExpired, PROMOS, promoValueLabel, type Promo } from '../data'
import { useStore } from '../store'
import { useTitle } from '../components/ui'
import { asset, copyText, cx, formatDate, formatMoney } from '../utils'

export function PromosPage() {
  useTitle('Ưu đãi')
  const { user, toggleSavedPromo, setDraft, showToast } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'all' | 'saved' | 'expired'>('all')
  const saved = user?.savedPromos ?? []
  const visible = PROMOS.filter((promo) => {
    const expired = isPromoExpired(promo)
    if (tab === 'expired') return expired
    if (tab === 'saved') return saved.includes(promo.code) && !expired
    return true
  })
  const activeSaved = saved.filter((code) => PROMOS.some((promo) => promo.code === code && !isPromoExpired(promo))).length

  const useCode = (promo: Promo) => {
    setDraft({ promoCode: promo.code })
    showToast(`Đã chọn mã ${promo.code}`)
    navigate('/co-so')
  }

  return (
    <div className="wrap page">
      <section className="promo-hero">
        <div>
          <h1>Thêm ưu đãi, trọn khoảng nghỉ</h1>
          <p>Chọn mã phù hợp cho lần đặt phòng tiếp theo.</p>
        </div>
        <img src={asset('/photos/promo.jpg')} alt="Thiệp ưu đãi Kabin" />
      </section>
      <div className="tabs">
        <button type="button" className={tab === 'all' ? 'on' : ''} onClick={() => setTab('all')}>
          Tất cả ({PROMOS.length})
        </button>
        <button type="button" className={tab === 'saved' ? 'on' : ''} onClick={() => setTab('saved')}>
          Đã lưu ({activeSaved})
        </button>
        <button type="button" className={tab === 'expired' ? 'on' : ''} onClick={() => setTab('expired')}>
          Hết hạn ({PROMOS.filter(isPromoExpired).length})
        </button>
        <span className="tabs-note">{activeSaved} ưu đãi đang áp dụng</span>
      </div>
      <div className="cards-3">
        {visible.map((promo) => {
          const expired = isPromoExpired(promo)
          const location = promo.locationId ? getLocation(promo.locationId) : undefined
          const kept = saved.includes(promo.code)
          return (
            <article key={promo.code} className={cx('voucher', expired && 'expired')}>
              <div className="voucher-value">
                <span>GIẢM</span>
                <strong>{promoValueLabel(promo)}</strong>
                {expired ? <em>Đã hết hạn</em> : null}
              </div>
              <div className="voucher-body">
                <div className="summary-head">
                  <h2>{promo.title}</h2>
                  <button
                    type="button"
                    className={cx('icon-plain', kept && 'on')}
                    aria-label={kept ? 'Bỏ lưu' : 'Lưu mã'}
                    onClick={() => {
                      if (!user) {
                        showToast('Đăng nhập để lưu ưu đãi')
                        navigate('/dang-nhap', { state: { from: '/uu-dai' } })
                        return
                      }
                      toggleSavedPromo(promo.code)
                    }}
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
                <p className="code-line">
                  Mã ưu đãi <b>{promo.code}</b>
                  <button
                    type="button"
                    className="icon-plain"
                    aria-label="Sao chép mã"
                    onClick={async () => {
                      await copyText(promo.code)
                      showToast('Đã sao chép mã')
                    }}
                  >
                    <Copy size={14} />
                  </button>
                </p>
                <ul>
                  {promo.kind === 'percent' && promo.cap ? <li>Tối đa {formatMoney(promo.cap)}</li> : null}
                  <li>Booking từ {formatMoney(promo.min)}</li>
                  {location ? <li>{location.name}</li> : null}
                  <li>{expired ? `Hết hạn ${formatDate(promo.until)}` : `Đến ${formatDate(promo.until)}`}</li>
                </ul>
                <div className="btn-row">
                  <button
                    type="button"
                    className="btn btn-line btn-sm"
                    onClick={async () => {
                      await copyText(promo.code)
                      showToast('Đã sao chép mã')
                    }}
                  >
                    Sao chép mã
                  </button>
                  {expired ? (
                    <button type="button" className="btn btn-muted btn-sm" disabled>
                      Đã hết hạn
                    </button>
                  ) : (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => useCode(promo)}>
                      Dùng mã
                    </button>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {visible.length === 0 ? (
        <div className="empty">
          <strong>Chưa có mã trong mục này</strong>
          <p>Các mã đang mở nằm ở tab Tất cả.</p>
        </div>
      ) : null}
      <p className="callout">Nhập mã ưu đãi ở bước kiểm tra đặt phòng.</p>
    </div>
  )
}
