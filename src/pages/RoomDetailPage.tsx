import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Clock, Hourglass } from 'lucide-react'
import { getLocation, getRoom, quotedStay, roomAmenities, roomTaken } from '../data'
import { useStore } from '../store'
import { DateField } from '../components/DateField'
import { PriceListLink } from '../components/PriceList'
import { DurationSelect } from '../components/DurationSelect'
import { TimeField } from '../components/TimeField'
import { Accordion, AmenityList, Crumb, Gallery, useTitle } from '../components/ui'
import { clockMinutes, durationText, formatDate, formatMoney, FULL_DAY_HOURS, fullDayStay, isPastSlot, overnightStay, stayHours, todayISO } from '../utils'

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

  if (location?.openingSoon) return <Navigate to="/co-so" replace />
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
  const taken = roomTaken(room.id, draft.date, draft.time, draft.duration, bookings)
  const conflict = !room.available || taken
  const price = quotedStay(room, {
    date: draft.date,
    time: draft.time,
    duration: draft.duration,
    overnight: draft.overnight,
  })
  const stayLabel = draft.overnight ? 'Qua đêm' : durationText(draft.duration)
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
              <span className="pill pill-expired">{taken ? 'Đã có khách' : 'Không khả dụng'}</span>
            ) : (
              <span className="pill pill-upcoming">Còn trống trong khung giờ đã chọn</span>
            )}
          </p>
          <Link to={`/co-so/${location.id}/chon-phong`} className="text-btn room-switch">
            <ArrowLeft size={16} /> Chọn phòng khác
          </Link>
        </div>
      </div>

      <div className="detail room-detail">
        <Gallery photos={room.photos} alt={`Phòng ${room.number}`} />
        <aside className="book-widget">
          {location.openingSoon ? (
            <div className="soon-panel">
              <span className="soon-badge">
                <i /> Opening soon
              </span>
              <h2>Phòng này chưa mở đặt</h2>
              <p>Kabin Tây Hồ sắp mở cửa, nên phòng chưa thể giữ hoặc thanh toán.</p>
              <Link to="/co-so" className="btn btn-primary btn-block">
                Xem cơ sở đang mở
              </Link>
            </div>
          ) : (
            <>
          <h2>Thông tin đặt phòng</h2>
          <div className="split-2">
            <label className="field">
              Chọn ngày
              <span className="control">
                <Calendar size={16} />
                <DateField hideLabel label="Chọn ngày" value={draft.date < today ? today : draft.date} onChange={(date) => setDraft({ date })} />
              </span>
            </label>
            <label className="field field-brand">
              Giờ nhận phòng
              <span className="control">
                <Clock size={16} />
                <TimeField
                  hideLabel
                  label="Giờ nhận phòng"
                  value={draft.time}
                  onChange={(time) =>
                    setDraft(
                      draft.overnight
                        ? { time, ...overnightStay(time) }
                        : draft.duration === FULL_DAY_HOURS
                          ? { time, ...fullDayStay(time) }
                          : { time, duration: stayHours(time, draft.checkoutTime) },
                    )
                  }
                />
              </span>
            </label>
          </div>
          <div className="split-2">
            <label className="field field-ink">
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
            <label className="field field-brand">
              Giờ trả phòng
              <span className="control">
                <Clock size={16} />
                <TimeField
                  hideLabel
                  label="Giờ trả phòng"
                  value={draft.checkoutTime}
                  align="end"
                  suffix={nextDay ? 'hôm sau' : undefined}
                  onChange={(checkoutTime) =>
                    setDraft({ overnight: false, checkoutTime, duration: stayHours(draft.time, checkoutTime) })
                  }
                />
              </span>
            </label>
          </div>
          <p className="hint">Trả phòng lúc {draft.checkoutTime}{nextDay ? ' hôm sau' : ''}</p>
          <div className="sum-row total">
            <span>Tổng tiền</span>
            <span className="price-stack">
              <b className="price">
                {formatMoney(price)} <small>/ {stayLabel}</small>
              </b>
              <PriceListLink />
            </span>
          </div>
          {past ? <p className="form-error">Khung giờ này đã qua.</p> : null}
          {!past && taken ? <p className="form-error">Khung giờ này đã có khách. Hãy chọn giờ khác hoặc phòng khác.</p> : null}
          {!past && !taken && !room.available ? <p className="form-error">Phòng này hiện không nhận đặt.</p> : null}
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
            </>
          )}
        </aside>
        <div className="detail-copy">
          <h2>Một căn phòng ấm cúng cho khoảng nghỉ riêng tư của bạn.</h2>
          <p>{room.description}</p>
          <AmenityList items={roomAmenities(room)} />
          <Accordion
            items={[
              {
                title: 'Tiện ích trong phòng',
                content: (
                  <p>
                    {roomAmenities(room).join(', ')}. Giá {formatMoney(price)} cho {durationText(draft.duration)}, ngày {formatDate(draft.date)}.
                  </p>
                ),
              },
              {
                title: 'Hướng dẫn tự nhận phòng',
                content: <p>Mã cổng và mã phòng xuất hiện trên vé ngay sau khi chuyển khoản được ghi nhận.</p>,
              },
              {
                title: 'Chính sách đặt phòng',
                content: <p>Giữ phòng 10 phút. Hết hạn chưa nhận tiền thì phòng mở lại. Tiền đến muộn được hỗ trợ xử lý riêng.</p>,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

