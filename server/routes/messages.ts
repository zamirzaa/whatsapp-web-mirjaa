import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { requireAuth, type AuthRequest } from '../auth';
import { io } from '../socket';
import { generateGroqReply } from '../services/groq';

const router = Router();

// Send new message
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const {
    chatId,
    text,
    type = 'text',
    mediaUrl,
    fileName,
    fileSize,
    audioDuration,
    replyToId,
    poll,
    isViewOnce,
  } = req.body;

  if (!chatId) {
    res.status(400).json({ error: 'chatId is required' });
    return;
  }

  // Ensure user is member
  const member = db.prepare(`
    SELECT * FROM conversation_members WHERE conversation_id = ? AND user_id = ?
  `).get(chatId, userId);

  if (!member) {
    res.status(403).json({ error: 'You are not a member of this chat' });
    return;
  }

  const now = Date.now();
  const messageId = `msg_${uuidv4().replace(/-/g, '').slice(0, 16)}`;

  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_id, type, text, media_url, file_name, file_size, audio_duration, reply_to_id, status, is_view_once, is_view_once_opened, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'delivered', ?, 0, ?, ?)
  `).run(
    messageId,
    chatId,
    userId,
    type,
    text || '',
    mediaUrl || null,
    fileName || null,
    fileSize || null,
    audioDuration || null,
    replyToId || null,
    isViewOnce ? 1 : 0,
    now,
    now
  );

  // If poll message
  let createdPoll = undefined;
  if (type === 'poll' && poll) {
    const pollId = `poll_${uuidv4()}`;
    db.prepare(`
      INSERT INTO polls (id, message_id, question, allow_multiple, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(pollId, messageId, poll.question, poll.allowMultiple ? 1 : 0, now);

    const insertedOptions = [];
    for (const opt of poll.options) {
      const optId = `opt_${uuidv4()}`;
      db.prepare(`
        INSERT INTO poll_options (id, poll_id, text, created_at)
        VALUES (?, ?, ?, ?)
      `).run(optId, pollId, opt.text, now);
      insertedOptions.push({ id: optId, text: opt.text, votes: [] });
    }

    createdPoll = {
      question: poll.question,
      options: insertedOptions,
      allowMultiple: Boolean(poll.allowMultiple),
    };
  }

  // Update conversation updated_at
  db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').run(now, chatId);

  // Increment unread count for other members
  db.prepare(`
    UPDATE conversation_members
    SET unread_count = unread_count + 1
    WHERE conversation_id = ? AND user_id != ?
  `).run(chatId, userId);

  // Fetch sender name & reply info
  const sender = db.prepare('SELECT display_name FROM users WHERE id = ?').get(userId) as any;
  let replyInfo = undefined;
  if (replyToId) {
    const repMsg = db.prepare(`
      SELECT m.id, m.text, m.type, u.display_name as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `).get(replyToId) as any;
    if (repMsg) {
      replyInfo = {
        id: repMsg.id,
        senderName: repMsg.sender_name,
        text: repMsg.text || 'Attachment',
      };
    }
  }

  const formattedMsg = {
    id: messageId,
    chatId,
    senderId: userId,
    text: text || '',
    type,
    timestamp: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestampRaw: now,
    status: 'delivered',
    isOutgoing: true,
    mediaUrl,
    fileName,
    fileSize,
    audioDuration,
    isViewOnce: Boolean(isViewOnce),
    isViewOnceOpened: false,
    replyTo: replyInfo,
    poll: createdPoll,
  };

  // Broadcast realtime event
  if (io) {
    io.to(chatId).emit('message:new', {
      chatId,
      message: { ...formattedMsg, senderName: sender?.display_name },
    });
  }

  // Asynchronous Gemini AI Auto-Reply (Server-side to avoid CORS)
  if (text && text.trim().length > 0) {
    setTimeout(async () => {
      try {
        const otherMember = db.prepare(`
          SELECT u.id, u.display_name, u.about
          FROM conversation_members cm
          JOIN users u ON cm.user_id = u.id
          WHERE cm.conversation_id = ? AND cm.user_id != ?
          LIMIT 1
        `).get(chatId, userId) as any;

        if (!otherMember) return;

        if (io) {
          io.to(chatId).emit('conversation:typing', { chatId, isTyping: true });
        }

        const replyText = await generateGroqReply({
          contactId: otherMember.id,
          contactName: otherMember.display_name,
          contactAbout: otherMember.about,
          userMessage: text,
        });

        await new Promise(r => setTimeout(r, 600));

        const replyNow = Date.now();
        const replyMsgId = `msg_${uuidv4().replace(/-/g, '').slice(0, 16)}`;

        // Mark all previous messages from user in this conversation as 'read' (answered)
        db.prepare(`
          UPDATE messages
          SET status = 'read'
          WHERE conversation_id = ? AND sender_id = ? AND status != 'read'
        `).run(chatId, userId);

        db.prepare(`
          INSERT INTO messages (id, conversation_id, sender_id, type, text, status, created_at, updated_at)
          VALUES (?, ?, ?, 'text', ?, 'read', ?, ?)
        `).run(replyMsgId, chatId, otherMember.id, replyText, replyNow, replyNow);

        db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').run(replyNow, chatId);

        if (io) {
          io.to(chatId).emit('conversation:typing', { chatId, isTyping: false });
          io.to(chatId).emit('messages:read', { chatId });
          io.to(chatId).emit('message:new', {
            chatId,
            message: {
              id: replyMsgId,
              chatId,
              senderId: otherMember.id,
              text: replyText,
              type: 'text',
              timestamp: new Date(replyNow).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestampRaw: replyNow,
              status: 'read',
              isOutgoing: false,
              senderName: otherMember.display_name,
            },
          });
        }
      } catch (err: any) {
        console.error('Groq auto-reply error:', err.message);
        if (io) {
          io.to(chatId).emit('conversation:typing', { chatId, isTyping: false });
        }
      }
    }, 600);
  }

  res.json(formattedMsg);
});

// View Once opened endpoint
router.post('/:id/view-once-open', requireAuth, (req: AuthRequest, res) => {
  const messageId = req.params.id;
  db.prepare('UPDATE messages SET is_view_once_opened = 1 WHERE id = ?').run(messageId);
  const msg = db.prepare('SELECT conversation_id FROM messages WHERE id = ?').get(messageId) as any;
  if (msg && io) {
    io.to(msg.conversation_id).emit('message:view_once_opened', {
      chatId: msg.conversation_id,
      messageId,
    });
  }
  res.json({ success: true });
});

// Dedicated Groq AI Reply Endpoint
router.post('/groq-reply', requireAuth, async (req: AuthRequest, res) => {
  const { contactId, contactName, contactAbout, userMessage } = req.body;
  try {
    const replyText = await generateGroqReply({
      contactId: contactId || 'usr_groq',
      contactName: contactName || 'AI Assistant',
      contactAbout: contactAbout || 'Powered by Groq gpt-oss-120b',
      userMessage: userMessage || '',
    });
    res.json({ replyText });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete message
router.delete('/:id', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const messageId = req.params.id;

  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId) as any;
  if (!msg) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }

  db.prepare('UPDATE messages SET is_deleted = 1, text = "This message was deleted" WHERE id = ?').run(messageId);

  if (io) {
    io.to(msg.conversation_id).emit('message:deleted', {
      chatId: msg.conversation_id,
      messageId,
    });
  }

  res.json({ success: true });
});

// Toggle reaction
router.post('/:id/reaction', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const messageId = req.params.id;
  const { emoji } = req.body;

  if (!emoji) {
    res.status(400).json({ error: 'Emoji is required' });
    return;
  }

  const existing = db.prepare(`
    SELECT id FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?
  `).get(messageId, userId, emoji);

  if (existing) {
    db.prepare('DELETE FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?').run(messageId, userId, emoji);
  } else {
    db.prepare(`
      INSERT INTO message_reactions (id, message_id, user_id, emoji, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(`rx_${uuidv4()}`, messageId, userId, emoji, Date.now());
  }

  const msg = db.prepare('SELECT conversation_id FROM messages WHERE id = ?').get(messageId) as any;
  if (msg && io) {
    io.to(msg.conversation_id).emit('message:reaction', {
      chatId: msg.conversation_id,
      messageId,
      userId,
      emoji,
      action: existing ? 'remove' : 'add',
    });
  }

  res.json({ success: true, active: !existing });
});

// Toggle star message
router.post('/:id/star', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const messageId = req.params.id;

  const existing = db.prepare('SELECT * FROM starred_messages WHERE user_id = ? AND message_id = ?').get(userId, messageId);

  if (existing) {
    db.prepare('DELETE FROM starred_messages WHERE user_id = ? AND message_id = ?').run(userId, messageId);
    res.json({ isStarred: false });
  } else {
    db.prepare('INSERT INTO starred_messages (user_id, message_id, created_at) VALUES (?, ?, ?)').run(userId, messageId, Date.now());
    res.json({ isStarred: true });
  }
});

// Vote in poll
router.post('/:id/poll-vote', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { optionId } = req.body;

  const existing = db.prepare('SELECT * FROM poll_votes WHERE poll_option_id = ? AND user_id = ?').get(optionId, userId);

  if (existing) {
    db.prepare('DELETE FROM poll_votes WHERE poll_option_id = ? AND user_id = ?').run(optionId, userId);
  } else {
    db.prepare('INSERT INTO poll_votes (poll_option_id, user_id, created_at) VALUES (?, ?, ?)').run(optionId, userId, Date.now());
  }

  const msg = db.prepare('SELECT conversation_id FROM messages WHERE id = ?').get(req.params.id) as any;
  if (msg && io) {
    io.to(msg.conversation_id).emit('message:poll-voted', {
      chatId: msg.conversation_id,
      messageId,
      optionId,
      userId,
    });
  }

  res.json({ success: true });
});

// Search messages
router.get('/search', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const query = (req.query.q as string) || '';

  if (!query.trim()) {
    res.json([]);
    return;
  }

  const results = db.prepare(`
    SELECT m.id, m.conversation_id as chatId, m.text, m.created_at as timestampRaw,
           u.display_name as senderName, c.name as conversationName
    FROM messages m
    JOIN conversation_members cm ON m.conversation_id = cm.conversation_id
    JOIN users u ON m.sender_id = u.id
    JOIN conversations c ON m.conversation_id = c.id
    WHERE cm.user_id = ? AND m.is_deleted = 0 AND m.text LIKE ?
    ORDER BY m.created_at DESC
    LIMIT 30
  `).all(userId, `%${query}%`) as any[];

  res.json(results);
});

export default router;
