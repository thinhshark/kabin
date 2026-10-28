import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, SlidersHorizontal } from 'lucide-react'
import { DISTRICTS, FILTER_AMENITIES, LOCATIONS, priceFrom, type Amenity } from '../data'
import { AmenityList, Photo, useTitle } from '../components/ui'
import { cx, formatMoney } from '../utils'

export function LocationsPage() {
  useTitle('Hệ thống cơ sở')
  const [district, setDistrict] = useState('Tất cả')
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [sort, setSort] = useState<'distance' | 'price-asc' | 'price-desc'>('distance')
  const [openFilters, setOpenFilters] = useState(false)

  const results = useMemo(() => {
    const list = LOCATIONS.filter((location) => {
      if (district !== 'Tất cả' && location.district !== district) return false
      return amenities.every((item) => location.amenities.includes(item))
    })
    list.sort((a, b) => {
      if (sort === 'price-asc') return priceFrom(a.id) - priceFrom(b.id)
      if (sort === 'price-desc') return priceFrom(b.id) - priceFrom(a.id)
      return a.distance - b.distance
    })
    return list
  }, [district, amenities, sort])

  const toggleAmenity = (item: Amenity) => {
    setAmenities((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]))
  }

  const clear = () => {
    setDistrict('Tất cả')
    setAmenities([])
  }

  return (
    <div className="wrap page">
      <p className="crumb">
        <Link to="/">Trang chủ</Link> <span>/</span> Hệ thống cơ sở
      </p>
      <h1>Hệ thống cơ sở</h1>
      <p className="lead">Chọn một điểm dừng chân cho khoảng nghỉ của bạn.</p>

      <div className="catalog">
        <aside className={cx('filters', openFilters && 'open')}>
          <div className="filters-head">
            <strong>Bộ lọc</strong>
            <button type="button" className="text-btn" onClick={clear}>
              Xóa lọc
            </button>
          </div>
          <fieldset>
            <legend>Khu vực</legend>
            {['Tất cả', ...DISTRICTS].map((item) => (
              <label key={item} className="check">
                <input type="radio" name="district" checked={district === item} onChange={() => setDistrict(item)} />
                {item}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Tiện ích</legend>
            {FILTER_AMENITIES.map((item) => (
              <label key={item} className="check">
                <input type="checkbox" checked={amenities.includes(item)} onChange={() => toggleAmenity(item)} />
                {item}
              </label>
            ))}
          </fieldset>
          <button type="button" className="btn btn-primary btn-block mobile-only" onClick={() => setOpenFilters(false)}>
            Xem {results.length} cơ sở
          </button>
        </aside>
        {openFilters ? <button type="button" className="backdrop" aria-label="Đóng bộ lọc" onClick={() => setOpenFilters(false)} /> : null}

        <div>
          <div className="catalog-bar">
            <div className="catalog-tools">
              <label>
                Sắp xếp
                <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                  <option value="distance">Gần nhất</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                </select>
              </label>
              <button type="button" className="btn btn-line filter-toggle" onClick={() => setOpenFilters(true)}>
                <SlidersHorizontal size={15} /> Bộ lọc
              </button>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="empty">
              <strong>Không có cơ sở phù hợp</strong>
              <p>Thử xóa bớt bộ lọc.</p>
              <button type="button" className="btn btn-line" onClick={clear}>
                Xóa lọc
              </button>
            </div>
          ) : (
            <div className="loc-grid">
              {results.map((location) => (
                <article key={location.id} className="loc-card">
                  <Photo src={location.cover} alt={location.name} />
                  <div className="loc-body">
                    <div className="loc-title">
                      <h2>{location.name}</h2>
                      <span>
                        <MapPin size={14} /> Cách {location.distance.toString().replace('.', ',')} km
                      </span>
                    </div>
                    <p>
                      {location.district}, {location.city}
                    </p>
                    <AmenityList items={location.amenities} />
                    <div className="loc-foot">
                      <span>
                        Từ <b className="price">{formatMoney(priceFrom(location.id))}</b>
                        <small> / 3 giờ</small>
                      </span>
                      <div>
                        <Link to={`/co-so/${location.id}`} className="text-btn">
                          Chi tiết cơ sở <ArrowRight size={15} />
                        </Link>
                        <Link to={`/co-so/${location.id}/chon-phong`} className="btn btn-primary btn-sm">
                          Xem phòng trống <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
