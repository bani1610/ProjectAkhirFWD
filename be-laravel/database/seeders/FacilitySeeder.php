<?php

namespace Database\Seeders;

use App\Models\Facility;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    public function run(): void
    {
        $facilities = [
            Facility::SCOPE_ROOM => ['Kasur', 'Lemari', 'Meja belajar', 'Kursi', 'AC', 'Kipas angin', 'Kamar mandi dalam'],
            Facility::SCOPE_SHARED => ['Dapur', 'WiFi', 'Parkir motor', 'Mesin cuci', 'Ruang jemur'],
        ];

        foreach ($facilities as $scope => $names) {
            foreach ($names as $name) {
                Facility::firstOrCreate(['name' => $name, 'scope' => $scope]);
            }
        }
    }
}
