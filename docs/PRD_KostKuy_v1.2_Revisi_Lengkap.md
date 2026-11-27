# Product Requirements Document (PRD)
# KostKuy – Aplikasi Pengelolaan Kost

| Informasi | Detail |
|---|---|
| Versi | 1.2 |
| Tanggal revisi | 23 November 2026 |
| Status | Draft revisi – perlu validasi stakeholder sebelum development penuh |
| Proyek | Final Project Kelompok 12 – FWD |
| Produk | KostKuy |
| Platform | Web responsif |
| Target MVP | 4 minggu (dengan pengurangan scope sesuai prioritas) |
| Pengguna utama | Pemilik kost dan penyewa |
| Arsitektur awal | Laravel REST API, React SPA, MySQL |

> **Catatan status dokumen:** PRD ini merupakan penyempurnaan dari PRD KostKuy versi 1.1. Aturan yang berasal dari kebutuhan awal dipertahankan sejauh tidak menimbulkan konflik. Rekomendasi baru yang belum dikonfirmasi pemilik kost ditandai sebagai **Usulan** atau **Perlu keputusan stakeholder**. Tim tidak boleh menganggap keputusan yang masih terbuka sebagai aturan final tanpa persetujuan.

---

## Riwayat Perubahan

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | – | Draft awal kebutuhan KostKuy |
| 1.1 | 5 November 2026 | Penambahan kebutuhan fungsional, aturan tagihan, model data, NFR, dan milestone |
| 1.2 | 23 November 2026 | Penajaman business rules, penanganan kondisi khusus, histori transaksi, fasilitas bersama, keamanan, acceptance criteria, pengujian, dan rencana delivery |

## Daftar Isi

1. Ringkasan Produk
2. Latar Belakang dan Permasalahan
3. Visi, Tujuan, dan Metrik Keberhasilan
4. Stakeholder dan Pengguna
5. Ruang Lingkup Produk
6. Asumsi, Batasan, dan Keputusan Terbuka
7. User Journey dan Alur Utama
8. Kebutuhan Fungsional
9. Aturan Bisnis
10. Model Data Konseptual
11. Kebutuhan Non-Fungsional
12. Integrasi dan Arsitektur Teknis
13. Prioritas dan Backlog MVP
14. Rencana Sprint dan Pembagian Tanggung Jawab
15. Acceptance Criteria dan Definition of Done
16. Strategi Pengujian dan UAT
17. Risiko dan Mitigasi
18. Rencana Deployment, Backup, dan Pemulihan
19. Kriteria Rilis MVP
20. Lampiran: Glosarium

---

# 1. Ringkasan Produk

KostKuy adalah aplikasi web responsif untuk membantu satu pemilik mengelola satu properti kost. Aplikasi memusatkan pengelolaan kamar, data penyewa, masa hunian, tagihan, pembayaran, notifikasi, dan keluhan dalam satu sistem.

Pemilik dapat mengelola kamar dan fasilitas, membuat akun penyewa, menempatkan atau memindahkan penyewa, menerbitkan serta memverifikasi tagihan, mencatat pembayaran tunai, menangani keluhan, dan melihat ringkasan operasional maupun keuangan.

Penyewa dapat melihat informasi kamar dan fasilitas yang ditempati, melihat masa sewa dan tagihan, memilih periode pembayaran berikutnya, mengunggah bukti transfer, serta membuat dan memantau keluhan.

MVP menggunakan pembayaran manual melalui transfer bank dan tunai. Notifikasi MVP dikirim di dalam aplikasi. Integrasi payment gateway, WhatsApp, booking calon penyewa, dan pengelolaan banyak properti tidak termasuk MVP.

## 1.1 Nilai Produk

- **Bagi pemilik:** mengurangi pencatatan manual, memudahkan pemantauan tagihan dan tunggakan, serta menyediakan riwayat keluhan dan biaya perbaikan.
- **Bagi penyewa:** memberikan akses mandiri terhadap informasi kamar, tagihan, status pembayaran, dan perkembangan keluhan.
- **Bagi operasional kost:** menyediakan satu sumber data untuk kamar, hunian, transaksi, dan keluhan.

## 1.2 Prinsip Produk

1. Data transaksi dan perubahan penting harus dapat ditelusuri.
2. Penyewa hanya dapat mengakses data miliknya sendiri.
3. Tagihan yang telah diterbitkan tidak berubah ketika harga kamar diperbarui.
4. Riwayat hunian harus tetap tersedia ketika penyewa pindah kamar atau keluar.
5. Proses utama harus dapat berjalan tanpa payment gateway dan WhatsApp.
6. Fitur MVP diprioritaskan berdasarkan kelengkapan alur bisnis, bukan jumlah halaman.

---

# 2. Latar Belakang dan Permasalahan

## 2.1 Kondisi Saat Ini

Pengelolaan kost masih dilakukan secara manual. Kondisi tersebut menimbulkan beberapa masalah:

- Status pembayaran dan tunggakan sulit dipantau.
- Pengingat tagihan bergantung pada ingatan pemilik.
- Data kamar dan penyewa tersebar.
- Keluhan disampaikan melalui percakapan yang tidak memiliki riwayat terstruktur.
- Riwayat kerusakan fasilitas dan biaya perbaikan sulit ditelusuri.
- Rekap pemasukan dan biaya membutuhkan waktu.

## 2.2 Pernyataan Masalah

Pemilik kost membutuhkan sistem terpusat untuk mengelola kamar, penyewa, tagihan, pembayaran, dan keluhan. Penyewa membutuhkan akses yang mudah untuk mengetahui informasi hunian, memenuhi pembayaran, dan melaporkan masalah.

## 2.3 Peluang

KostKuy berpeluang menjadi alat operasional sederhana untuk satu properti kost, dengan fokus pada proses administrasi rutin dan transparansi informasi bagi penyewa.

---

# 3. Visi, Tujuan, dan Metrik Keberhasilan

## 3.1 Visi

Menyediakan sistem pengelolaan kost yang sederhana, terstruktur, dan dapat dipercaya oleh pemilik maupun penyewa.

## 3.2 Tujuan Produk

1. Seluruh data kamar, penyewa, hunian, tagihan, pembayaran, dan keluhan tercatat dalam satu sistem.
2. Pengingat tagihan dibuat otomatis sesuai jadwal.
3. Pemilik dapat memverifikasi pembayaran dan memantau tunggakan.
4. Keluhan memiliki status, dokumentasi, tindakan, dan biaya penyelesaian.
5. Pemilik dapat membuat rekap operasional dan keuangan dengan lebih cepat.

## 3.3 Metrik Keberhasilan

Metrik dievaluasi setelah dua bulan penggunaan. Baseline perlu dicatat sebelum atau saat aplikasi mulai digunakan.

| Metrik | Target awal | Definisi pengukuran |
|---|---:|---|
| Tagihan aktif tercatat di sistem | 100% | Seluruh tagihan yang seharusnya diterbitkan untuk hunian aktif tercatat |
| Tagihan terjadwal berhasil diproses | 100% | Tagihan yang memenuhi syarat berhasil dibuat; kegagalan dicatat dan dapat ditindaklanjuti |
| Notifikasi aplikasi diproses sesuai jadwal | ≥99% | Notifikasi yang dibuat sistem dibandingkan notifikasi yang seharusnya dibuat |
| Respons awal keluhan biasa | <24 jam | Selisih waktu keluhan dikirim sampai pemilik mengubah status menjadi Diterima |
| Respons awal keluhan darurat | Usulan: ≤1 jam | Target perlu disetujui pemilik kost dan hanya berlaku selama layanan operasional tersedia |
| Waktu rekap keuangan bulanan | <15 menit | Waktu yang dibutuhkan pemilik menghasilkan rekap dari aplikasi |
| Kesalahan akses data antarpenyewa | 0 kasus | Hasil pengujian otorisasi dan pemantauan insiden |
| Rekonsiliasi laporan pembayaran | 100% sesuai | Total laporan sesuai transaksi pembayaran yang tercatat pada periode yang sama |
| Jumlah tagihan terlambat | Menurun | Dibandingkan baseline sebelum aplikasi digunakan |

**Catatan:** Target notifikasi di MVP mengukur proses notifikasi dalam aplikasi, bukan keterlihatan notifikasi pada perangkat atau pengiriman WhatsApp.

---

# 4. Stakeholder dan Pengguna

## 4.1 Stakeholder

| Stakeholder | Tanggung jawab |
|---|---|
| Pemilik kost | Pemilik keputusan operasional, aturan harga, pembayaran, deposit, dan penanganan keluhan |
| Penyewa | Pengguna yang melihat informasi hunian, membayar tagihan, dan membuat keluhan |
| Product Manager / Project Manager | Mengelola scope, prioritas, keputusan kebutuhan, risiko, dan koordinasi tim |
| Backend Developer | Mengembangkan API, business logic, database, scheduler, queue, dan keamanan backend |
| Frontend Developer | Mengembangkan antarmuka pemilik dan penyewa serta integrasi API |
| QA / Tester | Menyusun skenario uji, menguji acceptance criteria, regresi, dan UAT |

## 4.2 Role Pengguna

MVP hanya memiliki dua role:

- **Pemilik:** berperan sebagai administrator dan pengelola satu properti kost.
- **Penyewa:** mengakses data hunian dan transaksi miliknya sendiri.

## 4.3 Matriks Hak Akses

| Kemampuan | Pemilik | Penyewa |
|---|---:|---:|
| Melihat seluruh kamar | Ya | Tidak |
| Mengelola kamar dan tipe kamar | Ya | Tidak |
| Mengelola fasilitas dan peraturan | Ya | Tidak |
| Melihat kamar sendiri | Ya | Ya |
| Membuat dan menonaktifkan akun penyewa | Ya | Tidak |
| Menempatkan, memindahkan, dan mengakhiri hunian | Ya | Tidak |
| Melihat data penyewa lain | Ya | Tidak |
| Melihat tagihan sendiri | Ya | Ya |
| Memilih periode bayar berikutnya | Dapat membantu atas nama penyewa | Ya |
| Mengunggah bukti transfer | Tidak | Ya |
| Memverifikasi atau menolak pembayaran | Ya | Tidak |
| Mencatat pembayaran tunai | Ya | Tidak |
| Membuat keluhan | Tidak | Ya |
| Menangani keluhan | Ya | Tidak |
| Melihat dashboard dan laporan | Ya | Tidak |
| Mengubah profil sendiri | Ya | Ya, terbatas |
| Mengubah nama dan nomor HP penyewa | Ya | Tidak |
| Melihat histori transaksi dan perubahan | Ya | Histori miliknya sendiri |

**Aturan otorisasi:** pembatasan akses wajib diterapkan di backend pada setiap endpoint, bukan hanya dengan menyembunyikan menu di frontend.

---

# 5. Ruang Lingkup Produk

## 5.1 Termasuk MVP

1. Autentikasi pemilik dan penyewa.
2. Manajemen kamar dan tipe kamar.
3. Manajemen fasilitas kamar dan fasilitas bersama dalam cakupan yang disepakati.
4. Pengaturan informasi dasar dan peraturan kost.
5. Manajemen akun dan profil penyewa.
6. Penempatan penyewa, pindah kamar, dan keluar.
7. Penerbitan tagihan dan pengelolaan periode bayar.
8. Pembayaran manual melalui transfer dengan bukti dan pembayaran tunai.
9. Verifikasi pembayaran dan histori status pembayaran.
10. Notifikasi dalam aplikasi.
11. Pengelolaan keluhan dan dokumentasi foto.
12. Dashboard operasional dan keuangan dasar.
13. Pengujian hak akses, integrasi, dan UAT.
14. Deployment aplikasi.

## 5.2 Di Luar MVP

- Notifikasi WhatsApp.
- Payment gateway otomatis.
- Portal calon penyewa dan booking kamar.
- Kontrak sewa digital.
- Tagihan listrik atau air berdasarkan pemakaian.
- Denda keterlambatan otomatis.
- Penugasan keluhan kepada teknisi.
- Pengumuman massal.
- Aplikasi native Android/iOS.
- Dukungan banyak lokasi atau banyak pemilik.
- Pembayaran sebagian.
- Integrasi akuntansi eksternal.

## 5.3 Prioritas Jika Waktu Terbatas

Urutan pengurangan scope:

1. Label fasilitas "Sering bermasalah".
2. Ekspor Excel lanjutan.
3. Kuitansi PDF, selama bukti transaksi dan status pembayaran tetap dapat diakses.
4. Visualisasi dashboard non-esensial.
5. Penyempurnaan tampilan yang tidak menghambat alur utama.

Fitur yang tidak boleh dikorbankan demi mengejar tampilan: autentikasi, otorisasi, integritas hunian, penerbitan tagihan, pencatatan pembayaran, dan histori perubahan transaksi.

---

# 6. Asumsi, Batasan, dan Keputusan Terbuka

## 6.1 Asumsi Sementara

| Area | Asumsi |
|---|---|
| Kepemilikan | Satu akun pemilik mengelola satu properti kost |
| Harga | Harga ditetapkan per tipe kamar dan periode 1, 6, atau 12 bulan |
| Pembayaran | Transfer manual atau tunai |
| Pembayaran sebagian | Tidak didukung pada MVP |
| Deposit | Dicatat dan diselesaikan ketika penyewa keluar |
| Denda | Tidak ada denda keterlambatan otomatis |
| Utilitas | Tidak ada tagihan listrik/air terpisah |
| Notifikasi | Notifikasi dalam aplikasi untuk MVP |
| Teknisi | Keluhan ditangani langsung oleh pemilik |
| Laporan | Laporan dasar dan ekspor Excel dapat menyusul sesuai kapasitas |
| Retensi | Data pribadi penyewa yang keluar direncanakan dihapus setelah 12 bulan, sedangkan data transaksi tetap disimpan sesuai kebutuhan dan kewajiban yang berlaku |

## 6.2 Keputusan yang Wajib Dikonfirmasi

Keputusan berikut belum boleh dianggap final sebelum divalidasi dengan pemilik kost.

| No. | Pertanyaan | Usulan awal untuk dibahas |
|---:|---|---|
| 1 | Apakah penyewa dengan tunggakan boleh memperpanjang sewa? | Tagihan periode baru tetap dicatat, tetapi tunggakan lama ditampilkan terpisah. Kebijakan perpanjangan harus disetujui pemilik |
| 2 | Apakah pindah kamar dapat dilakukan saat ada tunggakan? | Pemilik dapat memproses dengan peringatan dan catatan, atau menolak sesuai kebijakan |
| 3 | Bagaimana jika penyewa keluar sebelum periode berakhir? | Pemilik menetapkan perhitungan sisa sewa dan deposit secara manual pada MVP |
| 4 | Apakah deposit dapat dipakai membayar tunggakan? | Tidak otomatis; harus ada keputusan dan catatan transaksi |
| 5 | Apakah satu kamar dapat ditempati lebih dari satu orang? | Asumsi MVP: satu penyewa utama per kamar. Perlu konfirmasi apakah penghuni tambahan diperbolehkan |
| 6 | Apakah pemilik dapat mengubah tagihan terbit? | Tidak mengubah nominal secara langsung; gunakan pembatalan dengan alasan dan penerbitan ulang |
| 7 | Apakah tanggal masuk selalu menjadi tanggal siklus tagihan? | Asumsi awal: ya |
| 8 | Berapa rekening tujuan transfer? | Satu rekening untuk MVP |
| 9 | Berapa lama data pribadi disimpan setelah penyewa keluar? | Usulan 12 bulan, perlu ditinjau berdasarkan tujuan pemrosesan dan kewajiban hukum |
| 10 | Bagaimana penyewa memverifikasi perubahan nomor HP? | Perlu ditetapkan prosedur verifikasi oleh pemilik |

## 6.3 Batasan

- Aplikasi memerlukan koneksi internet.
- MVP tidak memproses pembayaran secara otomatis melalui bank.
- Notifikasi aplikasi memerlukan pengguna membuka aplikasi atau memeriksa daftar notifikasi.
- Sistem tidak menyediakan pengelolaan teknisi eksternal.
- Sistem tidak ditujukan sebagai sistem akuntansi penuh.

---

# 7. User Journey dan Alur Utama

## 7.1 User Journey Pemilik

1. Pemilik membuka aplikasi dan login.
2. Pemilik melihat dashboard berisi status kamar, tunggakan, pembayaran yang menunggu verifikasi, dan keluhan.
3. Pemilik mengatur kamar, tipe kamar, harga, fasilitas, rekening, dan peraturan kost.
4. Pemilik membuat akun penyewa dan mengisi profil.
5. Pemilik menempatkan penyewa ke kamar kosong.
6. Sistem membuat data hunian dan tagihan pertama.
7. Pemilik memeriksa bukti transfer atau mencatat pembayaran tunai.
8. Pemilik menangani keluhan dan mencatat tindakan serta biaya.
9. Pemilik memeriksa laporan dan histori.

## 7.2 User Journey Penyewa

1. Penyewa menerima nomor HP dan password sementara dari pemilik.
2. Penyewa login dan wajib mengganti password.
3. Penyewa membaca dan menyetujui informasi pemrosesan data yang ditampilkan.
4. Penyewa melihat halaman Kamar Saya.
5. Penyewa memeriksa masa sewa dan tagihan.
6. Penyewa memilih periode pembayaran berikutnya dalam batas waktu.
7. Penyewa membayar melalui transfer dan mengunggah bukti, atau mengikuti proses pembayaran tunai dengan pemilik.
8. Penyewa menerima informasi hasil verifikasi.
9. Penyewa membuat keluhan jika terdapat masalah.
10. Penyewa memantau status keluhan dan mengonfirmasi hasil penyelesaian.

## 7.3 Alur Penempatan Penyewa

1. Pemilik memilih menu tambah penyewa.
2. Pemilik mengisi data penyewa.
3. Sistem memvalidasi nomor HP agar unik.
4. Pemilik memilih kamar yang tersedia.
5. Pemilik memasukkan tanggal masuk, periode awal, dan deposit.
6. Sistem memeriksa kembali ketersediaan kamar.
7. Sistem membuat akun, profil, dan occupancy.
8. Sistem membuat tagihan pertama sesuai aturan tanggal masuk.
9. Sistem mengubah kamar menjadi terisi atau menghitung statusnya dari occupancy aktif.
10. Pemilik memberikan kredensial sementara kepada penyewa melalui cara yang aman.

Jika langkah penyimpanan gagal, seluruh perubahan inti harus dibatalkan melalui database transaction agar tidak tercipta akun tanpa hunian atau hunian tanpa tagihan yang diwajibkan.

## 7.4 Alur Siklus Tagihan

1. Sistem menghitung periode berikutnya berdasarkan occupancy aktif.
2. Sistem mengirim pengingat pemilihan periode pada H-21.
3. Penyewa memilih periode sampai H-15.
4. Jika tidak memilih, sistem memakai periode sebelumnya.
5. Sistem menerbitkan tagihan pada H-14.
6. Sistem mengirim pengingat jatuh tempo pada H-7, H-3, dan H-0 selama memenuhi syarat.
7. Penyewa mengunggah bukti transfer atau membayar tunai kepada pemilik.
8. Pemilik memverifikasi pembayaran.
9. Jika diterima, tagihan menjadi Lunas.
10. Jika ditolak, alasan penolakan disimpan dan penyewa diberi tahu.
11. Sistem melanjutkan pengingat sesuai status dan tanggal jatuh tempo.

## 7.5 Alur Keluhan

1. Penyewa memilih kategori, fasilitas terkait, urgensi, judul, deskripsi, dan foto.
2. Sistem membuat keluhan berstatus Dikirim.
3. Pemilik menerima notifikasi.
4. Pemilik meninjau dan mengubah status menjadi Diterima.
5. Pemilik memproses keluhan dan dapat bertukar komentar dengan penyewa.
6. Saat selesai, pemilik mengisi penyebab, tindakan, dan biaya.
7. Penyewa memilih "Masalah sudah beres" atau "Belum beres".
8. Jika sudah beres, status menjadi Dikonfirmasi.
9. Jika belum beres, status kembali menjadi Diproses.
10. Jika penyewa tidak merespons selama tiga hari setelah status Selesai, sistem mengubah status menjadi Dikonfirmasi sesuai aturan otomatis.

## 7.6 Alur Pindah Kamar

1. Pemilik memilih penyewa yang memiliki occupancy aktif.
2. Pemilik memilih kamar tujuan yang tersedia.
3. Pemilik menentukan tanggal pindah.
4. Sistem menutup occupancy lama dan membuat occupancy baru.
5. Tagihan yang telah terbit tetap terikat pada occupancy lama dan tidak berubah.
6. Harga kamar baru berlaku mulai periode berikutnya, sesuai kebijakan yang disetujui.
7. Sistem memperbarui status ketersediaan kedua kamar.
8. Sistem menyimpan histori perpindahan.

Jika tanggal pindah berada di tengah periode, perlakuan prorata atau selisih harga harus mengikuti keputusan stakeholder. MVP tidak menghitung prorata otomatis sebelum aturan disepakati.

## 7.7 Alur Keluar dari Kost

1. Pemilik memilih penyewa dan tanggal keluar.
2. Sistem menampilkan occupancy, tagihan, pembayaran, dan deposit terkait.
3. Pemilik mencatat penyelesaian deposit.
4. Pemilik mencatat penyelesaian sewa dan tunggakan sesuai kebijakan.
5. Occupancy ditutup.
6. Kamar menjadi tersedia jika tidak ada occupancy aktif dan tidak sedang diperbaiki.
7. Akun penyewa dinonaktifkan sesuai aturan.
8. Riwayat hunian, tagihan, pembayaran, dan keluhan tetap tersedia bagi pemilik.

---

# 8. Kebutuhan Fungsional

Prioritas:
- **Must:** wajib untuk MVP.
- **Should:** penting, dikerjakan jika kapasitas memungkinkan.
- **Could:** dapat ditunda.
- **Phase 2:** bukan bagian MVP.

## 8.1 Akun dan Autentikasi

### F-AUTH-01 – Login
**Prioritas:** Must

Pengguna login menggunakan nomor HP dan password.

Kriteria:
- Nomor HP harus terdaftar dan akun aktif.
- Password diverifikasi menggunakan hash.
- Login gagal lima kali berturut-turut memicu penguncian sementara selama 15 menit.
- Sistem memberikan pesan kesalahan umum tanpa membocorkan apakah nomor HP terdaftar.

### F-AUTH-02 – Pembuatan Akun Penyewa
**Prioritas:** Must

Pemilik membuat akun penyewa dengan password sementara.

Kriteria:
- Nomor HP harus unik.
- Penyewa wajib mengganti password saat login pertama.
- Penyewa harus melihat dan menyetujui informasi pemrosesan data sebelum mengakses fitur utama.
- Sistem menyimpan waktu dan versi persetujuan yang diberikan.

### F-AUTH-03 – Reset Password
**Prioritas:** Must

Pemilik dapat memulai reset password penyewa dan memberikan kredensial sementara melalui prosedur yang aman.

Kriteria:
- Password lama tidak ditampilkan.
- Password sementara wajib diganti saat login berikutnya.
- Aktivitas reset dicatat.

### F-AUTH-04 – Penonaktifan Akun
**Prioritas:** Must

Akun yang dinonaktifkan tidak dapat login. Data dan riwayat transaksi tetap ada.

### F-AUTH-05 – Perubahan Password
**Prioritas:** Must

Pengguna dapat mengubah password sendiri setelah memasukkan password saat ini atau melalui prosedur pemulihan yang ditetapkan.

### F-AUTH-06 – Pemulihan Akun
**Prioritas:** Should

Proses ketika penyewa lupa password atau kehilangan akses ke nomor HP harus dilakukan melalui verifikasi pemilik. Mekanisme OTP tidak termasuk MVP kecuali disepakati.

## 8.2 Pengaturan Kost, Kamar, dan Fasilitas

### F-ROOM-01 – Tipe Kamar dan Harga
**Prioritas:** Must

Pemilik mengelola tipe kamar dan harga untuk periode 1, 6, dan 12 bulan.

Kriteria:
- Harga harus bernilai nol atau positif; harga nol hanya diperbolehkan jika kebijakan produk mengizinkannya.
- Setiap tipe kamar memiliki harga untuk periode yang tersedia.
- Invoice menyimpan snapshot nama/tipe dan nominal harga saat diterbitkan.
- Perubahan harga tidak mengubah invoice yang telah terbit.

### F-ROOM-02 – Manajemen Kamar
**Prioritas:** Must

Pemilik mengelola nomor kamar, lantai, tipe, dan kondisi operasional.

Status tampilan:
- Kosong
- Terisi
- Perbaikan

Kriteria:
- Kamar yang memiliki occupancy aktif tidak dapat ditempati penyewa lain.
- Kamar dalam perbaikan tidak dapat dipilih untuk penempatan.
- Sistem mencegah nomor kamar duplikat dalam satu properti.

### F-ROOM-03 – Master Fasilitas
**Prioritas:** Must

Pemilik mengelola master fasilitas dengan cakupan:
- Kamar: AC, kasur, lemari.
- Bersama: dapur, WiFi, parkir.

### F-ROOM-04 – Kondisi Fasilitas Kamar
**Prioritas:** Should

Pemilik mencatat kondisi awal fasilitas kamar, foto, catatan, dan tanggal dokumentasi.

Kondisi:
- Baik
- Kurang baik
- Rusak

Foto kondisi awal dipakai sebagai pembanding saat keluhan.

### F-ROOM-05 – Kondisi Fasilitas Bersama
**Prioritas:** Should

Pemilik dapat mencatat kondisi dan dokumentasi fasilitas bersama tanpa menggandakan fasilitas tersebut pada setiap kamar.

### F-ROOM-06 – Halaman Kamar Saya
**Prioritas:** Must

Penyewa melihat:
- Nomor dan tipe kamar.
- Fasilitas kamar.
- Fasilitas bersama.
- Kondisi dan foto fasilitas yang relevan.
- Peraturan kost.
- Masa sewa aktif.

Penyewa hanya dapat melihat informasi fasilitas dan hunian yang relevan dengan hak aksesnya.

### F-ROOM-07 – Peraturan Kost
**Prioritas:** Must

Pemilik menulis dan memperbarui peraturan kost. Perubahan ditampilkan kepada penyewa.

### F-ROOM-08 – Informasi Kost
**Prioritas:** Should

Pemilik mengelola nama kost, alamat, kontak pengelola, dan informasi dasar lainnya.

## 8.3 Penyewa dan Hunian

### F-TEN-01 – Data Penyewa
**Prioritas:** Must

Data yang dikumpulkan:
- Nama.
- Nomor HP unik.
- Foto diri (opsional jika tidak diperlukan).
- Pekerjaan.
- Kontak darurat: nama, hubungan, nomor HP.
- Tanggal masuk dicatat pada data occupancy.

KTP tidak diminta pada MVP.

### F-TEN-02 – Satu Penyewa Utama per Kamar
**Prioritas:** Must

Satu kamar hanya memiliki satu occupancy aktif untuk satu penyewa utama.

Jika kebutuhan penghuni tambahan muncul, hal tersebut harus menjadi perubahan scope dan model data.

### F-TEN-03 – Penempatan Penyewa
**Prioritas:** Must

Pemilik mengisi kamar, tanggal masuk, periode bayar awal, dan deposit.

Kriteria:
- Sistem memvalidasi kamar tersedia pada saat penyimpanan.
- Sistem membuat occupancy aktif.
- Sistem mencatat deposit.
- Sistem membuat tagihan pertama sesuai aturan tanggal masuk.
- Proses penyimpanan dilakukan secara atomik.

### F-TEN-04 – Pindah Kamar
**Prioritas:** Must

Pemilik memindahkan penyewa ke kamar kosong dan menentukan tanggal pindah.

Kriteria:
- Occupancy lama ditutup dan occupancy baru dibuat.
- Riwayat keduanya tetap tersimpan.
- Invoice yang sudah terbit tidak berubah.
- Harga kamar baru berlaku mulai periode yang ditentukan oleh aturan bisnis.
- Selisih harga atau penyesuaian manual harus memiliki catatan.

### F-TEN-05 – Keluar dari Kost
**Prioritas:** Must

Pemilik mencatat tanggal keluar dan penyelesaian deposit.

Kriteria:
- Occupancy ditutup.
- Akun penyewa dinonaktifkan setelah proses keluar selesai.
- Tagihan belum lunas tetap tersedia dalam laporan tunggakan.
- Riwayat transaksi tidak dihapus.
- Kamar tersedia kembali hanya jika tidak ada occupancy aktif dan tidak sedang diperbaiki.

### F-TEN-06 – Riwayat Penyewa
**Prioritas:** Must

Pemilik melihat riwayat hunian, tagihan, pembayaran, deposit, dan keluhan penyewa.

## 8.4 Tagihan dan Pembayaran

### F-BILL-01 – Penerbitan Tagihan Otomatis
**Prioritas:** Must

Sistem menerbitkan tagihan 14 hari sebelum periode baru dimulai.

Kriteria:
- Scheduler berjalan setiap hari pukul 07.00 WIB.
- Sistem memeriksa occupancy aktif.
- Sistem mencegah tagihan ganda untuk occupancy dan periode yang sama.
- Kegagalan pembuatan tagihan dicatat dan dapat diproses ulang secara aman.

### F-BILL-02 – Pemilihan Periode Bayar
**Prioritas:** Must

Penyewa memilih periode 1, 6, atau 12 bulan paling lambat H-15.

Kriteria:
- Jika tidak memilih, periode sebelumnya digunakan.
- Pilihan dikunci setelah tagihan terbit.
- Perubahan setelah penerbitan dilakukan pemilik melalui pembatalan dan penerbitan ulang dengan alasan.

### F-BILL-03 – Daftar Tagihan
**Prioritas:** Must

Penyewa melihat nomor invoice, periode, nominal, jatuh tempo, status, dan rekening tujuan.

### F-BILL-04 – Upload Bukti Transfer
**Prioritas:** Must

Penyewa mengunggah bukti JPG, PNG, atau PDF maksimal 5 MB, disertai nominal dan tanggal transfer.

Kriteria:
- File divalidasi berdasarkan ekstensi, MIME type, dan ukuran.
- File disimpan privat.
- Setelah diunggah, pembayaran berstatus Menunggu Verifikasi.
- Pemilik menerima notifikasi aplikasi.
- Pengingat tagihan dihentikan sementara selama pembayaran menunggu verifikasi.

### F-BILL-05 – Verifikasi Pembayaran
**Prioritas:** Must

Pemilik menerima atau menolak bukti transfer.

Kriteria:
- Pembayaran diterima jika nominal dan bukti sesuai hasil pemeriksaan pemilik.
- Jika diterima, invoice menjadi Lunas.
- Jika ditolak, alasan wajib diisi.
- Status invoice kembali menjadi Belum Bayar atau Terlambat berdasarkan tanggal jatuh tempo.
- Penyewa menerima notifikasi.
- Histori keputusan tetap tersimpan.

### F-BILL-06 – Pembayaran Tunai
**Prioritas:** Must

Pemilik mencatat pembayaran tunai dari halaman invoice.

Kriteria:
- Nominal dan tanggal pembayaran wajib dicatat.
- Pemilik yang mencatat disimpan.
- Invoice menjadi Lunas setelah transaksi dicatat dan dikonfirmasi.

### F-BILL-07 – Pembayaran Penuh
**Prioritas:** Must

MVP hanya mendukung pelunasan penuh. Pembayaran sebagian tidak didukung.

### F-BILL-08 – Kuitansi
**Prioritas:** Could

Invoice yang lunas menghasilkan kuitansi PDF yang dapat diunduh pemilik dan penyewa.

Jika fitur PDF ditunda, detail transaksi tetap dapat dilihat dan bukti pembayaran tetap dapat diakses sesuai hak akses.

### F-BILL-09 – Status Invoice
**Prioritas:** Must

Status invoice:
- Belum Bayar.
- Menunggu Verifikasi.
- Lunas.
- Terlambat.
- Batal.

Transisi status harus divalidasi backend. Invoice Batal tidak dapat dibayar atau diubah menjadi Lunas tanpa proses penerbitan invoice pengganti.

### F-BILL-10 – Histori Pembayaran
**Prioritas:** Must

Setiap percobaan pembayaran dan perubahan status harus dapat ditelusuri.

Kriteria:
- Upload bukti baru tidak menghapus bukti atau percobaan sebelumnya.
- Alasan penolakan disimpan.
- Pihak yang melakukan verifikasi dan waktunya dicatat.
- Histori hanya dapat dilihat oleh pemilik dan penyewa terkait sesuai hak akses.

### F-BILL-11 – Pembatalan dan Penerbitan Ulang
**Prioritas:** Must

Pemilik dapat membatalkan invoice dengan alasan wajib dan menerbitkan invoice pengganti jika diperlukan.

Kriteria:
- Invoice lama tetap tersimpan dengan status Batal.
- Invoice pengganti memiliki referensi ke invoice sebelumnya.
- Nomor invoice tidak digunakan ulang.

## 8.5 Keluhan

### F-CMP-01 – Membuat Keluhan
**Prioritas:** Must

Penyewa mengisi:
- Kategori: fasilitas tidak sesuai, kerusakan, kebersihan, keamanan, atau lainnya.
- Fasilitas terkait, opsional untuk kategori Lainnya.
- Urgensi: biasa atau darurat.
- Judul dan deskripsi.
- Foto 1–3 buah, minimal satu foto, masing-masing maksimal 5 MB.

### F-CMP-02 – Notifikasi Keluhan
**Prioritas:** Must

Pemilik menerima notifikasi aplikasi. Keluhan darurat ditandai dan diprioritaskan pada daftar.

### F-CMP-03 – Status Keluhan
**Prioritas:** Must

Status:
- Dikirim.
- Diterima.
- Diproses.
- Selesai.
- Dikonfirmasi.

Kriteria:
- Penyewa dapat memilih "Masalah sudah beres" atau "Belum beres" setelah pemilik menandai Selesai.
- Jika belum beres, status kembali ke Diproses.
- Jika tidak ada respons dalam tiga hari kalender, status otomatis menjadi Dikonfirmasi.
- Perubahan status dicatat dalam histori.

### F-CMP-04 – Komentar
**Prioritas:** Should

Pemilik dan penyewa dapat bertukar komentar pada detail keluhan, termasuk foto.

### F-CMP-05 – Akar Masalah dan Tindakan
**Prioritas:** Must

Saat menyelesaikan keluhan, pemilik mengisi:
- Kategori penyebab: usia/pemakaian wajar, kesalahan pemakaian penyewa, kualitas barang/pemasangan, faktor eksternal, atau lainnya.
- Catatan penyebab.
- Tindakan yang dilakukan.
- Biaya perbaikan, boleh nol.

### F-CMP-06 – Perbandingan Kondisi Fasilitas
**Prioritas:** Should

Pemilik dapat melihat foto kondisi awal fasilitas berdampingan dengan foto keluhan jika dokumentasi awal tersedia.

### F-CMP-07 – Riwayat dan Pola Masalah
**Prioritas:** Could

Sistem menampilkan histori keluhan per kamar dan fasilitas. Fasilitas dengan minimal dua keluhan dalam enam bulan diberi label "Sering bermasalah".

## 8.6 Dashboard dan Laporan

### F-DASH-01 – Dashboard Pemilik
**Prioritas:** Must

Kartu ringkasan:
- Kamar terisi, kosong, dan dalam perbaikan.
- Pemasukan bulan ini berdasarkan pembayaran lunas.
- Total tunggakan.
- Bukti transfer menunggu verifikasi.
- Keluhan belum selesai.

### F-DASH-02 – Daftar Penunggak
**Prioritas:** Must

Menampilkan nama penyewa, kamar, nominal tunggakan, dan jumlah hari keterlambatan.

### F-DASH-03 – Fasilitas Sering Bermasalah
**Prioritas:** Could

Menampilkan fasilitas yang memenuhi ambang keluhan.

### F-DASH-04 – Ekspor Excel
**Prioritas:** Should

Ekspor laporan pembayaran, tunggakan, dan biaya perbaikan untuk rentang tanggal tertentu.

Kriteria:
- Filter tanggal diterapkan konsisten.
- Total laporan sama dengan sumber data dashboard untuk definisi dan rentang tanggal yang sama.
- Data yang diekspor mengikuti hak akses pemilik.

## 8.7 Notifikasi

### F-NOTIF-01 – Notifikasi Dalam Aplikasi
**Prioritas:** Must

Notifikasi tersedia untuk pemilik dan penyewa melalui ikon lonceng dan daftar notifikasi.

Kriteria:
- Notifikasi memiliki status sudah/belum dibaca.
- Pengguna hanya melihat notifikasi miliknya.
- Kegagalan pemrosesan dicatat.
- Notifikasi tidak boleh dibuat berulang untuk event yang sama akibat scheduler berjalan ulang.

### F-NOTIF-02 – WhatsApp
**Prioritas:** Phase 2

Notifikasi WhatsApp untuk pengingat tagihan dan perubahan status penting. Penyedia dan biaya ditentukan sebelum fase 2.

### F-NOTIF-03 – Retry WhatsApp
**Prioritas:** Phase 2

Setiap pengiriman dicatat. Jika gagal, sistem mencoba ulang maksimal tiga kali dengan jeda yang ditentukan. Notifikasi aplikasi tetap menjadi kanal utama.

---

# 9. Aturan Bisnis

## 9.1 Periode Sewa

1. Periode sewa dimulai dari tanggal mulai occupancy.
2. Periode pembayaran adalah 1, 6, atau 12 bulan.
3. Periode berikutnya dihitung dari tanggal awal siklus.
4. Jika tanggal awal 29–31 dan bulan tujuan lebih pendek, tanggal jatuh tempo menggunakan hari terakhir bulan tersebut.
5. Sistem harus menggunakan aturan kalender yang konsisten dan menghindari pergeseran tanggal berulang yang tidak disengaja.

Contoh: tanggal mulai 31 Januari dengan periode satu bulan. Periode berikutnya dimulai pada hari terakhir Februari. Perhitungan periode setelahnya perlu mengikuti anchor date yang disimpan, agar tanggal 31 tidak berubah permanen menjadi tanggal 28 atau 29.

## 9.2 Jadwal Tagihan dan Notifikasi

Definisi H adalah tanggal mulai periode sewa berikutnya.

| Waktu | Kejadian | Penerima | Kanal MVP |
|---|---|---|---|
| H-21 | Pengingat memilih periode bayar | Penyewa | Aplikasi |
| H-14 | Tagihan diterbitkan | Penyewa | Aplikasi |
| H-7 | Pengingat jatuh tempo jika belum lunas | Penyewa | Aplikasi |
| H-3 | Pengingat jatuh tempo jika belum lunas | Penyewa | Aplikasi |
| H-0 | Pengingat jatuh tempo jika belum lunas | Penyewa | Aplikasi |
| H+1 dan setiap 3 hari | Pemberitahuan terlambat | Penyewa dan pemilik | Aplikasi |
| Bukti diunggah | Perlu verifikasi | Pemilik | Aplikasi |
| Pembayaran diverifikasi | Diterima/ditolak | Penyewa | Aplikasi |
| Keluhan dibuat/status berubah | Pembaruan keluhan | Pihak terkait | Aplikasi |

Scheduler berjalan setiap hari pukul 07.00 WIB dengan zona waktu `Asia/Jakarta`.

## 9.3 Penentuan Nominal

Nominal invoice diambil dari harga tipe kamar untuk periode pembayaran yang dipilih dan berlaku saat invoice diterbitkan.

Invoice menyimpan snapshot:
- Tipe kamar atau deskripsi harga.
- Periode bulan.
- Harga satu periode.
- Tanggal periode.
- Tanggal jatuh tempo.

Perubahan harga master tidak mengubah invoice lama.

## 9.4 Aturan Tagihan Ganda

1. Sistem tidak boleh membuat dua invoice untuk occupancy dan periode yang sama.
2. Pembuatan invoice harus idempotent.
3. Constraint database atau mekanisme transaksi harus mendukung pencegahan duplikasi.
4. Jika scheduler dijalankan ulang, invoice yang sudah ada tidak dibuat ulang.

## 9.5 Tunggakan dan Tagihan Berikutnya

Usulan perilaku teknis:
- Invoice periode baru dapat diterbitkan sesuai siklus meskipun invoice lama belum lunas, kecuali stakeholder menetapkan kebijakan berbeda.
- Setiap invoice tetap memiliki status dan periode sendiri.
- Dashboard menampilkan total tunggakan sebagai agregasi invoice yang belum lunas dan telah melewati jatuh tempo.
- Kebijakan apakah penyewa boleh memperpanjang atau memilih periode baru saat menunggak wajib dikonfirmasi pemilik.

## 9.6 Bukti Ditolak dan Pengingat

1. Saat bukti diunggah, invoice masuk Menunggu Verifikasi.
2. Pengingat jatuh tempo dihentikan sementara selama status Menunggu Verifikasi.
3. Jika bukti ditolak, invoice kembali ke Belum Bayar atau Terlambat berdasarkan tanggal jatuh tempo.
4. Pengingat berikutnya dijadwalkan kembali sesuai status dan jadwal yang masih relevan.
5. Bukti, alasan penolakan, dan waktu keputusan tetap tersimpan.

## 9.7 Pembayaran

- Pembayaran harus penuh.
- Satu invoice dapat memiliki beberapa percobaan pembayaran karena bukti dapat ditolak.
- Hanya satu pembayaran yang dapat menjadi pembayaran berhasil untuk pelunasan invoice.
- Pembayaran tunai dicatat oleh pemilik.
- Pembayaran yang telah diverifikasi tidak dihapus langsung. Koreksi dilakukan melalui proses pembatalan/penyesuaian yang tercatat.

## 9.8 Pindah Kamar

- Kamar tujuan harus tersedia pada tanggal perpindahan.
- Occupancy lama ditutup dan occupancy baru dibuat.
- Invoice yang telah diterbitkan tidak diubah.
- Harga kamar baru berlaku pada periode berikutnya sesuai keputusan stakeholder.
- Perhitungan prorata tidak dilakukan otomatis pada MVP kecuali aturan telah disetujui dan diimplementasikan.

## 9.9 Keluar dan Deposit

- Deposit dicatat sebagai kewajiban yang perlu diselesaikan saat penyewa keluar.
- Setiap penerimaan, pengembalian, pemotongan, atau penghangusan deposit dicatat sebagai transaksi terpisah.
- Pemotongan deposit wajib memiliki alasan dan nominal.
- Penggunaan deposit untuk menutup tunggakan tidak otomatis; perlu keputusan pemilik dan catatan transaksi.
- Detail penyelesaian deposit dapat dilihat pada riwayat occupancy.

## 9.10 Status Kamar

Occupancy aktif menjadi sumber utama untuk mengetahui apakah kamar dihuni.

Status tampilan kamar:
- Terisi jika terdapat occupancy aktif.
- Kosong jika tidak ada occupancy aktif dan kamar tidak dalam perbaikan.
- Perbaikan jika pemilik menetapkan kamar dalam kondisi perbaikan.

Jika status operasional disimpan di database, perubahan status kamar dan occupancy harus dilakukan secara konsisten dalam database transaction. Sistem harus mencegah satu kamar memiliki lebih dari satu occupancy aktif.

## 9.11 Status Keluhan

Transisi status yang diperbolehkan:

| Status awal | Aksi | Status berikutnya |
|---|---|---|
| Dikirim | Pemilik menerima | Diterima |
| Diterima | Pemilik mulai menangani | Diproses |
| Diproses | Pemilik menyelesaikan | Selesai |
| Selesai | Penyewa menyatakan beres | Dikonfirmasi |
| Selesai | Penyewa menyatakan belum beres | Diproses |
| Selesai | Tidak ada respons selama 3 hari kalender | Dikonfirmasi |

Setiap transisi menyimpan pengguna, waktu, status lama, status baru, dan catatan jika ada.

---

# 10. Model Data Konseptual

Model berikut merupakan rancangan konseptual untuk membantu diskusi teknis. Tipe data, indeks, constraint, dan detail implementasi ditetapkan pada Technical Design Document dan ERD final.

## 10.1 Entitas Utama

| Tabel | Kolom utama | Keterangan |
|---|---|---|
| `users` | id, role, name, phone, password, photo_path, is_active, must_change_password, consented_at | Akun pemilik dan penyewa |
| `tenant_profiles` | id, user_id, occupation, emergency_name, emergency_relation, emergency_phone | Profil tambahan penyewa |
| `room_types` | id, name, description | Tipe kamar |
| `room_type_prices` | id, room_type_id, period_months, price, effective_from, effective_until | Harga per periode |
| `rooms` | id, number, floor, room_type_id, maintenance_status | Data kamar |
| `facilities` | id, name, scope | Master fasilitas |
| `room_facilities` | id, room_id, facility_id, condition_status, note | Relasi fasilitas kamar |
| `room_facility_condition_histories` | id, room_facility_id, condition_status, photo_path, note, recorded_at, recorded_by | Histori kondisi fasilitas kamar |
| `shared_facilities` | id, facility_id, name, is_active | Fasilitas bersama properti |
| `shared_facility_condition_histories` | id, shared_facility_id, condition_status, photo_path, note, recorded_at, recorded_by | Histori kondisi fasilitas bersama |
| `occupancies` | id, user_id, room_id, start_date, end_date, anchor_day, next_period_months, deposit_amount, status | Riwayat hunian |
| `invoices` | id, number, occupancy_id, period_start, period_end, period_months, amount, due_date, status, cancel_reason, replaces_invoice_id | Tagihan |
| `payments` | id, invoice_id, method, amount, paid_at, proof_path, status, reject_reason, verified_by, verified_at | Percobaan pembayaran |
| `payment_status_histories` | id, payment_id, old_status, new_status, changed_by, reason, created_at | Histori status pembayaran |
| `deposit_transactions` | id, occupancy_id, transaction_type, amount, reason, transaction_date, recorded_by | Penerimaan dan penyelesaian deposit |
| `complaints` | id, user_id, room_id, facility_id, category, urgency, title, description, status, root_cause_category, root_cause_note, action_taken, repair_cost, resolved_at, confirmed_at | Keluhan |
| `complaint_photos` | id, complaint_id, path | Foto keluhan |
| `complaint_comments` | id, complaint_id, user_id, body, photo_path | Komentar keluhan |
| `complaint_status_histories` | id, complaint_id, old_status, new_status, changed_by, note, created_at | Histori status keluhan |
| `notifications` | id, user_id, type, title, body, read_at, related_type, related_id | Notifikasi aplikasi |
| `notification_logs` | id, notification_id, channel, status, attempts, last_attempt_at, error_message | Histori pemrosesan notifikasi |
| `audit_logs` | id, actor_id, entity_type, entity_id, action, old_values, new_values, created_at | Audit perubahan data penting |
| `settings` | id, setting_key, setting_value | Pengaturan kost dan rekening |

Semua tabel operasional memiliki `created_at` dan `updated_at` jika relevan. Tabel histori yang bersifat append-only dapat menggunakan `created_at` tanpa menyediakan perubahan terhadap catatan lama.

## 10.2 Relasi Utama

- `users` 1–N `occupancies` untuk riwayat hunian penyewa.
- `rooms` 1–N `occupancies`.
- `occupancies` 1–N `invoices`.
- `invoices` 1–N `payments` untuk mendukung percobaan pembayaran dan upload ulang.
- `payments` 1–N `payment_status_histories`.
- `occupancies` 1–N `deposit_transactions`.
- `users` 1–N `complaints`.
- `complaints` 1–N `complaint_photos`.
- `complaints` 1–N `complaint_comments`.
- `complaints` 1–N `complaint_status_histories`.
- `facilities` 1–N relasi fasilitas kamar atau fasilitas bersama sesuai cakupan.
- `users` 1–N `notifications`.

## 10.3 Aturan Integritas Data

1. Nomor HP akun harus unik.
2. Nomor kamar harus unik dalam properti.
3. Satu kamar hanya boleh memiliki satu occupancy aktif.
4. Satu invoice hanya boleh diterbitkan satu kali untuk occupancy dan periode yang sama.
5. Nominal uang disimpan sebagai integer dalam Rupiah.
6. Data invoice menyimpan snapshot harga saat diterbitkan.
7. Pembayaran yang telah diverifikasi tidak dihapus secara fisik melalui antarmuka normal.
8. Histori status dan audit log tidak boleh diubah oleh penyewa.
9. Penghapusan data harus mempertimbangkan relasi transaksi dan kebijakan retensi.
10. Operasi penempatan, pindah kamar, keluar, penerbitan invoice, dan verifikasi pembayaran harus menggunakan transaksi database jika melibatkan beberapa perubahan yang saling bergantung.

## 10.4 Catatan Desain

- Status occupancy menjadi sumber utama penentuan hunian.
- Status perbaikan merupakan status operasional kamar yang dikelola pemilik.
- Fasilitas bersama tidak diduplikasi pada setiap kamar.
- Snapshot harga pada invoice mencegah perubahan master harga mengubah transaksi lama.
- Audit log dan histori domain memiliki fungsi berbeda: histori domain merekam alur bisnis, sedangkan audit log merekam perubahan penting oleh aktor.

---

# 11. Kebutuhan Non-Fungsional

## 11.1 Responsivitas

- Antarmuka nyaman digunakan mulai lebar layar 360 px.
- Alur penyewa dioptimalkan untuk ponsel.
- Dashboard pemilik dapat digunakan pada desktop dan perangkat mobile.
- Tabel penting harus memiliki perilaku responsif yang jelas.

## 11.2 Kinerja

Target awal:
- Halaman utama termuat kurang dari tiga detik pada jaringan 4G dalam kondisi pengujian yang ditetapkan.
- Endpoint utama memiliki pagination untuk daftar data.
- Query dashboard dioptimalkan agar tidak mengambil seluruh histori transaksi.
- Foto dikompresi di sisi server atau melalui proses upload yang aman.
- Pengujian kinerja dilakukan menggunakan dataset yang mendekati volume penggunaan yang diperkirakan.

Target tiga detik harus dilengkapi definisi perangkat, ukuran data, dan metode pengujian pada test plan.

## 11.3 Keamanan

- HTTPS wajib pada lingkungan produksi.
- Password disimpan menggunakan algoritma hashing yang sesuai, misalnya bcrypt atau Argon2id melalui mekanisme framework.
- Rate limiting diterapkan pada login dan endpoint sensitif.
- Otorisasi diterapkan pada setiap endpoint.
- Validasi dilakukan di backend meskipun frontend telah melakukan validasi.
- File bukti pembayaran dan foto privat tidak boleh tersedia melalui URL publik permanen.
- File privat diakses melalui mekanisme akses terotorisasi atau signed URL yang memiliki masa berlaku.
- Upload memvalidasi ukuran, MIME type, ekstensi, dan nama file.
- Secret dan kredensial tidak disimpan di repository.
- CORS, CSRF, session/token, dan konfigurasi autentikasi harus disesuaikan dengan pola deployment Laravel API dan React SPA.
- Perubahan transaksi dan data penting dicatat.
- Error produksi tidak menampilkan stack trace atau informasi sensitif.

## 11.4 Privasi dan Perlindungan Data

- Data yang dikumpulkan dibatasi sesuai kebutuhan operasional.
- KTP tidak diminta pada MVP.
- Penyewa menerima informasi tujuan penggunaan data sebelum memberikan persetujuan.
- Sistem mencatat waktu dan versi persetujuan.
- Akses foto diri, kontak darurat, dan bukti transfer dibatasi.
- Retensi data pribadi ditetapkan berdasarkan tujuan pemrosesan dan kewajiban hukum yang berlaku.
- Penghapusan atau anonimisasi data pribadi tidak boleh menghilangkan integritas catatan transaksi yang wajib dipertahankan.
- Permintaan perubahan atau penghapusan data ditangani melalui prosedur yang ditetapkan pemilik/pengelola.

## 11.5 Ketersediaan dan Penanganan Kegagalan

- Kegagalan scheduler dan queue dicatat.
- Proses yang gagal dapat dicoba ulang tanpa membuat data duplikat.
- Kegagalan notifikasi tidak boleh membatalkan transaksi utama.
- Pengguna menerima pesan yang dapat dipahami ketika operasi gagal.
- Target availability formal ditentukan setelah kebutuhan operasional dan infrastruktur diketahui.

## 11.6 Backup dan Pemulihan

- Backup database dilakukan harian.
- Retensi awal minimal tujuh hari.
- Backup disimpan terpisah dari server aplikasi jika infrastruktur memungkinkan.
- Prosedur restore didokumentasikan.
- Restore diuji secara berkala sebelum aplikasi digunakan secara operasional.
- File upload juga harus memiliki strategi backup yang sesuai.

## 11.7 Aksesibilitas dan Usability

- Form memiliki label yang jelas.
- Pesan validasi menjelaskan cara memperbaiki input.
- Status tidak hanya dibedakan berdasarkan warna.
- Tombol aksi memiliki label yang mudah dipahami.
- Loading, empty state, dan error state disediakan pada alur utama.

---

# 12. Integrasi dan Arsitektur Teknis

## 12.1 Arsitektur Awal

| Komponen | Teknologi |
|---|---|
| Backend | Laravel REST API |
| Autentikasi API | Laravel Sanctum |
| Frontend | React SPA |
| Database | MySQL |
| Scheduler | Laravel Scheduler |
| Queue | Laravel Queue |
| File storage | Private storage |
| Deployment | Server/VPS yang disiapkan tim |

## 12.2 Tanggung Jawab Komponen

- Laravel menangani autentikasi, otorisasi, validasi, business logic, transaksi database, dan API.
- React menangani antarmuka pemilik dan penyewa.
- MySQL menyimpan data utama dan histori.
- Scheduler memicu penerbitan invoice dan jadwal notifikasi.
- Queue memproses pekerjaan yang tidak harus diselesaikan dalam request pengguna.
- Storage privat menyimpan foto penyewa, bukti pembayaran, dan foto keluhan.

## 12.3 Prinsip Integrasi

1. Kontrak API disepakati sebelum frontend dan backend mengembangkan integrasi secara paralel.
2. Format respons dan error API dibuat konsisten.
3. Endpoint sensitif menerapkan otorisasi.
4. Operasi penting mendukung idempotency atau mekanisme pencegahan duplikasi.
5. Dokumentasi API diperbarui ketika kontrak berubah.
6. Environment development, testing, dan production dipisahkan.

## 12.4 Integrasi Fase 2

WhatsApp API dan payment gateway tidak termasuk MVP. Pemilihan vendor, biaya, keamanan credential, webhook, retry, dan rekonsiliasi harus dianalisis pada fase terpisah.

---

# 13. Prioritas dan Backlog MVP

## 13.1 Urutan Prioritas Produk

| Prioritas | Modul | Keluaran minimum |
|---|---|---|
| Must | Authentication & authorization | Pemilik dan penyewa dapat login dengan akses terpisah |
| Must | Room management | Pemilik dapat mengelola kamar dan tipe kamar |
| Must | Tenant & occupancy | Pemilik dapat menempatkan dan mengakhiri hunian |
| Must | Billing | Invoice pertama dan invoice periodik tercatat tanpa duplikasi |
| Must | Payment | Transfer manual dan tunai dapat dicatat serta diverifikasi |
| Must | Notification | Notifikasi aplikasi untuk event utama |
| Must | Complaint | Penyewa membuat keluhan dan pemilik memprosesnya |
| Must | Dashboard dasar | Ringkasan kamar, tunggakan, pembayaran, dan keluhan |
| Should | Histori fasilitas | Dokumentasi kondisi fasilitas |
| Should | Histori pembayaran lengkap | Histori percobaan dan keputusan pembayaran |
| Should | Histori deposit | Penerimaan dan penyelesaian deposit |
| Should | Ekspor Excel | Laporan dasar |
| Could | Kuitansi PDF | Dokumen kuitansi |
| Could | Label sering bermasalah | Identifikasi fasilitas dengan keluhan berulang |
| Phase 2 | WhatsApp dan payment gateway | Integrasi eksternal |

## 13.2 Dependency Antarfitur

| Fitur | Bergantung pada |
|---|---|
| Penempatan penyewa | User, room, room type, price |
| Invoice pertama | Occupancy dan price |
| Invoice periodik | Occupancy, billing rules, scheduler |
| Upload pembayaran | Invoice dan private storage |
| Verifikasi pembayaran | Payment dan role pemilik |
| Dashboard tunggakan | Invoice dan payment status |
| Keluhan fasilitas | User, room, facility |
| Perbandingan foto kondisi | Histori kondisi fasilitas dan complaint photos |
| Laporan biaya perbaikan | Complaint dan repair cost |
| Notifikasi | Event bisnis dan queue |

---

# 14. Rencana Sprint dan Pembagian Tanggung Jawab

## 14.1 Komposisi Tim

| Peran | Jumlah | Tanggung jawab utama |
|---|---:|---|
| Project Manager / QA / Database | 1 | Scope, backlog, koordinasi, ERD, acceptance criteria, pengujian dan UAT |
| Backend Developer | 2 | API, business logic, database implementation, scheduler, queue, security |
| Frontend Developer | 2 | UI pemilik dan penyewa, state, form, integrasi API, responsive layout |

**Risiko kapasitas:** PM merangkap QA dan database berpotensi menjadi bottleneck. Developer harus membantu pengujian unit dan integrasi, sementara PM memusatkan perhatian pada acceptance, prioritas, dan koordinasi.

## 14.2 Sprint 1 – Foundation

**Target:** minggu pertama.

Pekerjaan:
- Setup repository dan environment.
- Menyepakati ERD dan kontrak API.
- Migrasi dan seeder inti.
- Login, logout, dan otorisasi.
- CRUD kamar dan tipe kamar.
- Master fasilitas.
- Pengaturan kost dasar.

Output:
- Pemilik dapat login.
- Role dan akses dasar berjalan.
- Pemilik dapat mengelola kamar dan tipe kamar.

## 14.3 Sprint 2 – Tenant dan Occupancy

**Target:** minggu kedua.

Pekerjaan:
- CRUD penyewa.
- Penempatan penyewa.
- Pindah kamar dan keluar.
- Halaman Kamar Saya.
- Pengelolaan deposit dasar.
- Penerbitan invoice pertama.

Output:
- Siklus penempatan penyewa dapat diselesaikan.
- Riwayat occupancy tersimpan.
- Invoice pertama tercatat.

## 14.4 Sprint 3 – Billing dan Payment

**Target:** minggu ketiga.

Pekerjaan:
- Perhitungan periode dan jatuh tempo.
- Scheduler penerbitan invoice.
- Pemilihan periode bayar.
- Upload bukti transfer.
- Verifikasi dan penolakan pembayaran.
- Pembayaran tunai.
- Histori pembayaran.
- Notifikasi aplikasi.

Output:
- Siklus tagihan berjalan dari penerbitan hingga lunas.
- Scheduler tidak membuat invoice duplikat.
- Histori pembayaran dapat ditelusuri.

## 14.5 Sprint 4 – Complaint, Dashboard, dan Release

**Target:** minggu keempat.

Pekerjaan:
- Pembuatan dan penanganan keluhan.
- Foto dan komentar sesuai kapasitas.
- Pencatatan akar masalah dan biaya.
- Dashboard dasar.
- Pengujian integrasi dan keamanan.
- UAT.
- Perbaikan bug kritis.
- Deployment dan dokumentasi.

Output:
- Alur keluhan utama berjalan.
- Dashboard dasar tersedia.
- Aplikasi dapat digunakan pada lingkungan demo/produksi yang disepakati.

## 14.6 Aturan Pengendalian Scope

Jika sprint tertinggal:
1. Jangan mengurangi pengujian keamanan dan integritas transaksi.
2. Tunda fitur Could terlebih dahulu.
3. Tunda fitur Should yang bukan dependency alur utama.
4. Sederhanakan tampilan non-esensial.
5. Laporkan perubahan target kepada stakeholder.
6. Jangan menandai fitur selesai jika acceptance criteria belum terpenuhi.

---

# 15. Acceptance Criteria dan Definition of Done

## 15.1 Contoh Acceptance Criteria – Penempatan Penyewa

**Skenario: Penempatan berhasil**

Given:
- Pemilik telah login.
- Kamar A-01 tersedia.
- Data penyewa valid.

When:
- Pemilik menempatkan penyewa pada kamar A-01 dengan tanggal masuk dan periode awal.

Then:
- Sistem membuat occupancy aktif.
- Sistem mencatat deposit.
- Sistem menerbitkan invoice pertama.
- Kamar ditampilkan sebagai Terisi.
- Penyewa dapat melihat kamar tersebut pada halaman Kamar Saya.

**Skenario: Kamar sudah terisi**

Given:
- Kamar A-01 memiliki occupancy aktif.

When:
- Pemilik mencoba menempatkan penyewa lain pada kamar A-01.

Then:
- Sistem menolak operasi.
- Tidak ada occupancy tambahan yang tersimpan.
- Pengguna mendapat pesan bahwa kamar tidak tersedia.

## 15.2 Contoh Acceptance Criteria – Pembayaran

**Skenario: Bukti transfer diterima**

Given:
- Invoice berstatus Belum Bayar.
- Penyewa mengunggah bukti transfer yang valid.

When:
- Pemilik memverifikasi pembayaran dan memilih Terima.

Then:
- Payment berstatus diterima.
- Invoice menjadi Lunas.
- Waktu dan pemilik yang memverifikasi tersimpan.
- Histori status tercatat.
- Penyewa menerima notifikasi.
- Kuitansi tersedia jika fitur PDF sudah termasuk rilis.

**Skenario: Bukti transfer ditolak**

Given:
- Payment berstatus Menunggu Verifikasi.

When:
- Pemilik menolak dan mengisi alasan.

Then:
- Alasan penolakan tersimpan.
- Invoice kembali menjadi Belum Bayar atau Terlambat sesuai tanggal.
- Penyewa menerima notifikasi.
- Bukti dan histori percobaan sebelumnya tetap tersedia.
- Pengingat dijadwalkan kembali sesuai aturan.

## 15.3 Contoh Acceptance Criteria – Isolasi Data

**Skenario: Penyewa mencoba mengakses invoice penyewa lain**

Given:
- Penyewa A login.
- Invoice yang diminta milik penyewa B.

When:
- Penyewa A meminta detail invoice tersebut melalui API.

Then:
- Backend menolak akses.
- Data invoice tidak dikembalikan.
- Percobaan dapat dicatat untuk pemantauan keamanan.

## 15.4 Definition of Done

Fitur dinyatakan selesai jika:

- [ ] Requirement dan acceptance criteria dipahami.
- [ ] Implementasi backend selesai jika fitur membutuhkan backend.
- [ ] Validasi input dilakukan di backend.
- [ ] Otorisasi diuji.
- [ ] Frontend terintegrasi dengan API.
- [ ] Loading, empty state, dan error state tersedia.
- [ ] Data tersimpan dan terbaca dengan benar.
- [ ] Histori perubahan tersedia untuk proses yang diwajibkan.
- [ ] Unit test atau pengujian terkait lulus.
- [ ] Pengujian integrasi terkait lulus.
- [ ] Tidak ada bug blocker atau critical yang terbuka.
- [ ] Dokumentasi API atau penggunaan diperbarui.
- [ ] Fitur telah direview oleh anggota tim yang relevan.
- [ ] Acceptance criteria disetujui PM/QA.

---

# 16. Strategi Pengujian dan UAT

## 16.1 Jenis Pengujian

| Jenis | Fokus |
|---|---|
| Unit testing | Perhitungan periode, status, nominal, dan validasi business logic |
| Integration testing | Relasi API, database, storage, scheduler, dan queue |
| API testing | Validasi request, response, status code, dan otorisasi |
| UI testing | Form, navigasi, loading, error, dan tampilan responsif |
| Security testing | Isolasi data, akses file, rate limit, dan role |
| Regression testing | Memastikan perubahan tidak merusak fitur sebelumnya |
| UAT | Memastikan alur sesuai kebutuhan pemilik dan penyewa |

## 16.2 Skenario Uji Minimum

### Autentikasi
- Login valid.
- Password salah.
- Akun nonaktif.
- Penguncian setelah lima kegagalan.
- Wajib ganti password.
- Penyewa mencoba mengakses endpoint pemilik.

### Kamar dan Hunian
- Menambah kamar.
- Menolak nomor kamar duplikat.
- Menempatkan penyewa ke kamar kosong.
- Menolak penempatan ke kamar terisi.
- Pindah kamar.
- Menutup occupancy saat penyewa keluar.
- Memastikan histori lama tetap ada.

### Tagihan
- Penerbitan invoice pertama.
- Penerbitan invoice H-14.
- Perhitungan periode 1, 6, dan 12 bulan.
- Tanggal masuk 29, 30, dan 31.
- Scheduler dijalankan dua kali tanpa duplikasi.
- Perubahan harga tidak mengubah invoice lama.
- Invoice batal tidak dapat dibayar.

### Pembayaran
- Upload file valid.
- Menolak file terlalu besar atau tipe tidak diizinkan.
- Bukti diterima.
- Bukti ditolak.
- Upload ulang setelah penolakan.
- Pembayaran tunai.
- Pembayaran tidak dapat diverifikasi dua kali.
- Histori tetap tersedia.

### Keluhan
- Membuat keluhan dengan foto.
- Validasi jumlah foto.
- Perubahan status.
- Komentar.
- Penyelesaian dan konfirmasi.
- Reopen ketika penyewa menyatakan belum selesai.
- Auto-confirm setelah tiga hari.

### Laporan
- Total pemasukan sesuai pembayaran lunas.
- Tunggakan sesuai invoice yang belum lunas dan telah jatuh tempo.
- Biaya perbaikan sesuai data keluhan.
- Filter tanggal konsisten.

## 16.3 UAT

UAT dilakukan bersama perwakilan pemilik dan penyewa.

Skenario UAT minimum:
1. Pemilik membuat kamar dan tipe kamar.
2. Pemilik mendaftarkan penyewa.
3. Penyewa login dan melihat kamar.
4. Sistem menerbitkan tagihan.
5. Penyewa mengunggah bukti.
6. Pemilik menerima atau menolak pembayaran.
7. Penyewa membuat keluhan.
8. Pemilik menyelesaikan keluhan.
9. Pemilik melihat dashboard dan laporan.

Hasil UAT dicatat sebagai:
- Diterima.
- Diterima dengan catatan.
- Ditolak dan perlu perbaikan.

---

# 17. Risiko dan Mitigasi

| Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|
| Aturan tagihan belum disepakati | Perubahan business logic dan database | Tinggi | Validasi aturan sebelum implementasi billing |
| Scope terlalu besar untuk 4 minggu | Fitur tidak selesai atau kualitas turun | Tinggi | Prioritaskan Must dan tunda Could |
| Scheduler membuat invoice ganda | Kesalahan transaksi | Sedang | Idempotency, unique constraint, dan pengujian scheduler |
| Status kamar tidak sinkron dengan occupancy | Double booking | Sedang | Jadikan occupancy sumber utama dan gunakan transaksi database |
| Bukti pembayaran hilang saat upload ulang | Hilangnya histori | Sedang | Simpan setiap percobaan pembayaran |
| Akses data antarpenyewa bocor | Insiden privasi | Tinggi | Policy/authorization di backend dan pengujian setiap endpoint |
| File privat dapat diakses publik | Kebocoran dokumen | Tinggi | Private storage dan signed/authorized access |
| Backup tidak dapat dipulihkan | Kehilangan data | Sedang | Uji restore berkala |
| PM menjadi bottleneck | Keputusan dan QA terlambat | Tinggi | Developer melakukan self-testing dan review silang |
| Integrasi frontend-backend terlambat | Fitur tidak dapat diuji end-to-end | Tinggi | Sepakati API contract sejak Sprint 1 |
| Notifikasi gagal diproses | Pengguna tidak mendapat informasi | Sedang | Logging, retry aman, dan pemantauan queue |
| Perubahan scope di tengah sprint | Jadwal bergeser | Tinggi | Change control dan persetujuan PM/stakeholder |

---

# 18. Rencana Deployment, Backup, dan Pemulihan

## 18.1 Lingkungan

Minimal tersedia:
- Development: untuk pengembangan lokal.
- Testing/Staging: untuk integrasi dan UAT.
- Production/Demo: untuk aplikasi yang akan digunakan atau didemonstrasikan.

## 18.2 Deployment Checklist

- [ ] Environment variable production disiapkan.
- [ ] APP_DEBUG dinonaktifkan.
- [ ] HTTPS aktif.
- [ ] Database production disiapkan.
- [ ] Migrasi database diperiksa dan dijalankan.
- [ ] Queue worker aktif.
- [ ] Scheduler aktif.
- [ ] Storage privat dapat diakses sesuai otorisasi.
- [ ] Backup database dikonfigurasi.
- [ ] Log aplikasi dapat diperiksa.
- [ ] Akun pemilik awal dibuat dengan prosedur aman.
- [ ] Pengujian smoke test selesai.
- [ ] Prosedur rollback disiapkan.

## 18.3 Backup dan Restore

- Backup database harian dengan retensi minimal tujuh hari sebagai baseline.
- Backup file upload dipertimbangkan sesuai kapasitas storage.
- Backup disimpan di lokasi terpisah jika memungkinkan.
- Prosedur restore ditulis dan diuji.
- Akses backup dibatasi.
- Keberhasilan backup dipantau, bukan hanya diasumsikan dari jadwal.

## 18.4 Monitoring

Pantau minimal:
- Error aplikasi.
- Kegagalan scheduler.
- Queue yang gagal.
- Kegagalan upload.
- Kegagalan koneksi database.
- Kapasitas disk.
- Keberhasilan backup.

---

# 19. Kriteria Rilis MVP

MVP dapat dinyatakan siap dirilis jika seluruh kondisi berikut terpenuhi:

## 19.1 Fungsional
- [ ] Pemilik dan penyewa dapat login.
- [ ] Role dan hak akses berjalan.
- [ ] Pemilik dapat mengelola kamar.
- [ ] Pemilik dapat membuat akun penyewa.
- [ ] Penempatan, pindah, dan keluar penyewa berjalan sesuai aturan yang disetujui.
- [ ] Invoice pertama dan periodik dapat dibuat.
- [ ] Sistem mencegah invoice duplikat.
- [ ] Penyewa dapat mengunggah bukti pembayaran.
- [ ] Pemilik dapat menerima dan menolak pembayaran.
- [ ] Pembayaran tunai dapat dicatat.
- [ ] Histori pembayaran tersedia.
- [ ] Notifikasi aplikasi untuk event utama berjalan.
- [ ] Penyewa dapat membuat keluhan.
- [ ] Pemilik dapat menangani keluhan.
- [ ] Dashboard dasar menampilkan data yang konsisten.

## 19.2 Kualitas dan Keamanan
- [ ] Pengujian hak akses lulus.
- [ ] Tidak ada bug blocker atau critical yang diketahui.
- [ ] Validasi upload berjalan.
- [ ] File privat tidak dapat diakses tanpa otorisasi.
- [ ] Perhitungan tanggal dan nominal telah diuji.
- [ ] Scheduler dan queue telah diuji.
- [ ] Backup berjalan dan prosedur restore tersedia.
- [ ] HTTPS aktif pada deployment produksi.

## 19.3 Dokumentasi dan Persetujuan
- [ ] README dan panduan instalasi tersedia.
- [ ] Dokumentasi API tersedia.
- [ ] UAT telah dilakukan.
- [ ] Catatan bug dan keputusan terbuka diperbarui.
- [ ] Stakeholder menyetujui hasil MVP atau menerima daftar keterbatasan yang diketahui.

---

# 20. Glosarium

| Istilah | Definisi |
|---|---|
| Occupancy | Catatan periode seorang penyewa menempati kamar |
| Invoice | Tagihan untuk satu periode sewa |
| Payment | Catatan percobaan atau transaksi pembayaran terhadap invoice |
| H-14 | Empat belas hari sebelum tanggal mulai periode |
| Scheduler | Proses terjadwal yang menjalankan pekerjaan otomatis |
| Queue | Antrean pekerjaan yang diproses di latar belakang |
| Idempotent | Operasi yang dijalankan berulang tidak menghasilkan efek ganda |
| Audit log | Catatan perubahan penting yang dilakukan aktor |
| UAT | User Acceptance Testing, pengujian penerimaan oleh pengguna/stakeholder |
| MVP | Minimum Viable Product, versi awal dengan kemampuan inti |
| NFR | Non-Functional Requirements, kebutuhan kualitas sistem |
| Acceptance Criteria | Kondisi terukur yang harus dipenuhi agar kebutuhan dianggap terpenuhi |
| Definition of Done | Standar minimum agar pekerjaan dinyatakan selesai |

---

# Catatan Penutup

PRD versi 1.2 ini dimaksudkan sebagai dasar penyelarasan kebutuhan produk dan perencanaan pengembangan KostKuy. Dokumen ini mempertahankan arah produk awal, tetapi memperjelas beberapa area yang berisiko menimbulkan perbedaan interpretasi saat implementasi.

Sebelum development penuh, tim perlu menyelesaikan keputusan terbuka pada Bagian 6, menyetujui aturan bisnis pada Bagian 9, dan memfinalisasi ERD serta kontrak API pada dokumen teknis terpisah.

**Dokumen turunan yang disarankan:**
1. Project Plan dan sprint backlog.
2. ERD final dan data dictionary.
3. Technical Design Document.
4. API specification.
5. UI/UX flow dan desain antarmuka.
6. Test plan dan UAT checklist.

**Prinsip rilis:** alur utama harus konsisten, aman, dapat diuji, dan dapat ditelusuri sebelum fitur tambahan diprioritaskan.
