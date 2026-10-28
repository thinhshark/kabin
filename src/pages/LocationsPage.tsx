import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, List, LocateFixed, Map, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { DISTRICTS, FILTER_AMENITIES, LOCATIONS, priceFrom, type Amenity } from '../data'
import { useStore } from '../store'
import { AmenityList, Photo, useTitle } from '../components/ui'
import { cx, formatMoney } from '../utils'

export function LocationsPage() {
  useTitle('Hệ thống cơ sở')
  const { showToast } = useStore()
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState('Tất cả')
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [sort, setSort] = useState<'distance' | 'price-asc' | 'price-desc'>('distance')
  const [view, setView] = useState<'list' | 'map'>('list')
  const [openFilters, setOpenFilters] = useState(false)

  const results = useMemo(() => {
    const text = query.trim().toLowerCase()
    const list = LOCATIONS.filter((location) => {
      const hay = `${location.name} ${location.district}`.toLowerCase()
      if (text && !hay.includes(text)) return false
      if (district !== 'Tất cả' && location.district !== district) return false
      return amenities.every((item) => location.amenities.includes(item))
    })
    list.sort((a, b) => {
      if (sort === 'price-asc') return priceFrom(a.id) - priceFrom(b.id)
      if (sort === 'price-desc') return priceFrom(b.id) - priceFrom(a.id)
      return a.distance - b.distance
    })
    return list
  }, [query, district, amenities, sort])

  const toggleAmenity = (item: Amenity) => {
    setAmenities((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]))
  }

  const clear = () => {
    setDistrict('Tất cả')
    setAmenities([])
    setQuery('')
  }

  return (
    <div className="wrap page">
      <p className="crumb">
        <Link to="/">Trang chủ</Link> <span>/</span> Hệ thống cơ sở
      </p>
      <h1>Hệ thống cơ sở</h1>
      <p className="lead">Chọn một điểm dừng chân cho khoảng nghỉ của bạn.</p>

      <form className="search-row" onSubmit={(event) => event.preventDefault()}>
        <label className="control grow">
          <Search size={18} />
          <input placeholder="Tìm tên cơ sở hoặc khu vực" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label className="control">
          <MapPin size={18} />
          <select defaultValue="Hà Nội" aria-label="Thành phố">
            <option>Hà Nội</option>
          </select>
        </label>
        <button
          type="button"
          className="btn btn-line"
          onClick={() => {
            setSort('distance')
            showToast('Đang sắp theo khoảng cách minh họa quanh Hà Nội')
          }}
        >
          <LocateFixed size={16} /> Gần tôi
        </button>
        <button type="button" className="btn btn-primary filter-toggle" onClick={() => setOpenFilters(true)}>
          <SlidersHorizontal size={16} /> Bộ lọc
        </button>
        <button type="submit" className="btn btn-primary desktop-submit">
          Tìm cơ sở <ArrowRight size={16} />
        </button>
      </form>

      <div className="chip-row">
        {['Tất cả', ...DISTRICTS].map((item) => (
          <button key={item} type="button" className={cx('chip', district === item && 'on')} onClick={() => setDistrict(item)}>
            {item}
          </button>
        ))}
      </div>

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
          <div className="filter-note">
            <strong>Đặt phòng trực tuyến</strong>
            <p>Tự nhận phòng bằng mã truy cập.</p>
          </div>
          <button type="button" className="btn btn-primary btn-block mobile-only" onClick={() => setOpenFilters(false)}>
            Xem {results.length} cơ sở
          </button>
        </aside>
        {openFilters ? <button type="button" className="backdrop" aria-label="Đóng bộ lọc" onClick={() => setOpenFilters(false)} /> : null}

        <div>
          <div className="catalog-bar">
            <strong>{results.length} cơ sở tại Hà Nội</strong>
            <div className="catalog-tools">
              <label>
                Sắp xếp
                <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                  <option value="distance">Gần nhất</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                </select>
              </label>
              <div className="seg">
                <button type="button" className={cx(view === 'list' && 'on')} onClick={() => setView('list')}>
                  <List size={15} /> Danh sách
                </button>
                <button type="button" className={cx(view === 'map' && 'on')} onClick={() => setView('map')}>
                  <Map size={15} /> Bản đồ
                </button>
              </div>
            </div>
          </div>

          {view === 'map' ? (
            <div className="map-board" aria-label="Bản đồ minh họa các cơ sở">
              {results.map((location, index) => (
                <Link
                  key={location.id}
                  to={`/co-so/${location.id}`}
                  className="pin"
                  style={{ top: `${22 + (index % 3) * 22}%`, left: `${18 + index * 16}%` }}
                >
                  <MapPin size={16} />
                  {location.name.replace('Kabin ', '')}
                </Link>
              ))}
            </div>
          ) : null}

          {results.length === 0 ? (
            <div className="empty">
              <strong>Không có cơ sở phù hợp</strong>
              <p>Thử xóa bớt bộ lọc hoặc tìm tên khác.</p>
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
