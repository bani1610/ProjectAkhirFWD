# KostKuy – Backend (Laravel 12)

REST API untuk aplikasi pengelolaan kost KostKuy. Autentikasi memakai Laravel Sanctum, database MySQL, zona waktu Asia/Jakarta.

## Kebutuhan

- PHP 8.4 atau lebih baru (`composer.lock` berisi paket yang butuh PHP 8.4)
- Composer 2
- MySQL 8 (misalnya dari Laragon atau XAMPP)

## Cara menjalankan

```bash
cd be-laravel
composer install
cp .env.example .env
php artisan key:generate
```

Buat database kosong bernama `kostkuy`:

```sql
CREATE DATABASE kostkuy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Sesuaikan `DB_USERNAME` dan `DB_PASSWORD` di `.env` jika MySQL kamu memakai password. Setelah itu:

```bash
php artisan migrate:fresh --seed
php artisan serve
```

API berjalan di `http://localhost:8000/api`.

## Akun demo

Semua akun memakai password `password`.

| Role | Nama | No. HP | Skenario |
| --- | --- | --- | --- |
| Pemilik | Pemilik KostKuy | 081200000001 | Admin |
| Penyewa | Budi Santoso | 081311110001 | Kamar 101, 6 bulanan. Tagihan baru terbit, belum bayar. Keluhan kipas angin 2 kali (label "Sering bermasalah"). |
| Penyewa | Siti Rahmawati | 081311110002 | Kamar 201, bulanan. Bukti transfer menunggu verifikasi. Keluhan AC darurat. |
| Penyewa | Andi Pratama | 081311110003 | Pindah dari 103 ke 102. Pernah ditolak buktinya. Tagihan November terlambat. |
| Penyewa | Dewi Lestari | 081311110004 | Kamar 202, tahunan, lunas. |
| Penyewa | Rina Kartika | 081311110005 | Sudah keluar, akun nonaktif, masih menunggak Juli. |

Data demo hanya dibuat saat `APP_ENV=local` atau `testing`. Di produksi, seeder hanya membuat akun pemilik, pengaturan, tipe kamar, fasilitas, dan kamar.

## Struktur database

Ada 15 tabel sesuai PRD bagian 8:

| Tabel | Model | Isi |
| --- | --- | --- |
| `users` | `User` | Pemilik dan penyewa (login dengan nomor HP) |
| `tenant_profiles` | `TenantProfile` | Pekerjaan dan kontak darurat penyewa |
| `room_types` | `RoomType` | Tipe kamar (AC, Non-AC) |
| `room_type_prices` | `RoomTypePrice` | Harga per tipe untuk periode 1, 6, dan 12 bulan |
| `rooms` | `Room` | Nomor, lantai, tipe, status kamar |
| `facilities` | `Facility` | Master fasilitas, cakupan kamar atau bersama |
| `room_facilities` | `RoomFacility` | Fasilitas per kamar dan kondisi awalnya |
| `occupancies` | `Occupancy` | Riwayat hunian, termasuk pindah kamar dan keluar |
| `invoices` | `Invoice` | Tagihan per periode hunian |
| `payments` | `Payment` | Pembayaran transfer atau tunai, termasuk yang ditolak |
| `complaints` | `Complaint` | Keluhan beserta akar masalah dan biaya |
| `complaint_photos` | `ComplaintPhoto` | Foto keluhan (1–3) |
| `complaint_comments` | `ComplaintComment` | Komentar dua arah |
| `notifications` | `AppNotification` | Notifikasi dalam aplikasi (kolom WA untuk fase 2) |
| `settings` | `Setting` | Nama kost, peraturan, rekening bank |

Tabel lain (`sessions`, `cache`, `jobs`, `personal_access_tokens`, dan sejenisnya) adalah tabel bawaan Laravel dan Sanctum.

### Nilai enum

Nilai enum disimpan dalam bahasa Inggris. Label bahasa Indonesia diatur di frontend.

| Kolom | Nilai | Label |
| --- | --- | --- |
| `rooms.status` | `vacant`, `occupied`, `maintenance` | Kosong, Terisi, Perbaikan |
| `room_facilities.condition_status` | `good`, `fair`, `damaged` | Baik, Kurang baik, Rusak |
| `occupancies.status` | `active`, `moved`, `ended` | Aktif, Pindah, Selesai |
| `occupancies.deposit_status` | `pending`, `received`, `refunded`, `deducted`, `forfeited` | Belum diterima, Diterima, Dikembalikan, Dipotong, Hangus |
| `invoices.status` | `unpaid`, `pending_verification`, `paid`, `overdue`, `cancelled` | Belum bayar, Menunggu verifikasi, Lunas, Terlambat, Batal |
| `payments.status` | `pending`, `approved`, `rejected` | Menunggu, Diterima, Ditolak |
| `complaints.category` | `facility_mismatch`, `damage`, `cleanliness`, `security`, `other` | Fasilitas tidak sesuai, Kerusakan, Kebersihan, Keamanan, Lainnya |
| `complaints.status` | `submitted`, `accepted`, `in_progress`, `resolved`, `confirmed` | Dikirim, Diterima, Diproses, Selesai, Dikonfirmasi |
| `complaints.root_cause_category` | `normal_wear`, `tenant_misuse`, `quality_installation`, `external`, `other` | Usia/pemakaian wajar, Kesalahan pemakaian, Kualitas barang/pemasangan, Faktor eksternal, Lainnya |

### Catatan desain

- Uang disimpan sebagai bilangan bulat Rupiah (`unsignedInteger`).
- Tagihan terhubung ke `occupancies`, bukan ke user, agar riwayat pindah kamar tetap jelas.
- Nominal tagihan disalin dari harga saat tagihan terbit, jadi perubahan harga tidak mengubah tagihan lama.
- `users` punya kolom tambahan `failed_login_attempts` dan `locked_until` untuk aturan kunci akun di F-AUTH-01.
- `occupancies` punya kolom tambahan `note` untuk catatan selisih harga saat pindah kamar (F-TEN-04).
- Path foto di data demo hanya contoh. File aslinya diunggah lewat aplikasi ke disk privat.

## Menjalankan queue dan scheduler

Infrastruktur queue dan scheduler sudah disiapkan pada Tugas 2. Isi tugas
berkalanya (penerbitan tagihan, pengingat, notifikasi) ditambahkan pada tugas
masing-masing, jadi pada tahap ini belum ada jadwal yang berjalan.

### 1. Worker queue

```bash
php artisan queue:work --queue=notifications,default
```

Pekerjaan latar (misalnya pengiriman notifikasi) diarahkan ke queue
`notifications` agar tidak menahan request HTTP. **Worker wajib menyebutkan
queue tersebut**; `queue:work` tanpa `--queue` hanya mendengarkan `default`,
sehingga job bisa menumpuk tanpa diproses. Di produksi jalankan worker di bawah
supervisor (Supervisor atau systemd).

### 2. Scheduler

Tambahkan satu baris cron berikut. Ini satu-satunya entri yang dibutuhkan;
jadwal lain didaftarkan di dalam aplikasi.

```cron
* * * * * cd /path/ke/be-laravel && php artisan schedule:run >> /dev/null 2>&1
```

Zona waktu dan jam acuan sudah disiapkan di `config/kostkuy.php`
(`scheduler.timezone`, `scheduler.daily_at`) dan dapat diubah lewat
`SCHEDULER_TIMEZONE` serta `SCHEDULER_DAILY_AT` di `.env`.

Mendaftarkan jadwal baru cukup menambahkan di `routes/console.php`:

```php
Schedule::command('nama:command')
    ->dailyAt(config('kostkuy.scheduler.daily_at'))
    ->timezone(config('kostkuy.scheduler.timezone'))
    ->withoutOverlapping()
    ->onOneServer();
```

`php artisan schedule:list` menampilkan seluruh jadwal yang terdaftar
(saat ini kosong).

## REST API

Kontrak API ada di [docs/API.md](docs/API.md): bentuk respons, daftar kode
error, dan cara membuat token untuk pengujian.

Pemetaan cakupan pekerjaan dan daftar fitur yang sengaja belum dibuat ada di
[docs/SCOPE.md](docs/SCOPE.md).

Semua endpoint berada di bawah `/api/v1`:

| Method | Endpoint | Akses | Fungsi |
| --- | --- | --- | --- |
| GET | `/ping` | Publik | Health check |

> Route per role (owner/tenant), endpoint autentikasi, dan route fitur
> ditambahkan pada tugas berikutnya sesuai pembagian tugas kelompok.

### Struktur direktori API

```
app/
├── Exceptions/ApiException.php
├── Http/
│   ├── Controllers/Api/V1/    # PingController
│   ├── Middleware/            # ForceJsonResponse
│   └── Responses/ApiResponse.php
routes/
├── api.php                    # pendaftar versi
└── api/v1/health.php
```

### Menambah endpoint baru

1. Buat controller di `app/Http/Controllers/Api/V1/`.
2. Daftarkan route di `routes/api/v1/` lalu muat dari `routes/api.php`.
3. Balas memakai helper `ApiResponse` agar bentuknya seragam.
4. Untuk kesalahan yang sudah diketahui, lempar `ApiException`
   (`notFound()`, `forbidden()`, `conflict()`, `unprocessable()`).
5. Ambil identitas pengguna dari `$request->user()`; jangan menerima `user_id`
   dari parameter request (NFR-02).

### Cara membuat token untuk pengujian

Endpoint login baru ada pada Tugas 3. Sementara itu:

```bash
php artisan tinker
>>> $u = App\Models\User::where('phone', '081311110001')->first();
>>> echo $u->createToken('manual')->plainTextToken;
```

Atau di dalam pengujian gunakan `Sanctum::actingAs($user, ['tenant'])`.

## Pengujian

```bash
php artisan test
```

Cakupan saat ini (23 tes, 59 asersi):

- `tests/Feature/Api/V1/ApiStructureTest` — prefix versi, bentuk respons, error JSON (404, 405, 422, ApiException).
- `tests/Feature/Api/V1/SanctumSetupTest` — token Sanctum, route terlindungi, token dicabut, masa berlaku.
- `tests/Feature/Console/SchedulerTest` — command heartbeat, log, jadwal terdaftar, zona waktu.
- `tests/Feature/Queue/QueueSetupTest` — job masuk tabel `jobs`, diproses worker, tabel pendukung tersedia.

## Alur kerja Git


- `main` hanya berisi kode yang sudah direview.
- Kerjakan fitur di branch sendiri, lalu buat Pull Request ke `main`.
- GitHub Actions (`.github/workflows/backend.yml`) menjalankan migrasi, seeder, rollback, dan tes setiap kali ada perubahan di `be-laravel/`.
