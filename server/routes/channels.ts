import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { requireAuth, type AuthRequest } from '../auth';

const router = Router();

// Get channels
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const channels = db.prepare(`
    SELECT
      c.*,
      (SELECT COUNT(*) FROM channel_followers cf WHERE cf.channel_id = c.id) as follower_count,
      (SELECT COUNT(*) FROM channel_followers cf WHERE cf.channel_id = c.id AND cf.user_id = ?) as is_following
    FROM channels c
    ORDER BY c.created_at DESC
  `).all(userId) as any[];

  const result = channels.map(ch => {
    const posts = db.prepare(`
      SELECT id, text, media_url as mediaUrl, views_count as views, created_at as timestampRaw
      FROM channel_posts
      WHERE channel_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).all(ch.id) as any[];

    return {
      id: ch.id,
      name: ch.name,
      description: ch.description,
      avatar: ch.avatar,
      isVerified: Boolean(ch.is_verified),
      isFollowing: Boolean(ch.is_following),
      followers: `${ch.follower_count || 1} followers`,
      posts: posts.map(p => ({
        id: p.id,
        text: p.text,
        mediaUrl: p.mediaUrl,
        timestamp: new Date(p.timestampRaw).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        views: `${p.views} views`,
      })),
    };
  });

  res.json(result);
});

// Follow / Unfollow channel
router.post('/:id/follow', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const channelId = req.params.id;

  const existing = db.prepare('SELECT * FROM channel_followers WHERE channel_id = ? AND user_id = ?').get(channelId, userId);

  if (existing) {
    db.prepare('DELETE FROM channel_followers WHERE channel_id = ? AND user_id = ?').run(channelId, userId);
    res.json({ isFollowing: false });
  } else {
    db.prepare('INSERT INTO channel_followers (channel_id, user_id, followed_at) VALUES (?, ?, ?)').run(channelId, userId, Date.now());
    res.json({ isFollowing: true });
  }
});

// Create channel
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { name, description, avatar } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  const channelId = `ch_${uuidv4().slice(0, 10)}`;
  const now = Date.now();

  db.prepare(`
    INSERT INTO channels (id, name, description, avatar, owner_id, is_verified, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(channelId, name, description || '', avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', userId, now);

  db.prepare('INSERT INTO channel_followers (channel_id, user_id, followed_at) VALUES (?, ?, ?)').run(channelId, userId, now);

  res.json({ success: true, id: channelId });
});

export default router;
