# WhatsApp Web Clone — Project Architecture

Aplikasi ini dirancang sebagai aplikasi messaging full-stack standalone dengan arsitektur modular, scalable, dan realtime.

## 1. High-Level Diagram

```
+-------------------------------------------------------------+
|                     Client (Browser)                        |
|  - React 19 + TypeScript + Vite                             |
|  - Tailwind CSS v4 (Light / Dark WhatsApp Replica)          |
|  - Lucide React Iconography                                 |
|  - WhatsAppContext (Global state & optimistic store)        |
|  - Socket.IO Client (Bi-directional realtime stream)        |
+-------------------------------------------------------------+
                              |
                     HTTP / WebSocket
                              |
+-------------------------------------------------------------+
|               Backend Application (Node.js)                 |
|  - Express 5 REST API Engine                                |
|  - Socket.IO 4 Realtime Server                              |
|  - JWT Authentication & Session Manager                     |
|  - Multer File / Media Upload Pipeline                      |
|  - WebRTC Audio / Video Signaling Hub                       |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                     Database & Storage                      |
|  - SQLite (better-sqlite3) with WAL Mode & Foreign Keys     |
|  - Persistent storage in data/whatsapp.db                   |
|  - Uploaded media storage in uploads/                       |
+-------------------------------------------------------------+
```

## 2. Directory Structure

```
├── data/                    # SQLite database persistent storage
│   └── whatsapp.db
├── uploads/                 # Static user uploads (images, docs, audio)
├── server/                  # Backend Node.js / Express / Socket.IO
│   ├── auth.ts              # JWT signing, verification & auth middleware
│   ├── db.ts                # SQLite schema, tables & initial seed data
│   ├── index.ts             # Server entry point (port 3001)
│   ├── socket.ts            # Realtime events, presence & WebRTC signaling
│   └── routes/
│       ├── auth.ts          # Register, Login, QR Pairing, Profile
│       ├── channels.ts      # Channels discovery, posts & follow
│       ├── chats.ts         # Conversations list, create, archive, pin, mute
│       ├── contacts.ts      # Contacts list & addition
│       ├── messages.ts      # Message send, delete, reaction, star, poll
│       ├── status.ts        # Status creation & auto-expiry feed
│       └── upload.ts        # Multer disk storage upload
├── src/                     # Frontend Application
│   ├── components/
│   │   ├── auth/            # Auth & QR linking screen
│   │   ├── chat/            # Chat header, message list, bubbles, input
│   │   ├── modals/          # Call, media viewer, poll, app lock, status
│   │   ├── navigation/      # Far-left NavRail
│   │   ├── rightpanel/      # Contact info, message search drawers
│   │   ├── sidebar/         # Chat list, item previews
│   │   └── views/           # Settings, status, channels, new chat flows
│   ├── context/
│   │   └── WhatsAppContext.tsx # Central store connecting API & sockets
│   ├── services/
│   │   ├── api.ts           # Typed REST client
│   │   └── socket.ts        # Socket.IO connection manager
│   ├── types/
│   │   └── whatsapp.ts      # TypeScript interfaces
│   └── utils/
│       └── audio.ts         # Synthesis audio & notification ringtones
├── package.json
└── vite.config.ts
```

## 3. Communication Protocols

1. **REST API**:
   - Digunakan untuk operasi data persisten (Autentikasi, Fetch History Chat, Tambah Kontak, Upload Berkas).
   - Base endpoint: `/api`.
   - Autentikasi menggunakan header `Authorization: Bearer <token>`.

2. **WebSocket (Socket.IO)**:
   - Digunakan untuk realtime event broadcasting:
     - `message:new`
     - `message:deleted`
     - `message:reaction`
     - `message:read`
     - `conversation:typing`
     - `user:online` / `user:offline`
     - `call:initiate`, `call:accept`, `call:reject`, `call:end`
     - WebRTC signaling (`webrtc:offer`, `webrtc:answer`, `webrtc:ice-candidate`)
