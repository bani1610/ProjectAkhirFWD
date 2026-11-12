<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Memaksa header Accept: application/json pada seluruh route API.
 *
 * Tanpa ini, Laravel bisa membalas halaman HTML (misalnya pada error 404)
 * ketika klien lupa mengirim header Accept.
 */
class ForceJsonResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
