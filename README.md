# WhatsApp Web Clone — Full-Featured Standalone Replica

Aplikasi komunikasi web dan instant messaging yang mereplikasi desain UI/UX, navigasi, interaksi, serta fitur WhatsApp Web versi terbaru. Dibangun sebagai aplikasi full-stack mandiri dengan backend, database relasional SQLite, REST API, sistem realtime Socket.IO, dan signaling WebRTC.

---

## 🚀 Fitur Utama

- 🎨 **Replikasi Visual WhatsApp Web 1:1**:
  - Dukungan penuh **Light Mode** dan **Dark Mode** yang presisi sesuai tangkapan layar WhatsApp Web resmi.
  - Far-Left Navigation Rail (Chats, Status, Channels, Communities, Meta AI, Starred, Settings).
  - Sidebar percakapan dengan filter pills (*All*, *Unread*, *Favorites*, *Groups*), pencarian, dan arsip.
  - Chat wallpaper doodle autentik WhatsApp.
  - Right Drawer (*Contact Info*, *Search Messages*).
- 🔐 **Autentikasi Nyata & Pairing**:
  - Registrasi pengguna baru.
  - Login dengan username / nomor telepon dan password.
  - Sesi pairing QR-Code sekali pakai dengan polling token.
  - Opsi *One-Click Scan & Enter* untuk pengujian instan.
- 💬 **Sistem Pesan Realtime**:
  - Pengiriman pesan teks, gambar, dokumen, voice note, dan polling.
  - Status tanda centang (sent, delivered, read double-check biru/hijau).
  - Quote reply, hapus pesan (soft-delete), bintang pesan (*starred*), dan reaksi emoji (👍❤️😂😮😢🙏).
  - Indikator sedang mengetik (*typing indicator*) dan status online/offline.
- 📁 **Media & File Storage**:
  - Endpoint upload multipart dengan Multer disimpan ke folder `uploads/`.
  - Preview gambar, galeri berkas, pemutar voice note dengan visualisasi audio.
- 👥 **Group, Channel & Community**:
  - Pembuatan grup obrolan dengan pemilihan anggota dan peran admin/owner.
  - Saluran siaran (*Channels*) dengan fitur follow dan post updates.
  - Komunitas topik.
- ⏱️ **Status System**:
  - Cerita teks dan media dengan batas kedaluwarsa otomatis 24 jam.
  - Pencatat penonton status (*views tracker*).
- 📞 **Panggilan Audio & Video**:
  - Antarmuka panggilan suara dan video dengan WebRTC signaling melalui Socket.IO.
  - Kontrol bisu mikrofon, matikan kamera, dan durasi panggilan.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Socket.IO Client.
- **Backend**: Node.js, Express 5, Socket.IO 4, Multer, JWT, BcryptJS.
- **Database**: SQLite via `better-sqlite3` (WAL mode, Foreign Keys).
- **Storage**: Local static object storage (`uploads/`).

---

## 📦 Menjalankan Aplikasi

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Aplikasi (Backend + Frontend Sekaligus)
```bash
npm run dev
```

- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

### 3. Akun Bawaan (Seed Demo)
- **Username**: `mirza`
- **Nomor Telepon**: `+6281234567890`
- **Password**: `password123`
- Atau klik langsung tombol **"One-Click Scan & Enter"** di layar QR.

---

## 📚 Dokumentasi Terkait

- [PROJECT_ARCHITECTURE.md](file:///c:/Users/pc10a/Documents/whatsapp-web-mirjaa-main/PROJECT_ARCHITECTURE.md)
- [DATABASE_SCHEMA.md](file:///c:/Users/pc10a/Documents/whatsapp-web-mirjaa-main/DATABASE_SCHEMA.md)
- [API_DOCUMENTATION.md](file:///c:/Users/pc10a/Documents/whatsapp-web-mirjaa-main/API_DOCUMENTATION.md)
- [ENVIRONMENT_SETUP.md](file:///c:/Users/pc10a/Documents/whatsapp-web-mirjaa-main/ENVIRONMENT_SETUP.md)
- [IMPLEMENTATION_STATUS.md](file:///c:/Users/pc10a/Documents/whatsapp-web-mirjaa-main/IMPLEMENTATION_STATUS.md)
