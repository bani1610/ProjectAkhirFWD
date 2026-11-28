import { useState, useEffect } from 'react';
import {api} from '../../lib/api';

export default function TenantComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: 'damage',
    facility_id: '',
    urgency: 'normal',
    title: '',
    description: '',
    photos: [],
  });
  const [commentText, setCommentText] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/tenant/complaints')
      .then((res) => {
        setComplaints(res.data?.complaints || []);
        setFacilities(res.data?.facilities || []);
      })
      .catch(() => {
        setFacilities([
          { id: 1, name: 'Kasur', scope: 'room' },
          { id: 2, name: 'Lemari', scope: 'room' },
          { id: 6, name: 'Kipas angin', scope: 'room' },
          { id: 7, name: 'Kamar mandi dalam', scope: 'room' },
          { id: 8, name: 'Dapur', scope: 'shared' },
          { id: 9, name: 'WiFi', scope: 'shared' },
        ]);
        setComplaints([
          {
            id: 2,
            category: 'damage',
            urgency: 'normal',
            facility_name: 'Kipas angin',
            title: 'Kipas angin bunyi keras',
            description: 'Kipas berbunyi keras di kecepatan 2 dan 3.',
            status: 'resolved',
            action_taken: 'Pasang ulang dudukan dengan baut fischer.',
            created_at: '2026-11-03 13:00',
            comments: [
              { id: 2, author: 'Budi Santoso', role: 'tenant', body: 'Bunyinya makin keras kalau malam.' },
              { id: 3, author: 'Pemilik KostKuy', role: 'owner', body: 'Sudah dipasang ulang dudukannya, silakan dicek.' },
            ],
          },
          {
            id: 1,
            category: 'damage',
            urgency: 'normal',
            facility_name: 'Kipas angin',
            title: 'Kipas angin tidak berputar',
            description: 'Kipas angin menyala tapi baling-balingnya tidak berputar.',
            status: 'confirmed',
            action_taken: 'Ganti kapasitor kipas.',
            created_at: '2026-07-12 14:15',
            comments: [],
          },
        ]);
      });
  }, []);

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('category', form.category);
      if (form.facility_id) fd.append('facility_id', form.facility_id);
      fd.append('urgency', form.urgency);
      fd.append('title', form.title);
      fd.append('description', form.description);
      Array.from(form.photos)
        .slice(0, 3)
        .forEach((file) => fd.append('photos[]', file));

      const res = await api.post('/tenant/complaints', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.complaint) {
        setComplaints((prev) => [res.data.complaint, ...prev]);
      }
      setShowForm(false);
      setForm({ category: 'damage', facility_id: '', urgency: 'normal', title: '', description: '', photos: [] });
    } catch {
      alert('Pastikan minimal 1 foto (maks. 3 foto, 5 MB/foto) telah dilampirkan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmResolution = async (complaintId, isResolved) => {
    const nextStatus = isResolved ? 'confirmed' : 'in_progress';
    try {
      await api.patch(`/tenant/complaints/${complaintId}/confirm`, { resolved: isResolved });
    } catch {
      // optimistic fallback
    }
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: nextStatus } : c))
    );
  };

  const handleSendComment = async (complaintId) => {
    const body = (commentText[complaintId] || '').trim();
    if (!body) return;
    try {
      await api.post(`/tenant/complaints/${complaintId}/comments`, { body });
    } catch {
      // optimistic fallback
    }
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              comments: [
                ...(c.comments || []),
                { id: Date.now(), author: 'Anda', role: 'tenant', body },
              ],
            }
          : c
      )
    );
    setCommentText((prev) => ({ ...prev, [complaintId]: '' }));
  };

  const statusLabel = {
    submitted: { text: 'Dikirim', cls: 'bg-[#F3F4F6] text-[#374151]' },
    accepted: { text: 'Diterima', cls: 'bg-[#DBEAFE] text-[#1E40AF]' },
    in_progress: { text: 'Diproses', cls: 'bg-[#FEF3C7] text-[#92400E]' },
    resolved: { text: 'Selesai (Perlu Konfirmasi)', cls: 'bg-[#FEF3C7] text-[#B45309]' },
    confirmed: { text: 'Dikonfirmasi Beres', cls: 'bg-[#E5F1EA] text-[#14532D]' },
  };

  return (
    <>
      {/* Header */}
      <section className="rounded-[24px] bg-white border border-[#E5E1D8] p-6 sm:p-8 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1B6B3A]">
            <span className="h-0.5 w-4 rounded-full bg-[#F5A623]" />
            PELAPORAN FASILITAS
          </span>
          <h1 className="font-['Fraunces',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#112A1C] mt-1">
            Keluhan & Perbaikan
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5850] mt-1">
            Laporkan kerusakan atau kendala fasilitas kamar & area bersama dengan bukti foto.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-[#14532D] hover:bg-[#0B331C] text-white font-bold text-xs px-5 py-3 shadow transition cursor-pointer"
        >
          {showForm ? 'Tutup Form Keluhan' : '+ Buat Keluhan Baru'}
        </button>
      </section>

      {/* Form Buat Keluhan Baru */}
      {showForm && (
        <form
          onSubmit={handleCreateComplaint}
          className="rounded-[24px] bg-white border border-[#E5E1D8] p-6 sm:p-7 shadow-sm mb-6 space-y-4"
        >
          <h2 className="font-['Fraunces',Georgia,serif] text-xl font-bold text-[#112A1C]">
            Formulir Tiket Keluhan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#112A1C] mb-1.5">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-xs font-semibold"
              >
                <option value="damage">Kerusakan</option>
                <option value="facility_mismatch">Fasilitas tidak sesuai</option>
                <option value="cleanliness">Kebersihan</option>
                <option value="security">Keamanan</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#112A1C] mb-1.5">
                Fasilitas Terkait (Opsional untuk Lainnya)
              </label>
              <select
                value={form.facility_id}
                onChange={(e) => setForm({ ...form, facility_id: e.target.value })}
                className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-xs font-semibold"
              >
                <option value="">-- Pilih Fasilitas --</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.scope === 'room' ? 'Kamar' : 'Bersama'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#112A1C] mb-1.5">Tingkat Urgensi</label>
              <select
                value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-xs font-semibold"
              >
                <option value="normal">Biasa</option>
                <option value="emergency">Darurat (Bocor, listrik mati, dll)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#112A1C] mb-1.5">Judul Keluhan</label>
            <input
              type="text"
              required
              maxLength={150}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Kipas angin berbunyi keras"
              className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#112A1C] mb-1.5">Deskripsi Detail</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Jelaskan kronologi atau kondisi kendala..."
              className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#112A1C] mb-1.5">
              Unggah Foto Bukti (Wajib min. 1, maks. 3 foto · @ maks. 5 MB)
            </label>
            <input
              type="file"
              required
              multiple
              accept="image/*"
              onChange={(e) => setForm({ ...form, photos: e.target.files })}
              className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F6F1] px-3 py-2 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[#14532D] hover:bg-[#0B331C] text-white font-bold text-xs px-6 py-3 transition cursor-pointer"
          >
            {submitting ? 'Mengirim Tiket...' : 'Kirim Laporan Keluhan'}
          </button>
        </form>
      )}

      {/* Daftar Riwayat Keluhan */}
      <div className="space-y-4">
        {complaints.map((c) => {
          const st = statusLabel[c.status] || statusLabel.submitted;
          return (
            <div
              key={c.id}
              className="rounded-[22px] bg-white border border-[#E5E1D8] p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {c.urgency === 'emergency' && (
                    <span className="rounded-full bg-[#DC2626] text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                      Darurat
                    </span>
                  )}
                  <span className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${st.cls}`}>
                    {st.text}
                  </span>
                  {c.facility_name && (
                    <span className="rounded-full bg-[#F1EDE3] px-2.5 py-0.5 text-[11px] font-semibold text-[#4B5850]">
                      {c.facility_name}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#7A867E]">{c.created_at}</span>
              </div>

              <div>
                <h3 className="font-['Fraunces',Georgia,serif] text-lg font-bold text-[#112A1C]">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5850] mt-1">{c.description}</p>
              </div>

              {c.action_taken && (
                <div className="rounded-xl bg-[#E5F1EA]/70 border border-[#1B6B3A]/20 p-3.5 text-xs text-[#112A1C]">
                  <strong>Tindakan Perbaikan Pemilik:</strong> {c.action_taken}
                </div>
              )}

              {/* Konfirmasi Penyelesaian oleh Penyewa */}
              {c.status === 'resolved' && (
                <div className="rounded-2xl bg-[#FEF3C7] border border-[#F59E0B]/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#92400E]">
                    Pemilik menandai keluhan ini Selesai. Apakah masalah sudah beres?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleConfirmResolution(c.id, true)}
                      className="rounded-full bg-[#14532D] text-white text-xs font-bold px-4 py-2 cursor-pointer"
                    >
                      ✓ Masalah Sudah Beres
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmResolution(c.id, false)}
                      className="rounded-full bg-white border border-[#D97706] text-[#B45309] text-xs font-bold px-4 py-2 cursor-pointer"
                    >
                      Belum Beres
                    </button>
                  </div>
                </div>
              )}

              {/* Komentar Dua Arah */}
              <div className="pt-3 border-t border-[#E5E1D8] space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A867E]">
                  Diskusi & Tindak Lanjut
                </div>
                {(c.comments || []).map((cm) => (
                  <div
                    key={cm.id}
                    className={`rounded-xl px-3.5 py-2.5 text-xs ${
                      cm.role === 'owner'
                        ? 'bg-[#E5F1EA] text-[#112A1C]'
                        : 'bg-[#F8F6F1] text-[#112A1C]'
                    }`}
                  >
                    <span className="font-bold">{cm.author}: </span>
                    <span>{cm.body}</span>
                  </div>
                ))}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={commentText[c.id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [c.id]: e.target.value })}
                    placeholder="Tulis balasan atau update untuk pemilik..."
                    className="flex-1 rounded-full border border-[#E5E1D8] bg-[#F8F6F1] px-4 py-2 text-xs outline-none focus:border-[#1B6B3A] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendComment(c.id)}
                    className="rounded-full bg-[#14532D] text-white text-xs font-bold px-4 py-2 cursor-pointer"
                  >
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
