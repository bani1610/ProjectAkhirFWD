<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Room;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    /**
     * Mengambil seluruh data kamar.
     */
    public function index(): JsonResponse
    {
        $rooms = Room::query()
            ->with([
                'roomType:id,name,description',
                'facilities' => function ($query) {
                    $query->select(
                        'facilities.id',
                        'facilities.name',
                        'facilities.scope'
                    );
                },
            ])
            ->orderBy('floor')
            ->orderBy('number')
            ->get([
                'id',
                'number',
                'floor',
                'room_type_id',
                'status',
            ]);

        return ApiResponse::success(
            $rooms,
            'Data kamar berhasil diambil.'
        );
    }

    /**
     * Mengambil detail kamar berdasarkan ID.
     */
    public function show(Room $room): JsonResponse
    {
        $room->load([
            'roomType:id,name,description',
            'facilities' => function ($query) {
                $query->select(
                    'facilities.id',
                    'facilities.name',
                    'facilities.scope'
                );
            },
        ]);

        return ApiResponse::success(
            $room,
            'Detail kamar berhasil diambil.'
        );
    }
}
