<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Support\Str;

class TenantAccountController extends Controller
{
    /**
     * Mereset password tenant menggunakan password sementara.
     */
    public function resetPassword(User $tenant)
    {
        // Pastikan akun yang dipilih merupakan tenant.
        if (!$tenant->isTenant()) {
            return ApiResponse::error(
                'Data tenant tidak ditemukan.',
                404,
                'TENANT_NOT_FOUND'
            );
        }

        // Buat password sementara secara acak.
        $temporaryPassword = Str::random(16);

        // Simpan password sementara dan wajibkan penggantian.
        $tenant->password = $temporaryPassword;
        $tenant->must_change_password = true;
        $tenant->failed_login_attempts = 0;
        $tenant->locked_until = null;
        $tenant->save();

        // Cabut seluruh token lama milik tenant.
        $tenant->tokens()->delete();

        return ApiResponse::success([
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'phone' => $tenant->phone,
            ],
            'temporary_password' => $temporaryPassword,
            'must_change_password' => true,
        ], 'Password tenant berhasil direset.');
    }

    /**
     * Menonaktifkan akun tenant.
     */
    public function deactivate(User $tenant)
    {
        // Pastikan akun yang dipilih merupakan tenant.
        if (!$tenant->isTenant()) {
            return ApiResponse::error(
                'Data tenant tidak ditemukan.',
                404,
                'TENANT_NOT_FOUND'
            );
        }

        // Nonaktifkan akun tenant.
        $tenant->is_active = false;
        $tenant->save();

        // Cabut seluruh token milik tenant.
        $tenant->tokens()->delete();

        return ApiResponse::success([
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'phone' => $tenant->phone,
                'is_active' => false,
            ],
        ], 'Akun tenant berhasil dinonaktifkan.');
    }
}
