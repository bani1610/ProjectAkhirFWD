<?php

namespace Database\Seeders;

use App\Models\RoomType;
use Illuminate\Database\Seeder;

class RoomTypeSeeder extends Seeder
{
    public function run(): void
    {
        // Harga contoh (keputusan sementara #2): ditentukan ulang oleh pemilik.
        $types = [
            'AC' => [
                'description' => 'Kamar 3x4 m dengan AC, kamar mandi dalam.',
                'prices' => [1 => 1_500_000, 6 => 8_400_000, 12 => 16_200_000],
            ],
            'Non-AC' => [
                'description' => 'Kamar 3x3 m dengan kipas angin, kamar mandi dalam.',
                'prices' => [1 => 1_000_000, 6 => 5_700_000, 12 => 11_000_000],
            ],
        ];

        foreach ($types as $name => $data) {
            $type = RoomType::updateOrCreate(['name' => $name], ['description' => $data['description']]);

            foreach ($data['prices'] as $months => $price) {
                $type->prices()->updateOrCreate(['period_months' => $months], ['price' => $price]);
            }
        }
    }
}
