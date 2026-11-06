<?php

namespace Database\Seeders;

use App\Models\AppNotification;
use App\Models\Complaint;
use App\Models\Facility;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Keluhan demo yang mencakup semua status, termasuk kipas angin kamar 101
 * yang dikeluhkan 2 kali dalam 6 bulan (memicu label "Sering bermasalah").
 */
class DemoComplaintSeeder extends Seeder
{
    public function run(): void
    {
        if (Complaint::exists()) {
            $this->command?->warn('Keluhan demo sudah ada, DemoComplaintSeeder dilewati.');

            return;
        }

        $owner = User::where('role', User::ROLE_OWNER)->firstOrFail();
        $budi = User::where('phone', '081311110001')->firstOrFail();
        $siti = User::where('phone', '081311110002')->firstOrFail();
        $andi = User::where('phone', '081311110003')->firstOrFail();
        $fac = fn (string $name) => Facility::where('name', $name)->value('id');

        // 1. Dikonfirmasi: kipas angin 101, Juli.
        $c = $this->complaint($budi, $fac('Kipas angin'), [
            'category' => 'damage',
            'title' => 'Kipas angin tidak berputar',
            'description' => 'Kipas angin menyala tapi baling-balingnya tidak berputar.',
            'status' => 'confirmed',
            'root_cause_category' => 'normal_wear',
            'root_cause_note' => 'Kapasitor kipas sudah lemah karena usia pemakaian.',
            'action_taken' => 'Ganti kapasitor kipas.',
            'repair_cost' => 35_000,
            'resolved_at' => '2026-07-13 16:00',
            'confirmed_at' => '2026-07-14 08:30',
        ], '2026-07-12 21:15');
        $this->comment($c, $owner, 'Baik, besok sore teknisi datang ya.', '2026-07-12 21:40');

        // 2. Selesai, menunggu konfirmasi penyewa: kipas angin 101 lagi, Oktober.
        $c = $this->complaint($budi, $fac('Kipas angin'), [
            'category' => 'damage',
            'title' => 'Kipas angin bunyi keras',
            'description' => 'Kipas berbunyi keras di kecepatan 2 dan 3.',
            'status' => 'resolved',
            'root_cause_category' => 'quality_installation',
            'root_cause_note' => 'Dudukan dinding kipas kendur, baut tidak sesuai ukuran.',
            'action_taken' => 'Pasang ulang dudukan dengan baut fischer.',
            'repair_cost' => 0,
            'resolved_at' => '2026-11-05 15:00',
        ], '2026-11-03 20:00');
        $this->comment($c, $budi, 'Bunyinya makin keras kalau malam.', '2026-11-03 20:05', "complaints/demo/{$c->id}-comment.jpg");
        $this->comment($c, $owner, 'Sudah dipasang ulang dudukannya, silakan dicek.', '2026-11-05 15:05');
        $this->notify($budi, 'Keluhan selesai', 'Keluhan "Kipas angin bunyi keras" ditandai Selesai. Konfirmasi apakah masalah sudah beres.', '2026-11-05 15:05');

        // 3. Diproses, darurat: AC kamar 201.
        $c = $this->complaint($siti, $fac('AC'), [
            'category' => 'damage',
            'urgency' => 'emergency',
            'title' => 'AC bocor menetes ke kasur',
            'description' => 'Air menetes dari unit AC dalam, kasur sudah basah.',
            'status' => 'in_progress',
        ], '2026-11-05 22:10');
        $this->comment($c, $owner, 'Tolong matikan AC dulu. Teknisi datang besok jam 9.', '2026-11-05 22:30');

        // 4. Diterima: kebersihan dapur bersama.
        $this->complaint($andi, $fac('Dapur'), [
            'category' => 'cleanliness',
            'title' => 'Wastafel dapur mampet',
            'description' => 'Air di wastafel dapur bersama tidak turun sejak kemarin.',
            'status' => 'accepted',
        ], '2026-11-04 08:00');

        // 5. Dikirim: WiFi lambat.
        $c = $this->complaint($andi, $fac('WiFi'), [
            'category' => 'facility_mismatch',
            'title' => 'WiFi sangat lambat di lantai 1',
            'description' => 'Kecepatan di kamar 102 di bawah 1 Mbps, padahal dijanjikan 20 Mbps.',
            'status' => 'submitted',
        ], '2026-11-06 06:45');
        $this->notify($owner, 'Keluhan baru', 'Andi Pratama (kamar 102): '.$c->title, '2026-11-06 06:45');
    }

    private function complaint(User $tenant, ?int $facilityId, array $data, string $createdAt): Complaint
    {
        $occupancy = $tenant->activeOccupancy()->firstOrFail();

        $complaint = Complaint::create([
            'user_id' => $tenant->id,
            'room_id' => $occupancy->room_id,
            'facility_id' => $facilityId,
            'urgency' => 'normal',
            ...$data,
        ]);
        $complaint->forceFill(['created_at' => $createdAt])->saveQuietly();

        // Minimal 1 foto per keluhan (F-CMP-01). Path contoh, file asli diunggah lewat aplikasi.
        $complaint->photos()->create(['path' => "complaints/demo/{$complaint->id}-1.jpg"]);

        return $complaint;
    }

    private function comment(Complaint $complaint, User $user, string $body, string $at, ?string $photo = null): void
    {
        $comment = $complaint->comments()->create([
            'user_id' => $user->id,
            'body' => $body,
            'photo_path' => $photo,
        ]);
        $comment->forceFill(['created_at' => $at, 'updated_at' => $at])->saveQuietly();
    }

    private function notify(User $user, string $title, string $body, string $at): void
    {
        $notification = AppNotification::create([
            'user_id' => $user->id,
            'type' => 'complaint_update',
            'title' => $title,
            'body' => $body,
        ]);
        $notification->forceFill(['created_at' => $at, 'updated_at' => $at])->saveQuietly();
    }
}
