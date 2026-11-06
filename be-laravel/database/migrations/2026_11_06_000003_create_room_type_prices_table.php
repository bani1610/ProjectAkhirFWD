<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_type_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('period_months'); // 1, 6, atau 12
            $table->unsignedInteger('price'); // Rupiah (bilangan bulat)
            $table->timestamps();

            $table->unique(['room_type_id', 'period_months']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_type_prices');
    }
};
