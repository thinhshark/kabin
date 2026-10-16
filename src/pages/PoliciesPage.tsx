import { Link, useParams } from 'react-router-dom'
import { FileText, Headphones } from 'lucide-react'
import { POLICIES } from '../data'
import { useTitle } from '../components/ui'

export function PoliciesPage() {
  const { id } = useParams()
  const current = POLICIES.find((item) => item.id === id) ?? POLICIES[0]
  useTitle(current.title)

  return (
    <div className="wrap page">
      <p className="crumb">
        <Link to="/">Trang chủ</Link> <span>/</span> <Link to="/co-so">Cơ sở</Link> <span>/</span> Chính sách & quy định
      </p>
      <h1>Chính sách & quy định</h1>
      <p className="lead">Thông tin cần biết trước khi đặt phòng tại Kabin.</p>
      <div className="policy-layout">
        <aside>
          {POLICIES.map((policy) => (
            <Link key={policy.id} to={`/chinh-sach/${policy.id}`} className={policy.id === current.id ? 'on' : ''}>
              <FileText size={16} /> {policy.title}
            </Link>
          ))}
        </aside>
        <article className="panel">
          <h2>{current.title}</h2>
          <ol className="policy-list">
            {current.blocks.map((block, index) => (
              <li key={block.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>
                    {String(index + 1).padStart(2, '0')}. {block.title}
                  </h3>
                  {block.body ? <p>{block.body}</p> : null}
                  {block.highlight ? <p className="callout">{block.highlight}</p> : null}
                  {block.bullets ? (
                    <ul>
                      {block.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
          <div className="help-bar">
            <strong>Bạn cần giải thích thêm?</strong>
            <div>
              <Link to="/tro-giup" className="btn btn-primary">
                <Headphones size={16} /> Liên hệ hỗ trợ
              </Link>
              <Link to="/huong-dan" className="text-btn">
                Xem hướng dẫn nhận phòng
              </Link>
            </div>
          </div>
          <p className="hint">Nội dung chính sách trên bản này là minh họa để duyệt giao diện, cần được chốt trước khi áp dụng.</p>
        </article>
      </div>
    </div>
  )
}
