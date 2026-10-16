import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, MessageCircle, Phone, Search, Send } from 'lucide-react'
import { FAQS } from '../data'
import { useStore } from '../store'
import { useTitle } from '../components/ui'
import { cx } from '../utils'

const TOPICS = ['Tất cả', 'Đặt phòng', 'Thanh toán', 'Nhận phòng', 'Tài khoản'] as const

export function HelpPage() {
  useTitle('Trợ giúp')
  const { showToast } = useStore()
  const [params] = useSearchParams()
  const initialTopic = TOPICS.includes(params.get('chu-de') as (typeof TOPICS)[number]) ? (params.get('chu-de') as (typeof TOPICS)[number]) : 'Tất cả'
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>(initialTopic)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(FAQS[0]?.id ?? null)
  const [chat, setChat] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState<{ code: string; phone: string; topic: string; message: string }>({
    code: '',
    phone: '',
    topic: initialTopic === 'Tất cả' ? 'Thanh toán' : initialTopic,
    message: '',
  })

  const faqs = useMemo(() => {
    return FAQS.filter((item) => {
      if (topic !== 'Tất cả' && item.topic !== topic) return false
      const hay = `${item.q} ${item.a}`.toLowerCase()
      return hay.includes(query.trim().toLowerCase())
    })
  }, [topic, query])

  return (
    <div className="wrap page">
      <p className="crumb">Trang chủ / Hỗ trợ</p>
      <h1>Kabin có thể giúp gì cho bạn?</h1>
      <p className="lead">Tìm câu trả lời hoặc liên hệ đội ngũ hỗ trợ.</p>
      <div className="help-grid">
        <div>
          <label className="control">
            <Search size={18} />
            <input placeholder="Tìm câu hỏi hoặc vấn đề bạn gặp" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="chip-row show">
            {TOPICS.map((item) => (
              <button key={item} type="button" className={cx('chip', topic === item && 'on')} onClick={() => setTopic(item)}>
                {item}
              </button>
            ))}
          </div>
          <h2>Câu hỏi thường gặp</h2>
          <div className="accordion">
            {faqs.length === 0 ? <p>Không thấy câu hỏi phù hợp. Gửi yêu cầu bên cạnh để Kabin gọi lại.</p> : null}
            {faqs.map((item) => {
              const isOpen = open === item.id
              return (
                <div key={item.id} className={cx('acc-item', isOpen && 'open')}>
                  <button type="button" className="acc-btn" onClick={() => setOpen(isOpen ? null : item.id)}>
                    {item.q}
                    <ChevronDown size={18} />
                  </button>
                  {isOpen ? <div className="acc-body">{item.a}</div> : null}
                </div>
              )
            })}
          </div>
        </div>
        <aside>
          <section className="panel">
            <h2>Liên hệ Kabin</h2>
            <div className="btn-row">
              <button type="button" className="btn btn-primary" onClick={() => setChat(true)}>
                <MessageCircle size={16} /> Chat với Kabin
              </button>
              <a className="btn btn-line" href="tel:19001234">
                <Phone size={16} /> Gọi hỗ trợ
              </a>
            </div>
          </section>
          <section className="panel">
            <h2>Gửi yêu cầu hỗ trợ</h2>
            {sent ? (
              <p>Đã gửi yêu cầu. Kabin sẽ liên hệ qua số điện thoại bạn cung cấp.</p>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  if (!form.message.trim()) return
                  setSent(true)
                  showToast('Đã gửi yêu cầu hỗ trợ')
                }}
              >
                <label className="field">
                  Mã đặt phòng (nếu có)
                  <input value={form.code} placeholder="KB-..." onChange={(event) => setForm({ ...form, code: event.target.value })} />
                </label>
                <label className="field">
                  Số điện thoại
                  <input value={form.phone} placeholder="Nhập số điện thoại của bạn" onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                </label>
                <label className="field">
                  Vấn đề cần hỗ trợ
                  <select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>
                    {TOPICS.filter((item) => item !== 'Tất cả').map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Nội dung
                  <textarea rows={4} placeholder="Mô tả vấn đề bạn đang gặp" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
                </label>
                <button className="btn btn-primary btn-block" type="submit">
                  Gửi yêu cầu <Send size={16} />
                </button>
              </form>
            )}
          </section>
        </aside>
      </div>
      {chat ? <Chat onClose={() => setChat(false)} /> : null}
    </div>
  )
}

function Chat({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('')
  const [lines, setLines] = useState<Array<{ from: 'kabin' | 'me'; text: string }>>([
    { from: 'kabin', text: 'Kabin đây. Bạn cần hỗ trợ đặt phòng, thanh toán hay mã cửa?' },
  ])
  return (
    <div className="chat">
      <header>
        <strong>Chat với Kabin</strong>
        <button type="button" onClick={onClose} aria-label="Đóng">
          ×
        </button>
      </header>
      <div className="chat-log">
        {lines.map((line, index) => (
          <p key={index} className={line.from}>
            {line.text}
          </p>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const value = text.trim()
          if (!value) return
          setLines((current) => [
            ...current,
            { from: 'me', text: value },
            { from: 'kabin', text: 'Mình đã ghi nhận. Nếu cần người trực, hãy gửi yêu cầu hỗ trợ kèm số điện thoại.' },
          ])
          setText('')
        }}
      >
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Nhập tin nhắn" />
        <button className="btn btn-primary" type="submit">
          Gửi
        </button>
      </form>
    </div>
  )
}
