<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoomManagementController extends Controller
{
    /**
     * Menampilkan seluruh kamar.
     */
    public function index(): JsonResponse
    {
        $rooms = Room::with('roomType:id,name,description')
            ->orderBy('floor')
            ->orderBy('number')
            ->get();

        return ApiResponse::success(
            $rooms,
            'Data kamar berhasil diambil.'
        );
    }

    /**
     * Menampilkan detail kamar.
     */
    public function show(Room $room): JsonResponse
    {
        $room->load([
            'roomType:id,name,description',
            'facilities:id,name,scope',
        ]);

        return ApiResponse::success(
            $room,
            'Detail kamar berhasil diambil.'
        );
    }

    /**
     * Menambahkan kamar baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'number' => [
                'required',
                'string',
                'max:10',
                'unique:rooms,number',
            ],
            'floor' => ['required', 'integer', 'min:0', 'max:255'],
            'room_type_id' => [
                'required',
                'integer',
                'exists:room_types,id',
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in([
                    Room::STATUS_VACANT,
                    Room::STATUS_MAINTENANCE,
                ]),
            ],
        ]);

        $room = Room::create($validated);
        $room->load('roomType:id,name,description');

        return ApiResponse::success(
            $room,
            'Kamar berhasil ditambahkan.',
            201
        );
    }

    /**
     * Mengubah data kamar.
     */
    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'number' => [
                'sometimes',
                'required',
                'string',
                'max:10',
                Rule::unique('rooms', 'number')->ignore($room->id),
            ],
            'floor' => ['sometimes', 'required', 'integer', 'min:0', 'max:255'],
            'room_type_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:room_types,id',
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in([
                    Room::STATUS_VACANT,
                    Room::STATUS_MAINTENANCE,
                ]),
            ],
        ]);

        if (
            isset($validated['status']) &&
            $validated['status'] !== $room->status &&
            $room->activeOccupancy()->exists()
        ) {
            return ApiResponse::error(
                'Status kamar tidak dapat diubah karena masih memiliki penghuni aktif.',
                409,
                'ROOM_HAS_ACTIVE_OCCUPANCY'
            );
        }

        $room->update($validated);
        $room->load('roomType:id,name,description');

        return ApiResponse::success(
            $room,
            'Data kamar berhasil diperbarui.'
        );
    }

    /**
     * Menghapus kamar yang belum memiliki riwayat occupancy.
     */
    public function destroy(Room $room): JsonResponse
    {
        if ($room->occupancies()->exists()) {
            return ApiResponse::error(
                'Kamar tidak dapat dihapus karena sudah memiliki riwayat penghuni.',
                409,
                'ROOM_HAS_OCCUPANCIES'
            );
        }

        $room->delete();

        return ApiResponse::success(
            null,
            'Kamar berhasil dihapus.'
        );
    }
}
