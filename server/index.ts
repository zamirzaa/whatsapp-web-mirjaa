import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initDatabase } from './db';
import { initSocketServer } from './socket';

import authRoutes from './routes/auth';
import chatRoutes from './routes/chats';
import messageRoutes from './routes/messages';
import contactRoutes from './routes/contacts';
import statusRoutes from './routes/status';
import channelRoutes from './routes/channels';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Initialize Database & Tables
initDatabase();

// Initialize Realtime WebSocket Server
initSocketServer(server);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/upload', uploadRoutes);

// Root info & redirect to frontend
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>WhatsApp Web Clone — Backend Server</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #111b21; color: #e9edef; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
        .card { background: #202c33; padding: 40px; border-radius: 16px; border: 1px solid #313d45; max-width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: #00a884; margin-bottom: 8px; font-size: 24px; }
        p { color: #8696a0; font-size: 14px; line-height: 1.5; margin-bottom: 24px; }
        a { display: inline-block; background: #00a884; color: #111b21; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; transition: opacity 0.2s; }
        a:hover { opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>WhatsApp Web Clone Server</h1>
        <p>Backend API & Realtime Server aktif di port 3001.<br>Buka antarmuka aplikasi WhatsApp Web di link berikut:</p>
        <a href="http://localhost:5173">Buka Aplikasi WhatsApp Web (Port 5173)</a>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    appName: 'WhatsApp Web Clone API',
    timestamp: new Date().toISOString(),
  });
});

server.listen(PORT, () => {
  console.log(`⚡ WhatsApp Web Clone Server running on http://localhost:${PORT}`);
});
