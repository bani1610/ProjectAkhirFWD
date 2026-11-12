# Cakupan Pekerjaan — Tugas 2

> **Shapiere Januar Rafiansyah**
> Tugas 2 — *"Setup Laravel (Sanctum, Scheduler, Queue) dan struktur REST API"*
> Sumber: `Hasil_Progress_Final_Project_Kelompok_12.xlsx`, sel TUGAS 2.

Branch ini **hanya** berisi pekerjaan Tugas 2. Tidak ada fitur dari Tugas 3–8.

## 1. Yang dikerjakan

| Komponen | Berkas | Bagian dari Tugas 2 |
| --- | --- | --- |
| Struktur REST API berversi | `routes/api.php`, `routes/api/v1/health.php` | "struktur REST API" |
| Bentuk respons seragam | `app/Http/Responses/ApiResponse.php` | "struktur REST API" |
| Penanganan error terpusat | `app/Exceptions/ApiException.php`, `bootstrap/app.php` | "struktur REST API" |
| Pemaksa balasan JSON | `app/Http/Middleware/ForceJsonResponse.php` | "struktur REST API" |
| Endpoint health check | `app/Http/Controllers/Api/V1/PingController.php` | "struktur REST API" |
| **Sanctum** terpasang & teruji | `config/sanctum.php`, `tests/Feature/Api/V1/SanctumSetupTest.php` | "Sanctum" |
| **Scheduler** aktif | `routes/console.php`, `app/Console/Commands/Heartbeat.php` | "Scheduler" |
| **Queue** aktif | `config/kostkuy.php`, koneksi `database` | "Queue" |
| Konfigurasi terpusat | `config/kostkuy.php`, `.env.example` | "Scheduler" & "Queue" |
| Dokumentasi | `README.md`, `docs/API.md`, `docs/SCOPE.md` | — |
| Pengujian | `tests/**` (23 tes) | — |

### Scheduler

Scheduler sudah berjalan setiap hari pada jam yang diatur di `config/kostkuy.php`
(bawaan **07.00 Asia/Jakarta**, sesuai PRD bagian 6), dengan
`withoutOverlapping()` dan `onOneServer()`.

Satu-satunya jadwal saat ini adalah `kostkuy:heartbeat`, yaitu **bukti bahwa
penjadwalan benar-benar berjalan**. Command ini tidak memuat aturan bisnis.

Aturan bisnis tagihan (H-21, H-14, H-7/H-3/H-0, keterlambatan) **tidak
diimplementasikan di sini** karena berada pada Tugas 6 dan Tugas 7.

### Queue

Koneksi queue `database` aktif dan tabel `jobs`, `job_batches`, `failed_jobs`
sudah tersedia. Nama queue `notifications` disiapkan di `config/kostkuy.php`.

Belum ada job nyata yang dikirim ke queue, karena job pertama (notifikasi)
milik Tugas 7. Jalur queue diuji memakai job contoh di `tests/Fixtures/`
yang tidak pernah dipakai aplikasi.

### Sanctum

Paket `laravel/sanctum` sudah terpasang, trait `HasApiTokens` ada di model
`User`, tabel `personal_access_tokens` sudah dimigrasi, dan masa berlaku token
diatur lewat `SANCTUM_EXPIRATION_MINUTES` (bawaan 7 hari).

**Endpoint login tidak dibuat**, karena berada pada Tugas 3.

## 2. Yang SENGAJA TIDAK dibuat

| Fitur | Kebutuhan | Pemilik | Tugas |
| --- | --- | --- | --- |
| Endpoint login/logout, kunci 5× gagal, reset password, akun nonaktif | F-AUTH-01, 03, 04 | **Latif Wibowo** | **Tugas 3** |
| Middleware role owner/tenant | — | **Shapiere** | **Tugas 3** |
| Middleware wajib-ganti-password & persetujuan data | F-AUTH-02 | **Latif / Faisa** | **Tugas 3** |
| Route per role (owner/tenant) | — | **Shapiere** | **Tugas 3** |
| CRUD kamar, tipe kamar, harga, fasilitas | F-ROOM-01…03 | **Latif Wibowo** | Tugas 4 |
| Unggah & kompresi foto, signed URL | NFR-05 | **Shapiere** | Tugas 4 |
| Tempatkan / pindah / keluar penyewa | F-TEN-01…06 | **Latif Wibowo** | Tugas 5 |
| Penerbitan tagihan pertama saat penempatan | F-TEN-03 | **Shapiere** | Tugas 5 |
| Rumus periode, scheduler tagihan H-14, status Terlambat | F-BILL-01, 09 | **Shapiere** | **Tugas 6** |
| Pembatalan & penerbitan ulang tagihan | F-BILL-09 | **Latif Wibowo** | Tugas 6 |
| Unggah bukti transfer, verifikasi, pembayaran tunai | F-BILL-04…06 | **Shapiere / Sabian** | Tugas 6 |
| Kuitansi PDF | F-BILL-08 | **Shapiere** | Tugas 6 |
| Notifikasi dalam aplikasi & jadwal pengingat (H-21, H-7/3/0) | F-NOTIF-01 | **Shapiere** | **Tugas 7** |
| API keluhan, komentar, akar masalah, konfirmasi otomatis | F-CMP-01…07 | **Latif Wibowo** | Tugas 7 |
| Dashboard, penunggak, pola masalah, ekspor Excel | F-DASH-01…04 | **Shapiere** | Tugas 8 |
| UAT, uji akses per endpoint, deploy | — | **Sholahuddin Robbani** | Tugas 8 |
| Seluruh halaman frontend | — | **Faisa / Sabian** | Tugas 2 dst. |

Selain itu, **tidak ada perubahan pada migrasi, model, seeder, dan
`composer.json`**. Skema 15 tabel milik Robbani dibiarkan apa adanya.

## 3. Titik sambung untuk tugas berikutnya

Fondasi sudah siap; tugas berikutnya tinggal menempel tanpa mengubahnya.

| Tugas | Yang tinggal ditambahkan | Di mana |
| --- | --- | --- |
| Tugas 3 | Route + controller autentikasi | `routes/api/v1/` + `app/Http/Controllers/Api/V1/` |
| Tugas 3 | Alias middleware `role`, `active`, `password.changed` | `bootstrap/app.php` bagian `withMiddleware()` |
| Tugas 3 | Route per role | `routes/api/v1/owner.php`, `tenant.php`, dimuat dari `routes/api.php` |
| Tugas 6/7 | Command terjadwal | `app/Console/Commands/` |
| Tugas 6/7 | Pendaftaran jadwal | `routes/console.php` (contoh pola sudah ada di komentar) |
| Tugas 7 | Job notifikasi | `app/Jobs/`, kirim ke queue `config('kostkuy.queue.notification_queue')` |

Contoh mendaftarkan jadwal baru:

```php
Schedule::command('nama:command')
    ->dailyAt(config('kostkuy.scheduler.daily_at'))
    ->timezone(config('kostkuy.scheduler.timezone'))
    ->withoutOverlapping()
    ->onOneServer();
```

## 4. Keputusan tambahan di luar PRD

| Keputusan | Nilai default | Alasan |
| --- | --- | --- |
| Masa berlaku token Sanctum | 7 hari (`SANCTUM_EXPIRATION_MINUTES`) | PRD tidak menyebut; token abadi lebih berisiko |
| Nama queue notifikasi | `notifications` | Memisahkan pekerjaan lambat dari request HTTP |
| Endpoint `/ping` | publik | Health check untuk deploy Sprint 4 |

## 5. Konsistensi

- Tanpa perubahan skema 15 tabel.
- Enum mengikuti README tim.
- Uang bilangan bulat Rupiah dan zona waktu `Asia/Jakarta` sesuai PRD bagian 9.
- `config/app.php` sudah memakai `APP_TIMEZONE=Asia/Jakarta`.
