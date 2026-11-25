// Teks & konfigurasi statis landing page. Data kamar, harga, dan fasilitas diambil dari API.
// shortcut: kontak & alamat ditulis di sini, pindahkan ke API settings kalau endpoint-nya sudah ada.

export const CONTACT = {
  whatsapp: '6281234567890', // tanpa "+" untuk link wa.me
  whatsappLabel: '+6281234567890',
  hours: 'Survei setiap hari, 09.00–20.00 WIB',
  address: 'Jl. Lenteng Agung Raya No. 20, Srengseng Sawah, Jagakarsa, Jakarta Selatan',
}

export const waLink = (text = 'Halo, saya tertarik dengan kost KostKuy.') =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`

const unsplash = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`

export const IMAGES = {
  building: unsplash('1545324418-cc1a3fa10c00'),
  bedroom: unsplash('1522771739844-6a9f6d5f14af', 800),
  kitchen: unsplash('1556911220-bff31c812dba', 800),
  lounge: unsplash('1555041469-a586c61ea9bc', 1000),
  // Foto kamar dipakai bergiliran karena API belum menyediakan foto per kamar.
  rooms: [
    '1560448204-e02f11c3d0e2',
    '1522771739844-6a9f6d5f14af',
    '1616594039964-ae9021a400a0',
    '1505693416388-ac5ce068fe85',
    '1631049307264-da0ec9d70304',
    '1595526114035-0d45ed16cfbf',
  ].map((id) => unsplash(id, 600)),
}

export const NAV = [
  { href: '#kamar', label: 'Kamar' },
  { href: '#fasilitas', label: 'Fasilitas' },
  { href: '#harga', label: 'Harga' },
  { href: '#lokasi', label: 'Lokasi' },
  { href: '#faq', label: 'FAQ' },
]

// Deskripsi fasilitas bersama, dicocokkan dengan nama fasilitas dari API.
export const FACILITY_INFO = {
  WiFi: 'Internet cepat untuk kuliah dan kerja.',
  Dapur: 'Kompor, kulkas, dan alat masak.',
  'Parkir motor': 'Area parkir beratap dan berpagar.',
  'Mesin cuci': 'Bisa dipakai bergantian oleh penghuni.',
  'Ruang jemur': 'Jemuran di lantai atas, kena matahari.',
}

export const APP_FEATURES = [
  { icon: 'Receipt', title: 'Tagihan otomatis', text: 'Tagihan sewa dibuat tiap periode, lengkap dengan tanggal jatuh tempo.' },
  { icon: 'Upload', title: 'Upload bukti bayar', text: 'Transfer, unggah bukti, lalu pemilik mengonfirmasi dari aplikasi.' },
  { icon: 'Wrench', title: 'Lapor keluhan', text: 'Kerusakan dilaporkan dengan foto dan statusnya bisa dipantau.' },
  { icon: 'BellRing', title: 'Pengingat', text: 'Notifikasi sebelum jatuh tempo, jadi tidak lupa bayar.' },
]

export const STEPS = [
  { title: 'Hubungi pemilik', text: 'Chat lewat WhatsApp, sebutkan kamar yang kamu incar.' },
  { title: 'Survei kamar', text: 'Datang langsung untuk melihat kamar dan fasilitasnya.' },
  { title: 'Akun dibuatkan', text: 'Pemilik menempatkanmu di kamar dan membuatkan akun KostKuy.' },
  { title: 'Masuk & bayar', text: 'Login, ganti password, lalu bayar tagihan pertama. Selamat datang!' },
]

export const RULES = [
  { title: 'Jam bertamu', text: 'Jam malam pukul 23.00 WIB. Tamu wajib lapor ke pemilik, dan tamu lawan jenis dilarang masuk kamar.' },
  { title: 'Kebersihan', text: 'Jaga kebersihan kamar, dapur, dan kamar mandi bersama setelah dipakai. Dilarang merokok di dalam kamar.' },
  { title: 'Keamanan & ketenangan', text: 'Hormati penghuni lain dan jaga ketenangan, terutama di malam hari. Kerusakan fasilitas segera dilaporkan lewat menu Keluhan.' },
  { title: 'Listrik & peralatan', text: 'Matikan AC, lampu, dan peralatan listrik saat meninggalkan kamar.' },
]

export const FAQS = [
  { q: 'Bisa bayar per berapa bulan?', a: 'Bisa per 1, 6, atau 12 bulan. Makin lama periodenya, makin hemat.' },
  { q: 'Bagaimana cara bayarnya?', a: 'Transfer ke rekening pemilik, lalu unggah bukti transfer di aplikasi KostKuy. Pemilik akan mengonfirmasi pembayaranmu.' },
  { q: 'Apakah ada deposit?', a: 'Ada. Deposit sebesar 1 bulan sewa dibayar saat masuk dan dikembalikan saat keluar, dipotong jika ada kerusakan.' },
  { q: 'Listrik dan air bayar terpisah?', a: 'Tidak. Harga sewa sudah termasuk listrik, air, dan WiFi.' },
  { q: 'Kalau telat bayar kena denda?', a: 'Tidak ada denda keterlambatan, tapi pembayaran tetap wajib dilakukan paling lambat pada tanggal jatuh tempo.' },
  { q: 'Bisa pesan kamar lewat website?', a: 'Belum. Hubungi pemilik lewat WhatsApp dan survei dulu. Akun aplikasi dibuatkan setelah kamu resmi menempati kamar.' },
]

export const NEARBY = [
  { place: 'Kampus STT Terpadu Nurul Fikri', time: '3 menit' },
  { place: 'Stasiun Lenteng Agung', time: '7 menit' },
  { place: 'Minimarket & laundry', time: '1 menit' },
  { place: 'Warung makan & kafe', time: '2 menit' },
]

export const rupiah = (value) => 'Rp' + Number(value).toLocaleString('id-ID')

// Persentase hemat dibanding bayar bulanan selama periode yang sama.
export const savingPercent = (monthly, price, months) =>
  Math.round((1 - Number(price) / (Number(monthly) * months)) * 100)
