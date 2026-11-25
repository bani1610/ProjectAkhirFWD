import { Info, MessageCircle } from 'lucide-react'
import { IMAGES, rupiah, savingPercent, waLink } from './content'
import { SectionHeading, Toggle } from './ui'

const PERIODS = [1, 6, 12]

export function RoomList({ rooms, types, filter, setFilter, priceOf, error }) {
  const shown = rooms?.filter((r) => filter.type === 'all' || r.room_type_id === filter.type)

  return (
    <section id="kamar" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        eyebrow="Kamar kosong"
        title="Pilih kamar yang cocok buat kamu"
        text="Hanya kamar yang benar-benar kosong yang tampil di sini. Ganti periode bayar untuk melihat harganya."
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <Toggle
          label="Tipe"
          value={filter.type}
          onChange={(type) => setFilter((f) => ({ ...f, type }))}
          options={[{ value: 'all', label: 'Semua' }, ...(types ?? []).map((t) => ({ value: t.id, label: t.name }))]}
        />
        <Toggle
          label="Periode"
          value={filter.months}
          onChange={(months) => setFilter((f) => ({ ...f, months }))}
          options={PERIODS.map((m) => ({ value: m, label: `${m} bulan` }))}
        />
      </div>

      {error && <p className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!error && !shown && <p className="mt-8 text-gray-500">Memuat kamar...</p>}
      {shown?.length === 0 && (
        <p className="mt-8 rounded-xl bg-white p-6 text-center text-gray-500">
          Belum ada kamar kosong untuk tipe ini. Hubungi pemilik untuk info kamar berikutnya.
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown?.map((room, i) => {
          const price = priceOf(room.room_type_id, filter.months)
          return (
            <article key={room.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative">
                <img src={IMAGES.rooms[i % IMAGES.rooms.length]} alt={`Foto Kamar ${room.number}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-brand-700">
                  <span className="size-1.5 rounded-full bg-brand-600" /> Kosong
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-brand-800 px-2.5 py-1 text-xs font-semibold text-white">
                  {room.room_type?.name}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-brand-800">Kamar {room.number}</h3>
                <p className="mt-1 text-sm text-gray-600">Lantai {room.floor} · {room.room_type?.description}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {room.facilities.map((f) => (
                    <li key={f.id} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{f.name}</li>
                  ))}
                </ul>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-brand-800">{price ? rupiah(price) : '–'}</p>
                    <p className="text-xs text-gray-500">per {filter.months} bulan</p>
                  </div>
                  <a
                    href={waLink(`Halo, apakah Kamar ${room.number} (${room.room_type?.name}) masih kosong?`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                  >
                    <MessageCircle size={16} /> Tanya
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function Pricing({ types, vacantByType, onSelectType }) {
  return (
    <section id="harga" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        eyebrow="Tipe & harga"
        title="Makin lama sewa, makin hemat"
        text="Harga sudah termasuk listrik, air, dan WiFi. Tidak ada denda keterlambatan."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {types?.map((type, i) => {
          const dark = i === 0
          const monthly = type.prices.find((p) => p.period_months === 1)?.price
          return (
            <div key={type.id} className={`rounded-2xl p-7 ${dark ? 'bg-brand-800 text-white' : 'border border-gray-200 bg-[#f6f1e7]'}`}>
              <h3 className={`text-xl font-bold ${dark ? '' : 'text-brand-800'}`}>Kamar {type.name}</h3>
              <p className={`mt-2 text-sm ${dark ? 'text-brand-100' : 'text-gray-600'}`}>
                {type.description} Sisa {vacantByType[type.id] ?? 0} kamar kosong.
              </p>
              <dl className="mt-6">
                {type.prices.map((p) => {
                  const save = monthly && p.period_months > 1 ? savingPercent(monthly, p.price, p.period_months) : 0
                  return (
                    <div key={p.id} className={`flex items-center justify-between border-t py-4 ${dark ? 'border-white/15' : 'border-gray-200'}`}>
                      <dt className="flex items-center gap-2 text-sm">
                        {p.period_months} bulan
                        {save > 0 && <span className={`rounded bg-accent/20 px-1.5 py-0.5 text-[11px] font-semibold ${dark ? 'text-accent' : 'text-amber-800'}`}>Hemat {save}%</span>}
                      </dt>
                      <dd className={`text-lg font-extrabold ${dark ? '' : 'text-brand-800'}`}>{rupiah(p.price)}</dd>
                    </div>
                  )
                })}
              </dl>
              <a
                href="#kamar"
                onClick={() => onSelectType(type.id)}
                className={`mt-4 block rounded-full py-3 text-center text-sm font-semibold ${
                  dark ? 'bg-brand-600 hover:bg-brand-700' : 'border border-brand-700 text-brand-700 hover:bg-white'
                }`}
              >
                Lihat kamar {type.name}
              </a>
            </div>
          )
        })}
      </div>

      <p className="mt-6 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-gray-700">
        <Info size={18} className="mt-0.5 shrink-0 text-accent" />
        <span><b>Info deposit:</b> Deposit sebesar 1 bulan sewa dibayar saat masuk dan dikembalikan saat keluar, dipotong jika ada kerusakan.</span>
      </p>
    </section>
  )
}
