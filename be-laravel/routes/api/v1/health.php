<?php

use App\Http\Controllers\Api\V1\PingController;
use Illuminate\Support\Facades\Route;

// Publik: dipakai untuk health check hosting dan monitoring.
Route::get('/ping', PingController::class)->name('ping');
