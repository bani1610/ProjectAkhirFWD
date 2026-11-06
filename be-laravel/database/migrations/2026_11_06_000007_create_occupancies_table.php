<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('occupancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('room_id')->constrained()->restrictOnDelete();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->unsignedTinyInteger('next_period_months')->default(1);
            $table->unsignedInteger('deposit_amount')->default(0);
            $table->enum('deposit_status', ['pending', 'received', 'refunded', 'deducted', 'forfeited'])->default('pending');
            $table->text('deposit_note')->nullable();
            $table->text('note')->nullable(); // selisih harga saat pindah kamar (F-TEN-04)
            $table->enum('status', ['active', 'moved', 'ended'])->default('active');
            $table->timestamps();

            $table->index(['room_id', 'status']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('occupancies');
    }
};
