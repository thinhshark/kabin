import { useEffect, useRef, useState } from 'react'
import { Smartphone } from 'lucide-react'
import { useStore } from '../store'
import { cx, maskPhone } from '../utils'

export function OtpModal() {
  const { otp, closeOtp, verifyOtp, resendOtp } = useStore()
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    setDigits(['', '', '', '', '', ''])
    const timer = window.setTimeout(() => inputs.current[0]?.focus(), 40)
    return () => window.clearTimeout(timer)
  }, [otp?.phone, otp?.purpose])

  useEffect(() => {
    if (!otp) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeOtp()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [otp, closeOtp])

  if (!otp) return null

  const code = digits.join('')
  const ready = code.length === 6
  const mm = String(Math.floor(otp.seconds / 60)).padStart(2, '0')
  const ss = String(otp.seconds % 60).padStart(2, '0')

  const write = (index: number, raw: string) => {
    const only = raw.replace(/\D/g, '')
    if (!only) {
      setDigits((current) => current.map((item, i) => (i === index ? '' : item)))
      return
    }
    const chars = only.slice(0, 6 - index).split('')
    setDigits((current) => {
      const next = [...current]
      chars.forEach((char, offset) => {
        next[index + offset] = char
      })
      return next
    })
    const focusAt = Math.min(index + chars.length, 5)
    inputs.current[focusAt]?.focus()
  }

  return (
    <div className="modal-root" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="otp-title">
        <button type="button" className="modal-x" onClick={closeOtp} aria-label="Đóng">
          ×
        </button>
        <span className="modal-icon">
          <Smartphone size={22} />
        </span>
        <h2 id="otp-title">Xác thực số điện thoại</h2>
        <p>Nhập mã OTP đã gửi tới {maskPhone(otp.phone)}</p>
        <div className="otp-boxes">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputs.current[index] = node
              }}
              className={cx(otp.error && 'bad')}
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              aria-label={`Số thứ ${index + 1}`}
              onChange={(event) => write(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Backspace' && !digits[index] && index > 0) {
                  inputs.current[index - 1]?.focus()
                }
              }}
              onPaste={(event) => {
                event.preventDefault()
                write(index, event.clipboardData.getData('text'))
              }}
            />
          ))}
        </div>
        {otp.error ? <p className="form-error center">{otp.error}</p> : null}
        {otp.seconds > 0 ? (
          <p className="hint center">Gửi lại mã sau {mm}:{ss}</p>
        ) : (
          <button type="button" className="text-btn center-btn" onClick={resendOtp}>
            Gửi lại mã
          </button>
        )}
        <button type="button" className="text-btn center-btn" onClick={closeOtp}>
          Đổi số điện thoại
        </button>
        <button type="button" className="btn btn-primary btn-block" disabled={!ready} onClick={() => verifyOtp(code)}>
          {otp.error ? 'Xác thực lại' : 'Xác thực'}
        </button>
        <p className="hint center">Xác thực để nhận đúng thông tin đặt phòng.</p>
      </div>
    </div>
  )
}
