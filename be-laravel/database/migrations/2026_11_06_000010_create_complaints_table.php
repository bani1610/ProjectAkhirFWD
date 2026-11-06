<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('room_id')->constrained()->restrictOnDelete();
            $table->foreignId('facility_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('category', ['facility_mismatch', 'damage', 'cleanliness', 'security', 'other']);
            $table->enum('urgency', ['normal', 'emergency'])->default('normal');
            $table->string('title', 150);
            $table->text('description');
            $table->enum('status', ['submitted', 'accepted', 'in_progress', 'resolved', 'confirmed'])->default('submitted');
            $table->enum('root_cause_category', ['normal_wear', 'tenant_misuse', 'quality_installation', 'external', 'other'])->nullable();
            $table->text('root_cause_note')->nullable();
            $table->text('action_taken')->nullable();
            $table->unsignedInteger('repair_cost')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'urgency']);
            $table->index(['facility_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
