import { useState, useEffect } from 'react';
import {api} from '../../lib/api';

export default function TenantRoomPage() {
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    api
      .get('/tenant/room')
      .then((res) => setRoomData(res.data))
      .catch(() => {
        setRoomData({
          user: { id: 2, name: 'Budi Santoso' },
          occupancy: {
            start_date: '2026-05-10',
            active_until: '2027-05-09',
            next_period_months: 6,
            deposit_amount: 500000,
            deposit_status: 'received',
            room: {
              number: '101',
              floor: 1,
              status: 'occupied',
              room_type: {
                name: 'Non-AC',
                description: 'Kamar 3x3 m dengan kipas angin, kamar mandi dalam.',
              },
            },
          },
          room_facilities: [
            { id: 1, name: 'Kasur', condition_status: 'good', note: 'Kondisi awal saat pendataan.', recorded_at: '2026-01-01', photo_path: null },
            { id: 2, name: 'Lemari', condition_status: 'good', note: 'Kondisi awal saat pendataan.', recorded_at: '2026-01-01', photo_path: null },
            { id: 3, name: 'Meja belajar', condition_status: 'good', note: 'Kondisi awal saat pendataan.', recorded_at: '2026-01-01', photo_path: null },
            { id: 4, name: 'Kursi', condition_status: 'good', note: 'Kondisi awal saat pendataan.', recorded_at: '2026-01-01', photo_path: null },
            { id: 6, name: 'Kipas angin', condition_status: 'good', note: 'Kondisi awal saat pendataan.', recorded_at: '2026-01-01', photo_path: null },
            { id: 7, name: 'Kamar mandi dalam', condition_status: 'good', note: 'Kondisi awal saat pendataan.', recorded_at: '2026-01-01', photo_path: null },
          ],
          shared_facilities: [
            { id: 8, name: 'Dapur' },
            { id: 9, name: 'WiFi' },
            { id: 10, name: 'Parkir motor' },
            { id: 11, name: 'Mesin cuci' },
            { id: 12, name: 'Ruang jemur' },
          ],
          kost_rules:
            '1. Jam malam pukul 23.00 WIB. Tamu wajib lapor ke pemilik.\n2. Tamu lawan jenis dilarang masuk kamar.\n3. Dilarang merokok di dalam kamar.\n4. Jaga kebersihan dapur dan kamar mandi bersama setelah dipakai.\n5. Matikan AC, lampu, dan peralatan listrik saat meninggalkan kamar.\n6. Pembayaran sewa paling lambat pada tanggal jatuh tempo.\n7. Kerusakan fasilitas segera dilaporkan lewat menu Keluhan.',
        });
      });
  }, []);

  const conditionBadge = (status) => {
    if (status === 'good') return { label: 'Baik', cls: 'bg-[#E5F1EA] text-[#14532D]' };
    if (status === 'fair') return { label: 'Kurang Baik', cls: 'bg-[#FEF3C7] text-[#B45309]' };
    return { label: 'Rusak', cls: 'bg-[#FEE2E2] text-[#B91C1C]' };
  };

  if (!roomData) {
    return (
      <div className="py-20 text-center text-sm font-semibold text-[#4B5850]">
        Memuat detail kamar...
      </div>
    );
  }

  const room = roomData.occupancy?.room;

  return (
    <>
      {/* Header Info Kamar */}
      <section className="rounded-[24px] bg-white border border-[#E5E1D8] p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1B6B3A]">
              <span className="h-0.5 w-4 rounded-full bg-[#F5A623]" />
              KAMAR SAYA
            </span>
            <h1 className="font-['Fraunces',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#112A1C] mt-1">
              Kamar {room?.number} — Tipe {room?.room_type?.name}
            </h1>
            <p className="text-sm text-[#4B5850] mt-1">{room?.room_type?.description}</p>
          </div>

          <div className="rounded-2xl bg-[#E5F1EA] border border-[#1B6B3A]/20 px-5 py-3.5 text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#14532D]">
              Sewa Aktif Sampai
            </div>
            <div className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#0B331C]">
              {roomData.occupancy?.active_until}
            </div>
            <div className="text-[11px] text-[#4B5850]">
              Masuk sejak {roomData.occupancy?.start_date} · Lantai {room?.floor}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventaris Fasilitas Kamar & Kondisi Awal */}
        <div className="lg:col-span-2 rounded-[22px] bg-white border border-[#E5E1D8] p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="font-['Fraunces',Georgia,serif] text-xl font-bold text-[#112A1C]">
              Inventaris & Kondisi Awal Kamar
            </h2>
            <p className="text-xs text-[#4B5850] mt-0.5">
              Catatan kondisi awal fasilitas saat check-in sebagai acuan bersama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {(roomData.room_facilities || []).map((item) => {
              const badge = conditionBadge(item.condition_status);
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E5E1D8] bg-[#F8F6F1] p-4 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#112A1C]">{item.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5850]">{item.note || 'Tidak ada catatan khusus.'}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#7A867E] pt-1 border-t border-[#E5E1D8]">
                    <span>Dicatat: {item.recorded_at || '-'}</span>
                    {item.photo_path ? (
                      <a
                        href={item.photo_path}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#1B6B3A] hover:underline"
                      >
                        Lihat Foto Awal
                      </a>
                    ) : (
                      <span>Foto standar</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fasilitas Bersama */}
          <div className="mt-6 pt-5 border-t border-[#E5E1D8]">
            <h3 className="text-sm font-bold text-[#112A1C] mb-3">Fasilitas Bersama Kost</h3>
            <div className="flex flex-wrap gap-2">
              {(roomData.shared_facilities || []).map((sf) => (
                <span
                  key={sf.id}
                  className="rounded-full bg-[#F1EDE3] border border-[#E5E1D8] px-3.5 py-1.5 text-xs font-semibold text-[#112A1C]"
                >
                  ✓ {sf.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Peraturan Kost */}
        <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-6 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B6B3A]">
            Tata Tertib Hunian
          </span>
          <h2 className="font-['Fraunces',Georgia,serif] text-xl font-bold text-[#112A1C] mt-0.5 mb-4">
            Peraturan Kost
          </h2>
          <div className="rounded-2xl bg-[#F8F6F1] border border-[#E5E1D8] p-4 space-y-2.5 text-xs text-[#112A1C] leading-relaxed whitespace-pre-line">
            {roomData.kost_rules}
          </div>
        </div>
      </div>
    </>
  );
}
