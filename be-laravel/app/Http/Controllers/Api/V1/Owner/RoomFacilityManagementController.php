<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Facility;
use App\Models\Room;
use App\Models\RoomFacility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoomFacilityManagementController extends Controller
{
    /**
     * Menampilkan fasilitas yang tercatat pada suatu kamar.
     */
    public function index(Room $room): JsonResponse
    {
        $roomFacilities = $room->roomFacilities()
            ->with('facility:id,name,scope')
            ->orderBy('id')
            ->get();

        return ApiResponse::success(
            $roomFacilities,
            'Data fasilitas kamar berhasil diambil.'
        );
    }

    /**
     * Menambahkan pencatatan fasilitas pada suatu kamar.
     */
    public function store(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'facility_id' => [
                'required',
                'integer',
                Rule::exists('facilities', 'id')->where('scope', Facility::SCOPE_ROOM),
            ],
            'condition_status' => [
                'sometimes',
                'required',
                Rule::in(RoomFacility::CONDITIONS),
            ],
            'photo_path' => ['sometimes', 'nullable', 'string', 'max:255'],
            'note' => ['sometimes', 'nullable', 'string'],
            'recorded_at' => ['sometimes', 'nullable', 'date'],
        ]);

        $exists = $room->roomFacilities()
            ->where('facility_id', $validated['facility_id'])
            ->exists();

        if ($exists) {
            return ApiResponse::error(
                'Fasilitas tersebut sudah tercatat pada kamar ini.',
                409,
                'ROOM_FACILITY_ALREADY_EXISTS'
            );
        }

        $roomFacility = $room->roomFacilities()->create($validated);
        $roomFacility->load('facility:id,name,scope');

        return ApiResponse::success(
            $roomFacility,
            'Fasilitas berhasil ditambahkan ke kamar.',
            201
        );
    }

    /**
     * Memperbarui kondisi dan catatan fasilitas pada suatu kamar.
     */
    public function update(
        Request $request,
        Room $room,
        RoomFacility $roomFacility
    ): JsonResponse {
        if ($roomFacility->room_id !== $room->id) {
            return ApiResponse::error(
                'Pencatatan fasilitas tidak ditemukan pada kamar ini.',
                404,
                'ROOM_FACILITY_NOT_FOUND'
            );
        }

        $validated = $request->validate([
            'condition_status' => [
                'sometimes',
                'required',
                Rule::in(RoomFacility::CONDITIONS),
            ],
            'photo_path' => ['sometimes', 'nullable', 'string', 'max:255'],
            'note' => ['sometimes', 'nullable', 'string'],
            'recorded_at' => ['sometimes', 'nullable', 'date'],
        ]);

        $roomFacility->update($validated);
        $roomFacility->load('facility:id,name,scope');

        return ApiResponse::success(
            $roomFacility,
            'Kondisi fasilitas kamar berhasil diperbarui.'
        );
    }

    /**
     * Menghapus pencatatan fasilitas dari suatu kamar.
     */
    public function destroy(
        Room $room,
        RoomFacility $roomFacility
    ): JsonResponse {
        if ($roomFacility->room_id !== $room->id) {
            return ApiResponse::error(
                'Pencatatan fasilitas tidak ditemukan pada kamar ini.',
                404,
                'ROOM_FACILITY_NOT_FOUND'
            );
        }

        $roomFacility->delete();

        return ApiResponse::success(
            null,
            'Pencatatan fasilitas kamar berhasil dihapus.'
        );
    }
}
