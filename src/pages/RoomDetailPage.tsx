import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Clock, Hourglass } from 'lucide-react'
import { DURATIONS, getLocation, getRoom, TIMES } from '../data'
import { useStore } from '../store'
import { Accordion, AmenityList, Crumb, Gallery, useTitle } from '../components/ui'
import { checkoutLabel, formatDate, formatMoney, isPastSlot, slotPrice } from '../utils'

export function RoomDetailPage() {
  const { id = '', roomId = '' } = useParams()
  const location = getLocation(id)
  const room = getRoom(roomId)
  useTitle(room ? `Phòng ${room.number}` : 'Phòng')
  const { draft, setDraft } = useStore()
  const navigate = useNavigate()

  if (!location || !room || room.locationId !== location.id) {
    return (
      <div className="wrap page">
        <h1>Không tìm thấy phòng</h1>
        <Link to="/co-so">Về danh sách cơ sở</Link>
      </div>
    )
  }

  const end = checkoutLabel(draft.time, draft.duration)
  const past = isPastSlot(draft.date, draft.time)
  const price = slotPrice(room.price3h, draft.duration)
  const blocked = !room.available || past

  return (
    <div className="wrap page">
      <Crumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Cơ sở', to: '/co-so' },
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
            {room.available ? <span className="pill pill-upcoming">Còn trống trong khung giờ đã chọn</span> : <span className="pill pill-expired">Không khả dụng trong khung giờ này</span>}
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
            Ngày nhận phòng
            <span className="control">
              <Calendar size={16} />
              <input type="date" value={draft.date} onChange={(event) => setDraft({ date: event.target.value })} />
            </span>
          </label>
          <div className="split-2">
            <label className="field">
              Giờ nhận phòng
              <span className="control">
                <Clock size={16} />
                <select value={draft.time} onChange={(event) => setDraft({ time: event.target.value })}>
                  {TIMES.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </span>
            </label>
            <label className="field">
              Thời lượng
              <span className="control">
                <Hourglass size={16} />
                <select value={draft.duration} onChange={(event) => setDraft({ duration: Number(event.target.value) })}>
                  {DURATIONS.map((hours) => (
                    <option key={hours} value={hours}>
                      {hours} giờ
                    </option>
                  ))}
                </select>
              </span>
            </label>
          </div>
          <p className="hint">Trả phòng lúc {end.text}</p>
          <div className="sum-row total">
            <span>Tổng tiền</span>
            <b className="price">
              {formatMoney(price)} <small>/ {draft.duration} giờ</small>
            </b>
          </div>
          {past ? <p className="form-error">Khung giờ này đã qua.</p> : null}
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
