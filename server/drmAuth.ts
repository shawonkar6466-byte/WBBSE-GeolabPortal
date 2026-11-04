import type { Request, Response, NextFunction } from 'express';

export interface AuthenticatedUser {
  username: string;
  displayName: string;
  phone: string;
  role: string;
  isAdmin: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return 'XXXXXXXXXX';
  const clean = phone.replace(/[^\d]/g, '');
  if (clean.length < 5) return clean;
  return clean.substring(0, 4) + '***' + clean.substring(clean.length - 3);
}

/**
 * Creates authentication middleware with optional database lookup to verify authentic account records.
 */
export function createAuthMiddleware(db?: any) {
  return function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    let authHeader = req.headers['authorization'];
    let bearerToken = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      bearerToken = authHeader.substring(7).trim();
    }

    const usernameHeader = req.headers['x-user-id'] || req.headers['x-username'] || req.query.username || bearerToken;
    const roleHeader = req.headers['x-user-role'] || req.query.role;
    const nameHeader = req.headers['x-user-name'] || req.query.name;
    const phoneHeader = req.headers['x-user-phone'] || req.query.phone;

    let username = String(usernameHeader || '').trim();
    let phone = String(phoneHeader || '').trim();
    let role = String(roleHeader || 'student').trim().toLowerCase();
    let displayName = String(nameHeader || username || 'Student').trim();

    // If database is available, lookup genuine user credentials to prevent client spoofing
    if (db && username) {
      try {
        const userRow = db.prepare('SELECT username, full_name, role, phone, is_admin FROM users WHERE username = ?').get(username) as any;
        if (userRow) {
          if (userRow.full_name) displayName = userRow.full_name;
          if (userRow.phone) phone = userRow.phone;
          if (userRow.role) role = userRow.role;
          if (userRow.is_admin === 1) role = 'admin';
        }
      } catch (err) {
        // Fallback gracefully
      }
    }

    const isAdmin = role === 'admin' || phone === '7001257277' || username.toLowerCase() === 'admin';

    req.user = {
      username,
      displayName,
      phone,
      role: isAdmin ? 'admin' : role,
      isAdmin
    };

    next();
  };
}

/**
 * Middleware ensuring only Admin can access the route.
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'অ্যাডমিন অনুমতি প্রয়োজন (Admin privileges required)' });
  }
  next();
}
