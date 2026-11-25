<?php

namespace App\Policies;

use App\Models\Occupancy;
use App\Models\User;

/**
 * Pembatasan akses data hunian per penyewa (NFR-02).
 *
 * Penyewa hanya boleh membuka hunian miliknya sendiri. Pemilik kost
 * dilewatkan lewat Gate::before di AppServiceProvider karena mengelola
 * seluruh data.
 */
class OccupancyPolicy
{
    public function view(User $user, Occupancy $occupancy): bool
    {
        return $user->isTenant() && $occupancy->user_id === $user->id;
    }
}
