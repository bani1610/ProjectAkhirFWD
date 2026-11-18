<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\RoomType;
use Illuminate\Http\JsonResponse;

class RoomTypeController extends Controller
{
    /**
     * Menampilkan seluruh tipe kamar beserta daftar harga.
     *
     * GET /api/v1/room-types
     */
    public function index(): JsonResponse
    {
        $roomTypes = RoomType::query()
            ->with([
                'prices' => function ($query) {
                    $query->orderBy('period_months')
                        ->select('id', 'room_type_id', 'period_months', 'price');
                },
            ])
            ->orderBy('name')
            ->get(['id', 'name', 'description']);

        return ApiResponse::success(
            $roomTypes,
            'Data tipe kamar berhasil diambil.'
        );
    }

    /**
     * Menampilkan detail tipe kamar beserta daftar harga.
     *
     * GET /api/v1/room-types/{id}
     */
    public function show(RoomType $roomType): JsonResponse
    {
        $roomType->load([
            'prices' => function ($query) {
                $query->orderBy('period_months')
                    ->select('id', 'room_type_id', 'period_months', 'price');
            },
        ]);

        return ApiResponse::success(
            $roomType,
            'Detail tipe kamar berhasil diambil.'
        );
    }
}
