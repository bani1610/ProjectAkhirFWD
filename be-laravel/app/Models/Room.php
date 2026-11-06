<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Room extends Model
{
    public const STATUS_VACANT = 'vacant';
    public const STATUS_OCCUPIED = 'occupied';
    public const STATUS_MAINTENANCE = 'maintenance';

    protected $fillable = ['number', 'floor', 'room_type_id', 'status'];

    protected function casts(): array
    {
        return ['floor' => 'integer'];
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    public function roomFacilities(): HasMany
    {
        return $this->hasMany(RoomFacility::class);
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'room_facilities')
            ->withPivot(['id', 'condition_status', 'photo_path', 'note', 'recorded_at'])
            ->withTimestamps();
    }

    public function occupancies(): HasMany
    {
        return $this->hasMany(Occupancy::class);
    }

    public function activeOccupancy(): HasOne
    {
        return $this->hasOne(Occupancy::class)->where('status', Occupancy::STATUS_ACTIVE);
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }
}
