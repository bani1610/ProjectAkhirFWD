<?php

use App\Exceptions\ApiException;
use App\Http\Middleware\ForceJsonResponse;
use App\Http\Responses\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Seluruh route /api selalu membalas JSON, termasuk saat error.
        $middleware->api(prepend: [
            ForceJsonResponse::class,
        ]);

        // Alias middleware fitur (role, active, password.changed) didaftarkan
        // pada Tugas 3 bersama modul autentikasi.
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Khusus API: semua error dibungkus dengan bentuk respons yang sama.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request, Throwable $e): bool => $request->is('api/*') || $request->expectsJson()
        );

        $exceptions->render(function (ApiException $e, Request $request) {
            return $request->is('api/*') ? $e->render($request) : null;
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                'Data yang dikirim tidak valid.',
                422,
                'VALIDATION_ERROR',
                $e->errors(),
            );
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                'Sesi tidak valid atau token kedaluwarsa. Silakan login ulang.',
                401,
                'UNAUTHENTICATED',
            );
        });

        $exceptions->render(function (ModelNotFoundException|NotFoundHttpException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error('Resource tidak ditemukan.', 404, 'NOT_FOUND');
        });

        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                'Anda tidak memiliki akses ke resource ini.',
                403,
                'FORBIDDEN',
            );
        });

        $exceptions->render(function (ThrottleRequestsException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.',
                429,
                'TOO_MANY_REQUESTS',
                meta: ['retry_after' => $e->getHeaders()['Retry-After'] ?? null],
            );
        });

        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                $e->getMessage() ?: 'Permintaan tidak dapat diproses.',
                $e->getStatusCode(),
                'HTTP_ERROR',
            );
        });

        // Fallback terakhir: jangan bocorkan detail internal ke klien produksi.
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*') || config('app.debug')) {
                return null;
            }

            return ApiResponse::error('Terjadi kesalahan pada server.', 500, 'SERVER_ERROR');
        });
    })->create();
