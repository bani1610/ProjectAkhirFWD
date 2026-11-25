<?php

namespace App\Policies;

use App\Models\Complaint;
use App\Models\User;

/**
 * Pembatasan akses data keluhan per penyewa (NFR-02).
 *
 * Penyewa hanya boleh membuka keluhan yang ia buat sendiri.
 */
class ComplaintPolicy
{
    public function view(User $user, Complaint $complaint): bool
    {
        return $user->isTenant() && $complaint->user_id === $user->id;
    }
}
