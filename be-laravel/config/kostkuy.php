<?php

/*
|--------------------------------------------------------------------------
| Pengaturan aplikasi KostKuy
|--------------------------------------------------------------------------
|
| Nilai yang dipakai bersama oleh lapisan API, scheduler, dan queue.
| Semua nilai bisa ditimpa lewat .env tanpa mengubah kode.
|
*/

return [

    /*
    | Zona waktu dan jam acuan untuk tugas terjadwal (Laravel Scheduler).
    | PRD bagian 6 menyebut scheduler berjalan setiap hari pukul 07.00 WIB.
    | Aturan bisnis tiap tugas berkala ditambahkan oleh pemilik modulnya.
    */
    'scheduler' => [
        'timezone' => env('SCHEDULER_TIMEZONE', 'Asia/Jakarta'),
        'daily_at' => env('SCHEDULER_DAILY_AT', '07:00'),
    ],

    /*
    | Nama queue terpisah untuk pekerjaan yang tidak boleh menahan request
    | HTTP, misalnya pengiriman notifikasi. Saat ini queue hanya disiapkan;
    | job pertamanya ditambahkan pada tugas notifikasi.
    */
    'queue' => [
        'notification_queue' => env('NOTIFICATION_QUEUE', 'notifications'),
    ],

];
