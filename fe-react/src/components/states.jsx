import { Inbox } from 'lucide-react'

export function EmptyState({ title = 'Belum ada data', text, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700">
        <Inbox className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-gray-800">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-gray-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({ message = 'Gagal memuat data. Coba muat ulang halaman.' }) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  )
}

export function LoadingState({ rows = 4 }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-200/70" />
      ))}
      <span className="sr-only">Memuat data...</span>
    </div>
  )
}
