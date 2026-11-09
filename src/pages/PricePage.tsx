import { PriceBoard } from '../components/PriceList'
import { useTitle } from '../components/ui'

export function PricePage() {
  useTitle('Bảng giá')
  return (
    <div className="wrap page">
      <p className="crumb">Trang chủ / Bảng giá</p>
      <PriceBoard />
    </div>
  )
}
