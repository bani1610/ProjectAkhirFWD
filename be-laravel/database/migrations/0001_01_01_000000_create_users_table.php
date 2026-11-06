<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->enum('role', ['owner', 'tenant'])->default('tenant');
            $table->string('name', 100);
            $table->string('phone', 20)->unique();
            $table->string('password');
            $table->string('photo_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('must_change_password')->default(true);
            $table->timestamp('consented_at')->nullable();
            $table->unsignedTinyInteger('failed_login_attempts')->default(0); // F-AUTH-01
            $table->timestamp('locked_until')->nullable(); // F-AUTH-01
            $table->rememberToken();
            $table->timestamps();
        });

        // Tabel bawaan Laravel untuk SESSION_DRIVER=database (di luar 15 tabel domain)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('users');
    }
};
