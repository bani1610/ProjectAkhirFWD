import { ChevronLeft, ChevronRight } from 'lucide-react'

// page mulai dari 1. Dipakai DataTable, bisa juga dipakai sendiri untuk paginasi dari API (meta).
export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  const btn =
    'inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600'

  return (
    <nav className="flex items-center justify-between gap-3 pt-4" aria-label="Paginasi">
      <p className="text-sm text-gray-500">
        Halaman <span className="font-semibold text-gray-800">{page}</span> dari {pageCount}
      </p>
      <div className="flex gap-2">
        <button type="button" className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Halaman sebelumnya">
          <ChevronLeft className="size-4" />
        </button>
        <button type="button" className={btn} disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label="Halaman berikutnya">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  )
}
