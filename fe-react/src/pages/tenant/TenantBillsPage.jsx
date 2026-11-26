import { useState, useEffect } from 'react';
import {api} from '../../lib/api';

export default function TenantBillsPage() {
  const [invoices, setInvoices] = useState([]);
  const [bankInfo, setBankInfo] = useState({
    bank_name: 'BCA',
    bank_account_number: '1234567890',
    bank_account_name: 'Pemilik KostKuy',
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    api
      .get('/tenant/invoices')
      .then((res) => {
        setInvoices(res.data?.invoices || []);
        if (res.data?.bank) setBankInfo(res.data.bank);
      })
      .catch(() => {
        setInvoices([
          {
            id: 2,
            number: 'INV-202611-0002',
            period_start: '2026-11-10',
            period_end: '2027-05-09',
            period_months: 6,
            amount: 5700000,
            due_date: '2026-11-10',
            status: 'unpaid',
            latest_payment: null,
          },
          {
            id: 1,
            number: 'INV-202605-0001',
            period_start: '2026-05-10',
            period_end: '2026-11-09',
            period_months: 6,
            amount: 5700000,
            due_date: '2026-05-10',
            status: 'paid',
            latest_payment: {
              method: 'transfer',
              paid_at: '2026-05-09',
              status: 'approved',
            },
          },
        ]);
      });
  }, []);

  const formatRp = (n) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(n || 0);

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!selectedInvoice || !proofFile) return;

    setSubmitting(true);
    setFeedback('');
    try {
      const fd = new FormData();
      fd.append('amount', selectedInvoice.amount);
      fd.append('paid_at', paidAt);
      fd.append('proof', proofFile);

      await api.post(`/tenant/invoices/${selectedInvoice.id}/payments`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvoice.id ? { ...inv, status: 'pending_verification' } : inv
        )
      );
      setSelectedInvoice(null);
      setProofFile(null);
      setFeedback('Bukti transfer berhasil diunggah. Status berubah menjadi Menunggu Verifikasi.');
    } catch (err) {
      setFeedback(
        err?.response?.data?.message ||
          'Gagal mengunggah bukti transfer. Pastikan format JPG/PNG/PDF maks. 5 MB.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const statusPill = (status) => {
    const map = {
      unpaid: { label: 'Belum Bayar', cls: 'bg-[#FEF3C7] text-[#92400E]' },
      pending_verification: { label: 'Menunggu Verifikasi', cls: 'bg-[#DBEAFE] text-[#1E40AF]' },
      paid: { label: 'Lunas', cls: 'bg-[#E5F1EA] text-[#14532D]' },
      overdue: { label: 'Terlambat', cls: 'bg-[#FEE2E2] text-[#B91C1C]' },
      cancelled: { label: 'Dibatalkan', cls: 'bg-[#F3F4F6] text-[#4B5563]' },
    };
    return map[status] || map.unpaid;
  };

  return (
    <>
      {/* Header & Rekening Tujuan */}
      <section className="rounded-[24px] bg-white border border-[#E5E1D8] p-6 sm:p-8 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1B6B3A]">
            <span className="h-0.5 w-4 rounded-full bg-[#F5A623]" />
            TAGIHAN & PEMBAYARAN
          </span>
          <h1 className="font-['Fraunces',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#112A1C] mt-1">
            Daftar Tagihan Sewa
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5850] mt-1">
            Pembayaran wajib penuh sesuai nominal tagihan. Unggah bukti transfer untuk diverifikasi pemilik.
          </p>
        </div>

        <div className="rounded-2xl bg-[#F8F6F1] border border-[#E5E1D8] px-5 py-4 min-w-[270px]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A867E]">
            Rekening Tujuan Transfer
          </div>
          <div className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#14532D] mt-0.5">
            {bankInfo.bank_name} · {bankInfo.bank_account_number}
          </div>
          <div className="text-xs font-semibold text-[#112A1C]">a.n. {bankInfo.bank_account_name}</div>
        </div>
      </section>

      {feedback && (
        <div className="mb-5 rounded-2xl bg-[#E5F1EA] border border-[#1B6B3A]/25 px-4 py-3 text-xs font-bold text-[#14532D]">
          {feedback}
        </div>
      )}

      {/* List Tagihan */}
      <div className="space-y-4">
        {invoices.map((inv) => {
          const badge = statusPill(inv.status);
          const canPay = inv.status === 'unpaid' || inv.status === 'overdue';
          return (
            <div
              key={inv.id}
              className="rounded-[22px] bg-white border border-[#E5E1D8] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-['JetBrains_Mono',monospace] text-sm font-bold text-[#112A1C]">
                    {inv.number}
                  </span>
                  <span className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${badge.cls}`}>
                    {badge.label}
                  </span>
                  <span className="rounded-full bg-[#F1EDE3] px-2.5 py-0.5 text-[11px] font-semibold text-[#4B5850]">
                    Paket {inv.period_months} Bulan
                  </span>
                </div>

                <div className="text-xs text-[#4B5850]">
                  Periode: <strong className="text-[#112A1C]">{inv.period_start}</strong> s/d{' '}
                  <strong className="text-[#112A1C]">{inv.period_end}</strong> · Jatuh tempo:{' '}
                  <strong className="text-[#112A1C]">{inv.due_date}</strong>
                </div>

                {inv.latest_payment?.status === 'rejected' && (
                  <div className="rounded-xl bg-[#FEE2E2] px-3 py-1.5 text-xs font-semibold text-[#B91C1C]">
                    Bukti ditolak: {inv.latest_payment.reject_reason}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="font-['JetBrains_Mono',monospace] text-xl font-bold text-[#14532D]">
                  {formatRp(inv.amount)}
                </div>

                {canPay && (
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(inv)}
                    className="rounded-full bg-[#14532D] hover:bg-[#0B331C] text-white font-bold text-xs px-5 py-2.5 transition cursor-pointer"
                  >
                    Upload Bukti Transfer
                  </button>
                )}

                {inv.status === 'paid' && (
                  <a
                    href={`/api/tenant/invoices/${inv.id}/receipt`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#F1EDE3] hover:bg-[#E5E1D8] text-[#112A1C] font-bold text-xs px-4 py-2.5 transition"
                  >
                    Unduh Kuitansi PDF
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Upload Bukti Transfer */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-[#112A1C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[24px] bg-white border border-[#E5E1D8] p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Fraunces',Georgia,serif] text-xl font-bold text-[#112A1C]">
                Unggah Bukti Transfer
              </h3>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="text-xs font-bold text-[#7A867E] hover:text-[#112A1C] cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleUploadProof} className="space-y-4">
              <div className="rounded-xl bg-[#F8F6F1] border border-[#E5E1D8] p-3.5 text-xs space-y-1">
                <div className="text-[#4B5850]">
                  Tagihan: <strong>{selectedInvoice.number}</strong>
                </div>
                <div className="text-[#4B5850]">
                  Nominal Wajib Penuh:{' '}
                  <strong className="font-['JetBrains_Mono',monospace] text-[#14532D]">
                    {formatRp(selectedInvoice.amount)}
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#112A1C] mb-1.5">
                  Tanggal Transfer
                </label>
                <input
                  type="date"
                  required
                  value={paidAt}
                  onChange={(e) => setPaidAt(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-sm outline-none focus:border-[#1B6B3A] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#112A1C] mb-1.5">
                  File Bukti Transfer (JPG, PNG, atau PDF · Maks. 5 MB)
                </label>
                <input
                  type="file"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[#14532D] hover:bg-[#0B331C] text-white font-bold text-xs py-3.5 transition cursor-pointer"
              >
                {submitting ? 'Mengunggah Bukti...' : 'Kirim Bukti Pembayaran'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
