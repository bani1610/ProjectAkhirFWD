<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('OWNER_PASSWORD', 'password');

        // Nilai bawaan "password" ada di .env.example, jadi ikut ditolak di produksi.
        throw_if(
            app()->isProduction() && in_array($password, [null, '', 'password'], true),
            RuntimeException::class,
            'OWNER_PASSWORD wajib diisi dengan password yang kuat di produksi.'
        );

        // firstOrCreate: seed ulang tidak menimpa password owner yang sudah diganti.
        User::firstOrCreate(
            ['phone' => env('OWNER_PHONE', '081200000001')],
            [
                'role' => User::ROLE_OWNER,
                'name' => env('OWNER_NAME', 'Pemilik KostKuy'),
                'password' => $password,
                'is_active' => true,
                // Di produksi pemilik wajib ganti password saat login pertama.
                'must_change_password' => ! app()->environment(['local', 'testing']),
                'consented_at' => now(),
            ]
        );
    }
}
