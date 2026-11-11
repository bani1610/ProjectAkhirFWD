# KostKuy REST API v1

Kerangka REST API. Semua endpoint berada di bawah `/api/v1`.

- Base URL lokal: `http://localhost:8000/api/v1`
- Zona waktu: `Asia/Jakarta`
- Format uang: bilangan bulat Rupiah (contoh `500000`)

> **Cakupan.** Dokumen ini hanya memuat kerangka API: bentuk respons,
> penanganan error, dan endpoint health check. Endpoint autentikasi dan route
> fitur ditambahkan pada tugas berikutnya sesuai pembagian tugas kelompok.

## Bentuk respons

Semua endpoint memakai bentuk yang sama, baik berhasil maupun gagal.

**Berhasil**

```json
{
  "success": true,
  "message": "API aktif.",
  "data": { }
}
```

**Gagal**

```json
{
  "success": false,
  "message": "Resource tidak ditemukan.",
  "code": "NOT_FOUND"
}
```

`meta` dan `errors` hanya muncul bila relevan. Frontend cukup memeriksa `success`.

### Helper pembentuk respons

| Helper | Kegunaan |
| --- | --- |
| `ApiResponse::success($data, $message)` | Respons berhasil |
| `ApiResponse::error($message, $status, $code, $errors)` | Respons gagal |

### Daftar kode error

| Kode | HTTP | Arti |
| --- | --- | --- |
| `VALIDATION_ERROR` | 422 | Isian tidak lolos validasi. Lihat `errors`. |
| `UNAUTHENTICATED` | 401 | Token tidak ada, salah, atau kedaluwarsa. |
| `FORBIDDEN` | 403 | Tidak berhak atas resource ini. |
| `NOT_FOUND` | 404 | Resource tidak ada. |
| `CONFLICT` | 409 | Bertentangan dengan data saat ini. |
| `UNPROCESSABLE` | 422 | Format sah, melanggar aturan bisnis. |
| `TOO_MANY_REQUESTS` | 429 | Kena rate limit. |
| `SERVER_ERROR` | 500 | Kesalahan server; detail tidak dibocorkan di produksi. |

---

## Health

### GET /ping

Publik. Dipakai untuk health check hosting dan monitoring.

```json
{
  "success": true,
  "message": "API aktif.",
  "data": {
    "app": "KostKuy",
    "api_version": "v1",
    "environment": "local",
    "timezone": "Asia/Jakarta",
    "server_time": "2026-11-12T05:56:33+07:00",
    "queue": { "connection": "database", "pending_jobs": 0, "failed_jobs": 0 }
  }
}
```

---

## Autentikasi (Tugas 3)

Saat ini **belum ada endpoint login**. Untuk pengujian, buat token langsung:

```bash
php artisan tinker
>>> $u = App\Models\User::where('phone', '081311110001')->first();
>>> echo $u->createToken('manual')->plainTextToken;
```

Gunakan token tersebut sebagai header:

```
Authorization: Bearer {token}
```

Di dalam pengujian: `Sanctum::actingAs($user, ['tenant'])`.

---

## Menambah endpoint baru

1. Controller di `app/Http/Controllers/Api/V1/`.
2. Route di `routes/api/v1/`, dimuat dari `routes/api.php`.
3. Balas memakai `ApiResponse` agar bentuknya seragam.
4. Kesalahan yang sudah diketahui: lempar `ApiException`
   (`notFound()`, `forbidden()`, `conflict()`, `unprocessable()`).
   Jangan menyusun respons error manual.
5. Ambil identitas pengguna dari `$request->user()`; jangan menerima `user_id`
   dari parameter request, karena itu jalan masuk kebocoran data antar-penyewa (NFR-02).
