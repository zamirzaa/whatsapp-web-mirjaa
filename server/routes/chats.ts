import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { requireAuth, type AuthRequest } from '../auth';

const router = Router();

// Get all chats for current user
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const chats = db.prepare(`
    SELECT
      c.id,
      c.type,
      c.name as group_name,
      c.avatar as group_avatar,
      c.description,
      cm.role,
      cm.unread_count,
      cm.is_archived,
      cm.is_muted,
      cm.is_pinned,
      cm.is_favorite,
      cm.draft
    FROM conversation_members cm
    JOIN conversations c ON cm.conversation_id = c.id
    WHERE cm.user_id = ?
    ORDER BY cm.is_pinned DESC, c.updated_at DESC
  `).all(userId) as any[];

  const formattedChats = chats.map(chat => {
    // Determine contact id and metadata
    let contactId = '';
    let name = chat.group_name;
    let avatar = chat.group_avatar;
    let isOnline = false;
    let lastSeen = '';
    let about = chat.description || '';
    let isGroup = chat.type === 'group';
    let groupMembers: string[] = [];

    if (chat.type === 'direct') {
      const otherMember = db.prepare(`
        SELECT u.id, u.display_name, u.avatar_url, u.about, u.is_online, u.last_seen, u.phone
        FROM conversation_members cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.conversation_id = ? AND cm.user_id != ?
      `).get(chat.id, userId) as any;

      if (otherMember) {
        contactId = otherMember.id;
        name = otherMember.display_name;
        avatar = otherMember.avatar_url;
        isOnline = Boolean(otherMember.is_online);
        lastSeen = otherMember.last_seen;
        about = otherMember.about;
      }
    } else {
      contactId = chat.id;
      const members = db.prepare(`
        SELECT u.display_name
        FROM conversation_members cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.conversation_id = ?
      `).all(chat.id) as any[];
      groupMembers = members.map(m => m.display_name);
    }

    // Get last message
    const lastMsg = db.prepare(`
      SELECT m.*, u.display_name as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ? AND m.is_deleted = 0
      ORDER BY m.created_at DESC
      LIMIT 1
    `).get(chat.id) as any;

    let formattedLastMessage = undefined;
    if (lastMsg) {
      formattedLastMessage = {
        id: lastMsg.id,
        chatId: lastMsg.conversation_id,
        senderId: lastMsg.sender_id,
        text: lastMsg.text,
        type: lastMsg.type,
        timestamp: new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestampRaw: lastMsg.created_at,
        status: lastMsg.status,
        isOutgoing: lastMsg.sender_id === userId,
        mediaUrl: lastMsg.media_url,
        fileName: lastMsg.file_name,
        fileSize: lastMsg.file_size,
        audioDuration: lastMsg.audio_duration,
        isViewOnce: Boolean(lastMsg.is_view_once),
        isViewOnceOpened: Boolean(lastMsg.is_view_once_opened),
      };
    }

    return {
      id: chat.id,
      contactId,
      name,
      avatar,
      isOnline,
      lastSeen,
      about,
      isGroup,
      groupMembers,
      unreadCount: chat.unread_count || 0,
      isPinned: Boolean(chat.is_pinned),
      isMuted: Boolean(chat.is_muted),
      isArchived: Boolean(chat.is_archived),
      isFavorite: Boolean(chat.is_favorite),
      draft: chat.draft || '',
      lastMessage: formattedLastMessage,
    };
  });

  res.json(formattedChats);
});

// Create new direct or group chat
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { type, recipientId, name, avatar, memberIds } = req.body;

  const now = Date.now();
  const convId = `conv_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

  if (type === 'direct') {
    // Check if direct chat already exists
    const existing = db.prepare(`
      SELECT cm1.conversation_id
      FROM conversation_members cm1
      JOIN conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
      JOIN conversations c ON cm1.conversation_id = c.id
      WHERE c.type = 'direct' AND cm1.user_id = ? AND cm2.user_id = ?
    `).get(userId, recipientId) as any;

    if (existing) {
      res.json({ id: existing.conversation_id });
      return;
    }

    db.prepare(`
      INSERT INTO conversations (id, type, created_by, created_at, updated_at)
      VALUES (?, 'direct', ?, ?, ?)
    `).run(convId, userId, now, now);

    db.prepare(`
      INSERT INTO conversation_members (conversation_id, user_id, joined_at)
      VALUES (?, ?, ?), (?, ?, ?)
    `).run(convId, userId, now, convId, recipientId, now);

    res.json({ id: convId });
    return;
  }

  // Group chat creation
  db.prepare(`
    INSERT INTO conversations (id, type, name, avatar, created_by, created_at, updated_at)
    VALUES (?, 'group', ?, ?, ?, ?, ?)
  `).run(convId, name, avatar || '', userId, now, now);

  const insertMember = db.prepare(`
    INSERT INTO conversation_members (conversation_id, user_id, role, joined_at)
    VALUES (?, ?, ?, ?)
  `);

  insertMember.run(convId, userId, 'owner', now);

  if (Array.isArray(memberIds)) {
    for (const mId of memberIds) {
      if (mId !== userId) {
        insertMember.run(convId, mId, 'member', now);
      }
    }
  }

  // Initial system message
  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_id, type, text, status, created_at, updated_at)
    VALUES (?, ?, ?, 'text', 'You created this group', 'read', ?, ?)
  `).run(`msg_${uuidv4()}`, convId, userId, now, now);

  res.json({ id: convId });
});

// Get messages for a specific chat
router.get('/:id/messages', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;

  // Verify membership
  const member = db.prepare(`
    SELECT * FROM conversation_members WHERE conversation_id = ? AND user_id = ?
  `).get(chatId, userId);

  if (!member) {
    res.status(403).json({ error: 'You are not a member of this chat' });
    return;
  }

  const msgs = db.prepare(`
    SELECT m.*, u.display_name as sender_name,
           r.id as reply_id, r.sender_id as reply_sender_id, r.text as reply_text, r.type as reply_type,
           ru.display_name as reply_sender_name,
           (SELECT COUNT(*) FROM starred_messages sm WHERE sm.message_id = m.id AND sm.user_id = ?) as is_starred
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    LEFT JOIN messages r ON m.reply_to_id = r.id
    LEFT JOIN users ru ON r.sender_id = ru.id
    WHERE m.conversation_id = ? AND m.is_deleted = 0
    ORDER BY m.created_at ASC
  `).all(userId, chatId) as any[];

  const formattedMessages = msgs.map(m => {
    // Fetch reactions
    const reactionsList = db.prepare(`
      SELECT emoji, user_id,
             (SELECT display_name FROM users WHERE id = mr.user_id) as user_name
      FROM message_reactions mr
      WHERE message_id = ?
    `).all(m.id) as any[];

    const reactionsMap: Record<string, any> = {};
    for (const rx of reactionsList) {
      if (!reactionsMap[rx.emoji]) {
        reactionsMap[rx.emoji] = {
          emoji: rx.emoji,
          count: 0,
          byMe: false,
          users: [],
        };
      }
      reactionsMap[rx.emoji].count += 1;
      reactionsMap[rx.emoji].users.push(rx.user_name || rx.user_id);
      if (rx.user_id === userId) {
        reactionsMap[rx.emoji].byMe = true;
      }
    }

    // Fetch poll if applicable
    let poll = undefined;
    if (m.type === 'poll') {
      const p = db.prepare('SELECT * FROM polls WHERE message_id = ?').get(m.id) as any;
      if (p) {
        const options = db.prepare('SELECT * FROM poll_options WHERE poll_id = ?').all(p.id) as any[];
        const formattedOptions = options.map(opt => {
          const votes = db.prepare('SELECT user_id FROM poll_votes WHERE poll_option_id = ?').all(opt.id) as any[];
          return {
            id: opt.id,
            text: opt.text,
            votes: votes.map(v => (v.user_id === userId ? 'me' : v.user_id)),
          };
        });
        poll = {
          question: p.question,
          options: formattedOptions,
          allowMultiple: Boolean(p.allow_multiple),
        };
      }
    }

    return {
      id: m.id,
      chatId: m.conversation_id,
      senderId: m.sender_id === userId ? 'me' : m.sender_id,
      text: m.text,
      type: m.type,
      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestampRaw: m.created_at,
      status: m.status,
      isOutgoing: m.sender_id === userId,
      mediaUrl: m.media_url,
      fileName: m.file_name,
      fileSize: m.file_size,
      audioDuration: m.audio_duration,
      isStarred: Boolean(m.is_starred),
      isViewOnce: Boolean(m.is_view_once),
      isViewOnceOpened: Boolean(m.is_view_once_opened),
      reactions: reactionsMap,
      poll,
      replyTo: m.reply_id ? {
        id: m.reply_id,
        senderName: m.reply_sender_id === userId ? 'You' : (m.reply_sender_name || 'Contact'),
        text: m.reply_text || 'Attachment',
      } : undefined,
    };
  });

  res.json(formattedMessages);
});

// Mark chat as read
router.put('/:id/read', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;

  db.prepare(`
    UPDATE conversation_members
    SET unread_count = 0
    WHERE conversation_id = ? AND user_id = ?
  `).run(chatId, userId);

  // Mark all unread messages as read
  db.prepare(`
    UPDATE messages
    SET status = 'read'
    WHERE conversation_id = ? AND sender_id != ? AND status != 'read'
  `).run(chatId, userId);

  res.json({ success: true });
});

// Archive toggle
router.put('/:id/archive', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;
  const { isArchived } = req.body;

  db.prepare(`
    UPDATE conversation_members
    SET is_archived = ?
    WHERE conversation_id = ? AND user_id = ?
  `).run(isArchived ? 1 : 0, chatId, userId);

  res.json({ success: true });
});

// Pin toggle
router.put('/:id/pin', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;
  const { isPinned } = req.body;

  db.prepare(`
    UPDATE conversation_members
    SET is_pinned = ?
    WHERE conversation_id = ? AND user_id = ?
  `).run(isPinned ? 1 : 0, chatId, userId);

  res.json({ success: true });
});

// Mute toggle
router.put('/:id/mute', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;
  const { isMuted } = req.body;

  db.prepare(`
    UPDATE conversation_members
    SET is_muted = ?
    WHERE conversation_id = ? AND user_id = ?
  `).run(isMuted ? 1 : 0, chatId, userId);

  res.json({ success: true });
});

// Clear chat messages
router.delete('/:id/messages', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;

  // Ensure user is member
  const member = db.prepare('SELECT * FROM conversation_members WHERE conversation_id = ? AND user_id = ?').get(chatId, userId);
  if (!member) {
    res.status(403).json({ error: 'Not a member of this chat' });
    return;
  }

  // Delete all messages in this conversation
  db.prepare('DELETE FROM messages WHERE conversation_id = ?').run(chatId);
  db.prepare('UPDATE conversation_members SET unread_count = 0 WHERE conversation_id = ?').run(chatId);

  res.json({ success: true, message: 'Chat cleared successfully' });
});

// Update chat details (group name, avatar, description)
router.put('/:id', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;
  const { name, avatar, description } = req.body;

  const now = Date.now();
  if (name !== undefined) {
    db.prepare('UPDATE conversations SET name = ?, updated_at = ? WHERE id = ?').run(name, now, chatId);
  }
  if (avatar !== undefined) {
    db.prepare('UPDATE conversations SET avatar = ?, updated_at = ? WHERE id = ?').run(avatar, now, chatId);
  }
  if (description !== undefined) {
    db.prepare('UPDATE conversations SET description = ?, updated_at = ? WHERE id = ?').run(description, now, chatId);
  }

  res.json({ success: true });
});

// Add members to group
router.post('/:id/members', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;
  const { memberIds } = req.body;

  const now = Date.now();
  const insertMember = db.prepare(`
    INSERT OR IGNORE INTO conversation_members (conversation_id, user_id, role, joined_at)
    VALUES (?, ?, 'member', ?)
  `);

  if (Array.isArray(memberIds)) {
    for (const mId of memberIds) {
      insertMember.run(chatId, mId, now);
    }
  }

  res.json({ success: true });
});

// Remove member or exit group
router.delete('/:id/members/:memberId', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;
  const targetMemberId = req.params.memberId === 'me' ? userId : req.params.memberId;

  db.prepare(`
    DELETE FROM conversation_members
    WHERE conversation_id = ? AND user_id = ?
  `).run(chatId, targetMemberId);

  res.json({ success: true });
});

// Favorite toggle
router.put('/:id/favorite', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const chatId = req.params.id;
  const { isFavorite } = req.body;

  db.prepare(`
    UPDATE conversation_members
    SET is_favorite = ?
    WHERE conversation_id = ? AND user_id = ?
  `).run(isFavorite ? 1 : 0, chatId, userId);

  res.json({ success: true });
});

export default router;
