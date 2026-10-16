import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, Headphones, Hourglass, Info } from 'lucide-react'
import { DURATIONS, FILTER_AMENITIES, getLocation, roomsAt, TIMES, type Amenity } from '../data'
import { useStore } from '../store'
import { AmenityIcon, Crumb, Photo, useTitle } from '../components/ui'
import { checkoutLabel, cx, formatMoney, isPastSlot, slotPrice } from '../utils'

export function SelectRoomPage() {
  const { id = '' } = useParams()
  const location = getLocation(id)
  useTitle('Chọn phòng')
  const { draft, setDraft, showToast } = useStore()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const typeFilter = params.get('loai') ?? ''
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [sort, setSort] = useState<'asc' | 'desc' | 'number'>('asc')

  const end = checkoutLabel(draft.time, draft.duration)
  const past = isPastSlot(draft.date, draft.time)

  const rooms = useMemo(() => {
    if (!location) return []
    const list = roomsAt(location.id).filter((room) => {
      if (typeFilter && room.type !== typeFilter) return false
      if (onlyOpen && !room.available) return false
      return amenities.every((item) => room.amenities.includes(item))
    })
    list.sort((a, b) => {
      if (sort === 'desc') return b.price3h - a.price3h
      if (sort === 'number') return a.number.localeCompare(b.number)
      return a.price3h - b.price3h
    })
    return list
  }, [location, typeFilter, onlyOpen, amenities, sort])

  if (!location) {
    return (
      <div className="wrap page">
        <h1>Không tìm thấy cơ sở</h1>
        <Link to="/co-so">Về danh sách</Link>
      </div>
    )
  }

  const openCount = rooms.filter((room) => room.available).length

  return (
    <div className="wrap page">
      <Crumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Cơ sở', to: '/co-so' },
          { label: location.name, to: `/co-so/${location.id}` },
          { label: 'Chọn phòng' },
        ]}
      />
      <div className="title-row">
        <div>
          <h1>Chọn phòng cho khoảng nghỉ của bạn</h1>
          <p className="meta-line">
            {location.name} · {location.city}
            <Link to="/co-so">Đổi cơ sở</Link>
          </p>
        </div>
      </div>

      <form
        className="criteria"
        onSubmit={(event) => {
          event.preventDefault()
          showToast('Đã cập nhật phòng trống')
        }}
      >
        <label className="control">
          <Calendar size={18} />
          <span>
            <span className="control-label">Ngày nghỉ</span>
            <input type="date" value={draft.date} onChange={(event) => setDraft({ date: event.target.value })} />
          </span>
        </label>
        <label className="control">
          <Clock size={18} />
          <span>
            <span className="control-label">Giờ nhận phòng</span>
            <select value={draft.time} onChange={(event) => setDraft({ time: event.target.value })}>
              {TIMES.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </span>
        </label>
        <label className="control">
          <Hourglass size={18} />
          <span>
            <span className="control-label">Thời lượng nghỉ</span>
            <select value={draft.duration} onChange={(event) => setDraft({ duration: Number(event.target.value) })}>
              {DURATIONS.map((hours) => (
                <option key={hours} value={hours}>
                  {hours} giờ
                </option>
              ))}
            </select>
          </span>
        </label>
        <div className="control readonly">
          <Clock size={18} />
          <span>
            <span className="control-label">Trả phòng lúc</span>
            <strong>
              {end.time}
              <small> {draft.date.split('-').reverse().join('/')}</small>
            </strong>
          </span>
        </div>
        <button className="btn btn-primary" type="submit">
          Cập nhật
        </button>
      </form>
      {past ? <p className="form-error">Khung giờ này đã qua. Hãy chọn giờ khác trước khi đặt.</p> : null}

      <div className="catalog rooms">
        <aside className="filters static">
          <strong>Tiện ích</strong>
          {FILTER_AMENITIES.concat(['Giường đôi', 'Wi-Fi']).map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={amenities.includes(item)}
                onChange={() =>
                  setAmenities((current) =>
                    current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
                  )
                }
              />
              <AmenityIcon name={item} /> {item}
            </label>
          ))}
          <label className="check">
            <input type="checkbox" checked={onlyOpen} onChange={() => setOnlyOpen((value) => !value)} />
            Chỉ hiện phòng còn trống
          </label>
          {typeFilter ? (
            <button type="button" className="chip on" onClick={() => setParams({})}>
              Loại {typeFilter} ×
            </button>
          ) : null}
        </aside>
        <div>
          <div className="catalog-bar">
            <strong>
              {openCount} phòng còn trống <span>{draft.time}–{end.time} · {draft.duration} giờ</span>
            </strong>
            <label>
              Sắp xếp theo
              <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                <option value="asc">Giá từ thấp đến cao</option>
                <option value="desc">Giá từ cao đến thấp</option>
                <option value="number">Số phòng</option>
              </select>
            </label>
          </div>
          <div className="stack">
            {rooms.length === 0 ? (
              <div className="empty">
                <strong>Không có phòng khớp bộ lọc</strong>
                <p>Thử bỏ bớt tiện ích hoặc đổi thời gian.</p>
              </div>
            ) : (
              rooms.map((room) => {
                const price = slotPrice(room.price3h, draft.duration)
                return (
                  <article key={room.id} className={cx('room-row', !room.available && 'off')}>
                    <Photo src={room.photos[0]} alt={`Phòng ${room.number}`} />
                    <div>
                      <h2>
                        Phòng {room.number} · {room.type}
                      </h2>
                      <p className="meta-line">
                        {room.amenities.slice(0, 3).map((item) => (
                          <span key={item}>
                            <AmenityIcon name={item} /> {item}
                          </span>
                        ))}
                      </p>
                      {room.available ? (
                        <span className="pill pill-upcoming">Còn trống</span>
                      ) : (
                        <span className="pill pill-expired">Không khả dụng trong khung giờ này</span>
                      )}
                    </div>
                    <div className="room-row-end">
                      <b className="price">
                        {formatMoney(price)} <small>/ {draft.duration} giờ</small>
                      </b>
                      {room.available ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={past}
                          onClick={() => {
                            setDraft({ locationId: location.id, roomId: room.id })
                            navigate(`/co-so/${location.id}/phong/${room.id}`)
                          }}
                        >
                          Xem phòng <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button type="button" className="btn btn-muted" disabled>
                          Không khả dụng
                        </button>
                      )}
                    </div>
                  </article>
                )
              })
            )}
          </div>
          <div className="note-row">
            <span>
              <Info size={16} /> Thay đổi thời gian để xem thêm phòng phù hợp.
            </span>
            <Link to="/tro-giup">
              <Headphones size={15} /> Cần hỗ trợ chọn phòng?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
