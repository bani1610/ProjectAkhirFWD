<?php

use App\Http\Controllers\Api\V1\FacilityController;
use Illuminate\Support\Facades\Route;

Route::get('/facilities', [FacilityController::class, 'index'])
    ->name('facilities.index');
