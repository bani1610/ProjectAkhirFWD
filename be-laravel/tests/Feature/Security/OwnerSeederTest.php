<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Database\Seeders\OwnerSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class OwnerSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seed_ulang_tidak_menimpa_password_owner(): void
    {
        $this->seed(OwnerSeeder::class);
        User::where('role', User::ROLE_OWNER)->first()->update(['password' => 'password-baru-123']);

        $this->seed(OwnerSeeder::class);

        $owner = User::where('role', User::ROLE_OWNER)->sole();
        $this->assertTrue(Hash::check('password-baru-123', $owner->password));
    }

    public function test_produksi_menolak_password_owner_bawaan(): void
    {
        $this->app['env'] = 'production';

        $this->expectException(RuntimeException::class);

        // Panggil langsung: db:seed di produksi meminta konfirmasi interaktif.
        (new OwnerSeeder)->run();
    }
}
