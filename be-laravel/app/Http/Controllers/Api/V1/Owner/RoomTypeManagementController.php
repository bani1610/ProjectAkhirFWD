<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\RoomType;
use App\Models\RoomTypePrice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RoomTypeManagementController extends Controller
{
    /**
     * Menampilkan seluruh tipe kamar beserta harga.
     */
    public function index(): JsonResponse
    {
        $roomTypes = RoomType::with([
            'prices' => fn ($query) => $query->orderBy('period_months'),
        ])
            ->orderBy('name')
            ->get();

        return ApiResponse::success(
            $roomTypes,
            'Data tipe kamar berhasil diambil.'
        );
    }

    /**
     * Menampilkan detail tipe kamar beserta harga.
     */
    public function show(RoomType $roomType): JsonResponse
    {
        $roomType->load([
            'prices' => fn ($query) => $query->orderBy('period_months'),
        ]);

        return ApiResponse::success(
            $roomType,
            'Detail tipe kamar berhasil diambil.'
        );
    }

    /**
     * Menambahkan tipe kamar beserta harga.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:50',
                'unique:room_types,name',
            ],
            'description' => ['nullable', 'string'],
            'prices' => ['required', 'array', 'min:1'],
            'prices.*.period_months' => [
                'required',
                'integer',
                Rule::in(RoomTypePrice::PERIODS),
                'distinct',
            ],
            'prices.*.price' => [
                'required',
                'integer',
                'min:0',
            ],
        ]);

        $roomType = DB::transaction(function () use ($validated) {
            $roomType = RoomType::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            $roomType->prices()->createMany($validated['prices']);

            return $roomType->load('prices');
        });

        return ApiResponse::success(
            $roomType,
            'Tipe kamar berhasil ditambahkan.',
            201
        );
    }

    /**
     * Mengubah data tipe kamar dan harga yang dikirim.
     */
    public function update(
        Request $request,
        RoomType $roomType
    ): JsonResponse {
        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('room_types', 'name')->ignore($roomType->id),
            ],
            'description' => ['sometimes', 'nullable', 'string'],
            'prices' => ['sometimes', 'required', 'array', 'min:1'],
            'prices.*.period_months' => [
                'required_with:prices',
                'integer',
                Rule::in(RoomTypePrice::PERIODS),
                'distinct',
            ],
            'prices.*.price' => [
                'required_with:prices',
                'integer',
                'min:0',
            ],
        ]);

        DB::transaction(function () use ($validated, $roomType) {
            $roomType->fill([
                'name' => $validated['name'] ?? $roomType->name,
                'description' => array_key_exists('description', $validated)
                    ? $validated['description']
                    : $roomType->description,
            ])->save();

            foreach ($validated['prices'] ?? [] as $price) {
                $roomType->prices()->updateOrCreate(
                    ['period_months' => $price['period_months']],
                    ['price' => $price['price']]
                );
            }
        });

        return ApiResponse::success(
            $roomType->load('prices'),
            'Tipe kamar berhasil diperbarui.'
        );
    }

    /**
     * Menghapus tipe kamar jika belum digunakan oleh kamar.
     */
    public function destroy(RoomType $roomType): JsonResponse
    {
        if ($roomType->rooms()->exists()) {
            return ApiResponse::error(
                'Tipe kamar tidak dapat dihapus karena masih digunakan oleh kamar.',
                409,
                'ROOM_TYPE_IN_USE'
            );
        }

        $roomType->delete();

        return ApiResponse::success(
            null,
            'Tipe kamar berhasil dihapus.'
        );
    }
}
