<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;

class FacilityController extends Controller
{
    /**
     * Mengambil seluruh data fasilitas.
     */
    public function index(): JsonResponse
    {
        $facilities = Facility::query()
            ->orderBy('scope')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'scope',
            ]);

        return ApiResponse::success(
            $facilities,
            'Data fasilitas berhasil diambil.'
        );
    }
}
