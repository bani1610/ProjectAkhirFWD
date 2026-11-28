import { BedDouble, Receipt, Users, Wrench } from 'lucide-react'
import DataCard, { CardGrid, StatCard } from '../components/DataCard'
import DataTable, { Mono, TwoLine } from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { EmptyState } from '../components/states'
import { rupiah } from '../landing/content'
import AppShell from '../layouts/AppShell'

// Halaman contoh untuk melihat AppShell, DataTable, dan DataCard dengan data palsu (Tugas 2).
// Buka di /demo-komponen. Aman dihapus (beserta satu baris route di App.jsx) kalau sudah tidak perlu.
const menu = [
  { to: '/demo-komponen', label: 'Ringkasan', end: true },
  { to: '/demo-komponen#tagihan', label: 'Tagihan', badge: { count: 2, tone: 'amber' } },
  { to: '/demo-komponen#kamar', label: 'Kamar' },
  { to: '/demo-komponen#keluhan', label: 'Keluhan', badge: { count: 1, tone: 'red' } },
]

const invoices = [
  { id: 1, no: 'INV-202611-008', tenant: 'Aulia Rahman', unit: 'Kamar B-05', amount: 8400000, status: 'Menunggu Verifikasi' },
  { id: 2, no: 'INV-202611-004', tenant: 'Rizky Pratama', unit: 'Kamar B-02', amount: 1500000, status: 'Terlambat' },
  { id: 3, no: 'INV-202611-001', tenant: 'Nadia Putri', unit: 'Kamar B-04', amount: 1500000, status: 'Lunas' },
  { id: 4, no: 'INV-202610-012', tenant: 'Dimas Saputra', unit: 'Kamar A-05', amount: 900000, status: 'Belum Dibayar' },
  { id: 5, no: 'INV-202610-009', tenant: 'Citra Lestari', unit: 'Kamar A-03', amount: 900000, status: 'Lunas' },
]

const columns = [
  { key: 'no', label: 'Nomor Invoice', primary: true, render: (r) => <Mono>{r.no}</Mono> },
  { key: 'tenant', label: 'Penyewa & Unit', render: (r) => <TwoLine main={r.tenant} sub={r.unit} /> },
  { key: 'amount', label: 'Nominal', align: 'right', render: (r) => <Mono>{rupiah(r.amount)}</Mono> },
  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
]

const rooms = [
  { id: 1, number: 'A-02', detail: 'Lantai 1 · Non-AC · Rp900.000/bln', status: 'Kosong' },
  { id: 2, number: 'B-02', detail: 'Lantai 2 · AC · Masuk 10 Agu 2026', status: 'Terisi' },
  { id: 3, number: 'A-04', detail: 'Lantai 1 · Non-AC · Pengecatan ulang', status: 'Perawatan' },
]

export default function DemoKomponen() {
  return (
    <AppShell tag="Demo" homeTo="/demo-komponen" items={menu}>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Kamar terisi" value="6 / 12" icon={BedDouble} />
        <StatCard label="Tagihan belum lunas" value={rupiah(2400000)} icon={Receipt} />
        <StatCard label="Penyewa aktif" value="6 orang" icon={Users} />
        <StatCard label="Keluhan aktif" value="3" icon={Wrench} />
      </section>

      <section id="tagihan">
        <h2 className="mb-3 text-lg font-bold text-brand-800">DataTable (tabel di desktop, kartu di HP)</h2>
        <DataTable columns={columns} rows={invoices} pageSize={4} />
      </section>

      <section id="kamar">
        <h2 className="mb-3 text-lg font-bold text-brand-800">DataCard + CardGrid</h2>
        <CardGrid>
          {rooms.map((r) => (
            <DataCard key={r.id} title={`Kamar ${r.number}`} subtitle={r.detail} badge={<StatusBadge status={r.status} />} />
          ))}
        </CardGrid>
      </section>

      <section id="keluhan">
        <h2 className="mb-3 text-lg font-bold text-brand-800">Tampilan kosong</h2>
        <EmptyState title="Belum ada keluhan" text="Data akan muncul di sini setelah ada laporan." />
      </section>
    </AppShell>
  )
}
