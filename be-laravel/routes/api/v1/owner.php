<?php

use App\Http\Controllers\Api\V1\Owner\TenantAccountController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Owner\RoomTypeManagementController;
use App\Http\Controllers\Api\V1\Owner\RoomManagementController;
use App\Http\Controllers\Api\V1\Owner\FacilityManagementController;
use App\Http\Controllers\Api\V1\Owner\RoomFacilityManagementController;
use App\Http\Controllers\Api\V1\Owner\HouseRuleManagementController;
use App\Http\Controllers\Api\V1\Owner\OccupancyManagementController;

// Seluruh endpoint khusus Owner.
Route::middleware([
    'auth:sanctum',
    'active',
    'password.changed',
    'role:owner',
])->prefix('owner')->name('owner.')->group(function (): void {

    // Reset password tenant.
    Route::post('/tenants/{tenant}/reset-password', [
        TenantAccountController::class,
        'resetPassword',
    ])->name('tenants.reset-password');

    // Menonaktifkan akun tenant.
    Route::patch('/tenants/{tenant}/deactivate', [
        TenantAccountController::class,
        'deactivate',
    ])->name('tenants.deactivate');

    // Penempatan tenant ke kamar.
    Route::post('/occupancies', [
        OccupancyManagementController::class,
        'store',
    ])->name('occupancies.store');

    Route::get('/occupancies', [
        OccupancyManagementController::class,
        'index',
    ])->name('occupancies.index');

    Route::post('/occupancies/{occupancy}/move', [
        OccupancyManagementController::class,
        'move',
    ])->name('occupancies.move');

    Route::post('/occupancies/{occupancy}/checkout', [
        OccupancyManagementController::class,
        'checkout',
    ])->name('occupancies.checkout');

    Route::patch('/occupancies/{occupancy}/deposit', [
        OccupancyManagementController::class,
        'updateDeposit',
    ])->name('occupancies.deposit.update');

        // CRUD tipe kamar beserta harga.
    Route::get('/room-types', [
        RoomTypeManagementController::class,
        'index',
    ])->name('room-types.index');

    Route::get('/room-types/{roomType}', [
        RoomTypeManagementController::class,
        'show',
    ])->name('room-types.show');

    Route::post('/room-types', [
        RoomTypeManagementController::class,
        'store',
    ])->name('room-types.store');

    Route::put('/room-types/{roomType}', [
        RoomTypeManagementController::class,
        'update',
    ])->name('room-types.update');

    Route::delete('/room-types/{roomType}', [
        RoomTypeManagementController::class,
        'destroy',
    ])->name('room-types.destroy');

        // CRUD kamar.
    Route::get('/rooms', [
        RoomManagementController::class,
        'index',
    ])->name('rooms.index');

    Route::get('/rooms/{room}', [
        RoomManagementController::class,
        'show',
    ])->name('rooms.show');

    Route::post('/rooms', [
        RoomManagementController::class,
        'store',
    ])->name('rooms.store');

    Route::put('/rooms/{room}', [
        RoomManagementController::class,
        'update',
    ])->name('rooms.update');

    Route::delete('/rooms/{room}', [
        RoomManagementController::class,
        'destroy',
    ])->name('rooms.destroy');

    Route::get('/facilities', [FacilityManagementController::class, 'index'])->name('facilities.index');
    Route::post('/facilities', [FacilityManagementController::class, 'store'])->name('facilities.store');
    Route::get('/facilities/{facility}', [FacilityManagementController::class, 'show'])->name('facilities.show');
    Route::put('/facilities/{facility}', [FacilityManagementController::class, 'update'])->name('facilities.update');
    Route::delete('/facilities/{facility}', [FacilityManagementController::class, 'destroy'])->name('facilities.destroy');

        // Pencatatan dan kondisi fasilitas pada kamar.
    Route::get('/rooms/{room}/facilities', [
        RoomFacilityManagementController::class,
        'index',
    ])->name('rooms.facilities.index');

    Route::post('/rooms/{room}/facilities', [
        RoomFacilityManagementController::class,
        'store',
    ])->name('rooms.facilities.store');

    Route::put('/rooms/{room}/facilities/{roomFacility}', [
        RoomFacilityManagementController::class,
        'update',
    ])->name('rooms.facilities.update');

    Route::delete('/rooms/{room}/facilities/{roomFacility}', [
        RoomFacilityManagementController::class,
        'destroy',
    ])->name('rooms.facilities.destroy');

        // Mengambil dan memperbarui aturan kost.
    Route::get('/house-rules', [
        HouseRuleManagementController::class,
        'show',
    ])->name('house-rules.show');

    Route::put('/house-rules', [
        HouseRuleManagementController::class,
        'update',
    ])->name('house-rules.update');
});
