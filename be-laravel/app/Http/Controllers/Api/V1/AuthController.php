<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Login menggunakan nomor telepon dan password.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('phone', $validated['phone'])->first();

        // Periksa apakah akun ditemukan.
        if (!$user) {
            return ApiResponse::error(
                'Nomor telepon atau password salah.',
                401,
                'INVALID_CREDENTIALS'
            );
        }

        // Periksa status akun.
        if (!$user->is_active) {
            return ApiResponse::error(
                'Akun Anda sudah dinonaktifkan.',
                403,
                'ACCOUNT_INACTIVE'
            );
        }

        // Periksa apakah akun sedang terkunci.
        if ($user->locked_until && $user->locked_until->isFuture()) {
            return ApiResponse::error(
                'Akun terkunci sementara. Silakan coba lagi nanti.',
                423,
                'ACCOUNT_LOCKED',
                meta: [
                    'locked_until' => $user->locked_until->toDateTimeString(),
                ]
            );
        }

        // Jika masa penguncian sudah berakhir, reset hitungan.
        if ($user->locked_until && $user->locked_until->isPast()) {
            $user->failed_login_attempts = 0;
            $user->locked_until = null;
            $user->save();
        }

        // Periksa password.
        if (!Hash::check($validated['password'], $user->password)) {
            $user->failed_login_attempts++;

            // Kunci akun setelah 5 kali gagal.
            if ($user->failed_login_attempts >= 5) {
                $user->locked_until = now()->addMinutes(15);
            }

            $user->save();

            if ($user->locked_until) {
                return ApiResponse::error(
                    'Akun terkunci selama 15 menit karena terlalu banyak percobaan login.',
                    423,
                    'ACCOUNT_LOCKED',
                    meta: [
                        'locked_until' => $user->locked_until->toDateTimeString(),
                    ]
                );
            }

            return ApiResponse::error(
                'Nomor telepon atau password salah.',
                401,
                'INVALID_CREDENTIALS',
                meta: [
                    'remaining_attempts' => 5 - $user->failed_login_attempts,
                ]
            );
        }

        // Reset percobaan gagal setelah login berhasil.
        $user->failed_login_attempts = 0;
        $user->locked_until = null;
        $user->save();

        // Buat token Sanctum.
        $token = $user->createToken('auth-token')->plainTextToken;

        return ApiResponse::success([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'role' => $user->role,
                'must_change_password' => $user->must_change_password,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Login berhasil.');
    }

        /**
     * Logout dan mencabut token yang sedang digunakan.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success(
            null,
            'Logout berhasil.'
        );
    }

    /**
     * Mengganti password pengguna.
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8),
            ],
        ]);

        $user = $request->user();

        // Periksa password lama.
        if (!Hash::check($validated['current_password'], $user->password)) {
            return ApiResponse::error(
                'Password lama yang Anda masukkan salah.',
                422,
                'INVALID_CURRENT_PASSWORD'
            );
        }

        // Simpan password baru.
        $user->password = $validated['new_password'];
        $user->must_change_password = false;
        $user->save();

        return ApiResponse::success(
            [
                'must_change_password' => $user->must_change_password,
            ],
            'Password berhasil diperbarui.'
        );
    }
}
