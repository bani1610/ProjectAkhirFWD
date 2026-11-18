<?php

use App\Http\Controllers\Api\V1\Owner\TenantAccountController;
use Illuminate\Support\Facades\Route;

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
});
