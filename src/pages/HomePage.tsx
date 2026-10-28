import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, KeyRound, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { LOCATIONS, PHOTOS, ROOM_TYPES } from '../data'
import { useStore } from '../store'
import { DateField } from '../components/DateField'
import { TimeField } from '../components/TimeField'
import { LogoMark, useTitle } from '../components/ui'
import { formatMoney, overnightStay, stayHours, todayISO } from '../utils'

export function HomePage() {
  useTitle('Kabin')
  const { draft, setDraft } = useStore()
  const navigate = useNavigate()
  const location = LOCATIONS.find((item) => item.id === draft.locationId) ?? LOCATIONS[0]
  const [district, setDistrict] = useState('Tất cả')
  const districts = ['Tất cả', ...new Set(LOCATIONS.map((item) => item.district))]
  const places = LOCATIONS.filter((item) => district === 'Tất cả' || item.district === district).sort(
    (a, b) => a.distance - b.distance,
  )

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
      </section>
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
                <DateField
                  hideLabel
                  label="Ngày nhận phòng"
                  value={draft.date < todayISO() ? todayISO() : draft.date}
                  onChange={(date) => setDraft({ date })}
                />
              </span>
            </label>
            <div className="control">
              <Clock size={18} />
              <TimeField
                label="Giờ nhận phòng"
                value={draft.time}
                onChange={(time) =>
                  setDraft(
                    draft.overnight
                      ? { time, ...overnightStay(time) }
                      : { time, duration: stayHours(time, draft.checkoutTime) },
                  )
                }
              />
            </div>
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
              Xem phòng trống <ArrowRight size={18} />
            </button>
          </div>
          <p className="hint">Chọn phòng trước, thanh toán ở bước tiếp theo.</p>
        </form>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">Hạng phòng</p>
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
                {room.amenities ? <p>{room.amenities}</p> : null}
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

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">Điểm đến</p>
            <h2>Chọn cơ sở gần bạn</h2>
            <p>Từ Cầu Giấy, Tây Hồ đến Ba Đình và Đống Đa. Mỗi cơ sở đều tự nhận phòng bằng mã cửa.</p>
          </div>
          <Link to="/co-so" className="text-btn">
            Xem hệ thống cơ sở <ArrowRight size={16} />
          </Link>
        </div>
        <div className="chip-row show home-chips">
          {districts.map((item) => (
            <button key={item} type="button" className={item === district ? 'chip on' : 'chip'} onClick={() => setDistrict(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="place-grid">
          {places.map((place) => (
            <Link key={place.id} to={`/co-so/${place.id}`} className="place-card">
              <img src={place.cover} alt={place.name} />
              <div>
                <h3>{place.name.replace('Kabin ', '')}</h3>
                <p>
                  <MapPin size={14} /> {place.district} · {place.city}
                </p>
                <p>{place.blurb}</p>
                <span className="text-btn">
                  Xem cơ sở <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">Hệ sinh thái T-Box</p>
            <h2>Ba thương hiệu, một hệ sinh thái</h2>
            <p>Kabin là một phần trong hệ sinh thái T-Box, cùng Tbox Stay và Tbox Space.</p>
          </div>
        </div>
        <div className="cards-3">
          <article className="brand-card stay">
            <div className="brand-logo">
              <img src={`${import.meta.env.BASE_URL}brands/tbox.png`} alt="Logo T-Box" />
            </div>
            <div>
              <p className="kicker">Lưu trú theo giờ</p>
              <h3>Tbox Stay</h3>
              <p>Không gian riêng để xem phim, thư giãn và hẹn hò, với máy chiếu, bồn tắm và tiện nghi trong phòng.</p>
              <a className="text-btn" href="https://tboxstay.vn/index.html" target="_blank" rel="noreferrer">
                Xem Tbox Stay <ArrowRight size={16} />
              </a>
            </div>
          </article>
          <article className="brand-card here">
            <div className="brand-logo kabin">
              <span className="brand-lockup">
                <LogoMark className="logo-mark" />
                <span className="logo-word">
                  <span className="logo-name">KABIN</span>
                  <span className="logo-sub">STAYS</span>
                </span>
              </span>
            </div>
            <div>
              <p className="kicker">Self check-in</p>
              <h3>Kabin</h3>
              <p>Đặt phòng theo giờ, thanh toán và nhận mã cửa. Đến là vào phòng, không cần quầy lễ tân.</p>
              <Link to="/co-so" className="text-btn">
                Xem phòng Kabin <ArrowRight size={16} />
              </Link>
            </div>
          </article>
          <article className="brand-card">
            <div className="brand-logo space">
              <img src={`${import.meta.env.BASE_URL}brands/tbox-space.png`} alt="T-Box Space" />
            </div>
            <div>
              <p className="kicker">Coffee Working</p>
              <h3>Tbox Space</h3>
              <p>Không gian cà phê để làm việc, sắp mở cửa trong hệ sinh thái T-Box.</p>
              <span className="pill pill-pending">Sắp mở cửa</span>
            </div>
          </article>
        </div>
      </section>

      <section className="section about-block">
        <div className="about-split">
          <div>
            <p className="kicker">Về Kabin</p>
            <h2>Đóng cửa lại, phố ở lại bên ngoài.</h2>
            <p className="about-lead">Một khoảng nghỉ ngắn, đủ riêng để vài giờ cũng trọn.</p>
            <p>
              Giữa một ngày dài, thứ cần đôi khi không phải một chuyến đi. Chỉ là một căn phòng yên, một chiếc giường, và thời gian không phải chia với ai.
            </p>
            <p>
              Có người ghé lúc trưa để nằm xuống. Có người ở lại buổi tối để xem phim, ngâm mình, hoặc chỉ ngồi im. Kabin giữ những khoảng ấy khép kín và chậm hơn phố bên ngoài.
            </p>
          </div>
          <img src={PHOTOS.door} alt="Phòng Kabin" />
        </div>
        <div className="steps-grid about-points">
          <div className="step-col">
            <div>
              <strong>Giữa phố, vẫn riêng</strong>
              <p>Một cánh cửa khép lại là đủ. Hà Nội vẫn ồn bên ngoài. Bên trong là khoảng chỉ của bạn.</p>
            </div>
          </div>
          <div className="step-col">
            <div>
              <strong>Ngắn cũng là một kỳ nghỉ</strong>
              <p>Không cần ở lại cả đêm mới được một chỗ của riêng mình. Vài giờ đúng chỗ cũng làm ngày chậm lại.</p>
            </div>
          </div>
          <div className="step-col">
            <div>
              <strong>Đủ để nán lại</strong>
              <p>Giường êm, ánh đèn ấm, một góc yên trong phòng. Những thứ nhỏ đã ở sẵn, để khoảng nghỉ không bị cắt ngang.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">Vì sao chọn Kabin</p>
            <h2>Riêng tư hơn, chủ động hơn.</h2>
          </div>
        </div>
        <ul className="amenity-row">
          <li>Tự nhận phòng</li>
          <li>Mã cửa riêng</li>
          <li>Máy chiếu</li>
          <li>Bồn tắm</li>
          <li>Chỗ để oto</li>
        </ul>
        <div className="reason-grid">
          <article className="reason">
            <KeyRound size={20} />
            <h3>Tự nhận phòng bằng mã riêng</h3>
            <p>Mã cổng và mã phòng chỉ dùng cho lần đặt của bạn. Đến nơi, nhập mã và vào phòng.</p>
          </article>
          <article className="reason">
            <Clock size={20} />
            <h3>Giờ nhận, giờ trả do bạn chọn</h3>
            <p>Chọn ngày, giờ đến và giờ về. Phòng được giữ 10 phút để bạn thanh toán.</p>
          </article>
          <article className="reason">
            <Sparkles size={20} />
            <h3>Đủ tiện nghi cho khoảng nghỉ</h3>
            <p>Máy chiếu, bồn tắm hoặc tiện ích khác tùy cơ sở. Mỗi phòng ghi rõ những gì đã có sẵn.</p>
          </article>
          <article className="reason">
            <ShieldCheck size={20} />
            <h3>Riêng tư khi muốn, hỗ trợ khi cần</h3>
            <p>Bạn tự vào phòng. Khi cần đổi giờ, thanh toán hoặc mã cửa, Kabin hỗ trợ qua trang trợ giúp.</p>
          </article>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <p className="kicker">Đặt phòng</p>
          <h2>Sẵn sàng cho một khoảng nghỉ?</h2>
          <p>Chọn cơ sở và khung giờ. Thanh toán xong, mã cửa được gửi trước khi bạn đến.</p>
        </div>
        <div className="steps-grid">
          <Step n="01" title="Chọn phòng" text="Chọn phòng và thời gian phù hợp." />
          <Step n="02" title="Thanh toán" text="Phòng được giữ 10 phút để thanh toán." />
          <Step n="03" title="Nhận mã vào phòng" text="Xác nhận thành công, nhận mã cổng và phòng." />
        </div>
        <div className="cta-foot">
          <p className="hint">Thông tin đặt phòng được gửi qua SMS và email.</p>
          <div className="cta-actions">
            <button type="button" className="btn btn-primary" onClick={() => submit()}>
              Xem phòng trống <ArrowRight size={16} />
            </button>
            <Link to="/huong-dan" className="btn btn-ghost">
              Xem hướng dẫn nhận phòng
            </Link>
          </div>
        </div>
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
