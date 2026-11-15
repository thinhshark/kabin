import { CigaretteOff, PawPrint, Users } from 'lucide-react'
import { BAN_GROUPS, HOUSE_RULES, KEY_RULES, REFUND_NOTE } from '../data'

export function RuleFlags() {
  return (
    <div className="rule-flags" aria-label="Nội quy quan trọng">
      {KEY_RULES.map((rule) => (
        <article key={rule.id} className={`rule-flag ${rule.id}`}>
          <RuleMark id={rule.id} />
          <strong>{rule.text}</strong>
        </article>
      ))}
    </div>
  )
}

export function StayRules({ mode = 'full' }: { mode?: 'full' | 'brief' | 'refund' | 'sheets' }) {
  const sheets = mode === 'full' || mode === 'sheets'
  return (
    <div className={mode === 'full' || mode === 'sheets' ? 'stay-rules' : 'stay-rules brief'}>
      {mode === 'full' || mode === 'brief' ? <RuleFlags /> : null}
      {mode === 'full' || mode === 'brief' || mode === 'refund' ? <RefundTable /> : null}

      {sheets ? (
        <div className="rule-sheets">
          <article className="rule-sheet">
            <p className="sheet-brand">KABIN</p>
            <h3>Nội quy homestay</h3>
            <ol>
              {HOUSE_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
            <p className="sheet-note">Nếu vi phạm nội quy, cơ sở phụ thu tùy mức độ.</p>
            <p className="sheet-hotline">Hotline hỗ trợ: 1800.2230</p>
          </article>

          <article className="rule-sheet">
            <p className="sheet-brand">KABIN</p>
            <h3>Quy định cấm</h3>
            <table className="ban-table">
              <tbody>
                {BAN_GROUPS.map((group) =>
                  group.items.map((item, index) => (
                    <tr key={item}>
                      <td>{item}</td>
                      {index === 0 ? (
                        <td className="penalty" rowSpan={group.items.length}>
                          {group.penalty}
                        </td>
                      ) : null}
                    </tr>
                  )),
                )}
              </tbody>
            </table>
            <p className="sheet-hotline">Hotline hỗ trợ: 1800.2230</p>
          </article>

          <article className="rule-sheet">
            <p className="sheet-brand">KABIN</p>
            <h3>Quy định thời gian lưu trú</h3>
            <h4>Phí trả phòng muộn</h4>
            <p>
              Trả phòng muộn quá 30 phút sẽ phụ thu <b>200.000đ</b>. Nếu muốn dùng thêm phòng, quý khách quét mã QR hoặc đặt thêm qua web/app khi khung giờ tiếp theo còn trống và chưa có khách đặt.
            </p>
            <h4>Phí phạt quá số người quy định</h4>
            <p>
              Phạt <b>200.000đ</b> nếu số khách lưu trú nhiều hơn số đã đăng ký mà không báo trước.
            </p>
            <p className="sheet-note">Cảm ơn bạn đã giữ phòng gọn và đúng giờ.</p>
            <p className="sheet-hotline">Hotline hỗ trợ: 1800.2230</p>
          </article>
        </div>
      ) : null}
    </div>
  )
}

function RuleMark({ id }: { id: (typeof KEY_RULES)[number]['id'] }) {
  if (id === 'pet') return <PawPrint size={26} strokeWidth={2.4} />
  if (id === 'smoke') return <CigaretteOff size={26} strokeWidth={2.4} />
  if (id === 'people') return <Users size={26} strokeWidth={2.4} />
  return <b>16+</b>
}

export function RefundTable({ heading = true }: { heading?: boolean }) {
  return (
    <div className="refund-card">
      {heading ? <h3>Chính sách hoàn hủy</h3> : null}
      <table className="refund-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Thời điểm hủy</th>
            <th>Mức hoàn</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="rowgroup" rowSpan={3}>
              Ngày thường
            </th>
            <td>Trước ít nhất 8 tiếng</td>
            <td className="rate">100%</td>
          </tr>
          <tr>
            <td>Trước ít nhất 4 tiếng</td>
            <td className="rate">50%</td>
          </tr>
          <tr>
            <td>Dưới 4 tiếng</td>
            <td className="rate">Không hoàn</td>
          </tr>
          <tr>
            <th scope="rowgroup" rowSpan={2}>
              Ngày lễ
            </th>
            <td>Trước ít nhất 24 tiếng</td>
            <td className="rate">100%</td>
          </tr>
          <tr>
            <td>Trong vòng 24 tiếng</td>
            <td className="rate">Không hoàn</td>
          </tr>
        </tbody>
      </table>
      <p className="hint">{REFUND_NOTE}</p>
    </div>
  )
}
