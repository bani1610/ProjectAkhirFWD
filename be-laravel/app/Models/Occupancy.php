<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Occupancy extends Model
{
    public const STATUS_ACTIVE = 'active';
    public const STATUS_MOVED = 'moved';
    public const STATUS_ENDED = 'ended';

    protected $fillable = [
        'user_id',
        'room_id',
        'start_date',
        'end_date',
        'next_period_months',
        'deposit_amount',
        'deposit_status',
        'deposit_note',
        'note',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'next_period_months' => 'integer',
            'deposit_amount' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
