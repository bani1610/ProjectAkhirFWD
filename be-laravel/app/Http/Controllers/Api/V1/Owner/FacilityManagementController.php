<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FacilityManagementController extends Controller
{
    /**
     * Menampilkan seluruh fasilitas.
     */
    public function index(): JsonResponse
    {
        $facilities = Facility::query()
            ->orderBy('scope')
            ->orderBy('name')
            ->get();

        return ApiResponse::success(
            $facilities,
            'Data fasilitas berhasil diambil.'
        );
    }

    /**
     * Menampilkan detail fasilitas.
     */
    public function show(Facility $facility): JsonResponse
    {
        return ApiResponse::success(
            $facility,
            'Detail fasilitas berhasil diambil.'
        );
    }

    /**
     * Menambahkan fasilitas baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'scope' => [
                'required',
                Rule::in([
                    Facility::SCOPE_ROOM,
                    Facility::SCOPE_SHARED,
                ]),
            ],
        ]);

        $exists = Facility::where('name', $validated['name'])
            ->where('scope', $validated['scope'])
            ->exists();

        if ($exists) {
            return ApiResponse::error(
                'Nama fasilitas dengan scope tersebut sudah digunakan.',
                422,
                'FACILITY_ALREADY_EXISTS'
            );
        }

        $facility = Facility::create($validated);

        return ApiResponse::success(
            $facility,
            'Fasilitas berhasil ditambahkan.',
            201
        );
    }

    /**
     * Mengubah data fasilitas.
     */
    public function update(
        Request $request,
        Facility $facility
    ): JsonResponse {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'scope' => [
                'sometimes',
                'required',
                Rule::in([
                    Facility::SCOPE_ROOM,
                    Facility::SCOPE_SHARED,
                ]),
            ],
        ]);

        $name = $validated['name'] ?? $facility->name;
        $scope = $validated['scope'] ?? $facility->scope;

        $exists = Facility::where('name', $name)
            ->where('scope', $scope)
            ->where('id', '!=', $facility->id)
            ->exists();

        if ($exists) {
            return ApiResponse::error(
                'Nama fasilitas dengan scope tersebut sudah digunakan.',
                422,
                'FACILITY_ALREADY_EXISTS'
            );
        }

        $facility->update($validated);

        return ApiResponse::success(
            $facility,
            'Data fasilitas berhasil diperbarui.'
        );
    }

    /**
     * Menghapus fasilitas yang belum dipakai pada kamar.
     */
    public function destroy(Facility $facility): JsonResponse
    {
        if ($facility->roomFacilities()->exists()) {
            return ApiResponse::error(
                'Fasilitas tidak dapat dihapus karena masih digunakan pada kamar.',
                409,
                'FACILITY_IN_USE'
            );
        }

        $facility->delete();

        return ApiResponse::success(
            null,
            'Fasilitas berhasil dihapus.'
        );
    }
}
