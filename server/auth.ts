import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'whatsapp_super_secret_jwt_key_2026';

export interface AuthenticatedUser {
  id: string;
  username: string;
  phone: string;
  displayName: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function generateToken(user: { id: string; username: string; phone: string; display_name: string }): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      phone: user.phone,
      displayName: user.display_name,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    return payload;
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
    return;
  }

  req.user = user;
  next();
}
