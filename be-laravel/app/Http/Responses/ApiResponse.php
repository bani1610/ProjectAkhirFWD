<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

/**
 * Bentuk respons JSON untuk seluruh endpoint /api.
 *
 * Sukses:
 *   { "success": true, "message": "...", "data": ... }
 *
 * Gagal:
 *   { "success": false, "message": "...", "code": "...", "errors": {...} }
 *
 * Frontend cukup memeriksa "success" tanpa perlu menebak status HTTP,
 * sehingga penambahan endpoint berikutnya tidak memecah pola di frontend.
 */
final class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'OK',
        int $status = 200,
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    public static function error(
        string $message,
        int $status = 400,
        string $code = 'API_ERROR',
        array $errors = [],
        array $meta = [],
    ): JsonResponse {
        $payload = [
            'success' => false,
            'message' => $message,
            'code' => $code,
        ];

        if ($errors !== []) {
            $payload['errors'] = $errors;
        }

        if ($meta !== []) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }
}
