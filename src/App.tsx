import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Shell } from './components/Shell'
import { OtpModal } from './components/OtpModal'
import { useStore } from './store'
import { HomePage } from './pages/HomePage'
import { LocationsPage } from './pages/LocationsPage'
import { LocationDetailPage } from './pages/LocationDetailPage'
import { SelectRoomPage } from './pages/SelectRoomPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { ReviewPage } from './pages/ReviewPage'
import { PaymentPage } from './pages/PaymentPage'
import { ExpiredPage, LatePage } from './pages/PaymentStates'
import { TicketPage } from './pages/TicketPage'
import { GuidePage } from './pages/GuidePage'
import { BookingsPage } from './pages/BookingsPage'
import { LoginPage } from './pages/LoginPage'
import { AccountPage } from './pages/AccountPage'
import { PromosPage } from './pages/PromosPage'
import { HelpPage } from './pages/HelpPage'
import { PoliciesPage } from './pages/PoliciesPage'
import { LookupPage, NotFoundPage } from './pages/LookupPage'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Toaster() {
  const { toast } = useStore()
  if (!toast) return null
  return <div className="toast">{toast}</div>
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route element={<Shell />}>
          <Route index element={<HomePage />} />
          <Route path="co-so" element={<LocationsPage />} />
          <Route path="co-so/:id" element={<LocationDetailPage />} />
          <Route path="co-so/:id/chon-phong" element={<SelectRoomPage />} />
          <Route path="co-so/:id/phong/:roomId" element={<RoomDetailPage />} />
          <Route path="dat-phong" element={<ReviewPage />} />
          <Route path="thanh-toan" element={<PaymentPage />} />
          <Route path="thanh-toan/het-han" element={<ExpiredPage />} />
          <Route path="thanh-toan/den-muon" element={<LatePage />} />
          <Route path="ve/:code" element={<TicketPage />} />
          <Route path="huong-dan" element={<GuidePage />} />
          <Route path="huong-dan/:code" element={<GuidePage />} />
          <Route path="dat-phong-cua-toi" element={<BookingsPage />} />
          <Route path="tai-khoan" element={<AccountPage />} />
          <Route path="uu-dai" element={<PromosPage />} />
          <Route path="tro-giup" element={<HelpPage />} />
          <Route path="chinh-sach" element={<PoliciesPage />} />
          <Route path="chinh-sach/:id" element={<PoliciesPage />} />
          <Route path="tra-cuu" element={<LookupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <OtpModal />
      <Toaster />
    </>
  )
}
