import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DEMO_PHONE, DEMO_USER, quoteOf, SEED_BOOKINGS, type Booking } from './data'
import { normalizePhone, todayISO } from './utils'

export type User = {
  name: string
  phone: string
  email: string
  promoNotify: boolean
  savedPromos: string[]
}

export type Draft = {
  locationId: string
  roomId: string
  date: string
  time: string
  duration: number
  name: string
  phone: string
  phoneVerified: boolean
  email: string
  promoCode: string
  agreed: boolean
  bookingCode: string
  paymentRef: string
  gateCode: string
  roomCode: string
  holdUntil: number | null
  phase: 'idle' | 'holding' | 'paid' | 'expired' | 'late'
}

export type OtpPurpose = 'login' | 'checkout' | 'lookup' | 'change-phone'

type OtpState = {
  phone: string
  purpose: OtpPurpose
  error: string
  seconds: number
}

type Persisted = {
  user: User | null
  bookings: Booking[]
  draft: Draft
  lookupPhone: string
}

const KEY = 'kabin.v1'

function emptyDraft(): Draft {
  return {
    locationId: 'cau-giay',
    roomId: '',
    date: todayISO(),
    time: '14:00',
    duration: 3,
    name: '',
    phone: '',
    phoneVerified: false,
    email: '',
    promoCode: '',
    agreed: false,
    bookingCode: '',
    paymentRef: '',
    gateCode: '',
    roomCode: '',
    holdUntil: null,
    phase: 'idle',
  }
}

function load(): Persisted {
  const fallback: Persisted = {
    user: null,
    bookings: SEED_BOOKINGS,
    draft: emptyDraft(),
    lookupPhone: '',
  }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Persisted
    return {
      user: parsed.user ?? null,
      bookings: parsed.bookings?.length ? parsed.bookings : SEED_BOOKINGS,
      draft: { ...emptyDraft(), ...parsed.draft },
      lookupPhone: parsed.lookupPhone ?? '',
    }
  } catch {
    return fallback
  }
}

function codeFrom(date: string) {
  const compact = date.replaceAll('-', '').slice(2)
  const tail = String(Math.floor(1000 + Math.random() * 9000))
  return `KB-${compact}-${tail}`
}

function paymentRef() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let value = 'KABIN'
  for (let i = 0; i < 4; i += 1) value += alphabet[Math.floor(Math.random() * alphabet.length)]
  return value
}

function doorCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}#`
}

type Store = {
  user: User | null
  draft: Draft
  bookings: Booking[]
  toast: string
  otp: OtpState | null
  lookupPhone: string
  setDraft: (patch: Partial<Draft>) => void
  showToast: (message: string) => void
  openOtp: (args: { phone: string; purpose: OtpPurpose; onSuccess: () => void }) => void
  closeOtp: () => void
  verifyOtp: (code: string) => void
  resendOtp: () => void
  login: (phone: string) => void
  logout: () => void
  updateUser: (patch: Partial<User>) => void
  toggleSavedPromo: (code: string) => void
  startHold: () => void
  confirmPaid: () => string
  expireHold: () => void
  markLate: () => void
  resetHold: () => void
  setLookupPhone: (phone: string) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => load(), [])
  const [user, setUser] = useState<User | null>(initial.user)
  const [draft, setDraftState] = useState<Draft>(initial.draft)
  const [bookings, setBookings] = useState<Booking[]>(initial.bookings)
  const [lookupPhone, setLookupPhone] = useState(initial.lookupPhone)
  const [toast, setToast] = useState('')
  const [otp, setOtp] = useState<OtpState | null>(null)
  const successRef = useRef<() => void>(() => {})
  const draftRef = useRef(draft)
  draftRef.current = draft

  const pushBooking = (booking: Booking) => {
    setBookings((list) => (list.some((item) => item.code === booking.code) ? list : [booking, ...list]))
  }

  useEffect(() => {
    const payload: Persisted = { user, bookings, draft, lookupPhone }
    localStorage.setItem(KEY, JSON.stringify(payload))
  }, [user, bookings, draft, lookupPhone])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!otp || otp.seconds <= 0) return
    const timer = window.setTimeout(() => {
      setOtp((current) => (current ? { ...current, seconds: current.seconds - 1 } : current))
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [otp])

  useEffect(() => {
    document.body.style.overflow = otp ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [otp])

  const setDraft = (patch: Partial<Draft>) => {
    setDraftState((current) => ({ ...current, ...patch }))
  }

  const showToast = (message: string) => setToast(message)

  const login = (phone: string) => {
    const normalized = normalizePhone(phone)
    if (user && normalizePhone(user.phone) === normalized) return
    if (normalized === DEMO_PHONE) {
      setUser({ ...DEMO_USER })
      return
    }
    setUser({
      name: 'Khách Kabin',
      phone: normalized,
      email: '',
      promoNotify: false,
      savedPromos: [],
    })
  }

  const value: Store = {
    user,
    draft,
    bookings,
    toast,
    otp,
    lookupPhone,
    setDraft,
    showToast,
    openOtp: ({ phone, purpose, onSuccess }) => {
      successRef.current = onSuccess
      setOtp({ phone: normalizePhone(phone), purpose, error: '', seconds: 45 })
    },
    closeOtp: () => setOtp(null),
    verifyOtp: (code) => {
      if (code.length < 6) return
      if (code === '000000') {
        setOtp((current) => (current ? { ...current, error: 'Mã không đúng hoặc đã hết hạn.' } : current))
        return
      }
      const callback = successRef.current
      setOtp(null)
      callback()
    },
    resendOtp: () => {
      setOtp((current) => (current ? { ...current, seconds: 45, error: '' } : current))
      setToast('Đã gửi lại mã xác thực')
    },
    login,
    logout: () => setUser(null),
    updateUser: (patch) => setUser((current) => (current ? { ...current, ...patch } : current)),
    toggleSavedPromo: (code) => {
      setUser((current) => {
        if (!current) return current
        const has = current.savedPromos.includes(code)
        return {
          ...current,
          savedPromos: has ? current.savedPromos.filter((item) => item !== code) : [...current.savedPromos, code],
        }
      })
    },
    startHold: () => {
      setDraftState((current) => ({
        ...current,
        phase: 'holding',
        holdUntil: Date.now() + 5 * 60 * 1000,
        bookingCode: current.bookingCode || codeFrom(current.date),
        paymentRef: current.paymentRef || paymentRef(),
        gateCode: current.gateCode || doorCode(),
        roomCode: current.roomCode || doorCode(),
      }))
    },
    confirmPaid: () => {
      const current = draftRef.current
      const quoted = quoteOf(current.roomId, current.duration, current.promoCode)
      pushBooking({
        id: current.bookingCode,
        code: current.bookingCode,
        locationId: current.locationId,
        roomId: current.roomId,
        date: current.date,
        time: current.time,
        duration: current.duration,
        price: quoted?.base ?? 0,
        discount: quoted?.discount ?? 0,
        guestName: current.name,
        phone: normalizePhone(current.phone),
        email: current.email,
        status: 'upcoming',
        gateCode: current.gateCode,
        roomCode: current.roomCode,
        paymentRef: current.paymentRef,
      })
      setDraftState((item) => ({ ...item, phase: 'paid' }))
      return current.bookingCode
    },
    expireHold: () => setDraftState((current) => ({ ...current, phase: 'expired', holdUntil: null })),
    markLate: () => {
      const current = draftRef.current
      const quoted = quoteOf(current.roomId, current.duration, current.promoCode)
      const code = current.bookingCode || codeFrom(current.date)
      pushBooking({
        id: code,
        code,
        locationId: current.locationId,
        roomId: current.roomId,
        date: current.date,
        time: current.time,
        duration: current.duration,
        price: quoted?.base ?? 0,
        discount: quoted?.discount ?? 0,
        guestName: current.name,
        phone: normalizePhone(current.phone),
        email: current.email,
        status: 'pending',
        gateCode: '',
        roomCode: '',
        paymentRef: current.paymentRef,
      })
      setDraftState((item) => ({ ...item, phase: 'late', bookingCode: code }))
    },
    resetHold: () =>
      setDraftState((current) => ({
        ...current,
        phase: 'idle',
        holdUntil: null,
        bookingCode: '',
        paymentRef: '',
        gateCode: '',
        roomCode: '',
      })),
    setLookupPhone,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Store chưa được bọc')
  return ctx
}
