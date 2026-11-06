<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $ac = RoomType::where('name', 'AC')->firstOrFail();
        $nonAc = RoomType::where('name', 'Non-AC')->firstOrFail();

        // 10 kamar: lantai 1 Non-AC, lantai 2 AC. Kamar 205 sedang diperbaiki.
        $rooms = [
            ['101', 1, $nonAc], ['102', 1, $nonAc], ['103', 1, $nonAc], ['104', 1, $nonAc], ['105', 1, $nonAc],
            ['201', 2, $ac], ['202', 2, $ac], ['203', 2, $ac], ['204', 2, $ac], ['205', 2, $ac],
        ];

        $common = ['Kasur', 'Lemari', 'Meja belajar', 'Kursi', 'Kamar mandi dalam'];
        $facilityIds = Facility::where('scope', Facility::SCOPE_ROOM)->pluck('id', 'name');

        foreach ($rooms as [$number, $floor, $type]) {
            $room = Room::firstOrCreate(
                ['number' => $number],
                [
                    'floor' => $floor,
                    'room_type_id' => $type->id,
                    'status' => $number === '205' ? Room::STATUS_MAINTENANCE : Room::STATUS_VACANT,
                ]
            );

            $names = [...$common, $type->name === 'AC' ? 'AC' : 'Kipas angin'];

            foreach ($names as $name) {
                // Foto kondisi awal diunggah pemilik lewat aplikasi (F-ROOM-04).
                $room->roomFacilities()->firstOrCreate(
                    ['facility_id' => $facilityIds[$name]],
                    [
                        'condition_status' => 'good',
                        'note' => 'Kondisi awal saat pendataan.',
                        'recorded_at' => now()->startOfYear(),
                    ]
                );
            }
        }

        // Contoh kondisi awal yang tidak sempurna.
        Room::where('number', '104')->first()->roomFacilities()
            ->where('facility_id', $facilityIds['Lemari'])
            ->update(['condition_status' => 'fair', 'note' => 'Engsel pintu kanan agak longgar.']);

        Room::where('number', '205')->first()->roomFacilities()
            ->where('facility_id', $facilityIds['AC'])
            ->update(['condition_status' => 'damaged', 'note' => 'AC tidak dingin, menunggu servis.']);
    }
}
