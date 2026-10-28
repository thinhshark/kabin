import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, Headphones, Hourglass, Info, MapPin } from 'lucide-react'
import { FILTER_AMENITIES, getLocation, ROOMS, roomsAt, type Amenity, type Room } from '../data'
import { useStore } from '../store'
import { DateField } from '../components/DateField'
import { DurationSelect } from '../components/DurationSelect'
import { TimeField } from '../components/TimeField'
import { AmenityIcon, Crumb, Photo, useTitle } from '../components/ui'
import { checkoutLabel, cx, formatMoney, isPastSlot, overnightStay, slotPrice, stayHours, todayISO } from '../utils'

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

  const today = todayISO()
  useEffect(() => {
    if (draft.date < today) setDraft({ date: today })
  }, [draft.date, setDraft, today])

  const end = checkoutLabel(draft.time, draft.duration)
  const past = isPastSlot(draft.date, draft.time)
  const stayLabel = draft.overnight ? 'Qua đêm' : hoursLabel(draft.duration)

  const { here, elsewhere } = useMemo(() => {
    if (!location) return { here: [] as Room[], elsewhere: [] as Room[] }
    const matches = (room: Room) => {
      if (typeFilter && room.type !== typeFilter) return false
      if (onlyOpen && !room.available) return false
      return amenities.every((item) => room.amenities.includes(item))
    }
    const byChoice = (a: Room, b: Room) => {
      if (sort === 'desc') return b.price3h - a.price3h
      if (sort === 'number') return a.number.localeCompare(b.number, 'vi')
      return a.price3h - b.price3h
    }
    const hereRooms = roomsAt(location.id).filter(matches)
    hereRooms.sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1
      return byChoice(a, b)
    })
    const otherRooms = ROOMS.filter((room) => room.locationId !== location.id && room.available && matches(room))
    otherRooms.sort((a, b) => {
      const distance = (getLocation(a.locationId)?.distance ?? 0) - (getLocation(b.locationId)?.distance ?? 0)
      if (distance !== 0) return distance
      return byChoice(a, b)
    })
    return { here: hereRooms, elsewhere: otherRooms }
  }, [location, typeFilter, onlyOpen, amenities, sort])

  if (!location) {
    return (
      <div className="wrap page">
        <h1>Không tìm thấy cơ sở</h1>
        <Link to="/co-so">Về danh sách</Link>
      </div>
    )
  }

  const openCount = here.filter((room) => room.available).length + elsewhere.length

  return (
    <div className="wrap page">
      <Crumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Hệ thống cơ sở', to: '/co-so' },
          { label: location.name, to: `/co-so/${location.id}` },
          { label: 'Chọn phòng' },
        ]}
      />
      <div className="title-row">
        <div>
          <h1>Chọn phòng cho khoảng nghỉ của bạn</h1>
          <p className="meta-line">
            <span className="place-line">
              <MapPin size={16} />
              {location.name} · {location.city}
            </span>
            <Link to="/co-so" className="change-place">
              Đổi cơ sở
            </Link>
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
            <span className="control-label">Chọn ngày</span>
            <DateField hideLabel label="Chọn ngày" value={draft.date < today ? today : draft.date} onChange={(date) => setDraft({ date })} />
          </span>
        </label>
        <div className="control">
          <Clock size={18} />
          <TimeField
            label="Giờ nhận phòng"
            value={draft.time}
            onChange={(time) =>
              setDraft(draft.overnight ? { time, ...overnightStay(time) } : { time, duration: stayHours(time, draft.checkoutTime) })
            }
          />
        </div>
        <label className="control">
          <Hourglass size={18} />
          <span>
            <span className="control-label">Thời lượng</span>
            <DurationSelect
              time={draft.time}
              duration={draft.duration}
              overnight={draft.overnight}
              onChange={(next) => setDraft(next)}
            />
          </span>
        </label>
        <div className="control">
          <Clock size={18} />
          <TimeField
            label="Giờ trả phòng"
            value={draft.checkoutTime}
            align="end"
            onChange={(checkoutTime) =>
              setDraft({ overnight: false, checkoutTime, duration: stayHours(draft.time, checkoutTime) })
            }
          />
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
              <span className="open-count">{openCount} phòng còn trống</span>{' '}
              <span>{draft.time}–{draft.checkoutTime}{end.nextDay ? ' hôm sau' : ''} · {stayLabel}</span>
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
            {here.length === 0 && elsewhere.length === 0 ? (
              <div className="empty">
                <strong>Không có phòng khớp bộ lọc</strong>
                <p>Thử bỏ bớt tiện ích hoặc đổi thời gian.</p>
              </div>
            ) : (
              <>
                {here.map((room) => (
                  <RoomChoice
                    key={room.id}
                    room={room}
                    stayLabel={stayLabel}
                    price={slotPrice(room.price3h, draft.duration)}
                    past={past}
                    onOpen={(placeId) => {
                      setDraft({ locationId: placeId, roomId: room.id })
                      navigate(`/co-so/${placeId}/phong/${room.id}`)
                    }}
                  />
                ))}
                {elsewhere.length > 0 ? (
                  <div className="other-rooms-head">
                    <h3>Phòng trống ở cơ sở khác</h3>
                    <p>Thêm lựa chọn gần bạn, trong cùng khung giờ.</p>
                  </div>
                ) : null}
                {elsewhere.map((room) => (
                  <RoomChoice
                    key={room.id}
                    room={room}
                    stayLabel={stayLabel}
                    price={slotPrice(room.price3h, draft.duration)}
                    past={past}
                    onOpen={(placeId) => {
                      setDraft({ locationId: placeId, roomId: room.id })
                      navigate(`/co-so/${placeId}/phong/${room.id}`)
                    }}
                  />
                ))}
              </>
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

function RoomChoice({
  room,
  stayLabel,
  price,
  past,
  onOpen,
}: {
  room: Room
  stayLabel: string
  price: number
  past: boolean
  onOpen: (locationId: string) => void
}) {
  const place = getLocation(room.locationId)
  return (
    <article className={cx('room-row', !room.available && 'off')}>
      <Photo src={room.photos[0]} alt={`Phòng ${room.number}`} />
      <div>
        <h2>
          Phòng {room.number} · {room.type}
        </h2>
        <p className="room-place">
          <MapPin size={14} />
          {place?.name} · Cách {place ? place.distance.toString().replace('.', ',') : ''} km
        </p>
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
          <small>chỉ từ </small>
          {formatMoney(price)} <small>/ {stayLabel}</small>
        </b>
        {room.available ? (
          <button type="button" className="btn btn-primary" disabled={past} onClick={() => onOpen(room.locationId)}>
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
}

function hoursLabel(hours: number) {
  const minutes = Math.round(hours * 60)
  const whole = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!rest) return `${whole} giờ`
  if (!whole) return `${rest} phút`
  return `${whole} giờ ${rest} phút`
}
