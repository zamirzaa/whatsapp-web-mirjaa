# Environment Setup — WhatsApp Web Clone

Panduan konfigurasi dan instalasi lingkungan lokal untuk menjalankan aplikasi.

## 1. Persyaratan Sistem

- **Node.js**: v18.0.0 atau lebih baru (Disarankan Node.js v20+ atau v24+)
- **NPM**: v9.0.0 atau lebih baru
- **Sistem Operasi**: Windows, macOS, atau Linux

## 2. File Konfigurasi `.env`

Buat file `.env` di direktori root aplikasi:

```env
# Port Server Backend
PORT=3001

# Secret Key untuk penandatanganan JSON Web Token (JWT)
JWT_SECRET=whatsapp_super_secret_jwt_key_2026

# Node Environment
NODE_ENV=development
```

## 3. Instalasi Dependensi

Jalankan perintah berikut:

```bash
npm install
```

## 4. Menjalankan Aplikasi

Aplikasi dapat dijalankan secara bersamaan (Backend Server + Frontend Vite) menggunakan satu perintah:

```bash
npm run dev
```

Output:
- Backend Server: `http://localhost:3001`
- Frontend Client: `http://localhost:5173`

Atau jika ingin menjalankan secara terpisah:

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

## 5. Akun Pengguna Bawaan (Seed Data)

Database secara otomatis diinisialisasi dan di-seed saat pertama kali dijalankan:

- **Username**: `mirza`
- **Nomor Telepon**: `+6281234567890`
- **Password**: `password123`
- **Tersedia juga opsi**: Klik tombol **"One-Click Scan & Enter"** di layar login untuk langsung masuk tanpa mengetik.
