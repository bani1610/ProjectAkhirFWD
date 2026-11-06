<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Complaint extends Model
{
    public const STATUSES = ['submitted', 'accepted', 'in_progress', 'resolved', 'confirmed'];
    public const CATEGORIES = ['facility_mismatch', 'damage', 'cleanliness', 'security', 'other'];
    public const ROOT_CAUSES = ['normal_wear', 'tenant_misuse', 'quality_installation', 'external', 'other'];

    protected $fillable = [
        'user_id',
        'room_id',
        'facility_id',
        'category',
        'urgency',
        'title',
        'description',
        'status',
        'root_cause_category',
        'root_cause_note',
        'action_taken',
        'repair_cost',
        'resolved_at',
        'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'repair_cost' => 'integer',
            'resolved_at' => 'datetime',
            'confirmed_at' => 'datetime',
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

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ComplaintPhoto::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ComplaintComment::class);
    }
}
