<?php

namespace Tests\Fixtures;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

/**
 * Job contoh untuk menguji jalur queue. Hanya dipakai di dalam pengujian,
 * tidak pernah dipakai aplikasi.
 */
class RecordProgressJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $label) {}

    public function handle(): void
    {
        Log::info('Job uji queue diproses.', ['label' => $this->label]);
    }
}
