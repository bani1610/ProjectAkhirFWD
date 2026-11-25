import { BedDouble, Bike, CookingPot, Home, LogIn, MessageCircle, Wifi } from 'lucide-react'
import { IMAGES, NAV, rupiah, waLink } from './content'

export function Logo({ light = false }) {
  return (
    <a href="#" className={`flex items-center gap-2 text-lg font-extrabold ${light ? 'text-white' : 'text-brand-800'}`}>
      <span className={`grid size-8 place-items-center rounded-lg ${light ? 'bg-white text-brand-800' : 'bg-brand-700 text-white'}`}>
        <Home size={18} />
      </span>
      KostKuy
    </a>
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/70 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <ul className="hidden gap-8 text-sm font-medium text-gray-600 md:flex">
          {NAV.map((n) => (
            <li key={n.href}><a href={n.href} className="hover:text-brand-700">{n.label}</a></li>
          ))}
        </ul>
        <div className="flex gap-2">
          {/* shortcut: halaman login belum dibuat, route /login menyusul */}
          <a href="/login" className="hidden items-center gap-1.5 rounded-full border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 sm:flex">
            <LogIn size={16} /> Masuk
          </a>
          <a href={waLink()} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
            <MessageCircle size={16} /> Hubungi
          </a>
        </div>
      </nav>
    </header>
  )
}

export function Hero({ vacantCount, minPrice, totalRooms }) {
  const vacantLabel = vacantCount ?? '–'

  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 sm:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 text-xs text-gray-600">
            <span className="rounded-full bg-brand-700 px-2 py-0.5 font-semibold text-white">{vacantLabel} kosong</span>
            Kamar siap huni bulan ini
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-brand-800 sm:text-6xl">
            Kost nyaman,
            <br />
            <span className="underline decoration-accent/40 decoration-8 underline-offset-8">bayar fleksibel.</span>
          </h1>
          <p className="mt-6 max-w-md text-gray-600">
            Kamar bersih dekat kampus, WiFi kencang, dan dapur bersama. Pilih bayar 1, 6, atau 12 bulan, semua
            tagihan dan keluhan tercatat rapi di aplikasi KostKuy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#kamar" className="flex items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800">
              <BedDouble size={18} /> Lihat Kamar Kosong
            </a>
            <a href={waLink()} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-brand-700 px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50">
              <MessageCircle size={18} /> Hubungi Pemilik
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <img src={IMAGES.building} alt="Tampak depan gedung kost" className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl" />
          <div className="absolute -left-4 top-6 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-lg sm:-left-10">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><BedDouble size={18} /></span>
            <div className="text-xs">
              <p className="font-bold text-brand-800">{vacantLabel} kamar kosong</p>
              <p className="text-gray-500">Siap ditempati</p>
            </div>
          </div>
          {minPrice && (
            <div className="absolute -right-4 bottom-24 rounded-2xl bg-white p-3 text-xs shadow-lg sm:-right-8">
              <p className="text-gray-500">Mulai dari</p>
              <p className="text-sm font-bold text-brand-800">{rupiah(minPrice)}<span className="font-normal text-gray-500">/bulan</span></p>
            </div>
          )}
          <div className="absolute bottom-4 left-4 flex gap-3 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-lg">
            <span className="flex items-center gap-1"><Wifi size={14} /> WiFi</span>
            <span className="flex items-center gap-1"><Bike size={14} /> Parkir</span>
            <span className="flex items-center gap-1"><CookingPot size={14} /> Dapur</span>
          </div>
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-6 rounded-2xl bg-brand-800 px-6 py-8 text-white sm:grid-cols-4 sm:px-10">
        {[
          [totalRooms ?? '–', 'Total kamar'],
          [vacantLabel, 'Kamar kosong'],
          ['1/6/12', 'Pilihan bulan bayar'],
          ['<24 jam', 'Keluhan ditanggapi'],
        ].map(([value, label]) => (
          <div key={label} className="flex flex-col-reverse">
            <dt className="text-xs text-brand-100">{label}</dt>
            <dd className="text-3xl font-extrabold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
