# KostKuy

Aplikasi pengelolaan kost. Repo ini berisi dua bagian:

| Folder | Isi |
|---|---|
| [`be-laravel/`](be-laravel/) | REST API (Laravel 12, MySQL, Sanctum) |
| [`fe-react/`](fe-react/) | Frontend (React + Vite + Tailwind CSS v4) |
| [`docs/`](docs/) | PRD, SRS, dan dokumen desain sistem |

## Kebutuhan

- PHP 8.4+, Composer 2, MySQL 8 (Laragon/XAMPP)
- Node.js 22+
- pnpm. Aktifkan sekali saja lewat Corepack (sudah ikut Node):

  ```bash
  corepack enable
  ```

  Frontend **wajib pakai pnpm**, jangan `npm install`. Kalau sampai muncul `package-lock.json`, hapus saja.

## Setup pertama kali

**1. Backend.** Ikuti [be-laravel/README.md](be-laravel/README.md). Ringkasnya:

```bash
cd be-laravel
composer install
cp .env.example .env
php artisan key:generate
# buat database kosong "kostkuy" di MySQL, lalu:
php artisan migrate:fresh --seed
```

**2. Frontend**

```bash
cd fe-react
pnpm install
```

## Menjalankan saat develop

Dari **root repo**:

```bash
pnpm dev
```

Perintah ini menjalankan Laravel (http://localhost:8000) dan Vite (http://localhost:5173) bersamaan. Buka **http://localhost:5173**. Ctrl+C mematikan keduanya.

| Perintah (dari root) | Fungsi |
|---|---|
| `pnpm dev` | Backend + frontend sekaligus |
| `pnpm dev:api` | Backend saja |
| `pnpm dev:web` | Frontend saja |
| `pnpm build` | Build frontend ke `fe-react/dist` |

## Cara frontend memanggil API

Saat develop, semua request ke `/api/...` dari frontend diteruskan Vite ke Laravel `http://localhost:8000` (lihat `proxy` di [fe-react/vite.config.js](fe-react/vite.config.js)), jadi tidak perlu mengatur CORS.

Pakai client yang sudah ada di [fe-react/src/lib/api.js](fe-react/src/lib/api.js):

```js
import { api } from '../lib/api'

const res = await api.get('/rooms')   // = GET /api/v1/rooms
const rooms = res.data.data           // format respons: { success, message, data, meta? }
```

## Struktur frontend

```
fe-react/src/
├── lib/api.js            axios ke /api/v1
├── landing/              landing page (route "/")
│   ├── Landing.jsx       ambil data API + susun semua section
│   ├── Hero.jsx          navbar, hero, angka statistik
│   ├── Rooms.jsx         daftar kamar kosong + tipe & harga
│   ├── Sections.jsx      fasilitas, galeri, fitur, langkah, aturan/FAQ, lokasi, CTA, footer
│   ├── content.js        teks statis: WA, alamat, FAQ, aturan, foto, helper rupiah
│   └── ui.jsx            komponen kecil: SectionHeading, Toggle, Accordion
├── App.jsx               routing (react-router-dom)
└── index.css             Tailwind + warna tema (brand, cream, accent)
```

- **Ganti nomor WA, alamat, FAQ, atau aturan kost**: cukup edit `src/landing/content.js`.
- **Data kamar, harga, dan fasilitas** diambil dari API (`/rooms`, `/room-types`, `/facilities`), jadi ikut berubah kalau data di database berubah.
- **Warna tema** ada di `@theme` pada `src/index.css`; pakai class seperti `bg-brand-700`, `text-accent`, `bg-cream`.
- **Ikon** pakai [lucide-react](https://lucide.dev/icons): `import { Wifi } from 'lucide-react'`.
- **Halaman baru**: buat komponen, lalu daftarkan `<Route>`-nya di `App.jsx`.

## Masalah umum

- **`@import: command not found`**: `@import "tailwindcss";` adalah isi file CSS, bukan perintah terminal.
- **Halaman menampilkan "Gagal memuat data..."**: backend belum jalan atau database belum di-seed. Jalankan `pnpm dev` dari root dan `php artisan migrate:fresh --seed` di `be-laravel`.
- **Port 8000/5173 sudah dipakai**: matikan server lama (terminal lain) lalu jalankan lagi.
