// Badge status. Warna ditentukan dari label status (bahasa Indonesia sesuai SRS & desain Figma).
// Pakai: <StatusBadge status="Lunas" />  atau  <StatusBadge status="Apa saja" tone="warning" />

const TONES = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  neutral: 'bg-gray-100 text-gray-600 ring-gray-500/20',
}

export const STATUS_TONES = {
  // kamar & inventaris
  Kosong: 'success',
  Terisi: 'info',
  Perawatan: 'warning',
  Baik: 'success',
  'Dalam Perbaikan': 'warning',
  // tagihan
  'Belum Dibayar': 'warning',
  'Belum Lunas': 'warning',
  'Menunggu Verifikasi': 'warning',
  Aktif: 'success',
  Keluar: 'neutral',
  'Kurang baik': 'warning',
  'Selesai (Tunggu Konfirmasi)': 'warning',
  Lunas: 'success',
  'Lunas · Kuitansi': 'success',
  Ditolak: 'danger',
  Terlambat: 'danger',
  // keluhan
  Dikirim: 'neutral',
  Diproses: 'warning',
  Selesai: 'warning',
  'Selesai · Cek Hasil': 'warning',
  Dikonfirmasi: 'success',
  // urgensi keluhan
  Darurat: 'danger',
  Biasa: 'neutral',
}

export default function StatusBadge({ status, tone }) {
  const key = tone ?? STATUS_TONES[status] ?? 'neutral'
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${TONES[key] ?? TONES.neutral}`}
    >
      {status}
    </span>
  )
}
