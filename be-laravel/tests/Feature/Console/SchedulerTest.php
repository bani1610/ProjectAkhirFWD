<?php

namespace Tests\Feature\Console;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

/**
 * Memastikan penjadwalan (Laravel Scheduler) sudah terpasang dan berjalan.
 */
class SchedulerTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_heartbeat_berjalan(): void
    {
        $this->artisan('kostkuy:heartbeat')
            ->expectsOutputToContain('Scheduler aktif')
            ->assertSuccessful();
    }

    public function test_command_heartbeat_menulis_log(): void
    {
        Log::spy();

        $this->artisan('kostkuy:heartbeat')->assertSuccessful();

        Log::shouldHaveReceived('info')->withArgs(
            fn (string $message) => str_contains($message, 'Scheduler KostKuy berjalan')
        );
    }

    public function test_jadwal_terdaftar_pada_jam_dan_zona_waktu_yang_benar(): void
    {
        $this->artisan('schedule:list')
            ->expectsOutputToContain('kostkuy:heartbeat')
            ->assertSuccessful();
    }

    public function test_zona_waktu_dan_jam_scheduler_dibaca_dari_konfigurasi(): void
    {
        $this->assertSame('Asia/Jakarta', config('kostkuy.scheduler.timezone'));
        $this->assertSame('07:00', config('kostkuy.scheduler.daily_at'));
    }
}
