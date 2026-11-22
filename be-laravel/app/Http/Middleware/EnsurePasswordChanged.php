<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChanged
{
    /**
     * Memastikan pengguna sudah mengganti password sementara.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->must_change_password) {
            return ApiResponse::error(
                'Anda wajib mengganti password sebelum mengakses fitur ini.',
                403,
                'PASSWORD_CHANGE_REQUIRED'
            );
        }

        return $next($request);
    }
}
