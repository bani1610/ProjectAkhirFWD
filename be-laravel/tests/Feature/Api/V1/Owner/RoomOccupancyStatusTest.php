<?php

namespace Tests\Feature\Api\V1\Owner;

use App\Models\Occupancy;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoomOccupancyStatusTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;

    private User $tenant;

    private User $tenantKedua;

    private Room $room;

    private Occupancy $occupancy;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::create([
            'role' => User::ROLE_OWNER,
            'name' => 'Pemilik KostKuy',
            'phone' => '081200000001',
            'password' => 'password',
            'is_active' => true,
            'must_change_password' => false,
        ]);

        $this->tenant = User::create([
            'role' => User::ROLE_TENANT,
            'name' => 'Tenant Pertama',
            'phone' => '081200000002',
            'password' => 'password',
            'is_active' => true,
            'must_change_password' => false,
        ]);

        $this->tenantKedua = User::create([
            'role' => User::ROLE_TENANT,
            'name' => 'Tenant Kedua',
            'phone' => '081200000003',
            'password' => 'password',
            'is_active' => true,
            'must_change_password' => false,
        ]);

        $roomType = RoomType::create([
            'name' => 'AC',
        ]);

        $this->room = Room::create([
            'number' => '101',
            'floor' => 1,
            'room_type_id' => $roomType->id,
            'status' => Room::STATUS_OCCUPIED,
        ]);

        $this->occupancy = Occupancy::create([
            'user_id' => $this->tenant->id,
            'room_id' => $this->room->id,
            'start_date' => '2026-11-01',
            'next_period_months' => 1,
            'status' => Occupancy::STATUS_ACTIVE,
        ]);

        Sanctum::actingAs($this->owner, ['owner']);
    }

    public function test_owner_tidak_dapat_mengubah_status_kamar_yang_masih_dihuni(): void
    {
        $this->putJson('/api/v1/owner/rooms/'.$this->room->id, [
            'status' => Room::STATUS_MAINTENANCE,
        ])
            ->assertStatus(409)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'ROOM_HAS_ACTIVE_OCCUPANCY');

        $this->assertDatabaseHas('rooms', [
            'id' => $this->room->id,
            'status' => Room::STATUS_OCCUPIED,
        ]);
    }

    public function test_tenant_kedua_tidak_dapat_ditempatkan_di_kamar_yang_sudah_dihuni(): void
    {
        $this->postJson('/api/v1/owner/occupancies', [
            'user_id' => $this->tenantKedua->id,
            'room_id' => $this->room->id,
            'start_date' => '2026-11-28',
            'next_period_months' => 1,
        ])
            ->assertStatus(409)
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 'OCCUPANCY_CONFLICT');

        $this->assertDatabaseCount('occupancies', 1);
        $this->assertDatabaseHas('occupancies', [
            'id' => $this->occupancy->id,
            'user_id' => $this->tenant->id,
            'room_id' => $this->room->id,
            'status' => Occupancy::STATUS_ACTIVE,
        ]);
    }
}
