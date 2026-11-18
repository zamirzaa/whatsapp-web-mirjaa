import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { generateToken, requireAuth, type AuthRequest } from '../auth';

const router = Router();

// Register new user
router.post('/register', (req, res) => {
  const { username, phone, displayName, password } = req.body;
  if (!username || !phone || !displayName || !password) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE username = ? OR phone = ?').get(username, phone);
    if (existing) {
      res.status(409).json({ error: 'Username or phone already registered' });
      return;
    }

    const userId = `usr_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const now = Date.now();

    db.prepare(`
      INSERT INTO users (id, username, phone, display_name, password_hash, avatar_url, about, thought, is_online, created_at)
      VALUES (?, ?, ?, ?, ?, '', 'Hey there! I am using WhatsApp.', '', 1, ?)
    `).run(userId, username.toLowerCase(), phone, displayName, passwordHash, now);

    db.prepare(`
      INSERT INTO user_settings (user_id, theme, notifications_enabled, sound_enabled, read_receipts_enabled, app_lock_enabled, updated_at)
      VALUES (?, 'dark', 1, 1, 1, 0, ?)
    `).run(userId, now);

    const user = { id: userId, username: username.toLowerCase(), phone, display_name: displayName };
    const token = generateToken(user);

    res.json({ token, user: { ...user, avatar_url: '', about: 'Hey there! I am using WhatsApp.' } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Login with username or phone & password
router.post('/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    res.status(400).json({ error: 'Identifier and password are required' });
    return;
  }

  const user = db.prepare(`
    SELECT id, username, phone, display_name, password_hash, avatar_url, about, thought
    FROM users
    WHERE username = ? OR phone = ?
  `).get(identifier.toLowerCase(), identifier) as any;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: 'Invalid username/phone or password' });
    return;
  }

  const token = generateToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      phone: user.phone,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      about: user.about,
      thought: user.thought,
    },
  });
});

// Demo/Fast QR instant login
router.post('/quick-login', (req, res) => {
  const defaultUser = db.prepare(`
    SELECT id, username, phone, display_name, avatar_url, about, thought
    FROM users
    WHERE id = 'usr_mirza'
  `).get() as any;

  if (!defaultUser) {
    res.status(404).json({ error: 'Default account not found' });
    return;
  }

  const token = generateToken(defaultUser);
  res.json({
    token,
    user: {
      id: defaultUser.id,
      username: defaultUser.username,
      phone: defaultUser.phone,
      displayName: defaultUser.display_name,
      avatarUrl: defaultUser.avatar_url,
      about: defaultUser.about,
      thought: defaultUser.thought,
    },
  });
});

// Generate QR Code session
router.get('/qr/generate', (_req, res) => {
  const qrToken = `qr_${uuidv4().replace(/-/g, '')}`;
  const now = Date.now();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes

  db.prepare(`
    INSERT INTO qr_pairing (id, qr_token, status, created_at, expires_at)
    VALUES (?, ?, 'pending', ?, ?)
  `).run(uuidv4(), qrToken, now, expiresAt);

  res.json({ qrToken, expiresAt });
});

// Poll QR status
router.get('/qr/status/:token', (req, res) => {
  const { token } = req.params;
  const pairing = db.prepare(`
    SELECT q.*, u.username, u.phone, u.display_name, u.avatar_url, u.about, u.thought
    FROM qr_pairing q
    LEFT JOIN users u ON q.user_id = u.id
    WHERE q.qr_token = ?
  `).get(token) as any;

  if (!pairing) {
    res.status(404).json({ error: 'QR session not found' });
    return;
  }

  if (Date.now() > pairing.expires_at) {
    res.json({ status: 'expired' });
    return;
  }

  if (pairing.status === 'confirmed' && pairing.user_id) {
    const user = {
      id: pairing.user_id,
      username: pairing.username,
      phone: pairing.phone,
      display_name: pairing.display_name,
    };
    const sessionToken = generateToken(user);
    res.json({
      status: 'confirmed',
      token: sessionToken,
      user: {
        id: pairing.user_id,
        username: pairing.username,
        phone: pairing.phone,
        displayName: pairing.display_name,
        avatarUrl: pairing.avatar_url,
        about: pairing.about,
        thought: pairing.thought,
      },
    });
    return;
  }

  res.json({ status: 'pending' });
});

// Get current user profile
router.get('/me', requireAuth, (req: AuthRequest, res) => {
  const user = db.prepare(`
    SELECT u.id, u.username, u.phone, u.display_name, u.avatar_url, u.about, u.thought,
           s.theme, s.notifications_enabled, s.sound_enabled, s.read_receipts_enabled, s.app_lock_enabled
    FROM users u
    LEFT JOIN user_settings s ON u.id = s.user_id
    WHERE u.id = ?
  `).get(req.user!.id) as any;

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    phone: user.phone,
    name: user.display_name,
    avatar: user.avatar_url,
    about: user.about,
    thought: user.thought,
    settings: {
      theme: user.theme || 'dark',
      notificationsEnabled: Boolean(user.notifications_enabled),
      soundEnabled: Boolean(user.sound_enabled),
      readReceiptsEnabled: Boolean(user.read_receipts_enabled),
      appLockEnabled: Boolean(user.app_lock_enabled),
    },
  });
});

// Update profile
router.put('/profile', requireAuth, (req: AuthRequest, res) => {
  const { name, about, avatar, thought } = req.body;
  const userId = req.user!.id;

  if (name !== undefined) {
    db.prepare('UPDATE users SET display_name = ? WHERE id = ?').run(name, userId);
  }
  if (about !== undefined) {
    db.prepare('UPDATE users SET about = ? WHERE id = ?').run(about, userId);
  }
  if (avatar !== undefined) {
    db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(avatar, userId);
  }
  if (thought !== undefined) {
    db.prepare('UPDATE users SET thought = ? WHERE id = ?').run(thought, userId);
  }

  res.json({ success: true });
});

// Get Groq API Key status
router.get('/groq-key', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const setting = db.prepare('SELECT groq_api_key, groq_model FROM user_settings WHERE user_id = ?').get(userId) as any;
  const key = setting?.groq_api_key || process.env.GROQ_API_KEY || '';
  const model = setting?.groq_model || process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  res.json({
    configured: Boolean(key && key.trim().length > 10),
    preview: key ? `${key.slice(0, 6)}...${key.slice(-4)}` : '',
    model,
  });
});

// Update Groq API Key
router.put('/groq-key', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { apiKey, model } = req.body;
  const m = model || 'openai/gpt-oss-120b';
  db.prepare(`
    INSERT INTO user_settings (user_id, groq_api_key, groq_model, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET groq_api_key = ?, groq_model = ?, updated_at = ?
  `).run(userId, apiKey || '', m, Date.now(), apiKey || '', m, Date.now());

  res.json({ success: true, configured: Boolean(apiKey && apiKey.trim().length > 10) });
});

export default router;
