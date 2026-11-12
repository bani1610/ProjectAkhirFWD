<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Memastikan Sanctum terpasang dan siap dipakai.
 *
 * Endpoint login belum ada (Tugas 3), jadi pengujian memakai route
 * sementara yang hanya didaftarkan di dalam tes.
 */
class SanctumSetupTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware(['api', 'auth:sanctum'])->get('/api/v1/_uji/terlindungi', function () {
            return response()->json([
                'success' => true,
                'data' => ['user_id' => request()->user()->id],
            ]);
        });
    }

    private function makeTenant(): User
    {
        return User::create([
            'role' => User::ROLE_TENANT,
            'name' => 'Budi Santoso',
            'phone' => '081311110001',
            'password' => 'password',
        ]);
    }

    public function test_route_terlindungi_menolak_request_tanpa_token(): void
    {
        $this->app['auth']->forgetGuards();

        $this->getJson('/api/v1/_uji/terlindungi')
            ->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'UNAUTHENTICATED');
    }

    public function test_token_sanctum_dapat_dipakai_untuk_route_terlindungi(): void
    {
        $tenant = $this->makeTenant();
        $token = $tenant->createToken('uji')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/_uji/terlindungi')
            ->assertOk()
            ->assertJsonPath('data.user_id', $tenant->id);
    }

    public function test_token_yang_sudah_dicabut_tidak_berlaku(): void
    {
        $tenant = $this->makeTenant();
        $token = $tenant->createToken('uji')->plainTextToken;

        $tenant->tokens()->delete();
        $this->app['auth']->forgetGuards();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/_uji/terlindungi')
            ->assertStatus(401);
    }

    public function test_token_tersimpan_di_tabel_personal_access_tokens(): void
    {
        $tenant = $this->makeTenant();
        $tenant->createToken('uji');

        $this->assertDatabaseCount('personal_access_tokens', 1);
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $tenant->id,
            'tokenable_type' => $tenant::class,
        ]);
    }

    public function test_sanctum_acting_as_dapat_dipakai_dalam_pengujian(): void
    {
        Sanctum::actingAs($this->makeTenant(), ['tenant']);

        $this->getJson('/api/v1/_uji/terlindungi')->assertOk();
    }

    public function test_masa_berlaku_token_dibaca_dari_konfigurasi(): void
    {
        $this->assertSame(10080, config('sanctum.expiration'));
    }
}
