<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountIsActive
{
    /**
     * Memastikan akun pengguna masih aktif.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->is_active) {
            // Cabut token yang sedang digunakan.
            $user->currentAccessToken()?->delete();

            return ApiResponse::error(
                'Akun Anda sudah dinonaktifkan.',
                403,
                'ACCOUNT_INACTIVE'
            );
        }

        return $next($request);
    }
}
