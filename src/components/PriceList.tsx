import { useEffect, useState } from 'react'
import { PRICE_HOURS, PRICE_ROOMS, RATE_BANDS } from '../priceList'
import { cx, formatMoney } from '../utils'

export function PriceBoard() {
  const [roomId, setRoomId] = useState<(typeof PRICE_ROOMS)[number]['id']>('lake')

  return (
    <div className="price-board">
      <div className="price-board-head">
        <div>
          <p className="kicker">Kabin Stays</p>
          <h2>Bảng giá phòng</h2>
        </div>
        <p>Đơn vị: đồng / phòng</p>
      </div>
      <div className="price-room-switch" role="tablist" aria-label="Loại phòng">
        {PRICE_ROOMS.map((room) => (
          <button
            key={room.id}
            type="button"
            role="tab"
            aria-selected={room.id === roomId}
            className={room.id === roomId ? 'on' : undefined}
            onClick={() => setRoomId(room.id)}
          >
            {room.name}
          </button>
        ))}
      </div>
      <div className="rate-scroll">
        <table className="rate-table">
          <thead>
            <tr>
              <th rowSpan={2}>Thời lượng</th>
              {PRICE_ROOMS.map((room) => (
                <th key={room.id} colSpan={3} className={cx('room-group', room.id === roomId && 'shown', `group-${room.id}`)}>
                  {room.name}
                </th>
              ))}
            </tr>
            <tr>
              {PRICE_ROOMS.flatMap((room) =>
                RATE_BANDS.map((band) => (
                  <th key={`${room.id}-${band.id}`} className={cx(room.id === roomId && 'shown', `group-${room.id}`)}>
                    {band.label}
                    <small>{band.note}</small>
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {PRICE_HOURS.map((hour) => (
              <tr key={hour} className={hour === 24 ? 'cap' : undefined}>
                <th>{hour} giờ</th>
                {PRICE_ROOMS.flatMap((room) =>
                  RATE_BANDS.map((band) => (
                    <td key={`${room.id}-${band.id}`} className={cx(room.id === roomId && 'shown', `group-${room.id}`)}>
                      {formatMoney(room.hours[band.id][hour - 2])}
                    </td>
                  )),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overnight-board">
        <div>
          <strong>Qua đêm</strong>
          <span>22h–9h sáng hôm sau</span>
        </div>
        <table className="rate-table overnight-table">
          <thead>
            <tr>
              <th>Loại phòng</th>
              <th>Đêm Chủ nhật–Thứ năm</th>
              <th>Đêm Thứ sáu, Thứ bảy và lễ, Tết</th>
            </tr>
          </thead>
          <tbody>
            {PRICE_ROOMS.map((room) => (
              <tr key={room.id}>
                <th>{room.name}</th>
                <td>{formatMoney(room.overnight.weekday)}</td>
                <td>{formatMoney(room.overnight.weekend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="price-notes">
        <p>Theo giờ: tính theo giờ nhận phòng. Sau 8 giờ, mỗi giờ thêm 30.000đ đến khi chạm giá gói 24 giờ.</p>
        <p>Qua đêm: tính theo ngày bắt đầu đêm.</p>
      </div>
    </div>
  )
}

export function PriceListLink() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button type="button" className="text-btn price-list-link" onClick={() => setOpen(true)}>
        Xem bảng giá
      </button>
      {open ? (
        <div className="modal-root" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="modal-card price-modal align-left"
            role="dialog"
            aria-modal="true"
            aria-label="Bảng giá phòng"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="modal-x" aria-label="Đóng" onClick={() => setOpen(false)}>
              ×
            </button>
            <PriceBoard />
          </div>
        </div>
      ) : null}
    </>
  )
}
