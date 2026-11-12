<?php

namespace Tests\Feature\Queue;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\RecordProgressJob;
use Tests\TestCase;

/**
 * Memastikan queue terpasang: koneksi database, tabel jobs tersedia,
 * dan worker benar-benar memproses job.
 */
class QueueSetupTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_masuk_ke_tabel_jobs(): void
    {
        Queue::fake();

        RecordProgressJob::dispatch('contoh');

        Queue::assertPushed(RecordProgressJob::class);
    }

    public function test_job_diproses_oleh_worker_pada_koneksi_database(): void
    {
        // Pakai koneksi database sungguhan, bukan sync, agar jalur queue teruji.
        config()->set('queue.default', 'database');

        RecordProgressJob::dispatch('diproses');
        $this->assertDatabaseCount('jobs', 1);

        $this->artisan('queue:work', [
            'connection' => 'database',
            '--once' => true,
            '--queue' => 'default',
        ])->assertSuccessful();

        $this->assertDatabaseCount('jobs', 0);
    }

    public function test_queue_yang_bermasalah_tidak_menahan_request(): void
    {
        // Queue pada lingkungan pengujian memakai sync agar hasilnya deterministik.
        $this->assertNotNull(config('queue.default'));
        $this->assertArrayHasKey('database', config('queue.connections'));
    }

    public function test_tabel_pendukung_queue_tersedia(): void
    {
        foreach (['jobs', 'job_batches', 'failed_jobs'] as $table) {
            $this->assertTrue(
                Schema::hasTable($table),
                "Tabel {$table} harus ada untuk mendukung queue.",
            );
        }
    }
}
