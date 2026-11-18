import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { requireAuth, type AuthRequest } from '../auth';

const router = Router();

// Get active statuses (24h validity)
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const now = Date.now();

  const activeStatuses = db.prepare(`
    SELECT
      s.id,
      s.user_id as userId,
      s.type,
      s.media_url as mediaUrl,
      s.caption,
      s.background_color as backgroundColor,
      s.created_at as timestampRaw,
      u.display_name as userName,
      u.avatar_url as userAvatar,
      (SELECT COUNT(*) FROM status_views sv WHERE sv.status_id = s.id AND sv.user_id = ?) as has_seen
    FROM statuses s
    JOIN users u ON s.user_id = u.id
    WHERE s.expires_at > ?
    ORDER BY s.created_at DESC
  `).all(userId, now) as any[];

  // Group by user
  const grouped: Record<string, any> = {};

  for (const item of activeStatuses) {
    if (!grouped[item.userId]) {
      grouped[item.userId] = {
        userId: item.userId,
        userName: item.userName,
        userAvatar: item.userAvatar,
        allSeen: true,
        items: [],
      };
    }

    if (!item.has_seen && item.userId !== userId) {
      grouped[item.userId].allSeen = false;
    }

    grouped[item.userId].items.push({
      id: item.id,
      userId: item.userId,
      type: item.type,
      mediaUrl: item.mediaUrl || '',
      caption: item.caption,
      backgroundColor: item.backgroundColor,
      timestamp: new Date(item.timestampRaw).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }

  // Ensure "me" is first if exists
  const result = Object.values(grouped);
  result.sort((a: any, b: any) => {
    if (a.userId === userId) return -1;
    if (b.userId === userId) return 1;
    return 0;
  });

  res.json(result);
});

// Create status
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { type = 'text', mediaUrl, caption, backgroundColor = '#005c4b' } = req.body;

  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours expiry
  const statusId = `st_${uuidv4().slice(0, 10)}`;

  db.prepare(`
    INSERT INTO statuses (id, user_id, type, media_url, caption, background_color, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(statusId, userId, type, mediaUrl || null, caption || '', backgroundColor, now, expiresAt);

  res.json({ success: true, id: statusId });
});

// Mark status as viewed
router.post('/:id/view', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const statusId = req.params.id;

  db.prepare(`
    INSERT OR IGNORE INTO status_views (status_id, user_id, viewed_at)
    VALUES (?, ?, ?)
  `).run(statusId, userId, Date.now());

  res.json({ success: true });
});

export default router;
