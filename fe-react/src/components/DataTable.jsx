import { useState } from 'react'
import Pagination from './Pagination'
import { EmptyState, LoadingState } from './states'

/**
 * Tabel responsif: tabel biasa di layar >= md, berubah jadi daftar kartu di layar kecil
 * (mulai 360px), jadi tidak perlu geser horizontal.
 *
 * columns: [{ key, label, render?(row), primary?, align? }]
 *   - primary: true  -> kolom ini jadi judul kartu di mobile
 *   - render(row)    -> isi sel kustom (mis. <StatusBadge />, tombol aksi)
 *   - align: 'right' -> rata kanan (cocok untuk nominal)
 * rows: array data
 * rowKey: nama field unik (default 'id')
 * pageSize: jumlah baris per halaman (default 10, paginasi di sisi klien)
 *
 * Contoh:
 *   <DataTable
 *     columns={[
 *       { key: 'number', label: 'Kamar', primary: true },
 *       { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
 *     ]}
 *     rows={rooms}
 *     loading={!rooms}
 *   />
 */
export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  loading = false,
  pageSize = 10,
  emptyTitle = 'Belum ada data',
  emptyText,
  bare = false, // true: tanpa bingkai luar, untuk dipasang di dalam <Panel>
}) {
  const [page, setPage] = useState(1)

  if (loading) return <LoadingState />
  if (!rows || rows.length === 0) return <EmptyState title={emptyTitle} text={emptyText} />

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pageCount)
  const visible = rows.slice((current - 1) * pageSize, current * pageSize)

  const primary = columns.find((c) => c.primary) ?? columns[0]
  const rest = columns.filter((c) => c !== primary)
  const cell = (col, row) => (col.render ? col.render(row) : row[col.key])

  return (
    <div>
      {/* Desktop: tabel */}
      <div className={`hidden overflow-x-auto md:block ${bare ? '' : 'rounded-2xl border border-gray-200 bg-white'}`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={`px-5 py-3 ${c.align === 'right' ? 'text-right' : ''}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((row) => (
              <tr key={row[rowKey]} className="transition hover:bg-cream">
                {columns.map((c) => (
                  <td key={c.key} className={`px-5 py-3.5 text-gray-700 ${c.align === 'right' ? 'text-right tabular-nums' : ''}`}>
                    {cell(c, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: kartu */}
      <ul className="space-y-3 md:hidden">
        {visible.map((row) => (
          <li key={row[rowKey]} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="font-semibold text-brand-800">{cell(primary, row)}</p>
            <dl className="mt-3 space-y-2 text-sm">
              {rest.map((c) => (
                <div key={c.key} className="flex items-center justify-between gap-4">
                  <dt className="text-gray-500">{c.label}</dt>
                  <dd className="text-right font-medium text-gray-800">{cell(c, row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <Pagination page={current} pageCount={pageCount} onChange={setPage} />
    </div>
  )
}

// Sel dua baris (teks utama + keterangan kecil), mis. nama penyewa dan nomor HP.
export function TwoLine({ main, sub }) {
  return (
    <div>
      <p className="font-semibold text-gray-900">{main}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

// Angka/nomor dengan font mono (nominal rupiah, nomor invoice).
export function Mono({ children }) {
  return <span className="font-mono text-xs">{children}</span>
}
