# WhatsApp Web Clone — REST & WebSocket API Documentation

Semua endpoint REST berada di bawah prefix `/api`. Header autentikasi: `Authorization: Bearer <token>`.

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Mendaftarkan akun baru.
- **Request Body**:
  ```json
  {
    "username": "budi_s",
    "phone": "+6281299998888",
    "displayName": "Budi Santoso",
    "password": "password123"
  }
  ```
- **Response**: `{ "token": "...", "user": { ... } }`

### `POST /api/auth/login`
Masuk dengan username / nomor HP dan password.
- **Request Body**:
  ```json
  {
    "identifier": "mirza",
    "password": "password123"
  }
  ```
- **Response**: `{ "token": "...", "user": { ... } }`

### `POST /api/auth/quick-login`
Masuk instan ke akun demo aktif (`mirza`).

### `GET /api/auth/qr/generate`
Membuat token sesi QR pairing baru.

### `GET /api/auth/qr/status/:token`
Mengecek status pairing sesi QR.

### `GET /api/auth/me`
Mendapatkan profil dan pengaturan akun saat ini.

### `PUT /api/auth/profile`
Memperbarui nama, bio (about), foto profil, atau thought.

---

## 2. Chats (`/api/chats`)

### `GET /api/chats`
Daftar semua percakapan pengguna (diurutkan berdasarkan pinned & aktivitas pesan terbaru).

### `POST /api/chats`
Membuat percakapan langsung atau grup baru.
- **Request Body Direct**: `{ "type": "direct", "recipientId": "usr_ralf" }`
- **Request Body Group**:
  ```json
  {
    "type": "group",
    "name": "Frontend Team",
    "avatar": "https://...",
    "memberIds": ["usr_ralf", "usr_alice"]
  }
  ```

### `GET /api/chats/:id/messages`
Mengambil semua riwayat pesan dalam chat beserta reaksi dan polling.

### `PUT /api/chats/:id/read`
Menandai pesan dalam chat telah dibaca (`unread_count = 0`).

### `PUT /api/chats/:id/archive`
Arsipkan / batalkan arsip percakapan.

### `PUT /api/chats/:id/pin`
Sematkan / lepas sematan percakapan.

### `PUT /api/chats/:id/mute`
Bisukan notifikasi percakapan.

---

## 3. Messages (`/api/messages`)

### `POST /api/messages`
Mengirim pesan baru.
- **Request Body**:
  ```json
  {
    "chatId": "conv_ralf",
    "text": "Halo Ralf!",
    "type": "text",
    "mediaUrl": null,
    "replyToId": null
  }
  ```

### `DELETE /api/messages/:id`
Menghapus pesan (soft-delete).

### `POST /api/messages/:id/reaction`
Menambah atau menghapus reaksi emoji pada pesan.

### `POST /api/messages/:id/star`
Bintang / batalkan bintang pesan.

### `POST /api/messages/:id/poll-vote`
Memberikan suara pada opsi polling.

### `GET /api/messages/search?q=keyword`
Mencari pesan berdasarkan kata kunci.

---

## 4. Media & Berkas (`/api/upload`)

### `POST /api/upload`
Upload multipart file (dokumen, foto, audio, video).
- **Form Data**: `file`
- **Response**:
  ```json
  {
    "url": "/uploads/1731800000_abc123.jpg",
    "fileName": "document.pdf",
    "fileSize": "1.8 MB",
    "mimeType": "application/pdf"
  }
  ```

---

## 5. Realtime Socket.IO Events

| Event Name | Direction | Payload |
|---|---|---|
| `message:new` | Server -> Client | `{ chatId, message }` |
| `message:deleted` | Server -> Client | `{ chatId, messageId }` |
| `message:reaction` | Server -> Client | `{ chatId, messageId, emoji, action }` |
| `conversation:typing` | Bi-directional | `{ chatId, isTyping }` |
| `user:online` | Server -> Client | `{ userId, isOnline }` |
| `user:offline` | Server -> Client | `{ userId, lastSeen }` |
| `call:initiate` | Client -> Server | `{ recipientId, type }` |
| `call:incoming` | Server -> Client | `{ caller, type }` |
| `call:accept` | Client -> Server | `{ callerId }` |
| `call:reject` | Client -> Server | `{ callerId }` |
| `call:end` | Client -> Server | `{ recipientId }` |
| `webrtc:offer` | Client -> Client | `{ targetUserId, sdp }` |
| `webrtc:answer` | Client -> Client | `{ targetUserId, sdp }` |
| `webrtc:ice-candidate` | Client -> Client | `{ targetUserId, candidate }` |
