// Kartu data (mis. kamar, fasilitas) dan kartu angka ringkasan (dashboard).

// Grid responsif: 1 kolom di 360px, 2 kolom di sm, 3 kolom di lg
export function CardGrid({ children }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

/**
 * <DataCard title="Kamar A1" subtitle="Lantai 1 · Tipe Standar" badge={<StatusBadge status="Kosong" />}
 *           footer={<button>Detail</button>}>
 *   isi tambahan (opsional)
 * </DataCard>
 */
export default function DataCard({ title, subtitle, badge, children, footer }) {
  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-brand-800">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {badge}
      </header>
      {children && <div className="mt-4 text-sm text-gray-700">{children}</div>}
      {footer && <footer className="mt-4 border-t border-gray-100 pt-3">{footer}</footer>}
    </article>
  )
}

// Kartu angka ringkasan: <StatCard label="Kamar terisi" value="12" icon={BedDouble} />
export function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
      {Icon && (
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="truncate text-xl font-extrabold text-brand-800">{value}</p>
      </div>
    </div>
  )
}
