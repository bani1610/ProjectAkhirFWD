<?php

namespace Database\Seeders;

use App\Models\AppNotification;
use App\Models\Invoice;
use App\Models\Occupancy;
use App\Models\Payment;
use App\Models\Room;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;

/**
 * Data demo penyewa. Setiap penyewa mewakili satu skenario uji:
 *
 * - Budi  (101, 6 bulan)  tagihan berikutnya sudah terbit, Belum bayar
 * - Siti  (201, 1 bulan)  bukti transfer menunggu verifikasi
 * - Andi  (103 -> 102)    pernah pindah kamar, ada bukti ditolak, tagihan Terlambat
 * - Dewi  (202, 12 bulan) lunas, tagihan berikutnya belum terbit
 * - Rina  (103, keluar)   akun nonaktif, masih punya tunggakan
 *
 * Semua penyewa demo memakai password "password" dan sudah melewati login pertama.
 */
class DemoTenantSeeder extends Seeder
{
    private int $invoiceSeq = 0;

    private User $owner;

    public function run(): void
    {
        if (User::tenants()->exists()) {
            $this->command?->warn('Penyewa demo sudah ada, DemoTenantSeeder dilewati.');

            return;
        }

        $this->owner = User::where('role', User::ROLE_OWNER)->firstOrFail();

        // Budi: 6 bulanan, periode berjalan 10 Mei - 9 Nov, periode berikut terbit H-14.
        $budi = $this->tenant('Budi Santoso', '081311110001', 'Karyawan swasta', ['Sri Santoso', 'Ibu', '081311119001']);
        $occ = $this->occupy($budi, '101', '2026-05-10', 6, 500_000);
        $inv = $this->invoice($occ, '2026-05-10', 6, Invoice::STATUS_PAID);
        $this->payment($inv, 'transfer', '2026-05-09', Payment::STATUS_APPROVED);
        $this->invoice($occ, '2026-11-10', 6, Invoice::STATUS_UNPAID, issuedAt: '2026-10-27');
        $this->notify($budi, 'invoice_issued', 'Tagihan baru terbit', 'Tagihan sewa 10 Nov 2026 - 9 Mei 2027 sudah terbit. Jatuh tempo 10 Nov 2026.', '2026-10-27 07:00');

        // Siti: bulanan, Agustus-Oktober lunas, November menunggu verifikasi.
        $siti = $this->tenant('Siti Rahmawati', '081311110002', 'Mahasiswa', ['Ahmad Rahmat', 'Ayah', '081311119002']);
        $occ = $this->occupy($siti, '201', '2026-08-15', 1, 750_000);
        foreach (['2026-08-15', '2026-09-15', '2026-10-15'] as $i => $start) {
            $inv = $this->invoice($occ, $start, 1, Invoice::STATUS_PAID);
            $this->payment($inv, $i === 0 ? 'cash' : 'transfer', $start, Payment::STATUS_APPROVED);
        }
        $inv = $this->invoice($occ, '2026-11-15', 1, Invoice::STATUS_PENDING, issuedAt: '2026-11-01');
        $this->payment($inv, 'transfer', '2026-11-05', Payment::STATUS_PENDING);
        $this->notify($this->owner, 'payment_submitted', 'Bukti transfer baru', 'Siti Rahmawati (kamar 201) mengunggah bukti transfer untuk '.$inv->number.'.', '2026-11-05 19:12');

        // Andi: masuk di 103, pindah ke 102 pada 1 Okt. Bukti Oktober sempat ditolak. November terlambat.
        $andi = $this->tenant('Andi Pratama', '081311110003', 'Freelancer desain', ['Rudi Pratama', 'Kakak', '081311119003']);
        $old = $this->occupy($andi, '103', '2026-09-01', 1, 500_000);
        $inv = $this->invoice($old, '2026-09-01', 1, Invoice::STATUS_PAID);
        $this->payment($inv, 'transfer', '2026-09-01', Payment::STATUS_APPROVED);
        $old->update(['end_date' => '2026-09-30', 'status' => Occupancy::STATUS_MOVED]);
        Room::where('number', '103')->update(['status' => Room::STATUS_VACANT]);

        $occ = $this->occupy($andi, '102', '2026-10-01', 1, 500_000, 'Pindah dari kamar 103 (keluhan bising). Tipe sama, tidak ada selisih harga.');
        $inv = $this->invoice($occ, '2026-10-01', 1, Invoice::STATUS_PAID);
        $this->payment($inv, 'transfer', '2026-10-01', Payment::STATUS_REJECTED, 'Nominal transfer kurang Rp100.000.');
        $this->payment($inv, 'transfer', '2026-10-02', Payment::STATUS_APPROVED);
        $this->invoice($occ, '2026-11-01', 1, Invoice::STATUS_OVERDUE);
        $this->notify($andi, 'invoice_overdue', 'Tagihan terlambat', 'Tagihan sewa November sudah lewat jatuh tempo 1 Nov 2026. Segera lakukan pembayaran.', '2026-11-02 07:00');
        $this->notify($this->owner, 'invoice_overdue', 'Tagihan terlambat', 'Andi Pratama (kamar 102) belum membayar tagihan November.', '2026-11-02 07:00');

        // Dewi: tahunan, lunas sampai 19 Jan 2027.
        $dewi = $this->tenant('Dewi Lestari', '081311110004', 'Perawat', ['Made Lestari', 'Suami', '081311119004']);
        $occ = $this->occupy($dewi, '202', '2026-01-20', 12, 1_000_000);
        $inv = $this->invoice($occ, '2026-01-20', 12, Invoice::STATUS_PAID);
        $this->payment($inv, 'cash', '2026-01-20', Payment::STATUS_APPROVED);

        // Rina: sudah keluar akhir Juli dengan tunggakan Juli (F-TEN-05).
        $rina = $this->tenant('Rina Kartika', '081311110005', 'Karyawan swasta', ['Joko Kartika', 'Ayah', '081311119005']);
        $occ = $this->occupy($rina, '103', '2026-03-05', 1, 500_000);
        foreach (['2026-03-05', '2026-04-05', '2026-05-05', '2026-06-05'] as $start) {
            $inv = $this->invoice($occ, $start, 1, Invoice::STATUS_PAID);
            $this->payment($inv, 'transfer', $start, Payment::STATUS_APPROVED);
        }
        $this->invoice($occ, '2026-07-05', 1, Invoice::STATUS_OVERDUE);
        $occ->update([
            'end_date' => '2026-07-31',
            'status' => Occupancy::STATUS_ENDED,
            'deposit_status' => 'deducted',
            'deposit_note' => 'Deposit Rp500.000 dipotong Rp150.000 untuk penggantian kunci yang hilang.',
        ]);
        $rina->update(['is_active' => false]);
        Room::where('number', '103')->update(['status' => Room::STATUS_VACANT]);
    }

    private function tenant(string $name, string $phone, string $occupation, array $emergency): User
    {
        $user = User::create([
            'role' => User::ROLE_TENANT,
            'name' => $name,
            'phone' => $phone,
            'password' => 'password',
            'is_active' => true,
            'must_change_password' => false,
            'consented_at' => now()->subMonths(1),
        ]);

        $user->tenantProfile()->create([
            'occupation' => $occupation,
            'emergency_name' => $emergency[0],
            'emergency_relation' => $emergency[1],
            'emergency_phone' => $emergency[2],
        ]);

        return $user;
    }

    private function occupy(User $user, string $roomNumber, string $start, int $months, int $deposit, ?string $note = null): Occupancy
    {
        $room = Room::where('number', $roomNumber)->firstOrFail();
        $room->update(['status' => Room::STATUS_OCCUPIED]);

        return Occupancy::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'start_date' => $start,
            'next_period_months' => $months,
            'deposit_amount' => $deposit,
            'deposit_status' => 'received',
            'note' => $note,
            'status' => Occupancy::STATUS_ACTIVE,
        ]);
    }

    private function invoice(Occupancy $occ, string $start, int $months, string $status, ?string $issuedAt = null): Invoice
    {
        $periodStart = CarbonImmutable::parse($start);
        // addMonthsNoOverflow: tanggal 29-31 jatuh ke hari terakhir bulan yang lebih pendek (bagian 6 PRD).
        $periodEnd = $periodStart->addMonthsNoOverflow($months)->subDay();
        $price = $occ->room->roomType->priceFor($months);
        $this->invoiceSeq++;

        $invoice = Invoice::create([
            'number' => sprintf('INV-%s-%04d', $periodStart->format('Ym'), $this->invoiceSeq),
            'occupancy_id' => $occ->id,
            'period_start' => $periodStart,
            'period_end' => $periodEnd,
            'period_months' => $months,
            'amount' => $price,
            'due_date' => $periodStart,
            'status' => $status,
        ]);

        // Tagihan pertama terbit saat penempatan, berikutnya H-14.
        $issued = $issuedAt ? CarbonImmutable::parse($issuedAt) : max($periodStart->subDays(14), CarbonImmutable::parse($occ->start_date));
        $invoice->forceFill(['created_at' => $issued->setTime(7, 0), 'updated_at' => $issued->setTime(7, 0)])->saveQuietly();

        return $invoice;
    }

    private function payment(Invoice $invoice, string $method, string $paidAt, string $status, ?string $rejectReason = null): Payment
    {
        $paid = CarbonImmutable::parse($paidAt);
        $verified = $status === Payment::STATUS_PENDING ? null : $paid->setTime(20, 0);

        return Payment::create([
            'invoice_id' => $invoice->id,
            'method' => $method,
            'amount' => $rejectReason ? $invoice->amount - 100_000 : $invoice->amount,
            'paid_at' => $paid,
            // Path contoh. File aslinya diunggah lewat aplikasi ke disk privat.
            'proof_path' => $method === 'transfer' ? "payments/demo/{$invoice->number}.jpg" : null,
            'status' => $status,
            'reject_reason' => $rejectReason,
            'verified_by' => $verified ? $this->owner->id : null,
            'verified_at' => $verified,
        ]);
    }

    private function notify(User $user, string $type, string $title, string $body, string $at): void
    {
        $notification = AppNotification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
        ]);
        $notification->forceFill(['created_at' => $at, 'updated_at' => $at])->saveQuietly();
    }
}
