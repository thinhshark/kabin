import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, Hourglass, MapPin } from 'lucide-react'
import { DURATIONS, LOCATIONS, PHOTOS, ROOM_TYPES, TIMES } from '../data'
import { useStore } from '../store'
import { useTitle } from '../components/ui'
import { formatMoney, todayISO } from '../utils'

export function HomePage() {
  useTitle('Kabin')
  const { draft, setDraft } = useStore()
  const navigate = useNavigate()
  const location = LOCATIONS.find((item) => item.id === draft.locationId) ?? LOCATIONS[0]

  const submit = (type?: string) => {
    const query = type ? `?loai=${encodeURIComponent(type)}` : ''
    navigate(`/co-so/${location.id}/chon-phong${query}`)
  }

  return (
    <div className="wrap page">
      <section className="hero-block">
        <div className="hero">
          <img src={PHOTOS.hero} alt="Phòng Kabin buổi tối" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow">KABIN SELF-CHECKIN</p>
            <h1>
              Không gian riêng.
              <br />
              Tự do tận hưởng.
            </h1>
            <p>Đặt phòng dễ dàng. Nhận phòng chủ động.</p>
            <p className="hero-pills">Riêng tư · Tiện nghi · Tự nhận phòng</p>
          </div>
        </div>
        <form
          className="search-card"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <div className="search-head">
            <strong>Tìm không gian của bạn</strong>
            <label className="pin-select">
              <MapPin size={15} />
              <select
                aria-label="Cơ sở"
                value={location.id}
                onChange={(event) => setDraft({ locationId: event.target.value, roomId: '' })}
              >
                {LOCATIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="search-grid">
            <label className="control">
              <Calendar size={18} />
              <span>
                <span className="control-label">Ngày nhận phòng</span>
                <input type="date" value={draft.date} min={todayISO()} onChange={(event) => setDraft({ date: event.target.value })} />
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
                <span className="control-label">Thời lượng</span>
                <select value={draft.duration} onChange={(event) => setDraft({ duration: Number(event.target.value) })}>
                  {DURATIONS.map((hours) => (
                    <option key={hours} value={hours}>
                      {hours} giờ
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <button className="btn btn-primary" type="submit">
              Xem phòng trống <ArrowRight size={18} />
            </button>
          </div>
          <p className="hint">Chọn phòng trước, thanh toán ở bước tiếp theo.</p>
        </form>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Chọn một khoảng riêng cho bạn</h2>
            <p>Không gian thoải mái cho những giờ nghỉ ngơi.</p>
          </div>
          <Link to="/co-so" className="text-btn">
            Xem các phòng <ArrowRight size={16} />
          </Link>
        </div>
        <div className="cards-3">
          {ROOM_TYPES.map((room) => (
            <article key={room.type} className="room-card">
              <img src={room.photo} alt={`Phòng ${room.type}`} />
              <div>
                <h3>Phòng {room.type}</h3>
                <p>{room.amenities}</p>
                <div className="room-card-foot">
                  <span>
                    Từ <PriceInline value={room.priceFrom} />
                  </span>
                  <button type="button" className="text-btn" onClick={() => submit(room.type)}>
                    Xem phòng <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="steps-panel">
        <div className="section-head">
          <h2>Tự nhận phòng, thật đơn giản</h2>
          <Link to="/huong-dan" className="text-btn">
            Xem hướng dẫn <ArrowRight size={16} />
          </Link>
        </div>
        <div className="steps-grid">
          <Step n="01" title="Chọn phòng" text="Chọn phòng và thời gian phù hợp." />
          <Step n="02" title="Thanh toán" text="Phòng được giữ 5 phút để thanh toán." />
          <Step n="03" title="Nhận mã vào phòng" text="Xác nhận thành công, nhận mã cổng và phòng." />
        </div>
        <p className="hint">Thông tin đặt phòng được gửi qua SMS và email.</p>
      </section>
    </div>
  )
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="step-col">
      <span>{n}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  )
}

function PriceInline({ value }: { value: number }) {
  return (
    <b className="price">
      {formatMoney(value)}
      <small> / 3 giờ</small>
    </b>
  )
}
