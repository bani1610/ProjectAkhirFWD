<?php

namespace Tests\Feature\Api\V1;

use App\Exceptions\ApiException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * Memastikan kerangka REST API berjalan: prefix versi, bentuk respons
 * seragam, dan seluruh error dibalas sebagai JSON.
 */
class ApiStructureTest extends TestCase
{
    use RefreshDatabase;

    public function test_endpoint_publik_ping_mengembalikan_bentuk_respons_standar(): void
    {
        $this->getJson('/api/v1/ping')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['app', 'api_version', 'environment', 'timezone', 'server_time', 'queue'],
            ]);
    }

    public function test_ping_menyertakan_versi_api(): void
    {
        $this->getJson('/api/v1/ping')->assertJsonPath('data.api_version', 'v1');
    }

    public function test_route_tidak_dikenal_membalas_json_bukan_html(): void
    {
        $response = $this->getJson('/api/v1/tidak-ada');

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'NOT_FOUND');

        $this->assertStringContainsString('application/json', $response->headers->get('Content-Type'));
    }

    public function test_method_yang_salah_membalas_json(): void
    {
        $response = $this->postJson('/api/v1/ping');

        $response->assertStatus(405);
        $this->assertStringContainsString('application/json', $response->headers->get('Content-Type'));
    }

    public function test_api_exception_dirender_menjadi_respons_standar(): void
    {
        // Route sementara hanya untuk pengujian, tidak terdaftar di aplikasi.
        Route::middleware('api')->get('/api/v1/_uji/konflik', function () {
            throw ApiException::conflict('Kamar sudah terisi.');
        });

        $this->getJson('/api/v1/_uji/konflik')
            ->assertStatus(409)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'CONFLICT')
            ->assertJsonPath('message', 'Kamar sudah terisi.');
    }

    public function test_api_exception_not_found_dirender_dengan_benar(): void
    {
        Route::middleware('api')->get('/api/v1/_uji/hilang', function () {
            throw ApiException::notFound();
        });

        $this->getJson('/api/v1/_uji/hilang')
            ->assertStatus(404)
            ->assertJsonPath('code', 'NOT_FOUND');
    }

    public function test_validasi_gagal_membalas_json_berbentuk_standar(): void
    {
        Route::middleware('api')->post('/api/v1/_uji/validasi', function (Request $request) {
            $request->validate(['nama' => ['required', 'string']]);
        });

        $this->postJson('/api/v1/_uji/validasi', [])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'VALIDATION_ERROR')
            ->assertJsonStructure(['message', 'errors' => ['nama']]);
    }
}
