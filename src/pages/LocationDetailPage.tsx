import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, Headphones, Hourglass, MapPin } from 'lucide-react'
import { DURATIONS, getLocation, roomsAt, TIMES } from '../data'
import { useStore } from '../store'
import { Accordion, AmenityList, Crumb, Gallery, Photo, useTitle } from '../components/ui'
import { checkoutLabel, formatDate, formatMoney, isPastSlot, mapsUrl } from '../utils'

export function LocationDetailPage() {
  const { id = '' } = useParams()
  const location = getLocation(id)
  useTitle(location?.name ?? 'Cơ sở')
  const { draft, setDraft } = useStore()
  const navigate = useNavigate()
  if (!location) {
    return (
      <div className="wrap page">
        <h1>Không tìm thấy cơ sở</h1>
        <Link to="/co-so" className="btn btn-primary">
          Về danh sách cơ sở
        </Link>
      </div>
    )
  }

  const rooms = roomsAt(location.id).filter((room) => room.available)
  const end = checkoutLabel(draft.time, draft.duration)
  const past = isPastSlot(draft.date, draft.time)

  return (
    <div className="wrap page">
      <Crumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Hệ thống cơ sở', to: '/co-so' }, { label: location.name }]} />
      <div className="title-row">
        <div>
          <h1>{location.name}</h1>
          <p className="meta-line">
            <MapPin size={15} /> {location.district}, {location.city}
            <span>Cách bạn {location.distance.toString().replace('.', ',')} km</span>
            <a href={mapsUrl(location.name, location.district)} target="_blank" rel="noreferrer">
              Chỉ đường
            </a>
          </p>
        </div>
        <Link to="/huong-dan" className="btn btn-line">
          Tự nhận phòng
        </Link>
      </div>

      <div className="detail">
        <Gallery photos={location.photos} alt={location.name} />
        <aside className="book-widget">
          <h2>Chọn thời gian nghỉ</h2>
          <label className="field">
            Ngày nhận phòng
            <span className="control">
              <Calendar size={16} />
              <input type="date" value={draft.date} onChange={(event) => setDraft({ date: event.target.value, locationId: location.id })} />
            </span>
          </label>
          <div className="split-2">
            <label className="field">
              Giờ nhận phòng
              <span className="control">
                <Clock size={16} />
                <select
                  value={draft.time}
                  onChange={(event) => {
                    const time = event.target.value
                    setDraft({ time, locationId: location.id, checkoutTime: checkoutLabel(time, draft.duration).time })
                  }}
                >
                  {(TIMES.includes(draft.time) ? TIMES : [draft.time, ...TIMES]).map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </span>
            </label>
            <label className="field">
              Thời lượng
              <span className="control">
                <Hourglass size={16} />
                <select
                  value={draft.duration}
                  onChange={(event) => {
                    const duration = Number(event.target.value)
                    setDraft({
                      duration,
                      locationId: location.id,
                      checkoutTime: checkoutLabel(draft.time, duration).time,
                    })
                  }}
                >
                  {(DURATIONS.includes(draft.duration) ? DURATIONS : [draft.duration, ...DURATIONS]).map((hours) => (
                    <option key={hours} value={hours}>
                      {hours} giờ
                    </option>
                  ))}
                </select>
              </span>
            </label>
          </div>
          <p className="hint">Trả phòng lúc {end.text}</p>
          {past ? <p className="form-error">Khung giờ này đã qua. Hãy chọn giờ khác.</p> : null}
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={past}
            onClick={() => {
              setDraft({ locationId: location.id, roomId: '' })
              navigate(`/co-so/${location.id}/chon-phong`)
            }}
          >
            Xem phòng trống <ArrowRight size={16} />
          </button>
          <ul className="quiet-list">
            <li>
              <Clock size={15} /> Giữ phòng 5 phút khi thanh toán
            </li>
            <li>
              <Headphones size={15} /> Nhận mã cổng và phòng sau xác nhận
            </li>
          </ul>
          <div className="help-mini">
            <span>
              <Headphones size={16} /> Bạn cần hỗ trợ?
            </span>
            <Link to="/tro-giup">Liên hệ Kabin</Link>
          </div>
        </aside>
        <div className="detail-copy">
          <h2>{location.blurb}</h2>
          <p>{location.description}</p>
          <AmenityList items={location.amenities} />
          <div className="inline-head">
            <h2>Phòng phù hợp với bạn</h2>
            <span>
              {formatDate(draft.date)} · {draft.time}–{end.time}
            </span>
          </div>
          <div className="stack">
            {rooms.map((room) => (
              <article key={room.id} className="mini-room">
                <Photo src={room.photos[0]} alt={`Phòng ${room.number}`} />
                <div>
                  <strong>
                    Phòng {room.number} · {room.type}
                  </strong>
                  <p>{room.amenities.slice(0, 2).join(' · ')}</p>
                  <span className="pill pill-upcoming">Còn trống</span>
                </div>
                <div className="mini-room-end">
                  <b className="price">
                    {formatMoney(room.price3h)} <small>/ 3 giờ</small>
                  </b>
                  <Link to={`/co-so/${location.id}/phong/${room.id}`} className="btn btn-primary btn-sm">
                    Xem phòng <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <Accordion
            items={[
              {
                title: 'Hướng dẫn tự nhận phòng',
                content: <p>Sau khi thanh toán thành công, dùng mã cổng để vào sảnh và mã phòng để mở cửa. Không cần quầy lễ tân.</p>,
              },
              {
                title: 'Chính sách đặt phòng',
                content: <p>Phòng được giữ 5 phút để chuyển khoản. Hết giờ chưa nhận tiền, phòng được mở lại.</p>,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
