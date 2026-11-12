<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| REST API KostKuy (v1)
|--------------------------------------------------------------------------
|
| Semua endpoint berada di bawah prefix /api/v1.
| Setiap versi punya direktori route sendiri agar perubahan besar (v2) bisa
| hidup berdampingan tanpa memutus aplikasi yang sudah berjalan.
|
| Route per role (owner/tenant) ditambahkan bersama middleware role pada
| Tugas 3. Route fitur (kamar, tagihan, keluhan) menyusul di tugas berikutnya.
|
*/

Route::prefix('v1')->name('v1.')->group(function (): void {
    require __DIR__.'/api/v1/health.php';
});
