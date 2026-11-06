<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomTypePrice extends Model
{
    public const PERIODS = [1, 6, 12];

    protected $fillable = ['room_type_id', 'period_months', 'price'];

    protected function casts(): array
    {
        return [
            'period_months' => 'integer',
            'price' => 'integer',
        ];
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }
}
