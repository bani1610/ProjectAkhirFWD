<?php

use App\Http\Controllers\Api\V1\RoomTypeController;
use Illuminate\Support\Facades\Route;

// Publik: menampilkan tipe kamar dan daftar harganya.
Route::get('/room-types', [RoomTypeController::class, 'index'])
    ->name('room-types.index');

Route::get('/room-types/{roomType}', [RoomTypeController::class, 'show'])
    ->name('room-types.show');
