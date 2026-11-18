# Database Schema — WhatsApp Web Clone

Database menggunakan SQLite (didukung oleh driver performa tinggi `better-sqlite3`) dengan WAL mode (`Write-Ahead Logging`) dan referential integrity (`foreign_keys = ON`).

## Tables & Relations

### 1. `users`
Tabel pengguna utama aplikasi.
- `id` (TEXT, PRIMARY KEY): ID unik user (contoh: `usr_mirza`).
- `username` (TEXT, UNIQUE): Username unik login.
- `phone` (TEXT, UNIQUE): Nomor telepon terdaftar.
- `display_name` (TEXT): Nama tampilan profil.
- `password_hash` (TEXT): Hash bcrypt password.
- `avatar_url` (TEXT): Foto profil.
- `about` (TEXT): Status bio info.
- `thought` (TEXT): Catatan singkat harian.
- `is_online` (INTEGER): Status online (0 atau 1).
- `last_seen` (TEXT): Keterangan terakhir aktif.
- `created_at` (INTEGER): Epoch millisecond.

### 2. `sessions`
Sesi aktif perangkat pengguna.
- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT REFERENCES users(id))
- `token` (TEXT UNIQUE)
- `device_name` (TEXT)
- `created_at` (INTEGER)
- `expires_at` (INTEGER)

### 3. `qr_pairing`
Sistem pairing login berbasis QR Code sekali pakai.
- `id` (TEXT, PRIMARY KEY)
- `qr_token` (TEXT UNIQUE)
- `user_id` (TEXT REFERENCES users(id))
- `status` (TEXT): `pending` | `confirmed` | `expired`
- `created_at` (INTEGER)
- `expires_at` (INTEGER)

### 4. `contacts`
Daftar buku kontak antar pengguna.
- `id` (TEXT, PRIMARY KEY)
- `owner_id` (TEXT REFERENCES users(id))
- `contact_user_id` (TEXT REFERENCES users(id))
- `alias_name` (TEXT)
- `created_at` (INTEGER)

### 5. `conversations`
Ruang percakapan (Direct / Group / Channel).
- `id` (TEXT, PRIMARY KEY)
- `type` (TEXT): `direct` | `group` | `channel`
- `name` (TEXT)
- `avatar` (TEXT)
- `description` (TEXT)
- `created_by` (TEXT REFERENCES users(id))
- `created_at` (INTEGER)
- `updated_at` (INTEGER)

### 6. `conversation_members`
Keanggotaan percakapan & preferensi individual.
- `conversation_id` (TEXT REFERENCES conversations(id))
- `user_id` (TEXT REFERENCES users(id))
- `role` (TEXT): `owner` | `admin` | `member`
- `unread_count` (INTEGER DEFAULT 0)
- `is_archived` (INTEGER DEFAULT 0)
- `is_muted` (INTEGER DEFAULT 0)
- `is_pinned` (INTEGER DEFAULT 0)
- `is_favorite` (INTEGER DEFAULT 0)
- `draft` (TEXT)
- `last_read_message_id` (TEXT)
- `joined_at` (INTEGER)
- PRIMARY KEY (`conversation_id`, `user_id`)

### 7. `messages`
Riwayat pesan (Text, Media, Dokumen, Voice Note, Polling).
- `id` (TEXT, PRIMARY KEY)
- `conversation_id` (TEXT REFERENCES conversations(id))
- `sender_id` (TEXT REFERENCES users(id))
- `type` (TEXT): `text` | `image` | `audio` | `video` | `document` | `poll`
- `text` (TEXT)
- `media_url` (TEXT)
- `file_name` (TEXT)
- `file_size` (TEXT)
- `audio_duration` (INTEGER)
- `reply_to_id` (TEXT REFERENCES messages(id))
- `status` (TEXT): `sent` | `delivered` | `read`
- `is_deleted` (INTEGER DEFAULT 0)
- `created_at` (INTEGER)
- `updated_at` (INTEGER)

### 8. `message_reactions`
Reaksi emoji pada pesan.
- `id` (TEXT, PRIMARY KEY)
- `message_id` (TEXT REFERENCES messages(id))
- `user_id` (TEXT REFERENCES users(id))
- `emoji` (TEXT)
- `created_at` (INTEGER)
- UNIQUE (`message_id`, `user_id`, `emoji`)

### 9. `starred_messages`
Pesan berbintang per pengguna.
- `user_id` (TEXT REFERENCES users(id))
- `message_id` (TEXT REFERENCES messages(id))
- `created_at` (INTEGER)
- PRIMARY KEY (`user_id`, `message_id`)

### 10. `polls`, `poll_options`, `poll_votes`
Sistem polling interaktif dalam percakapan.

### 11. `statuses` & `status_views`
Status cerita (24-hour disappearing status) dengan pencatat penonton (views).

### 12. `channels`, `channel_followers`, `channel_posts`
Saluran siaran publik, followers, dan update postingan.

### 13. `calls`
Riwayat panggilan audio & video WebRTC.

### 14. `user_settings`
Pengaturan tema (dark/light), notifikasi, tanda baca, kunci aplikasi.
