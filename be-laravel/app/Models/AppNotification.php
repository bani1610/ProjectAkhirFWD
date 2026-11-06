<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Notifikasi dalam aplikasi (F-NOTIF-01). Dinamai AppNotification agar tidak
 * bentrok dengan sistem notifikasi bawaan Laravel.
 */
class AppNotification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'read_at',
        'wa_status',
        'wa_attempts',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'wa_attempts' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
