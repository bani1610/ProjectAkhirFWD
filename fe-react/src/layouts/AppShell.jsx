import { Link, NavLink, Outlet } from 'react-router-dom'
import { Building2 } from 'lucide-react'

const BADGE_TONES = { amber: 'bg-accent text-brand-900', red: 'bg-red-600 text-white' }

/**
 * Layout dasar responsif: navbar menu atas berbentuk pil + area isi.
 *  - Layar >= xl : menu di tengah navbar
 *  - Layar kecil : menu turun ke baris sendiri dan bisa digeser ke samping (aman di 360px)
 *
 * Layout ini polos dan tidak tahu soal peran/login, jadi bisa dipakai halaman mana pun
 * (mis. portal owner). Portal penghuni milik Faisa tetap memakai TenantLayout-nya.
 *
 * Props:
 *   items    menu: [{ to, label, end?, badge?: { count, tone: 'amber' | 'red' } }]
 *   homeTo   tujuan klik logo
 *   tag      tulisan kecil di samping logo, mis. "Owner"
 *   actions  isi kanan navbar (lonceng, tombol, dll.)
 *   children isi halaman; kalau kosong dipakai <Outlet /> untuk route bersarang
 *
 * Contoh:
 *   <AppShell tag="Owner" homeTo="/owner" items={[{ to: '/owner', label: 'Ringkasan', end: true }]}>
 *     <HalamanSaya />
 *   </AppShell>
 */
export default function AppShell({ items = [], homeTo = '/', tag, actions, children }) {
  const tabs = (
    <ul className="flex w-max items-center gap-0.5 rounded-full border border-gray-200 bg-gray-100/70 p-1">
      {items.map(({ to, label, end, badge }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold transition ${
                isActive ? 'bg-white text-brand-800 shadow-sm' : 'text-gray-600 hover:text-brand-700'
              }`
            }
          >
            {label}
            {badge?.count > 0 && (
              <span className={`grid size-4 place-items-center rounded-full text-[10px] font-bold ${BADGE_TONES[badge.tone] ?? BADGE_TONES.amber}`}>
                {badge.count}
              </span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-gray-200/70 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to={homeTo} className="flex shrink-0 items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-700 text-white">
              <Building2 className="size-4" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold text-brand-800">KostKuy</span>
            {tag && (
              <span className="hidden rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 sm:inline">
                {tag}
              </span>
            )}
          </Link>

          <nav className="hidden flex-1 justify-center xl:flex" aria-label="Menu utama">
            {tabs}
          </nav>

          <div className="ml-auto flex items-center gap-2">{actions}</div>
        </div>

        {/* Menu di layar kecil: baris sendiri, bisa digeser */}
        <nav className="overflow-x-auto px-4 pb-3 xl:hidden" aria-label="Menu utama">
          {tabs}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">{children ?? <Outlet />}</main>
    </div>
  )
}
