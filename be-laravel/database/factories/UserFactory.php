<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'role' => User::ROLE_TENANT,
            'name' => fake()->name(),
            'phone' => '08'.fake()->unique()->numerify('##########'),
            'password' => static::$password ??= Hash::make('password'),
            'is_active' => true,
            'must_change_password' => false,
            'consented_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }

    public function owner(): static
    {
        return $this->state(fn () => ['role' => User::ROLE_OWNER]);
    }

    /** Akun baru buatan pemilik: wajib ganti password dan belum setuju data (F-AUTH-02). */
    public function firstLogin(): static
    {
        return $this->state(fn () => ['must_change_password' => true, 'consented_at' => null]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
