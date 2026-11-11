<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Pemeriksaan kesehatan API, dipakai frontend dan monitoring untuk
 * memastikan backend, queue, dan database siap.
 *
 * GET /api/v1/ping (publik)
 */
class PingController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return ApiResponse::success([
            'app' => config('app.name'),
            'api_version' => 'v1',
            'environment' => app()->environment(),
            'timezone' => config('app.timezone'),
            'server_time' => now()->toIso8601String(),
            'queue' => [
                'connection' => config('queue.default'),
                'pending_jobs' => $this->count('jobs'),
                'failed_jobs' => $this->count('failed_jobs'),
            ],
        ], 'API aktif.');
    }

    private function count(string $table): ?int
    {
        try {
            return DB::table($table)->count();
        } catch (Throwable) {
            // Tabel queue belum dimigrasi: jangan sampai endpoint health ikut gagal.
            return null;
        }
    }
}
