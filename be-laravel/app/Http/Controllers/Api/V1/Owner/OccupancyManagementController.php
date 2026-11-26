<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Occupancy;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OccupancyManagementController extends Controller
{

    /**
    * Menampilkan riwayat hunian.
    */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
        ]);

        $query = Occupancy::with([
            'user:id,name,phone',
            'room:id,number,floor,status',
        ])->latest('start_date');

        if (isset($validated['user_id'])) {
            $query->where('user_id', $validated['user_id']);
        }

        $occupancies = $query->paginate(15);

        return ApiResponse::success(
            $occupancies,
            'Riwayat hunian berhasil diambil.'
        );
    }

    /**
    * Memindahkan tenant ke kamar lain.
    */
    public function move(Request $request, Occupancy $occupancy): JsonResponse
    {
        $validated = $request->validate([
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'start_date' => ['required', 'date'],
            'next_period_months' => [
                'sometimes',
                'integer',
                Rule::in([1, 6, 12]),
            ],
            'note' => ['nullable', 'string'],
        ]);

        $newOccupancy = DB::transaction(function () use ($occupancy, $validated) {
            $current = Occupancy::whereKey($occupancy->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($current->status !== Occupancy::STATUS_ACTIVE) {
                return null;
            }

            $currentRoom = Room::whereKey($current->room_id)
                ->lockForUpdate()
                ->firstOrFail();

            $newRoom = Room::whereKey($validated['room_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if (
                $newRoom->id === $currentRoom->id ||
                $newRoom->status !== Room::STATUS_VACANT
            ) {
                return null;
            }

            $moveDate = $validated['start_date'];

            $current->update([
                'end_date' => $moveDate,
                'status' => Occupancy::STATUS_MOVED,
            ]);

            $currentRoom->update([
                'status' => Room::STATUS_VACANT,
            ]);

            $newOccupancy = Occupancy::create([
                'user_id' => $current->user_id,
                'room_id' => $newRoom->id,
                'start_date' => $moveDate,
                'next_period_months' => $validated['next_period_months']
                    ?? $current->next_period_months,
                'deposit_amount' => 0,
                'deposit_status' => 'pending',
                'deposit_note' => null,
                'note' => $validated['note'] ?? null,
                'status' => Occupancy::STATUS_ACTIVE,
            ]);

            $newRoom->update([
                'status' => Room::STATUS_OCCUPIED,
            ]);

            return $newOccupancy;
        });

        if (!$newOccupancy) {
            return ApiResponse::error(
                'Occupancy tidak aktif, atau kamar tujuan tidak tersedia.',
                409,
                'OCCUPANCY_MOVE_CONFLICT'
            );
        }

        $newOccupancy->load([
            'user:id,name,phone',
            'room:id,number,floor,status',
        ]);

        return ApiResponse::success(
            $newOccupancy,
            'Tenant berhasil dipindahkan ke kamar baru.',
            201
        );
    }

    /**
     * Menempatkan tenant ke kamar.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'start_date' => ['required', 'date'],
            'next_period_months' => [
                'required',
                'integer',
                Rule::in([1, 6, 12]),
            ],
            'deposit_amount' => ['sometimes', 'integer', 'min:0'],
            'deposit_status' => [
                'sometimes',
                Rule::in(['pending', 'received']),
            ],
            'deposit_note' => ['nullable', 'string'],
        ]);

        $occupancy = DB::transaction(function () use ($validated) {
            // Kunci data tenant agar tidak ditempatkan dua kali bersamaan.
            $tenant = User::tenants()
                ->whereKey($validated['user_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if (!$tenant->is_active) {
                return null;
            }

            if ($tenant->activeOccupancy()->exists()) {
                return null;
            }

            // Kunci kamar agar tidak ditempati dua tenant bersamaan.
            $room = Room::whereKey($validated['room_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($room->status !== Room::STATUS_VACANT) {
                return null;
            }

            $occupancy = Occupancy::create([
                'user_id' => $tenant->id,
                'room_id' => $room->id,
                'start_date' => $validated['start_date'],
                'next_period_months' => $validated['next_period_months'],
                'deposit_amount' => $validated['deposit_amount'] ?? 0,
                'deposit_status' => $validated['deposit_status'] ?? 'pending',
                'deposit_note' => $validated['deposit_note'] ?? null,
                'status' => Occupancy::STATUS_ACTIVE,
            ]);

            $room->update([
                'status' => Room::STATUS_OCCUPIED,
            ]);

            return $occupancy;
        });

        if (!$occupancy) {
            return ApiResponse::error(
                'Tenant tidak aktif, sudah memiliki hunian aktif, atau kamar tidak tersedia.',
                409,
                'OCCUPANCY_CONFLICT'
            );
        }

        $occupancy->load([
            'user:id,name,phone',
            'room:id,number,floor,status',
        ]);

        return ApiResponse::success(
            $occupancy,
            'Tenant berhasil ditempatkan ke kamar.',
            201
        );
    }

    /**
    * Memproses tenant keluar dari kamar.
    */
    public function checkout(Request $request, Occupancy $occupancy): JsonResponse
    {
        $validated = $request->validate([
            'end_date' => ['required', 'date'],
            'note' => ['nullable', 'string'],
        ]);

        $result = DB::transaction(function () use ($occupancy, $validated) {
            $current = Occupancy::whereKey($occupancy->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($current->status !== Occupancy::STATUS_ACTIVE) {
                return null;
            }

            if ($validated['end_date'] < $current->start_date->toDateString()) {
                return null;
            }

            $room = Room::whereKey($current->room_id)
                ->lockForUpdate()
                ->firstOrFail();

            $current->update([
                'end_date' => $validated['end_date'],
                'status' => Occupancy::STATUS_ENDED,
                'note' => $validated['note'] ?? $current->note,
            ]);

            if ($room->status === Room::STATUS_OCCUPIED) {
                $room->update([
                    'status' => Room::STATUS_VACANT,
                ]);
            }

            return $current;
        });

        if (!$result) {
            return ApiResponse::error(
                'Occupancy tidak aktif atau tanggal keluar tidak valid.',
                409,
                'OCCUPANCY_CHECKOUT_CONFLICT'
            );
        }

        $result->load([
            'user:id,name,phone',
            'room:id,number,floor,status',
        ]);

        return ApiResponse::success(
            $result,
            'Tenant berhasil keluar dari kamar.'
        );
    }

    /**
    * Memperbarui catatan deposit tenant.
    */
    public function updateDeposit(Request $request, Occupancy $occupancy): JsonResponse
    {
        $validated = $request->validate([
            'deposit_amount' => ['sometimes', 'required', 'integer', 'min:0'],
            'deposit_status' => [
                'sometimes',
                'required',
                Rule::in([
                    'pending',
                    'received',
                    'refunded',
                    'deducted',
                    'forfeited',
                ]),
            ],
            'deposit_note' => ['sometimes', 'nullable', 'string'],
        ]);

        if (empty($validated)) {
            return ApiResponse::error(
                'Minimal satu data deposit harus dikirim.',
                422,
                'DEPOSIT_DATA_REQUIRED'
            );
        }

        $occupancy->update($validated);

        return ApiResponse::success(
            $occupancy->fresh(),
            'Data deposit berhasil diperbarui.'
        );
    }
}
