<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

// Endpoint login (publik).
Route::post('/auth/login', [AuthController::class, 'login'])
    ->name('auth.login');

// Endpoint logout (harus login).
Route::post('/auth/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum')
    ->name('auth.logout');

// Endpoint ganti password (harus login).
Route::post('/auth/change-password', [AuthController::class, 'changePassword'])
    ->middleware('auth:sanctum')
    ->name('auth.change-password');
