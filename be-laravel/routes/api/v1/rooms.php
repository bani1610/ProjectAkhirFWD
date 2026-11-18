<?php

use App\Http\Controllers\Api\V1\RoomController;
use Illuminate\Support\Facades\Route;

Route::get('/rooms', [RoomController::class, 'index'])
    ->name('rooms.index');

Route::get('/rooms/{room}', [RoomController::class, 'show'])
    ->name('rooms.show');
