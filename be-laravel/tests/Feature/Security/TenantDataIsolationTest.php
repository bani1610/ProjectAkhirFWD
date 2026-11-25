<?php

namespace Tests\Feature\Security;

use App\Models\Complaint;
use App\Models\Invoice;
use App\Models\Occupancy;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * NFR-02: penyewa hanya bisa mengakses datanya sendiri.
 *
 * Pengujian memanggil aturan otorisasi secara langsung (Gate/Policy), karena
 * endpoint fitur penyewa baru dibuat pada tugas berikutnya. Dengan begitu
 * aturan ini sudah terkunci sebelum endpoint-nya ada.
 */
class TenantDataIsolationTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;

    private User $budi;

    private User $siti;

    private Occupancy $hunianBudi;

    private Occupancy $hunianSiti;

    protected function setUp(): void
    {
        parent::setUp();

        // Route sementara hanya untuk pengujian, tidak terdaftar di aplikasi.
        Route::middleware(['api', 'auth:sanctum'])
            ->get('/api/v1/_uji/tagihan/{invoice}', function (Invoice $invoice) {
                Gate::authorize('view', $invoice);

                return response()->json([
                    'success' => true,
                    'data' => ['number' => $invoice->number],
                ]);
            });

        $this->owner = User::create([
            'role' => User::ROLE_OWNER,
            'name' => 'Pemilik KostKuy',
            'phone' => '081200000001',
            'password' => 'password',
        ]);

        $this->budi = User::create([
            'role' => User::ROLE_TENANT,
            'name' => 'Budi Santoso',
            'phone' => '081311110001',
            'password' => 'password',
        ]);

        $this->siti = User::create([
            'role' => User::ROLE_TENANT,
            'name' => 'Siti Rahmawati',
            'phone' => '081311110002',
            'password' => 'password',
        ]);

        $tipe = RoomType::create(['name' => 'AC']);

        $kamar101 = Room::create([
            'number' => '101',
            'floor' => 1,
            'room_type_id' => $tipe->id,
            'status' => Room::STATUS_OCCUPIED,
        ]);

        $kamar201 = Room::create([
            'number' => '201',
            'floor' => 2,
            'room_type_id' => $tipe->id,
            'status' => Room::STATUS_OCCUPIED,
        ]);

        $this->hunianBudi = Occupancy::create([
            'user_id' => $this->budi->id,
            'room_id' => $kamar101->id,
            'start_date' => '2026-01-10',
            'next_period_months' => 1,
            'status' => Occupancy::STATUS_ACTIVE,
        ]);

        $this->hunianSiti = Occupancy::create([
            'user_id' => $this->siti->id,
            'room_id' => $kamar201->id,
            'start_date' => '2026-02-15',
            'next_period_months' => 1,
            'status' => Occupancy::STATUS_ACTIVE,
        ]);
    }

    private function buatTagihan(Occupancy $hunian, string $nomor): Invoice
    {
        return Invoice::create([
            'number' => $nomor,
            'occupancy_id' => $hunian->id,
            'period_start' => '2026-11-10',
            'period_end' => '2026-12-09',
            'period_months' => 1,
            'amount' => 900000,
            'due_date' => '2026-11-10',
            'status' => Invoice::STATUS_UNPAID,
        ]);
    }

    private function buatKeluhan(User $penyewa, Room $kamar, string $judul): Complaint
    {
        return Complaint::create([
            'user_id' => $penyewa->id,
            'room_id' => $kamar->id,
            'category' => 'damage',
            'urgency' => 'normal',
            'title' => $judul,
            'description' => 'Keterangan keluhan.',
            'status' => 'submitted',
        ]);
    }

    // ---------------------------------------------------------------- hunian

    public function test_penyewa_boleh_melihat_hunian_miliknya_sendiri(): void
    {
        $this->assertTrue($this->budi->can('view', $this->hunianBudi));
    }

    public function test_penyewa_tidak_boleh_melihat_hunian_penyewa_lain(): void
    {
        $this->assertFalse($this->budi->can('view', $this->hunianSiti));
    }

    // --------------------------------------------------------------- tagihan

    public function test_penyewa_boleh_melihat_tagihan_miliknya_sendiri(): void
    {
        $tagihanBudi = $this->buatTagihan($this->hunianBudi, 'INV-BUDI-001');

        $this->assertTrue($this->budi->can('view', $tagihanBudi));
    }

    public function test_penyewa_tidak_boleh_melihat_tagihan_penyewa_lain(): void
    {
        $tagihanSiti = $this->buatTagihan($this->hunianSiti, 'INV-SITI-001');

        $this->assertFalse($this->budi->can('view', $tagihanSiti));
    }

    // --------------------------------------------------------------- keluhan

    public function test_penyewa_boleh_melihat_keluhan_miliknya_sendiri(): void
    {
        $keluhanBudi = $this->buatKeluhan($this->budi, $this->hunianBudi->room, 'Kipas berisik');

        $this->assertTrue($this->budi->can('view', $keluhanBudi));
    }

    public function test_penyewa_tidak_boleh_melihat_keluhan_penyewa_lain(): void
    {
        $keluhanSiti = $this->buatKeluhan($this->siti, $this->hunianSiti->room, 'AC bocor');

        $this->assertFalse($this->budi->can('view', $keluhanSiti));
    }

    // ------------------------------------------------------------------ peran

    public function test_pemilik_boleh_melihat_data_seluruh_penyewa(): void
    {
        $tagihanSiti = $this->buatTagihan($this->hunianSiti, 'INV-SITI-002');
        $keluhanBudi = $this->buatKeluhan($this->budi, $this->hunianBudi->room, 'Lampu mati');

        $this->assertTrue($this->owner->can('view', $this->hunianSiti));
        $this->assertTrue($this->owner->can('view', $tagihanSiti));
        $this->assertTrue($this->owner->can('view', $keluhanBudi));
    }

    // ------------------------------------------------------------ lapisan API

    public function test_penyewa_mendapat_403_saat_membuka_tagihan_penyewa_lain(): void
    {
        $tagihanSiti = $this->buatTagihan($this->hunianSiti, 'INV-SITI-003');

        Sanctum::actingAs($this->budi, ['tenant']);

        $this->getJson('/api/v1/_uji/tagihan/'.$tagihanSiti->id)
            ->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'FORBIDDEN');
    }

    public function test_pemilik_mendapat_200_saat_membuka_tagihan_penyewa(): void
    {
        $tagihanBudi = $this->buatTagihan($this->hunianBudi, 'INV-BUDI-004');

        Sanctum::actingAs($this->owner, ['owner']);

        $this->getJson('/api/v1/_uji/tagihan/'.$tagihanBudi->id)
            ->assertOk()
            ->assertJsonPath('data.number', 'INV-BUDI-004');
    }
}
