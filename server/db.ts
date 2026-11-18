import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'whatsapp.db');
export const db = new Database(DB_PATH);

// Optimize SQLite for high-concurrency desktop app
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT DEFAULT '',
      about TEXT DEFAULT 'Hey there! I am using WhatsApp.',
      thought TEXT DEFAULT '',
      is_online INTEGER DEFAULT 0,
      last_seen TEXT DEFAULT '',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      device_name TEXT DEFAULT 'WhatsApp Web (Chrome)',
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS qr_pairing (
      id TEXT PRIMARY KEY,
      qr_token TEXT UNIQUE NOT NULL,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      contact_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      alias_name TEXT,
      created_at INTEGER NOT NULL,
      UNIQUE(owner_id, contact_user_id)
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL, -- 'direct' | 'group' | 'channel'
      name TEXT,
      avatar TEXT,
      description TEXT,
      created_by TEXT REFERENCES users(id),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversation_members (
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT DEFAULT 'member', -- 'owner' | 'admin' | 'member'
      unread_count INTEGER DEFAULT 0,
      is_archived INTEGER DEFAULT 0,
      is_muted INTEGER DEFAULT 0,
      is_pinned INTEGER DEFAULT 0,
      is_favorite INTEGER DEFAULT 0,
      draft TEXT DEFAULT '',
      last_read_message_id TEXT,
      joined_at INTEGER NOT NULL,
      PRIMARY KEY (conversation_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT DEFAULT 'text', -- 'text' | 'image' | 'audio' | 'video' | 'document' | 'poll'
      text TEXT,
      media_url TEXT,
      file_name TEXT,
      file_size TEXT,
      audio_duration INTEGER,
      reply_to_id TEXT REFERENCES messages(id) ON DELETE SET NULL,
      status TEXT DEFAULT 'sent', -- 'sent' | 'delivered' | 'read'
      is_deleted INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS message_reactions (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      emoji TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE(message_id, user_id, emoji)
    );

    CREATE TABLE IF NOT EXISTS starred_messages (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL,
      PRIMARY KEY(user_id, message_id)
    );

    CREATE TABLE IF NOT EXISTS polls (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      allow_multiple INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS poll_options (
      id TEXT PRIMARY KEY,
      poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS poll_votes (
      poll_option_id TEXT NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL,
      PRIMARY KEY(poll_option_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS statuses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT DEFAULT 'text',
      media_url TEXT,
      caption TEXT,
      background_color TEXT DEFAULT '#005c4b',
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS status_views (
      status_id TEXT NOT NULL REFERENCES statuses(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      viewed_at INTEGER NOT NULL,
      PRIMARY KEY(status_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      avatar TEXT,
      owner_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      is_verified INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS channel_followers (
      channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      followed_at INTEGER NOT NULL,
      PRIMARY KEY(channel_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS channel_posts (
      id TEXT PRIMARY KEY,
      channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
      text TEXT,
      media_url TEXT,
      views_count INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS communities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      avatar TEXT,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS community_members (
      community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT DEFAULT 'member',
      joined_at INTEGER NOT NULL,
      PRIMARY KEY(community_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS community_groups (
      community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      PRIMARY KEY(community_id, conversation_id)
    );

    CREATE TABLE IF NOT EXISTS calls (
      id TEXT PRIMARY KEY,
      caller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
      type TEXT DEFAULT 'audio',
      status TEXT DEFAULT 'ringing',
      duration_seconds INTEGER DEFAULT 0,
      started_at INTEGER NOT NULL,
      ended_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      theme TEXT DEFAULT 'dark',
      notifications_enabled INTEGER DEFAULT 1,
      sound_enabled INTEGER DEFAULT 1,
      read_receipts_enabled INTEGER DEFAULT 1,
      app_lock_enabled INTEGER DEFAULT 0,
      app_lock_pin TEXT DEFAULT '',
      gemini_api_key TEXT DEFAULT '',
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blocked_users (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      blocked_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL,
      PRIMARY KEY(user_id, blocked_user_id)
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_conv_members ON conversation_members(user_id);
    CREATE INDEX IF NOT EXISTS idx_statuses_exp ON statuses(expires_at);
  `);

  try {
    db.exec("ALTER TABLE messages ADD COLUMN is_view_once INTEGER DEFAULT 0");
  } catch (_) {}
  try {
    db.exec("ALTER TABLE messages ADD COLUMN is_view_once_opened INTEGER DEFAULT 0");
  } catch (_) {}
  try {
    db.exec("ALTER TABLE user_settings ADD COLUMN groq_api_key TEXT DEFAULT ''");
  } catch (_) {}
  try {
    db.exec("ALTER TABLE user_settings ADD COLUMN groq_model TEXT DEFAULT 'openai/gpt-oss-120b'");
  } catch (_) {}

  seedCleanData();
}

export function seedCleanData() {
  const existingUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (existingUser) return;

  const now = Date.now();
  const passwordHash = bcrypt.hashSync('password123', 10);

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, phone, display_name, password_hash, avatar_url, about, thought, is_online, last_seen, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. User Utama: Mirza
  insertUser.run(
    'usr_mirza',
    'mirza',
    '+6281234567890',
    'Mirza',
    passwordHash,
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'Available for chat & collaboration 🚀',
    'WhatsApp Web Clone with Groq AI ⚡',
    1,
    'online',
    now
  );

  db.prepare(`
    INSERT INTO user_settings (user_id, theme, notifications_enabled, sound_enabled, read_receipts_enabled, app_lock_enabled, updated_at)
    VALUES ('usr_mirza', 'dark', 1, 1, 1, 0, ?)
  `).run(now);

  // 2. Fresh, Professional Contacts (Semua dibalas Groq AI secara cerdas dan kontekstual)
  const contactsData = [
    {
      id: 'usr_gemini',
      username: 'groq_ai',
      phone: '+1800436464',
      display_name: 'Groq AI Assistant',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      about: 'Powered by Groq openai/gpt-oss-120b 🤖',
      is_online: 1,
      last_seen: 'Always online',
      systemRole: 'Asisten AI cerdas, ramah, dan serba bisa.',
    },
    {
      id: 'usr_sarah',
      username: 'sarah_ui',
      phone: '+6281122334455',
      display_name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      about: 'UI/UX Designer & Design Systems 🎨',
      is_online: 1,
      last_seen: 'online',
      systemRole: 'Senior UI/UX Designer yang santai dan kreatif.',
    },
    {
      id: 'usr_alex',
      username: 'alex_tech',
      phone: '+6281298765432',
      display_name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      about: 'Full-Stack Lead & Cloud Architect ⚡',
      is_online: 1,
      last_seen: 'online',
      systemRole: 'Lead Software Engineer yang fokus performa dan arsitektur.',
    },
    {
      id: 'usr_david',
      username: 'david_mobile',
      phone: '+6281355667788',
      display_name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      about: 'Mobile Dev & Coffee lover ☕',
      is_online: 0,
      last_seen: 'Today at 07:45',
      systemRole: 'Mobile App Developer yang suka kopi dan teknologi baru.',
    },
    {
      id: 'usr_elena',
      username: 'elena_qa',
      phone: '+6281488990011',
      display_name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      about: 'Quality & Test Automation Specialist 🧪',
      is_online: 1,
      last_seen: 'online',
      systemRole: 'QA Engineer teliti dan ramah.',
    },
  ];

  for (const c of contactsData) {
    insertUser.run(
      c.id,
      c.username,
      c.phone,
      c.display_name,
      passwordHash,
      c.avatar,
      c.about,
      '',
      c.is_online,
      c.last_seen,
      now
    );

    db.prepare(`
      INSERT INTO contacts (id, owner_id, contact_user_id, created_at)
      VALUES (?, 'usr_mirza', ?, ?)
    `).run(`cnt_${c.id}`, c.id, now);
  }

  // 3. Fresh Active Conversations
  const convGeminiId = 'conv_gemini';
  db.prepare(`
    INSERT INTO conversations (id, type, name, created_by, created_at, updated_at)
    VALUES (?, 'direct', 'Groq AI Assistant', 'usr_mirza', ?, ?)
  `).run(convGeminiId, now - 86400000, now);

  db.prepare(`
    INSERT INTO conversation_members (conversation_id, user_id, joined_at)
    VALUES (?, 'usr_mirza', ?), (?, 'usr_gemini', ?)
  `).run(convGeminiId, now, convGeminiId, now);

  const insertMsg = db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_id, type, text, media_url, file_name, file_size, audio_duration, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMsg.run(
    'msg_gemini_1',
    convGeminiId,
    'usr_gemini',
    'text',
    'Halo Mirza! Saya Groq AI Assistant (openai/gpt-oss-120b). Semua chat di web ini sekarang terhubung ke AI langsung. Tanya saya apa saja! ✨',
    null,
    null,
    null,
    null,
    'read',
    now - 1200000,
    now - 1200000
  );

  // Conversation with Sarah Jenkins
  const convSarahId = 'conv_sarah';
  db.prepare(`
    INSERT INTO conversations (id, type, name, created_by, created_at, updated_at)
    VALUES (?, 'direct', 'Sarah Jenkins', 'usr_mirza', ?, ?)
  `).run(convSarahId, now - 86400000, now);

  db.prepare(`
    INSERT INTO conversation_members (conversation_id, user_id, is_pinned, joined_at)
    VALUES (?, 'usr_mirza', 1, ?), (?, 'usr_sarah', 0, ?)
  `).run(convSarahId, now, convSarahId, now);

  insertMsg.run(
    'msg_sarah_1',
    convSarahId,
    'usr_sarah',
    'text',
    'Hai Mirza! Desain UI WhatsApp Web yang kamu bangun ini keren banget, detailnya rapi! 👍',
    null,
    null,
    null,
    null,
    'read',
    now - 600000,
    now - 600000
  );

  // Conversation with Alex Rivera
  const convAlexId = 'conv_alex';
  db.prepare(`
    INSERT INTO conversations (id, type, name, created_by, created_at, updated_at)
    VALUES (?, 'direct', 'Alex Rivera', 'usr_mirza', ?, ?)
  `).run(convAlexId, now - 86400000, now);

  db.prepare(`
    INSERT INTO conversation_members (conversation_id, user_id, joined_at)
    VALUES (?, 'usr_mirza', ?), (?, 'usr_alex', ?)
  `).run(convAlexId, now, convAlexId, now);

  insertMsg.run(
    'msg_alex_1',
    convAlexId,
    'usr_alex',
    'text',
    'Bro, backend Express + Socket.IO + SQLite sudah jalan stabil di port 3001. Siap deploy!',
    null,
    null,
    null,
    null,
    'read',
    now - 300000,
    now - 300000
  );

  // Group: Engineering & Design Team
  const convGroupId = 'conv_team_group';
  db.prepare(`
    INSERT INTO conversations (id, type, name, avatar, description, created_by, created_at, updated_at)
    VALUES (?, 'group', 'Core Engineering & Design', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80', 'Grup Kolaborasi WhatsApp Web Clone', 'usr_mirza', ?, ?)
  `).run(convGroupId, now - 86400000, now);

  db.prepare(`
    INSERT INTO conversation_members (conversation_id, user_id, role, joined_at)
    VALUES (?, 'usr_mirza', 'owner', ?), (?, 'usr_sarah', 'admin', ?), (?, 'usr_alex', 'member', ?), (?, 'usr_david', 'member', ?)
  `).run(convGroupId, now, convGroupId, now, convGroupId, now, convGroupId, now);

  insertMsg.run(
    'msg_grp_1',
    convGroupId,
    'usr_mirza',
    'text',
    'Selamat datang di tim! Semua fitur realtime, media upload, dan integrasi AI sudah aktif.',
    null,
    null,
    null,
    null,
    'read',
    now - 86000000,
    now - 86000000
  );

  // 4. Archived Chat Example: Elena Rostova
  const convElenaId = 'conv_elena';
  db.prepare(`
    INSERT INTO conversations (id, type, name, created_by, created_at, updated_at)
    VALUES (?, 'direct', 'Elena Rostova', 'usr_mirza', ?, ?)
  `).run(convElenaId, now - 86400000, now);

  db.prepare(`
    INSERT INTO conversation_members (conversation_id, user_id, is_archived, unread_count, joined_at)
    VALUES (?, 'usr_mirza', 1, 0, ?), (?, 'usr_elena', 0, 0, ?)
  `).run(convElenaId, now, convElenaId, now);

  insertMsg.run(
    'msg_elena_1',
    convElenaId,
    'usr_elena',
    'text',
    'Test report sudah selesai diarsipkan ya Mirza. Silakan unarchive kapan saja!',
    null,
    null,
    null,
    null,
    'read',
    now - 7200000,
    now - 7200000
  );

  // 5. Fresh Statuses
  db.prepare(`
    INSERT INTO statuses (id, user_id, type, media_url, caption, background_color, created_at, expires_at)
    VALUES (?, 'usr_sarah', 'image', ?, 'Desain WhatsApp Web Clone sudah rampung! ✨', '#005c4b', ?, ?)
  `).run(
    'st_sarah_1',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    now - 3600000,
    now + 82800000
  );

  db.prepare(`
    INSERT INTO statuses (id, user_id, type, caption, background_color, created_at, expires_at)
    VALUES (?, 'usr_alex', 'text', 'Ngoding backend realtime seru banget hari ini! 💻🔥', '#008069', ?, ?)
  `).run(
    'st_alex_1',
    now - 7200000,
    now + 79200000
  );

  // 6. Fresh Channels
  db.prepare(`
    INSERT INTO channels (id, name, description, avatar, owner_id, is_verified, created_at)
    VALUES ('ch_wa', 'WhatsApp Official', 'Berita dan pembaruan resmi fitur WhatsApp Web Clone.', 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg', 'usr_mirza', 1, ?)
  `).run(now - 100000000);

  db.prepare(`
    INSERT INTO channel_followers (channel_id, user_id, followed_at)
    VALUES ('ch_wa', 'usr_mirza', ?)
  `).run(now);

  db.prepare(`
    INSERT INTO channel_posts (id, channel_id, text, media_url, views_count, created_at)
    VALUES ('post_1', 'ch_wa', 'Fitur AI Auto-Reply dengan Gemini 2.5 Flash kini resmi aktif! Coba kirim pesan ke kontak mana saja.', null, 12500, ?)
  `).run(now - 3600000);
}
