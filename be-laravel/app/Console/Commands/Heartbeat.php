<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Bukti bahwa penjadwalan (Laravel Scheduler) benar-benar berjalan.
 *
 * Command ini tidak memuat aturan bisnis apa pun. Fungsinya hanya memastikan
 * cron -> schedule:run -> command -> log tersambung dengan benar sebelum
 * tugas berkala yang sebenarnya (tagihan, pengingat, notifikasi) ditambahkan
 * pada tugas berikutnya.
 */
class Heartbeat extends Command
{
    protected $signature = 'kostkuy:heartbeat';

    protected $description = 'Catat waktu scheduler berjalan sebagai bukti penjadwalan aktif.';

    public function handle(): int
    {
        $now = now();

        Log::info('Scheduler KostKuy berjalan.', [
            'time' => $now->toIso8601String(),
            'timezone' => config('app.timezone'),
        ]);

        $this->info(sprintf('Scheduler aktif pada %s (%s).', $now->toDateTimeString(), config('app.timezone')));

        return self::SUCCESS;
    }
}
