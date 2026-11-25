import { BellRing, Bike, CookingPot, ExternalLink, MapPin, MessageCircle, Receipt, Shirt, Sparkles, Upload, WashingMachine, Wifi, Wrench } from 'lucide-react'
import { APP_FEATURES, CONTACT, FACILITY_INFO, FAQS, IMAGES, NAV, NEARBY, RULES, STEPS, waLink } from './content'
import { Logo } from './Hero'
import { Accordion, SectionHeading } from './ui'

const FACILITY_ICONS = { WiFi: Wifi, Dapur: CookingPot, 'Parkir motor': Bike, 'Mesin cuci': WashingMachine, 'Ruang jemur': Shirt }
const FEATURE_ICONS = { Receipt, Upload, Wrench, BellRing }

export function SharedFacilities({ facilities }) {
  return (
    <section id="fasilitas" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading eyebrow="Fasilitas bersama" title="Semua yang kamu butuhkan sehari-hari" />
      {!facilities && <p className="mt-8 text-gray-500">Memuat fasilitas...</p>}
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {facilities?.map((f) => {
          const Icon = FACILITY_ICONS[f.name] ?? Sparkles
          return (
            <div key={f.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700"><Icon size={20} /></span>
              <h3 className="mt-4 font-bold text-brand-800">{f.name}</h3>
              {FACILITY_INFO[f.name] && <p className="mt-1 text-sm text-gray-500">{FACILITY_INFO[f.name]}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Tile({ src, label, className }) {
  return (
    <figure className={`relative overflow-hidden rounded-2xl ${className}`}>
      <img src={src} alt={label} loading="lazy" className="size-full object-cover" />
      <figcaption className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-800">{label}</figcaption>
    </figure>
  )
}

export function Gallery() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading eyebrow="Galeri" title="Intip suasana kost" />
      <div className="mt-10 grid gap-4 md:h-[480px] md:grid-cols-4 md:grid-rows-2">
        <Tile src={IMAGES.building} label="Tampak depan" className="aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto" />
        <Tile src={IMAGES.bedroom} label="Kamar AC" className="aspect-[4/3] md:aspect-auto" />
        <Tile src={IMAGES.kitchen} label="Dapur bersama" className="aspect-[4/3] md:aspect-auto" />
        <Tile src={IMAGES.lounge} label="Ruang santai" className="aspect-[4/3] md:col-span-2 md:aspect-auto" />
      </div>
    </section>
  )
}

export function AppFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="rounded-3xl bg-brand-800 p-8 sm:p-12">
        <SectionHeading
          light
          eyebrow="Kenapa ngekos di sini"
          title="Urusan kost jadi gampang dengan aplikasi KostKuy"
          text="Tidak perlu lagi catatan di buku atau chat yang tenggelam."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {APP_FEATURES.map((f) => {
            const Icon = FEATURE_ICONS[f.icon]
            return (
              <div key={f.title} className="rounded-2xl bg-white p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-white"><Icon size={20} /></span>
                <h3 className="mt-4 font-bold text-brand-800">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{f.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Steps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading eyebrow="Cara mulai ngekos" title="Empat langkah sampai kamu pegang kunci" />
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-gray-200 bg-white p-5">
            <span className="text-sm font-extrabold text-accent">0{i + 1}</span>
            <h3 className="mt-2 font-bold text-brand-800">{s.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function RulesFaq() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-2">
      <div>
        <SectionHeading eyebrow="Peraturan kost" title="Biar semua penghuni nyaman" />
        <div className="mt-8"><Accordion items={RULES} /></div>
      </div>
      <div id="faq">
        <SectionHeading eyebrow="FAQ" title="Pertanyaan yang sering muncul" />
        <div className="mt-8"><Accordion items={FAQS.map((f) => ({ title: f.q, text: f.a }))} /></div>
      </div>
    </section>
  )
}

export function Location() {
  const mapQuery = encodeURIComponent(CONTACT.address)
  return (
    <section id="lokasi" className="mx-auto grid max-w-6xl gap-6 px-4 py-20 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-[#f6f1e7] p-7">
        <SectionHeading eyebrow="Lokasi" title="Strategis, dekat kampus" />
        <p className="mt-4 flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={18} className="mt-0.5 shrink-0 text-brand-700" /> {CONTACT.address}
        </p>
        <dl className="mt-6">
          {NEARBY.map((n) => (
            <div key={n.place} className="flex justify-between border-t border-gray-200 py-3 text-sm">
              <dt className="text-gray-600">{n.place}</dt>
              <dd className="font-semibold text-brand-800">{n.time}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative min-h-80 overflow-hidden rounded-2xl bg-gray-200">
        <iframe
          title="Peta lokasi KostKuy"
          src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
        />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="absolute left-4 top-4 flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow"
        >
          Buka di Maps <ExternalLink size={12} />
        </a>
      </div>
    </section>
  )
}

export function Cta({ vacantCount }) {
  return (
    <section className="px-4 py-12">
      <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-brand-700 p-8 sm:flex-row sm:items-center sm:p-12">
        <span className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border-[40px] border-white/5" />
        <div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {vacantCount ? `Masih ada ${vacantCount} kamar kosong.` : 'Tertarik ngekos di sini?'}
            <br />
            Amankan sebelum terisi!
          </h2>
          <p className="mt-2 text-sm text-brand-100">{CONTACT.hours}. Balas cepat lewat WhatsApp.</p>
        </div>
        <a href={waLink()} target="_blank" rel="noreferrer" className="relative flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-brand-900 hover:brightness-95">
          <MessageCircle size={18} /> Chat Pemilik Sekarang
        </a>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="mt-8 bg-brand-900 text-sm text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs">Kost nyaman dengan pengelolaan modern. Tagihan, pembayaran, dan keluhan, semua di satu aplikasi.</p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Jelajahi</h3>
          <ul className="mt-3 space-y-2">
            {NAV.map((n) => <li key={n.href}><a href={n.href} className="hover:text-white">{n.label}</a></li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Kontak</h3>
          <ul className="mt-3 space-y-2">
            <li><a href={waLink()} target="_blank" rel="noreferrer" className="hover:text-white">WA {CONTACT.whatsappLabel}</a></li>
            <li>{CONTACT.hours}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Penghuni</h3>
          <ul className="mt-3 space-y-2">
            <li><a href="/login" className="hover:text-white">Masuk ke aplikasi</a></li>
            <li><a href="/login" className="hover:text-white">Lihat tagihan</a></li>
            <li><a href="/login" className="hover:text-white">Lapor keluhan</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl justify-between border-t border-white/10 px-4 py-6 text-xs">
        <p>© 2026 KostKuy. Kelompok 14 – FWD Final Project.</p>
        <p>Foto: Unsplash</p>
      </div>
    </footer>
  )
}
