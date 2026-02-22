# 🎟️ TiketIn — Frontend

Aplikasi frontend untuk sistem pembelian tiket event berbasis web, dibangun dengan **React + Vite + Tailwind CSS** dan terhubung ke backend Laravel.

---

## 🖥️ Tech Stack

| Teknologi | Versi |
|---|---|
| React | 18+ |
| Vite | 5+ |
| Tailwind CSS | 3+ |
| React Router DOM | 6+ |
| qrcode.react | — |
| html5-qrcode | — |

---

## ✨ Fitur

### 👤 Pembeli (Buyer)
- 🔐 Registrasi & Login dengan JWT (Sanctum)
- 📋 Lihat daftar event yang tersedia
- 🔍 Detail event & sesi
- 💺 Pilih kursi interaktif (seat map)
- 🛒 Checkout dengan ringkasan pesanan & countdown timer
- 💳 Pilih metode pembayaran (Transfer Bank / Midtrans)
- ✅ Halaman sukses dengan QR code e-ticket

### 🔑 Admin
- 🎪 CRUD Event (buat, edit, hapus)
- 🗓️ CRUD Sesi per event

### 💰 Finance
- 📊 Dashboard order dengan statistik
- ✅ Verifikasi pembayaran manual
- 📄 Tabel order dengan pagination

### 🚪 Gate Officer
- 📷 Scan QR code tiket via kamera
- ✅ Validasi tiket masuk secara real-time

---

## 🗂️ Struktur Folder

```
src/
├── components/
│   ├── Navbar.jsx          # Navigasi utama (dinamis per role)
│   ├── ProtectedRoute.jsx  # Guard: harus login
│   └── RoleRoute.jsx       # Guard: akses per role
├── context/
│   ├── AuthContext.jsx     # State autentikasi global
│   └── BookingContext.jsx  # State pemesanan (seat → checkout)
├── pages/
│   ├── EventList.jsx       # Halaman daftar event
│   ├── EventDetail.jsx     # Detail event & sesi
│   ├── SeatMapPage.jsx     # Pilih kursi interaktif
│   ├── Checkout.jsx        # Ringkasan pesanan & pembayaran
│   ├── Payment.jsx         # Instruksi pembayaran
│   ├── Success.jsx         # Konfirmasi + QR e-ticket
│   ├── Login.jsx           # Halaman login
│   ├── Register.jsx        # Halaman registrasi
│   ├── AdminScanner.jsx    # Scan QR gate officer
│   └── admin/
│       ├── AdminEvents.jsx      # Tabel CRUD event
│       ├── AdminEventForm.jsx   # Form tambah/edit event
│       ├── AdminSessions.jsx    # Tabel sesi per event
│       ├── AdminSessionForm.jsx # Form tambah/edit sesi
│       └── FinanceDashboard.jsx # Dashboard keuangan
└── services/
    └── api.js              # Semua fungsi API ke backend
```

---

## 🚀 Cara Menjalankan

### 1. Clone & Install

```bash
git clone https://github.com/alikmakanmie/ticketing-fe.git
cd ticketing-fe
npm install
```

### 2. Konfigurasi Environment

Edit `src/services/api.js` dan sesuaikan `BASE_URL`:

```js
const BASE_URL = "http://localhost:8000/api"; // Sesuaikan dengan URL backend Laravel
```

### 3. Jalankan Dev Server

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:5173**

> ⚠️ Pastikan backend Laravel sudah berjalan di port 8000

---

## 🔐 Role & Akses Halaman

| Role | Halaman yang Bisa Diakses |
|---|---|
| **buyer** | Event List, Event Detail, Seat Map, Checkout, Payment, Success |
| **admin** | Semua + `/admin/events`, `/admin/events/:id/sessions` |
| **finance** | `/admin/finance` |
| **gate_officer** | `/admin/scanner` |

### Akun Demo (dari seeder backend)

| Email | Password | Role |
|---|---|---|
| `admin@tiket.in` | `password` | admin |
| `finance@tiket.in` | `password` | finance |
| `gate@tiket.in` | `password` | gate_officer |
| `budi@example.com` | `password` | buyer |

---

## 🔗 Routing

| Path | Halaman | Guard |
|---|---|---|
| `/` | Daftar Event | Publik |
| `/events/:slug` | Detail Event | Publik |
| `/sessions/:sessionId/seats` | Pilih Kursi | Publik (butuh login untuk pesan) |
| `/login` | Login | Publik |
| `/register` | Registrasi | Publik |
| `/checkout` | Checkout | 🔒 Login |
| `/payment` | Pembayaran | 🔒 Login |
| `/success` | Sukses | 🔒 Login |
| `/admin/events` | Kelola Event | 🔒 Admin |
| `/admin/events/:id/sessions` | Kelola Sesi | 🔒 Admin |
| `/admin/finance` | Dashboard Keuangan | 🔒 Finance / Admin |
| `/admin/scanner` | Scan QR | 🔒 Gate Officer / Admin |

---

## 🔌 Backend

Repo backend: [alikmakanmie/laraveltiketin](https://github.com/alikmakanmie/laraveltiketin)

---

## 📸 Screenshots

> Coming soon...

---

## 📄 Lisensi

MIT License © 2026 alikmakanmie
