<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

/**
 * Pembatasan akses data tagihan per penyewa (NFR-02).
 *
 * Tagihan terikat ke hunian, bukan langsung ke pengguna, jadi kepemilikan
 * diperiksa lewat occupancy.user_id.
 */
class InvoicePolicy
{
    public function view(User $user, Invoice $invoice): bool
    {
        $invoice->loadMissing('occupancy');

        return $user->isTenant()
            && $invoice->occupancy?->user_id === $user->id;
    }
}
