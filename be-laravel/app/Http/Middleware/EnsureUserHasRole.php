<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Memastikan pengguna memiliki role yang sesuai.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles, true)) {
            return ApiResponse::error(
                'Anda tidak memiliki hak akses untuk fitur ini.',
                403,
                'FORBIDDEN'
            );
        }

        return $next($request);
    }
}
