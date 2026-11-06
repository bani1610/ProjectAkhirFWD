<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Data master: dibutuhkan di semua environment.
        $this->call([
            OwnerSeeder::class,
            SettingSeeder::class,
            RoomTypeSeeder::class,
            FacilitySeeder::class,
            RoomSeeder::class,
        ]);

        // Data demo: hanya untuk local/testing, jangan masuk ke server produksi.
        if (app()->environment(['local', 'testing'])) {
            $this->call([
                DemoTenantSeeder::class,
                DemoComplaintSeeder::class,
            ]);
        }
    }
}
