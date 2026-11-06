<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $rules = <<<'TXT'
1. Jam malam pukul 23.00 WIB. Tamu wajib lapor ke pemilik.
2. Tamu lawan jenis dilarang masuk kamar.
3. Dilarang merokok di dalam kamar.
4. Jaga kebersihan dapur dan kamar mandi bersama setelah dipakai.
5. Matikan AC, lampu, dan peralatan listrik saat meninggalkan kamar.
6. Pembayaran sewa paling lambat pada tanggal jatuh tempo.
7. Kerusakan fasilitas segera dilaporkan lewat menu Keluhan.
TXT;

        $settings = [
            'kost_name' => 'Kost KostKuy',
            'kost_address' => 'Jl. Margonda Raya No. 100, Depok, Jawa Barat',
            'kost_rules' => $rules,
            'bank_name' => 'BCA',
            'bank_account_number' => '1234567890',
            'bank_account_name' => 'Pemilik KostKuy',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['setting_key' => $key], ['setting_value' => $value]);
        }
    }
}
