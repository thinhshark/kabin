import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { REFUND_NOTE, REFUND_POINTS } from '../data'
import { useTitle } from '../components/ui'

const SECTIONS = [
  {
    title: 'Dịch vụ',
    body: 'Kabin là dịch vụ nghỉ theo giờ, tự nhận phòng bằng mã cửa. Kabin thuộc hệ sinh thái T-Box, cùng Tbox Stay và Tbox Space.',
  },
  {
    title: 'Đặt phòng',
    body: 'Khách chọn cơ sở, ngày, giờ nhận phòng và giờ trả phòng, rồi xác thực số điện thoại bằng OTP. Phòng được giữ 10 phút để thanh toán. Khi đặt phòng được xác nhận, thông tin và mã cửa được gửi qua SMS, và có thể xem lại ở trang Tra cứu đặt phòng.',
  },
  {
    title: 'Mã cửa',
    body: 'Cổng và cửa phòng dùng chung một mã, chỉ có hiệu lực trong khung giờ khách đã đặt. Nhập đủ dấu # ở cuối mã. Mã chỉ dùng cho lần đặt đó, không chia sẻ cho người ngoài.',
  },
  {
    title: 'Cách sử dụng',
    bullets: [
      'Đến đúng cơ sở trên thông tin đặt và vào khu cổng. Không cần quầy lễ tân.',
      'Nhập mã cổng và phòng trên bàn phím khóa gắn tại cổng.',
      'Tới đúng số phòng và nhập lại đúng mã đó trên bàn phím khóa gắn tại cửa phòng.',
      'Mật khẩu Wi-Fi dán ở mặt trong cửa.',
    ],
  },
  {
    title: 'Trả phòng',
    body: 'Đến giờ trả phòng, quý khách vui lòng tắt điều hòa, đóng cửa trước khi rời phòng. Không cần trả chìa khóa.',
  },
  {
    title: 'Nội quy',
    body: 'Không mang thú cưng. Mỗi phòng tối đa 2 người. Chỉ nhận khách trên 16 tuổi. Nghiêm cấm hút thuốc. Khách giữ vệ sinh, khóa cửa khi ra ngoài và trả phòng đúng giờ.',
  },
  {
    title: 'Hủy và hoàn tiền',
    body: `${REFUND_POINTS.join(' ')} ${REFUND_NOTE}`,
  },
  {
    title: 'Đổi giờ và hỗ trợ',
    body: 'Khi cần đổi giờ, thanh toán hoặc mã cửa không mở được, liên hệ tổng đài hỗ trợ 1800.2230 và đọc mã đặt phòng.',
  },
]

export function TermsPage() {
  useTitle('Điều khoản & Sử dụng')

  return (
    <div className="wrap page">
      <p className="crumb">
        <Link to="/">Trang chủ</Link> <span>/</span> Điều khoản & Sử dụng
      </p>
      <h1>Điều khoản & Sử dụng</h1>
      <p className="lead">Những điều cần biết khi đặt phòng và tự nhận phòng tại Kabin.</p>
      <article className="panel terms">
        <ol className="policy-list">
          {SECTIONS.map((section, index) => (
            <li key={section.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>
                  {String(index + 1).padStart(2, '0')}. {section.title}
                </h3>
                {section.body ? <p>{section.body}</p> : null}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <a className="btn btn-block hotline-btn" href="tel:18002230">
          <Phone size={18} /> Liên hệ hotline
        </a>
      </article>
    </div>
  )
}
