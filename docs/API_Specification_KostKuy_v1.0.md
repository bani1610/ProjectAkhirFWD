# API Specification – KostKuy

| Informasi | Detail |
|---|---|
| Dokumen | API Specification |
| Produk | KostKuy – Aplikasi Pengelolaan Kost |
| Versi | 1.0 |
| Tanggal | 26 November 2026 |
| Status | Draft teknis untuk review |
| Acuan kebutuhan | PRD KostKuy v1.2, SRS KostKuy v2.0 |
| Acuan rancangan | System Design Document KostKuy v1.0 |
| Acuan data | ERD dan Data Dictionary KostKuy v1.0 |
| Backend | Laravel REST API |
| Autentikasi | Laravel Sanctum |
| Database | MySQL |
| Format | JSON; multipart/form-data untuk upload |

> **Kendali konsistensi:** Dokumen ini menerjemahkan rancangan API pada SDD menjadi kontrak yang lebih terperinci. Dokumen ini tidak mengubah ruang lingkup MVP dan tidak menetapkan keputusan bisnis yang masih terbuka pada PRD. Endpoint, payload, dan nama field merupakan rancangan kontrak yang perlu disepakati tim sebelum implementasi.

---

## Riwayat Perubahan

| Versi | Tanggal | Keterangan |
|---|---|---|
| 1.0 | 26 November 2026 | Penyusunan spesifikasi API berdasarkan PRD v1.2, SRS v2.0, SDD v1.0, dan ERD v1.0 |

## 1. Tujuan dan Ruang Lingkup

API KostKuy digunakan oleh React SPA untuk berkomunikasi dengan backend Laravel. Backend menjadi sumber kebenaran untuk autentikasi, otorisasi, validasi, perhitungan tagihan, perubahan status, dan pencatatan histori.

### 1.1 Ruang lingkup MVP

API mencakup:
1. Autentikasi dan pengelolaan akun.
2. Pengaturan informasi kost dan peraturan.
3. Tipe kamar, harga, kamar, dan fasilitas.
4. Data penyewa dan riwayat hunian.
5. Invoice, pemilihan periode, pembayaran transfer manual, dan pembayaran tunai.
6. Deposit sebagai pencatatan transaksi.
7. Keluhan, foto, komentar, dan histori status.
8. Dashboard, laporan dasar, dan ekspor.
9. Notifikasi dalam aplikasi.

### 1.2 Di luar ruang lingkup API MVP

- Payment gateway dan callback pembayaran otomatis.
- Integrasi WhatsApp sebagai kanal notifikasi aktif.
- Booking calon penyewa.
- Multi-properti.
- Pembayaran sebagian.
- Denda otomatis.
- Tagihan utilitas bermeter dan prorata/refund otomatis.
- Aplikasi mobile native.

Fitur di luar MVP tidak boleh ditambahkan sebagai kebutuhan implementasi API v1.0.

## 2. Konvensi API

### 2.1 Base URL

```text
/api/v1
```

Contoh URL lengkap pada lingkungan lokal:

```text
http://localhost:8000/api/v1/auth/login
```

Domain produksi ditentukan pada konfigurasi deployment dan tidak dikunci dalam dokumen ini.

### 2.2 Format komunikasi

- Request dan response standar menggunakan `application/json`.
- Upload bukti pembayaran dan foto keluhan menggunakan `multipart/form-data`.
- Encoding teks menggunakan UTF-8.
- Tanggal menggunakan format `YYYY-MM-DD`.
- Timestamp menggunakan ISO 8601 dengan zona waktu yang konsisten.
- Nilai uang menggunakan integer Rupiah, bukan floating point.
- ID resource menggunakan ID database yang dipublikasikan API; klien tidak boleh mengasumsikan urutan ID.

### 2.3 Format response sukses

Response tunggal:

```json
{
  "data": {
    "id": 15,
    "status": "active"
  },
  "meta": {}
}
```

Response daftar:

```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "last_page": 4,
    "total": 52
  }
}
```

`meta` dapat berisi informasi pagination atau metadata lain yang relevan. Properti yang tidak diperlukan dapat dihilangkan.

### 2.4 Format error

Validasi:

```json
{
  "message": "Data yang diberikan tidak valid.",
  "errors": {
    "phone": [
      "Nomor HP sudah digunakan."
    ]
  }
}
```

Error bisnis:

```json
{
  "message": "Invoice tidak dapat dibatalkan karena pembayaran telah diverifikasi.",
  "code": "INVOICE_CANNOT_BE_CANCELLED"
}
```

Error autentikasi/otorisasi:

```json
{
  "message": "Anda tidak memiliki akses untuk melakukan tindakan ini.",
  "code": "FORBIDDEN"
}
```

### 2.5 HTTP status

| HTTP | Penggunaan |
|---:|---|
| 200 | Request berhasil |
| 201 | Resource berhasil dibuat |
| 204 | Berhasil tanpa response body |
| 400 | Request tidak dapat diproses karena format/parameter tidak sesuai |
| 401 | Belum terautentikasi atau token tidak valid |
| 403 | Tidak memiliki hak akses |
| 404 | Resource tidak ditemukan atau tidak dapat diakses oleh pengguna |
| 409 | Konflik status atau konflik data |
| 422 | Validasi input atau aturan bisnis gagal |
| 429 | Terkena rate limit atau lockout |
| 500 | Kesalahan internal server |

### 2.6 Aturan umum

1. Semua endpoint selain login memerlukan autentikasi, kecuali dinyatakan lain.
2. Otorisasi wajib dilakukan di backend menggunakan middleware dan policy/gate.
3. Penyewa hanya dapat mengakses data hunian, invoice, pembayaran, keluhan, dan notifikasi miliknya.
4. Pemilik dapat mengakses data operasional properti yang dikelolanya.
5. ID yang dikirim klien tidak menjadi bukti kepemilikan resource.
6. Status transaksi tidak boleh diubah melalui endpoint update generik.
7. Perubahan penting harus dilakukan melalui action endpoint khusus dan dicatat dalam histori/audit.
8. Penghapusan data transaksi tidak dilakukan melalui operasi normal; gunakan pembatalan atau koreksi yang tercatat.
9. List endpoint mendukung pagination.
10. Field sensitif seperti password, token, dan path internal file tidak dikembalikan ke klien.

## 3. Autentikasi dan Hak Akses

### 3.1 Mekanisme autentikasi

API menggunakan Laravel Sanctum. Setelah login berhasil, backend mengembalikan token untuk digunakan React SPA sesuai konfigurasi autentikasi aplikasi.

Untuk request yang menggunakan bearer token, klien mengirim:

```http
Authorization: Bearer {token}
Accept: application/json
```

Jika deployment menggunakan Sanctum SPA cookie-based authentication, frontend harus mengikuti mekanisme cookie dan CSRF Sanctum; jangan mencampur kedua mekanisme tanpa konfigurasi yang konsisten.

### 3.2 Role

| Role | Keterangan |
|---|---|
| `owner` | Pemilik yang mengelola satu properti kost |
| `tenant` | Penyewa yang mengakses data dan transaksi miliknya |

### 3.3 Ketentuan autentikasi

- Login menggunakan nomor HP dan password.
- Lima kegagalan login berturut-turut memicu lockout selama 15 menit.
- Pesan login gagal tidak boleh mengungkap apakah nomor HP terdaftar.
- Akun nonaktif tidak dapat login.
- Penyewa yang menggunakan password sementara wajib menggantinya pada login pertama.
- Penyewa harus menyetujui informasi pemrosesan data sebelum mengakses fitur utama.
- Logout mencabut token/sesi autentikasi yang sedang digunakan.
- Reset password penyewa diprakarsai Pemilik.
- OTP tidak menjadi persyaratan MVP kecuali diputuskan stakeholder.

## 4. Daftar Endpoint

Seluruh endpoint di bawah menggunakan prefix `/api/v1`.

### 4.1 Authentication

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| POST | `/auth/login` | Guest | Login nomor HP dan password |
| POST | `/auth/logout` | Auth | Logout |
| GET | `/auth/me` | Auth | Mendapatkan profil pengguna aktif |
| POST | `/auth/change-password` | Auth | Mengubah password sendiri |
| POST | `/owner/tenants` | Owner | Membuat akun penyewa |
| POST | `/owner/tenants/{id}/reset-password` | Owner | Memulai reset password penyewa |
| PATCH | `/owner/tenants/{id}/activation` | Owner | Mengaktifkan/menonaktifkan akun penyewa |

### 4.2 Property Settings

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/owner/settings` | Owner | Melihat informasi dan pengaturan kost |
| PUT | `/owner/settings` | Owner | Memperbarui informasi kost |
| GET | `/owner/settings/rules` | Owner, Tenant | Melihat peraturan kost |
| PUT | `/owner/settings/rules` | Owner | Memperbarui peraturan kost |

### 4.3 Room Management

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/owner/room-types` | Owner | Daftar tipe kamar |
| POST | `/owner/room-types` | Owner | Membuat tipe kamar |
| GET | `/owner/room-types/{id}` | Owner | Detail tipe kamar |
| PUT | `/owner/room-types/{id}` | Owner | Memperbarui tipe kamar |
| GET | `/owner/room-types/{id}/prices` | Owner | Daftar harga tipe kamar |
| PUT | `/owner/room-types/{id}/prices` | Owner | Mengatur harga periode 1, 6, dan 12 bulan |
| GET | `/owner/rooms` | Owner | Daftar kamar |
| POST | `/owner/rooms` | Owner | Membuat kamar |
| GET | `/owner/rooms/{id}` | Owner | Detail kamar |
| PUT | `/owner/rooms/{id}` | Owner | Memperbarui data kamar |
| PATCH | `/owner/rooms/{id}/maintenance` | Owner | Mengubah status perbaikan |
| GET | `/owner/facilities` | Owner | Daftar master fasilitas |
| POST | `/owner/facilities` | Owner | Membuat master fasilitas |
| PUT | `/owner/facilities/{id}` | Owner | Memperbarui master fasilitas |
| GET | `/owner/rooms/{id}/facilities` | Owner | Daftar fasilitas pada kamar |
| PUT | `/owner/rooms/{id}/facilities` | Owner | Mengatur fasilitas kamar |
| POST | `/owner/rooms/{id}/facilities/{facilityId}/condition-histories` | Owner | Mencatat kondisi fasilitas kamar |
| GET | `/owner/shared-facilities` | Owner | Daftar fasilitas bersama |
| POST | `/owner/shared-facilities` | Owner | Membuat fasilitas bersama |
| PUT | `/owner/shared-facilities/{id}` | Owner | Memperbarui fasilitas bersama |
| POST | `/owner/shared-facilities/{id}/condition-histories` | Owner | Mencatat kondisi fasilitas bersama |

### 4.4 Tenant dan Occupancy

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/owner/tenants` | Owner | Daftar penyewa |
| GET | `/owner/tenants/{id}` | Owner | Detail penyewa |
| PUT | `/owner/tenants/{id}` | Owner | Memperbarui data penyewa |
| GET | `/owner/tenants/{id}/history` | Owner | Riwayat hunian penyewa |
| GET | `/owner/occupancies` | Owner | Daftar hunian |
| POST | `/owner/occupancies` | Owner | Menempatkan penyewa ke kamar |
| GET | `/owner/occupancies/{id}` | Owner | Detail hunian |
| POST | `/owner/occupancies/{id}/transfer` | Owner | Memindahkan penyewa ke kamar lain |
| POST | `/owner/occupancies/{id}/end` | Owner | Mengakhiri hunian |
| GET | `/tenant/my-room` | Tenant | Melihat kamar dan hunian sendiri |
| GET | `/tenant/my-occupancy` | Tenant | Melihat detail periode hunian aktif |

### 4.5 Billing dan Payment

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/owner/invoices` | Owner | Daftar seluruh invoice |
| GET | `/owner/invoices/{id}` | Owner | Detail invoice |
| POST | `/owner/invoices/{id}/cancel` | Owner | Membatalkan invoice sesuai aturan |
| POST | `/owner/invoices/{id}/reissue` | Owner | Menerbitkan invoice pengganti |
| GET | `/tenant/invoices` | Tenant | Daftar invoice sendiri |
| GET | `/tenant/invoices/{id}` | Tenant pemilik data | Detail invoice sendiri |
| POST | `/tenant/invoices/{id}/period-selection` | Tenant pemilik data | Memilih periode pembayaran berikutnya |
| POST | `/tenant/invoices/{id}/payments` | Tenant pemilik data | Mengirim percobaan pembayaran dan bukti transfer |
| GET | `/owner/payments/pending` | Owner | Daftar pembayaran menunggu verifikasi |
| GET | `/owner/payments/{id}` | Owner | Detail percobaan pembayaran |
| POST | `/owner/payments/{id}/verify` | Owner | Menerima atau menolak bukti pembayaran |
| POST | `/owner/invoices/{id}/cash-payment` | Owner | Mencatat pembayaran tunai penuh |
| GET | `/tenant/payments/{id}` | Tenant pemilik data | Melihat detail pembayaran sendiri |
| GET | `/tenant/payments/{id}/receipt` | Tenant pemilik data | Mengakses kuitansi pembayaran lunas |

### 4.6 Deposit

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/owner/occupancies/{id}/deposits` | Owner | Melihat transaksi deposit hunian |
| POST | `/owner/occupancies/{id}/deposits` | Owner | Mencatat transaksi deposit |

API deposit hanya menyediakan pencatatan transaksi. Penggunaan deposit untuk tunggakan, pengembalian, atau perhitungan sisa deposit tidak boleh diasumsikan otomatis sebelum keputusan stakeholder ditetapkan.

### 4.7 Complaint

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/owner/complaints` | Owner | Daftar seluruh keluhan |
| GET | `/tenant/complaints` | Tenant | Daftar keluhan sendiri |
| POST | `/tenant/complaints` | Tenant | Membuat keluhan |
| GET | `/complaints/{id}` | Owner / Tenant terkait | Detail keluhan |
| POST | `/complaints/{id}/transition` | Owner / Tenant sesuai status | Menjalankan transisi status yang diizinkan |
| POST | `/complaints/{id}/comments` | Owner / Tenant terkait | Menambahkan komentar |
| POST | `/complaints/{id}/photos` | Owner / Tenant terkait sesuai aturan | Menambahkan foto keluhan |
| GET | `/complaints/{id}/status-histories` | Owner / Tenant terkait | Melihat histori status |

### 4.8 Dashboard, Notifications, Reports

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/owner/dashboard` | Owner | Ringkasan operasional dan keuangan |
| GET | `/owner/reports/payments` | Owner | Laporan pembayaran |
| GET | `/owner/reports/arrears` | Owner | Laporan tunggakan |
| GET | `/owner/reports/repairs` | Owner | Laporan fasilitas/perbaikan |
| GET | `/owner/reports/payments/export` | Owner | Ekspor laporan pembayaran |
| GET | `/owner/reports/arrears/export` | Owner | Ekspor laporan tunggakan |
| GET | `/notifications` | Auth | Daftar notifikasi milik pengguna |
| PATCH | `/notifications/{id}/read` | Pemilik notifikasi | Menandai satu notifikasi dibaca |
| PATCH | `/notifications/read-all` | Auth | Menandai seluruh notifikasi sendiri dibaca |

### 4.9 Endpoint internal Scheduler

Proses terjadwal bukan endpoint publik yang dapat dipanggil React SPA. Laravel Scheduler/Queue menjalankan proses berikut di sisi backend:

- Penerbitan invoice sesuai jadwal H-14.
- Pengingat H-21, H-14, H-7, H-3, H-0.
- Pengingat keterlambatan H+1 dan setiap tiga hari sesuai aturan PRD.
- Konfirmasi otomatis keluhan setelah tiga hari kalender tanpa respons penyewa setelah status Selesai.
- Retry pekerjaan notifikasi yang gagal sesuai konfigurasi queue.

Setiap proses harus idempotent. Endpoint publik untuk memicu proses scheduler tidak disediakan pada API MVP.

## 5. Spesifikasi Request dan Response

Contoh berikut merupakan kontrak payload yang disarankan. Field wajib dan opsional harus diterapkan konsisten pada Form Request Laravel.

### 5.1 Login

`POST /api/v1/auth/login`

Request:

```json
{
  "phone": "081234567890",
  "password": "password-pengguna"
}
```

Response berhasil `200`:

```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Nama Pengguna",
      "phone": "081234567890",
      "role": "tenant",
      "must_change_password": true
    },
    "token": "sanctum-token"
  }
}
```

Catatan:
- Password tidak pernah dikembalikan.
- Pesan gagal login harus generik.
- Properti token mengikuti mekanisme Sanctum yang dipilih pada konfigurasi aplikasi.
- `must_change_password` digunakan untuk mengarahkan alur ganti password pertama kali.

### 5.2 Membuat akun penyewa

`POST /api/v1/owner/tenants`

Request:

```json
{
  "name": "Nama Penyewa",
  "phone": "081234567890",
  "email": "penyewa@example.com",
  "occupation": "Mahasiswa",
  "emergency_contact": {
    "name": "Nama Kontak",
    "relation": "Orang tua",
    "phone": "081234567891"
  }
}
```

Response `201`:

```json
{
  "data": {
    "id": 12,
    "name": "Nama Penyewa",
    "phone": "081234567890",
    "role": "tenant",
    "is_active": true,
    "must_change_password": true
  },
  "meta": {
    "temporary_password_issued": true
  }
}
```

Catatan:
- Nomor HP harus unik.
- Password sementara dibuat oleh backend melalui mekanisme aman.
- Password sementara tidak disimpan dalam bentuk teks biasa.
- Field profil harus disesuaikan dengan kolom final yang disetujui pada ERD.
- Akun penyewa tidak otomatis berarti penyewa telah menempati kamar; penempatan dilakukan melalui endpoint occupancy.

### 5.3 Membuat tipe kamar dan harga

`POST /api/v1/owner/room-types`

Request:

```json
{
  "name": "Standard",
  "description": "Tipe kamar standard",
  "prices": [
    {
      "period_months": 1,
      "amount": 1000000
    },
    {
      "period_months": 6,
      "amount": 5700000
    },
    {
      "period_months": 12,
      "amount": 10800000
    }
  ]
}
```

Ketentuan:
- `period_months` hanya menerima 1, 6, atau 12.
- `amount` harus integer lebih besar dari nol.
- Perubahan harga master tidak mengubah invoice yang sudah diterbitkan.
- Perubahan harga dilakukan melalui endpoint harga tipe kamar, bukan dengan mengubah snapshot invoice.

### 5.4 Membuat kamar

`POST /api/v1/owner/rooms`

Request:

```json
{
  "room_number": "A-01",
  "room_type_id": 2,
  "description": "Kamar lantai satu"
}
```

Ketentuan:
- Nomor kamar unik.
- `room_type_id` harus merujuk tipe kamar yang tersedia.
- Status terisi/kosong diturunkan dari occupancy aktif.
- Status perbaikan disimpan sebagai kondisi terpisah; klien tidak boleh mengirim status ketersediaan hasil perhitungan secara bebas.

### 5.5 Penempatan penyewa

`POST /api/v1/owner/occupancies`

Request:

```json
{
  "tenant_id": 12,
  "room_id": 5,
  "start_date": "2026-12-01",
  "period_months": 1,
  "deposit_amount": 500000
}
```

Response `201`:

```json
{
  "data": {
    "id": 30,
    "tenant_id": 12,
    "room_id": 5,
    "start_date": "2026-12-01",
    "status": "active"
  }
}
```

Ketentuan:
- Backend memastikan akun tenant aktif.
- Backend memastikan kamar dapat ditempati dan tidak memiliki occupancy aktif lain.
- Satu kamar hanya boleh memiliki satu occupancy aktif.
- Pembuatan occupancy, pembaruan kondisi kamar turunan, dan pembuatan invoice pertama (jika aturan tanggal masuk mengharuskannya) harus konsisten dalam transaksi database.
- `user_id`, role, status occupancy, dan nilai hasil kalkulasi tidak boleh dipercaya dari frontend.
- Ketentuan anchor tanggal dan invoice pertama mengikuti aturan PRD/SRS yang telah disepakati.

### 5.6 Pindah kamar

`POST /api/v1/owner/occupancies/{id}/transfer`

Request:

```json
{
  "target_room_id": 8,
  "transfer_date": "2026-12-15",
  "note": "Perpindahan kamar"
}
```

Ketentuan:
- Hanya Pemilik yang dapat melakukan aksi ini.
- Occupancy lama dipertahankan sebagai histori dan ditutup sesuai tanggal efektif.
- Occupancy baru dibuat untuk kamar tujuan.
- Kamar tujuan harus memenuhi syarat ketersediaan.
- Proses menggunakan transaksi database dan locking untuk mencegah dua penempatan bersamaan.
- Prorata, refund, dan penanganan tunggakan saat pindah kamar tetap mengikuti keputusan stakeholder; API tidak menghitungnya otomatis sebelum diputuskan.

### 5.7 Mengakhiri hunian

`POST /api/v1/owner/occupancies/{id}/end`

Request:

```json
{
  "end_date": "2027-01-01",
  "reason": "Masa sewa berakhir"
}
```

Ketentuan:
- Histori occupancy tidak dihapus.
- Invoice dan pembayaran terdahulu tetap tersimpan.
- Perlakuan deposit, sisa sewa, refund, dan tunggakan mengikuti keputusan stakeholder.
- Endpoint tidak boleh menghapus transaksi yang telah terjadi.

### 5.8 Memilih periode pembayaran berikutnya

`POST /api/v1/tenant/invoices/{id}/period-selection`

Request:

```json
{
  "period_months": 6
}
```

Ketentuan:
- Hanya menerima periode 1, 6, atau 12 bulan.
- Pemilihan dilakukan sebelum batas waktu H-15 sesuai aturan bisnis.
- Backend menghitung nominal berdasarkan harga yang berlaku dan aturan periode.
- Frontend tidak mengirim nominal akhir sebagai sumber kebenaran.
- Pemilihan periode tidak boleh mengubah invoice yang sudah diterbitkan.
- Bila aturan bisnis tidak mengizinkan perubahan karena status invoice tertentu, backend mengembalikan `409`.

### 5.9 Upload bukti transfer

`POST /api/v1/tenant/invoices/{id}/payments`

Content-Type: `multipart/form-data`

| Field | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| `amount` | integer | Ya | Nominal pembayaran penuh |
| `paid_at` | datetime | Ya | Waktu transfer |
| `proof` | file | Ya | JPG, PNG, atau PDF sesuai batas upload |

Response `201`:

```json
{
  "data": {
    "id": 91,
    "invoice_id": 45,
    "amount": 1000000,
    "method": "bank_transfer",
    "status": "pending_verification",
    "proof_available": true
  }
}
```

Ketentuan:
- Penyewa hanya dapat mengirim pembayaran untuk invoice miliknya.
- Pembayaran sebagian tidak tersedia.
- Nominal harus sama dengan jumlah yang harus dibayar untuk invoice tersebut.
- Bukti disimpan pada private storage.
- Path internal file tidak ditampilkan.
- Backend membuat payment attempt dan histori status.
- Pengiriman berulang tidak boleh membuat transaksi ganda secara tidak sengaja; frontend dianjurkan menggunakan mekanisme pencegahan double-submit. Jika idempotency key diterapkan, kontraknya harus ditetapkan konsisten oleh backend dan frontend.

### 5.10 Verifikasi pembayaran

`POST /api/v1/owner/payments/{id}/verify`

Request untuk menerima:

```json
{
  "decision": "accept"
}
```

Request untuk menolak:

```json
{
  "decision": "reject",
  "reason": "Nominal pada bukti tidak sesuai dengan tagihan."
}
```

Response `200`:

```json
{
  "data": {
    "id": 91,
    "status": "verified",
    "verified_at": "2026-12-01T10:30:00+07:00"
  }
}
```

Ketentuan:
- `decision` hanya `accept` atau `reject`.
- `reason` wajib jika ditolak.
- Pembayaran hanya dapat diverifikasi oleh Pemilik.
- Backend memastikan payment masih berada pada status yang dapat diverifikasi.
- Jika diterima, invoice diperbarui sesuai state machine dan histori dicatat.
- Pembayaran terverifikasi tidak dapat dihapus melalui operasi normal.
- Aksi verifikasi harus transaksional dan tercatat pada audit log.

### 5.11 Pembayaran tunai

`POST /api/v1/owner/invoices/{id}/cash-payment`

Request:

```json
{
  "amount": 1000000,
  "paid_at": "2026-12-01T10:30:00+07:00",
  "note": "Diterima langsung oleh pemilik"
}
```

Ketentuan:
- Hanya Pemilik yang dapat mencatat pembayaran tunai.
- Pembayaran harus penuh sesuai nilai invoice.
- Backend membuat payment dengan metode `cash` dan status sesuai alur pembayaran lunas.
- Invoice tidak boleh dibayar dua kali.
- Pencatatan dilakukan secara transaksional dan masuk audit log.

### 5.12 Deposit

`POST /api/v1/owner/occupancies/{id}/deposits`

Request:

```json
{
  "transaction_type": "received",
  "amount": 500000,
  "transaction_date": "2026-12-01",
  "note": "Deposit awal"
}
```

Ketentuan:
- Hanya Pemilik yang dapat mencatat transaksi deposit.
- `transaction_type` harus mengikuti enum final pada Data Dictionary.
- Deposit dicatat sebagai transaksi dan tidak mengubah invoice secara otomatis.
- Penggunaan deposit untuk tunggakan atau pengembalian tidak ditentukan oleh endpoint ini.

### 5.13 Membuat keluhan

`POST /api/v1/tenant/complaints`

Request:

```json
{
  "title": "Lampu kamar mati",
  "description": "Lampu utama kamar tidak menyala sejak tadi malam",
  "room_id": 5,
  "facility_id": 3
}
```

Response `201`:

```json
{
  "data": {
    "id": 70,
    "title": "Lampu kamar mati",
    "status": "submitted",
    "created_at": "2026-12-01T08:00:00+07:00"
  }
}
```

Ketentuan:
- Penyewa hanya dapat membuat keluhan terkait hunian yang menjadi hak aksesnya.
- Foto dapat ditambahkan melalui endpoint upload foto.
- Backend menetapkan pembuat, status awal, dan waktu pembuatan.
- Pemilik menerima notifikasi dalam aplikasi.

### 5.14 Upload foto keluhan

`POST /api/v1/complaints/{id}/photos`

Content-Type: `multipart/form-data`

| Field | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| `photos[]` | file | Ya | Foto keluhan sesuai batas dan format yang ditetapkan |

Ketentuan:
- Pengguna harus memiliki akses ke keluhan tersebut.
- File divalidasi tipe MIME, ukuran, dan jumlah.
- File disimpan secara privat.
- Akses file dilakukan melalui endpoint/URL sementara yang memeriksa otorisasi, bukan path storage publik.

### 5.15 Transisi status keluhan

`POST /api/v1/complaints/{id}/transition`

Contoh request untuk mulai menangani:

```json
{
  "action": "start_processing"
}
```

Contoh request untuk menyelesaikan:

```json
{
  "action": "resolve",
  "root_cause_category": "wear_and_tear",
  "root_cause_note": "Komponen telah aus karena pemakaian.",
  "action_taken": "Komponen diganti.",
  "repair_cost": 150000
}
```

Contoh request konfirmasi oleh penyewa:

```json
{
  "action": "confirm"
}
```

Ketentuan:
- Status yang digunakan dalam kebutuhan sistem adalah Dikirim, Diterima, Diproses, Selesai, dan Dikonfirmasi.
- Backend memetakan `action` ke transisi yang sah berdasarkan role dan status saat ini.
- Klien tidak boleh mengirim status arbitrer.
- Penyelesaian keluhan menyimpan akar masalah, tindakan, dan biaya sesuai kebutuhan SRS.
- Keluhan otomatis dikonfirmasi setelah tiga hari kalender tanpa respons Penyewa setelah status Selesai.
- Proses otomatis harus idempotent dan mencatat histori status.

### 5.16 Komentar keluhan

`POST /api/v1/complaints/{id}/comments`

Request:

```json
{
  "comment": "Terima kasih, akan saya cek kembali."
}
```

Ketentuan:
- Hanya Pemilik atau Penyewa terkait yang dapat memberi komentar.
- `user_id` diambil dari token, bukan dari request body.
- Komentar tidak boleh mengubah status kecuali melalui endpoint transition.

### 5.17 Notifikasi

`GET /api/v1/notifications`

Query parameter:
- `page`
- `per_page`
- `read` (opsional)

`PATCH /api/v1/notifications/{id}/read`

`PATCH /api/v1/notifications/read-all`

Ketentuan:
- Pengguna hanya dapat membaca dan mengubah status baca notifikasi miliknya.
- Notifikasi yang sama tidak boleh dibuat ganda untuk event yang sama.
- Notifikasi MVP hanya dalam aplikasi.

## 6. Status dan Transisi Data

Nilai status berikut harus diselaraskan dengan enum/konstanta backend dan Data Dictionary. Label yang ditampilkan di UI dapat diterjemahkan, tetapi nilai internal harus konsisten.

### 6.1 Occupancy

Status yang digunakan pada rancangan sistem:
- `active`
- `ended`
- `transferred` (jika dipertahankan sebagai status histori pada implementasi)

Aturan:
- Satu kamar hanya boleh memiliki satu occupancy aktif.
- Occupancy lama tidak dihapus ketika penyewa pindah atau keluar.
- Status dan tanggal efektif hanya dapat diubah melalui action yang berwenang.

### 6.2 Invoice

Status invoice mengikuti state machine pada SDD dan SRS. Secara umum, API harus membedakan invoice yang menunggu pembayaran, telah dibayar, terlambat, dibatalkan, atau digantikan sesuai enum final yang digunakan pada migration.

Aturan:
- Satu invoice hanya diterbitkan sekali untuk occupancy dan periode yang sama.
- Invoice menyimpan snapshot harga.
- Invoice yang telah dibatalkan tidak diedit untuk mengubah histori; gunakan penerbitan ulang yang memiliki referensi invoice sebelumnya.
- Invoice yang telah memiliki pembayaran terverifikasi tidak dapat dibatalkan melalui alur pembatalan biasa.

### 6.3 Payment

Status pembayaran mengikuti state machine pada SDD dan SRS, minimal membedakan:
- menunggu verifikasi,
- terverifikasi/diterima,
- ditolak.

Jika status tambahan digunakan untuk pembayaran tunai atau pembatalan attempt, nilai tersebut harus ditetapkan konsisten pada ERD, migration, model, dan frontend.

Aturan:
- Tidak ada pembayaran sebagian.
- Percobaan pembayaran tetap disimpan sebagai histori.
- Penolakan menyimpan alasan.
- Pembayaran terverifikasi tidak dihapus.

### 6.4 Complaint

Status yang ditampilkan:
1. Dikirim
2. Diterima
3. Diproses
4. Selesai
5. Dikonfirmasi

Transisi hanya dilakukan melalui endpoint action dan policy yang sesuai. Backend menolak transisi yang tidak sah dengan HTTP `409`.

## 7. Validasi dan Aturan Bisnis Lintas Endpoint

1. Nomor HP akun harus unik.
2. Nomor kamar harus unik.
3. Role hanya `owner` dan `tenant`.
4. Satu kamar hanya boleh memiliki satu occupancy aktif.
5. Harga periode hanya 1, 6, atau 12 bulan.
6. Nominal uang berupa integer Rupiah.
7. Invoice menyimpan snapshot harga saat diterbitkan.
8. Satu invoice tidak boleh terbit ganda untuk occupancy dan periode yang sama.
9. Periode sewa dihitung berdasarkan aturan kalender dan anchor date yang telah disepakati.
10. Invoice periodik diterbitkan pada H-14 melalui Scheduler.
11. Pemilihan periode berikutnya dilakukan paling lambat H-15 sesuai aturan PRD.
12. Pengingat mengikuti jadwal PRD; pengiriman tidak boleh duplikat.
13. Pembayaran harus penuh; pembayaran sebagian ditolak.
14. Bukti transfer dan foto keluhan disimpan privat.
15. Semua aksi yang mengubah status transaksi harus memeriksa status sebelumnya.
16. Operasi penempatan, pindah kamar, penerbitan invoice, dan verifikasi pembayaran menggunakan transaksi database.
17. Gunakan locking saat memeriksa ketersediaan kamar dan mencegah invoice ganda.
18. Histori status pembayaran, keluhan, dan audit dipertahankan.
19. Data milik Penyewa tidak boleh dapat diakses dengan mengganti ID pada URL.
20. Keputusan bisnis terbuka tidak boleh diimplementasikan sebagai aturan final sebelum disetujui.

## 8. Pagination, Filter, dan Sorting

Endpoint daftar menggunakan query parameter berikut jika relevan:

| Parameter | Tipe | Keterangan |
|---|---|---|
| `page` | integer | Halaman yang diminta, default 1 |
| `per_page` | integer | Jumlah data per halaman, dibatasi maksimum oleh backend |
| `search` | string | Pencarian nama/nomor kamar/nomor HP sesuai resource |
| `status` | string | Filter status |
| `from` | date | Tanggal awal filter |
| `to` | date | Tanggal akhir filter |
| `sort_by` | string | Kolom sorting yang diizinkan |
| `sort_direction` | string | `asc` atau `desc` |

Backend harus menggunakan allowlist untuk `sort_by`. Input bebas tidak boleh diteruskan menjadi nama kolom SQL.

Contoh:

```text
GET /api/v1/owner/invoices?page=1&per_page=15&status=unpaid&from=2026-12-01&to=2026-12-31
```

## 9. Upload dan Akses File Privat

### 9.1 Jenis file

- Bukti pembayaran: JPG, PNG, atau PDF.
- Foto keluhan: format gambar yang diizinkan aplikasi.

Batas ukuran dan jumlah file harus mengikuti konfigurasi upload yang disepakati. SDD mencantumkan batas bukti pembayaran maksimal 5 MB.

### 9.2 Ketentuan keamanan

- Validasi dilakukan di backend, bukan hanya frontend.
- Periksa MIME type dan ekstensi.
- Nama file disimpan dengan nama acak/UUID.
- Simpan file di private storage.
- Jangan mengembalikan path filesystem.
- Download/preview harus memeriksa policy resource.
- URL sementara, jika digunakan, memiliki masa berlaku terbatas.
- File tidak boleh dapat diakses hanya dengan menebak URL.

## 10. Keamanan, Audit, dan Konsistensi

### 10.1 Keamanan

- Hash password menggunakan mekanisme hashing Laravel.
- Gunakan HTTPS pada lingkungan produksi.
- Terapkan rate limit pada login dan endpoint sensitif.
- Terapkan middleware autentikasi dan role.
- Terapkan policy untuk kepemilikan resource.
- Validasi semua input di backend.
- Jangan mengembalikan data sensitif yang tidak dibutuhkan.
- Cegah mass assignment dengan validasi dan allowlist field.

### 10.2 Audit log

Aksi berikut harus dicatat:
- Pembuatan/reset/nonaktif akun.
- Perubahan data kamar dan harga.
- Penempatan, pindah, dan pengakhiran occupancy.
- Penerbitan, pembatalan, dan penerbitan ulang invoice.
- Upload, verifikasi, dan penolakan pembayaran.
- Pencatatan pembayaran tunai dan deposit.
- Transisi status keluhan.
- Perubahan pengaturan penting.

Audit log minimal menyimpan aktor, jenis aksi, entitas, ID entitas, waktu, dan metadata perubahan yang aman. Jangan menyimpan password, token, atau isi file privat.

### 10.3 Transaksi database

Gunakan database transaction untuk operasi yang melibatkan beberapa perubahan saling bergantung, khususnya:
- Penempatan penyewa.
- Pindah kamar.
- Pengakhiran hunian jika mengubah beberapa data.
- Penerbitan invoice.
- Verifikasi pembayaran.
- Pencatatan pembayaran tunai.
- Transisi keluhan yang sekaligus mencatat histori.

Gunakan unique constraint dan row locking sebagai lapisan perlindungan tambahan, bukan hanya validasi frontend.

## 11. Pemetaan Endpoint ke Modul Backend

| Modul Laravel | Tanggung jawab |
|---|---|
| Authentication | Login, logout, profil aktif, password, token |
| Property Settings | Informasi kost, rekening, peraturan |
| Room Management | Tipe kamar, harga, kamar, fasilitas |
| Tenant Management | Akun dan profil penyewa |
| Occupancy Management | Penempatan, pindah, keluar, histori |
| Billing | Periode sewa, invoice, penerbitan, pembatalan |
| Payment | Transfer manual, verifikasi, tunai, kuitansi |
| Deposit | Pencatatan transaksi deposit |
| Complaint | Keluhan, foto, komentar, transisi, histori |
| Notification | Notifikasi dalam aplikasi dan status baca |
| Dashboard & Reporting | Ringkasan, laporan, ekspor |
| Audit | Pencatatan aktivitas penting |

Controller bertugas menerima request dan mengembalikan response. Aturan bisnis ditempatkan pada service/action class sesuai pola modular monolith pada SDD. Validasi request ditempatkan pada Form Request, sedangkan pembatasan akses ditempatkan pada middleware dan policy.

## 12. Ketertelusuran ke Dokumen Acuan

| Kelompok API | Acuan SRS | Acuan ERD |
|---|---|---|
| Authentication | SRS-FR-AUTH-01 s.d. SRS-FR-AUTH-06 | `users`, `tenant_profiles` |
| Property & Room | SRS-FR-MST-01 s.d. SRS-FR-MST-07 | `settings`, `room_types`, `room_type_prices`, `rooms`, `facilities`, `room_facilities`, tabel histori fasilitas |
| Tenant & Occupancy | SRS-FR-TEN-01 s.d. SRS-FR-TEN-06 | `users`, `tenant_profiles`, `occupancies` |
| Billing & Payment | SRS-FR-BILL-01 s.d. SRS-FR-BILL-11 | `occupancies`, `invoices`, `payments`, `payment_status_histories` |
| Deposit | SRS-FR terkait pengelolaan deposit dan aturan bisnis | `deposit_transactions` |
| Complaint | SRS-FR-CMP-01 s.d. SRS-FR-CMP-07 | `complaints`, `complaint_photos`, `complaint_comments`, `complaint_status_histories` |
| Dashboard & Report | SRS-FR-DASH-01 s.d. SRS-FR-DASH-04 | Data transaksi, occupancy, fasilitas, dan keluhan |
| Notification | SRS-FR-NOTIF-01 s.d. SRS-FR-NOTIF-03 | `notifications`, `notification_logs` |
| Audit | NFR keamanan, integritas, dan traceability | `audit_logs` |

## 13. Keputusan Terbuka yang Tidak Dikunci oleh API

Hal berikut tetap harus diputuskan stakeholder sebagaimana tercantum pada PRD/SRS:
1. Apakah penyewa dengan tunggakan boleh memperpanjang sewa.
2. Apakah pindah kamar diperbolehkan saat ada tunggakan.
3. Perhitungan sisa sewa dan deposit jika penyewa keluar sebelum periode berakhir.
4. Apakah deposit dapat digunakan untuk membayar tunggakan.
5. Apakah satu kamar dapat dihuni lebih dari satu orang.
6. Prosedur perubahan invoice yang telah diterbitkan selain pembatalan dan penerbitan ulang.
7. Konfirmasi tanggal masuk sebagai anchor siklus tagihan.
8. Rekening tujuan transfer untuk MVP.
9. Lama retensi data pribadi setelah penyewa keluar.
10. Prosedur verifikasi perubahan nomor HP penyewa.

Jika keputusan tersebut berubah, endpoint, payload, validasi, migration, dan test case yang terdampak harus diperbarui bersama-sama.

## 14. Checklist Review API

- [ ] Semua endpoint sesuai scope MVP PRD v1.2.
- [ ] Semua kebutuhan fungsional SRS v2.0 memiliki endpoint atau proses backend yang jelas.
- [ ] Nama tabel dan relasi mengacu pada ERD/Data Dictionary v1.0.
- [ ] Hak akses Pemilik dan Penyewa diterapkan di backend.
- [ ] Penyewa hanya dapat mengakses resource miliknya.
- [ ] Status transaksi hanya berubah melalui action endpoint yang sah.
- [ ] Upload menggunakan private storage.
- [ ] Scheduler tidak diekspos sebagai endpoint publik.
- [ ] Invoice dan pembayaran terlindungi dari duplikasi.
- [ ] Operasi kritis menggunakan transaksi database.
- [ ] Keputusan bisnis terbuka belum dikunci sebagai aturan final.
- [ ] Tim frontend dan backend menyepakati kontrak request/response sebelum implementasi.

## 15. Catatan Penutup

API Specification KostKuy v1.0 menjadi acuan kontrak komunikasi React SPA dan Laravel REST API. Dokumen ini masih berstatus draft teknis untuk review. Sebelum coding paralel, tim perlu menyepakati nama field final, enum status yang persis sama dengan migration, batas upload, format autentikasi Sanctum, serta detail response setiap endpoint.

Perubahan pada PRD, SRS, SDD, atau ERD harus ditelusuri ke dokumen API dan test case agar tidak terjadi perbedaan perilaku antara kebutuhan, database, backend, dan frontend.
