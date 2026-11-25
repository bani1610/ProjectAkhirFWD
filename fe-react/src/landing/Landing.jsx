import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Hero, Navbar } from './Hero'
import { Pricing, RoomList } from './Rooms'
import { AppFeatures, Cta, Footer, Gallery, Location, RulesFaq, SharedFacilities, Steps } from './Sections'

export default function Landing() {
  const [data, setData] = useState({ rooms: null, types: null, facilities: null, error: null })
  const [filter, setFilter] = useState({ type: 'all', months: 1 })

  useEffect(() => {
    Promise.all([api.get('/rooms'), api.get('/room-types'), api.get('/facilities')])
      .then(([rooms, types, facilities]) =>
        setData({ rooms: rooms.data.data, types: types.data.data, facilities: facilities.data.data, error: null }),
      )
      .catch(() => setData((d) => ({ ...d, error: 'Gagal memuat data kamar. Pastikan server backend jalan, lalu muat ulang halaman.' })))
  }, [])

  const { rooms, types, facilities, error } = data
  const vacant = rooms?.filter((r) => r.status === 'vacant')
  const vacantCountByType = (vacant ?? []).reduce(
    (count, r) => ({ ...count, [r.room_type_id]: (count[r.room_type_id] ?? 0) + 1 }),
    {},
  )
  const priceOf = (typeId, months) =>
    types?.find((t) => t.id === typeId)?.prices.find((p) => p.period_months === months)?.price
  const monthlyPrices = types?.flatMap((t) => t.prices.filter((p) => p.period_months === 1).map((p) => Number(p.price))) ?? []
  const minPrice = monthlyPrices.length ? Math.min(...monthlyPrices) : null

  const selectType = (type) => setFilter((f) => ({ ...f, type }))

  return (
    <>
      <Navbar />
      <main>
        <Hero vacantCount={vacant?.length} totalRooms={rooms?.length} minPrice={minPrice} />
        <RoomList rooms={vacant} types={types} filter={filter} setFilter={setFilter} priceOf={priceOf} error={error} />
        <Pricing types={types} vacantByType={vacantCountByType} onSelectType={selectType} />
        <SharedFacilities facilities={facilities?.filter((f) => f.scope === 'shared')} />
        <Gallery />
        <AppFeatures />
        <Steps />
        <RulesFaq />
        <Location />
        <Cta vacantCount={vacant?.length} />
      </main>
      <Footer />
    </>
  )
}
