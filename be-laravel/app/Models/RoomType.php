<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoomType extends Model
{
    protected $fillable = ['name', 'description'];

    public function prices(): HasMany
    {
        return $this->hasMany(RoomTypePrice::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    /** Harga yang berlaku sekarang untuk periode N bulan (F-ROOM-01). */
    public function priceFor(int $periodMonths): ?int
    {
        return $this->prices()->where('period_months', $periodMonths)->value('price');
    }
}
