<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['phone' => env('OWNER_PHONE', '081200000001')],
            [
                'role' => User::ROLE_OWNER,
                'name' => env('OWNER_NAME', 'Pemilik KostKuy'),
                'password' => env('OWNER_PASSWORD', 'password'),
                'is_active' => true,
                // Di produksi pemilik wajib ganti password saat login pertama.
                'must_change_password' => ! app()->environment(['local', 'testing']),
                'consented_at' => now(),
            ]
        );
    }
}
