import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Clock, Hourglass } from 'lucide-react'
import { getLocation, getRoom } from '../data'
import { useStore } from '../store'
import { DateField } from '../components/DateField'
import { DurationSelect } from '../components/DurationSelect'
import { TimeField } from '../components/TimeField'
import { Accordion, AmenityList, Crumb, Gallery, useTitle } from '../components/ui'
import { clockMinutes, formatDate, formatMoney, isPastSlot, overnightStay, slotPrice, stayHours, todayISO } from '../utils'

export function RoomDetailPage() {
  const { id = '', roomId = '' } = useParams()
  const location = getLocation(id)
  const room = getRoom(roomId)
  useTitle(room ? `Phòng ${room.number}` : 'Phòng')
  const { draft, setDraft, bookings } = useStore()
  const navigate = useNavigate()
  const today = todayISO()

  useEffect(() => {
    if (draft.date < today) setDraft({ date: today })
  }, [draft.date, setDraft, today])

  if (!location || !room || room.locationId !== location.id) {
    return (
      <div className="wrap page">
        <h1>Không tìm thấy phòng</h1>
        <Link to="/co-so">Về danh sách cơ sở</Link>
      </div>
    )
  }

  const nextDay = clockMinutes(draft.checkoutTime) <= clockMinutes(draft.time)
  const past = isPastSlot(draft.date, draft.time)
  const conflict =
    !room.available ||
    bookings.some(
      (booking) =>
        booking.roomId === room.id &&
        (booking.status === 'upcoming' || booking.status === 'active' || booking.status === 'pending') &&
        overlaps(draft.date, draft.time, draft.duration, booking),
    )
  const price = slotPrice(room.price3h, draft.duration)
  const stayLabel = draft.overnight ? 'Qua đêm' : hoursLabel(draft.duration)
  const blocked = conflict || past

  return (
    <div className="wrap page">
      <Crumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Hệ thống cơ sở', to: '/co-so' },
          { label: location.name, to: `/co-so/${location.id}` },
          { label: `Phòng ${room.number}` },
        ]}
      />
      <div className="title-row">
        <div>
          <h1>
            Phòng {room.number} · {room.type}
          </h1>
          <p className="meta-line">
            {location.name} · {location.city}
            {conflict ? (
              <span className="pill pill-expired">Không khả dụng</span>
            ) : (
              <span className="pill pill-upcoming">Còn trống trong khung giờ đã chọn</span>
            )}
          </p>
        </div>
        <Link to={`/co-so/${location.id}/chon-phong`} className="text-btn">
          <ArrowLeft size={16} /> Chọn phòng khác
        </Link>
      </div>

      <div className="detail room-detail">
        <Gallery photos={room.photos} alt={`Phòng ${room.number}`} />
        <aside className="book-widget">
          <h2>Thông tin đặt phòng</h2>
          <label className="field">
            Chọn ngày
            <span className="control">
              <Calendar size={16} />
              <DateField hideLabel label="Chọn ngày" value={draft.date < today ? today : draft.date} onChange={(date) => setDraft({ date })} />
            </span>
          </label>
          <div className="split-2">
            <label className="field">
              Giờ nhận phòng
              <span className="control">
                <Clock size={16} />
                <TimeField
                  hideLabel
                  label="Giờ nhận phòng"
                  value={draft.time}
                  onChange={(time) =>
                    setDraft(draft.overnight ? { time, ...overnightStay(time) } : { time, duration: stayHours(time, draft.checkoutTime) })
                  }
                />
              </span>
            </label>
            <label className="field">
              Thời lượng
              <span className="control">
                <Hourglass size={16} />
              <DurationSelect
                time={draft.time}
                duration={draft.duration}
                overnight={draft.overnight}
                onChange={(next) => setDraft(next)}
              />
              </span>
            </label>
          </div>
          <label className="field">
            Giờ trả phòng
            <span className="control">
              <Clock size={16} />
              <TimeField
                hideLabel
                label="Giờ trả phòng"
                value={draft.checkoutTime}
                onChange={(checkoutTime) =>
                  setDraft({ overnight: false, checkoutTime, duration: stayHours(draft.time, checkoutTime) })
                }
              />
            </span>
          </label>
          <p className="hint">Trả phòng lúc {draft.checkoutTime}{nextDay ? ' hôm sau' : ''}</p>
          <div className="sum-row total">
            <span>Tổng tiền</span>
            <b className="price">
              {formatMoney(price)} <small>/ {stayLabel}</small>
            </b>
          </div>
          {past ? <p className="form-error">Khung giờ này đã qua.</p> : null}
          {!past && conflict ? <p className="form-error">khung giờ này hiện không khả dụng</p> : null}
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={blocked}
            onClick={() => {
              setDraft({ locationId: location.id, roomId: room.id })
              navigate('/dat-phong')
            }}
          >
            Tiếp tục đặt phòng <ArrowRight size={16} />
          </button>
          <p className="hint">Kiểm tra thông tin trước khi thanh toán.</p>
        </aside>
        <div className="detail-copy">
          <h2>Một căn phòng ấm cúng cho khoảng nghỉ riêng tư của bạn.</h2>
          <p>{room.description}</p>
          <AmenityList items={room.amenities} />
          <Accordion
            items={[
              {
                title: 'Tiện ích trong phòng',
                content: (
                  <p>
                    {room.amenities.join(', ')}. Giá {formatMoney(price)} cho {draft.duration} giờ, ngày {formatDate(draft.date)}.
                  </p>
                ),
              },
              {
                title: 'Hướng dẫn tự nhận phòng',
                content: <p>Mã cổng và mã phòng xuất hiện trên vé ngay sau khi chuyển khoản được ghi nhận.</p>,
              },
              {
                title: 'Chính sách đặt phòng',
                content: <p>Giữ phòng 5 phút. Hết hạn chưa nhận tiền thì phòng mở lại. Tiền đến muộn được hỗ trợ xử lý riêng.</p>,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function overlaps(
  date: string,
  time: string,
  hours: number,
  booking: { date: string; time: string; duration: number },
) {
  const startOf = (day: string, clock: string) => new Date(`${day}T00:00:00`).getTime() + clockMinutes(clock) * 60000
  const start = startOf(date, time)
  const end = start + hours * 3600000
  const bookedStart = startOf(booking.date, booking.time)
  const bookedEnd = bookedStart + booking.duration * 3600000
  return start < bookedEnd && bookedStart < end
}

function hoursLabel(hours: number) {
  const minutes = Math.round(hours * 60)
  const whole = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!rest) return `${whole} giờ`
  if (!whole) return `${rest} phút`
  return `${whole} giờ ${rest} phút`
}
