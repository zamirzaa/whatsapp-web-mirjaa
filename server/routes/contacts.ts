import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { requireAuth, type AuthRequest } from '../auth';

const router = Router();

// Get contacts of current user
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const contacts = db.prepare(`
    SELECT
      u.id,
      COALESCE(c.alias_name, u.display_name) as name,
      u.phone as phoneNumber,
      u.avatar_url as avatar,
      u.about,
      u.is_online as isOnline,
      u.last_seen as lastSeen
    FROM contacts c
    JOIN users u ON c.contact_user_id = u.id
    WHERE c.owner_id = ?
    ORDER BY u.display_name ASC
  `).all(userId) as any[];

  res.json(contacts.map(c => ({
    ...c,
    isOnline: Boolean(c.isOnline),
  })));
});

// Add contact
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { phone, username, aliasName } = req.body;

  let targetUser = null;
  if (phone) {
    targetUser = db.prepare('SELECT id, display_name FROM users WHERE phone = ?').get(phone) as any;
  } else if (username) {
    targetUser = db.prepare('SELECT id, display_name FROM users WHERE username = ?').get(username.toLowerCase()) as any;
  }

  if (!targetUser) {
    // If not found, create guest contact user entry so user can still chat with the number
    const newGuestId = `usr_${uuidv4().slice(0, 8)}`;
    const now = Date.now();
    db.prepare(`
      INSERT INTO users (id, username, phone, display_name, password_hash, avatar_url, about, created_at)
      VALUES (?, ?, ?, ?, '', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Hey there! I am using WhatsApp.', ?)
    `).run(newGuestId, `user_${newGuestId}`, phone || username, aliasName || phone || username, now);

    targetUser = { id: newGuestId, display_name: aliasName || phone || username };
  }

  // Create contact relationship
  try {
    db.prepare(`
      INSERT OR REPLACE INTO contacts (id, owner_id, contact_user_id, alias_name, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(`cnt_${uuidv4().slice(0, 10)}`, userId, targetUser.id, aliasName || null, Date.now());

    res.json({ success: true, contactId: targetUser.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
