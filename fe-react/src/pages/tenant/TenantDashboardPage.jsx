import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { isAuthenticated } from '../../services/auth';
import { LoadingState, ErrorState } from '../../components/states';

export default function TenantDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [nextPeriod, setNextPeriod] = useState(6);
  const [savingPeriod, setSavingPeriod] = useState(false);
  const [periodFeedback, setPeriodFeedback] = useState('');

  useEffect(() => {
    // Guard: redirect ke login jika belum authenticated
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    api
      .get('/tenant/dashboard')
      .then((res) => {
        setData(res.data);
        if (res.data?.occupancy?.next_period_months) {
          setNextPeriod(res.data.occupancy.next_period_months);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        setError(err?.response?.data?.message || 'Gagal memuat dashboard.');
      });
  }, [navigate]);

  const handleSaveNextPeriod = async () => {
    setSavingPeriod(true);
    setPeriodFeedback('');
    try {
      await api.patch('/tenant/occupancy/next-period', { next_period_months: nextPeriod });
      setPeriodFeedback('Pilihan periode bayar berikutnya berhasil disimpan.');
    } catch (err) {
      setPeriodFeedback(
        err?.response?.data?.message || 'Gagal menyimpan pilihan periode.'
      );
    } finally {
      setSavingPeriod(false);
    }
  };

  const formatRp = (n) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(n || 0);

  // Loading state
  if (!data && !error) {
    return <LoadingState message="Memuat ringkasan penghuni..." />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="rounded-[24px] bg-gradient-to-br from-[#1B6B3A] via-[#14532D] to-[#0B331C] text-white p-6 sm:p-8 shadow-lg relative overflow-hidden mb-6">
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #F5A623 0%, transparent 70%)' }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#F5A623] mb-2">
              <span className="h-0.5 w-4 rounded-full bg-[#F5A623]" />
              <span>
                KAMAR {data.occupancy?.room?.number} · LANTAI {data.occupancy?.room?.floor} (
                {data.occupancy?.room?.type_name})
              </span>
            </div>
            <h1 className="font-['Fraunces',Georgia,serif] text-2xl sm:text-3xl font-bold tracking-tight">
              Halo, {data.user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-1">
              Masa sewa aktif s/d{' '}
              <strong className="text-white font-['JetBrains_Mono',monospace]">
                {data.occupancy?.active_until || '-'}
              </strong>{' '}
              · Deposit {formatRp(data.occupancy?.deposit_amount)} (
              {data.occupancy?.deposit_status === 'received' ? 'Diterima' : data.occupancy?.deposit_status}
              )
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/penghuni/tagihan"
              className="rounded-full bg-[#F5A623] hover:bg-[#e09416] text-[#112A1C] font-bold text-xs px-5 py-2.5 shadow transition"
            >
              Bayar / Unggah Bukti →
            </Link>
            <Link
              to="/penghuni/keluhan"
              className="rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs px-4 py-2.5 transition"
            >
              + Buat Keluhan
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Ringkasan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tagihan Aktif */}
        <div className="lg:col-span-2 rounded-[22px] bg-white border border-[#E5E1D8] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B6B3A]">
                Tagihan Berjalan
              </span>
              <h2 className="font-['Fraunces',Georgia,serif] text-xl font-bold text-[#112A1C]">
                {data.active_invoice ? data.active_invoice.number : 'Tidak Ada Tagihan Tertunggak'}
              </h2>
            </div>
            {data.active_invoice && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  data.active_invoice.status === 'overdue'
                    ? 'bg-[#FEE2E2] text-[#B91C1C]'
                    : data.active_invoice.status === 'pending_verification'
                    ? 'bg-[#FEF3C7] text-[#B45309]'
                    : 'bg-[#FEF3C7] text-[#92400E]'
                }`}
              >
                {data.active_invoice.status === 'unpaid'
                  ? 'Belum Bayar'
                  : data.active_invoice.status === 'pending_verification'
                  ? 'Menunggu Verifikasi'
                  : data.active_invoice.status === 'overdue'
                  ? 'Terlambat'
                  : 'Lunas'}
              </span>
            )}
          </div>
          {data.active_invoice ? (
            <div className="rounded-2xl bg-[#F8F6F1] border border-[#E5E1D8] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-[#4B5850]">
                  Periode Sewa ({data.active_invoice.period_months} Bulan):{' '}
                  <strong className="text-[#112A1C]">
                    {data.active_invoice.period_start} s/d {data.active_invoice.period_end}
                  </strong>
                </div>
                <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#14532D]">
                  {formatRp(data.active_invoice.amount)}
                </div>
                <div className="text-xs text-[#7A867E]">
                  Jatuh tempo:{' '}
                  <strong className="text-[#112A1C]">{data.active_invoice.due_date}</strong>
                </div>
              </div>
              <Link
                to="/penghuni/tagihan"
                className="inline-flex items-center justify-center rounded-full bg-[#14532D] hover:bg-[#0B331C] text-white font-bold text-xs px-5 py-3 transition"
              >
                Unggah Bukti Transfer
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#E5F1EA] p-5 text-xs font-semibold text-[#14532D]">
              Semua tagihan Anda sudah lunas. Kuitansi PDF tersedia di menu Tagihan.
            </div>
          )}
          {/* Pilihan Periode Bayar Berikutnya */}
          <div className="mt-6 pt-5 border-t border-[#E5E1D8]">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-[#112A1C]">Pilihan Periode Bayar Berikutnya</h3>
              <p className="text-xs text-[#4B5850]">
                Pilih skema 1, 6, atau 12 bulan maksimal H-15 sebelum periode berjalan berakhir.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {(data.prices || []).map((p) => (
                <button
                  key={p.period_months}
                  type="button"
                  onClick={() => setNextPeriod(p.period_months)}
                  className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                    nextPeriod === p.period_months
                      ? 'border-[#14532D] bg-[#E5F1EA]/70 ring-2 ring-[#14532D]/15'
                      : 'border-[#E5E1D8] bg-[#F8F6F1] hover:bg-white'
                  }`}
                >
                  <div className="text-xs font-extrabold text-[#112A1C]">{p.period_months} Bulan</div>
                  <div className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#1B6B3A] mt-1">
                    {formatRp(p.price)}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-[#7A867E]">
                *Otomatis terkunci pada H-14 saat tagihan baru diterbitkan sistem.
              </span>
              <button
                type="button"
                disabled={savingPeriod}
                onClick={handleSaveNextPeriod}
                className="rounded-full bg-[#14532D] hover:bg-[#0B331C] text-white text-xs font-bold px-4 py-2 transition cursor-pointer"
              >
                {savingPeriod ? 'Menyimpan...' : 'Simpan Pilihan Periode'}
              </button>
            </div>
            {periodFeedback && (
              <p className="mt-2 text-xs font-semibold text-[#1B6B3A]">{periodFeedback}</p>
            )}
          </div>
        </div>
        {/* Status Keluhan & Pintasan */}
        <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B6B3A]">
              Pemeliharaan & Fasilitas
            </span>
            <h2 className="font-['Fraunces',Georgia,serif] text-xl font-bold text-[#112A1C] mt-0.5">
              Status Keluhan Anda
            </h2>
            <p className="text-xs text-[#4B5850] mt-1">
              Laporkan kerusakan atau fasilitas tidak sesuai disertai foto bukti.
            </p>
            <div className="mt-4 rounded-2xl bg-[#F8F6F1] border border-[#E5E1D8] p-4">
              <div className="text-xs text-[#4B5850]">Menunggu Konfirmasi / Diproses</div>
              <div className="font-['JetBrains_Mono',monospace] text-3xl font-bold text-[#112A1C] mt-1">
                {data.open_complaints_count ?? 0} Tiket
              </div>
            </div>
          </div>
          <div className="space-y-2.5">
            <Link
              to="/penghuni/keluhan"
              className="block w-full text-center rounded-full bg-[#14532D] hover:bg-[#0B331C] text-white font-bold text-xs py-3 transition"
            >
              Lihat & Konfirmasi Keluhan
            </Link>
            <Link
              to="/penghuni/kamar"
              className="block w-full text-center rounded-full bg-[#F1EDE3] hover:bg-[#E5E1D8] text-[#112A1C] font-bold text-xs py-3 transition"
            >
              Cek Inventaris Kamar & Tata Tertib
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}