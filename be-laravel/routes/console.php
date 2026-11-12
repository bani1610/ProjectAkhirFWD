<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Penjadwalan (Laravel Scheduler)
|--------------------------------------------------------------------------
|
| Scheduler sudah aktif dan berjalan setiap hari pada jam yang diatur di
| config/kostkuy.php (bawaan 07.00 Asia/Jakarta, sesuai PRD bagian 6).
|
| Saat ini hanya berisi command heartbeat sebagai bukti bahwa penjadwalan
| benar-benar berjalan. Tugas berkala yang sesungguhnya didaftarkan di sini
| pada tugasnya masing-masing, dengan pola yang sama.
|
| Produksi memerlukan satu baris cron:
|
|   * * * * * cd /path/be-laravel && php artisan schedule:run >> /dev/null 2>&1
|
*/

Schedule::command('kostkuy:heartbeat')
    ->dailyAt(config('kostkuy.scheduler.daily_at'))
    ->timezone(config('kostkuy.scheduler.timezone'))
    ->withoutOverlapping()
    ->onOneServer()
    ->description('Bukti scheduler berjalan');
