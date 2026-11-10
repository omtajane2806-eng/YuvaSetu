import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { getDatabase, queryOne, execute, saveDatabase } from './db.ts';

// ============================================================================
// ENTERPRISE-GRADE PASSWORD HASHING (OWASP Cryptographic Standards)
// Uses memory-hard scrypt with 16-byte cryptographically secure random salt.
// Supports backward-compatible verification and automatic on-the-fly upgrade
// of legacy HMAC-SHA256 hashes without locking out existing users.
// ============================================================================

const LEGACY_SALT = 'yuvasetu_salt_2026';

/**
 * Generate a cryptographically secure salted hash using Node.js scrypt.
 * Format: scrypt$<saltHex>$<derivedKeyHex>
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Legacy HMAC-SHA256 calculation for existing seeded/test accounts.
 */
export function legacyHashPassword(password: string): string {
  return crypto.createHmac('sha256', LEGACY_SALT).update(password).digest('hex');
}

/**
 * Constant-time safe password verification.
 * Automatically detects whether the stored hash is modern scrypt or legacy HMAC-SHA256.
 * Returns true if the password is valid, plus an indicator if upgrade is needed.
 */
export function verifyPassword(
  plainText: string,
  storedHash: string
): { valid: boolean; needsUpgrade: boolean } {
  if (!storedHash || !plainText) {
    return { valid: false, needsUpgrade: false };
  }

  // 1. Modern scrypt format check
  if (storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length === 3) {
      const salt = parts[1];
      const originalKeyHex = parts[2];
      try {
        const derivedKey = crypto.scryptSync(plainText, salt, 64);
        const derivedKeyHex = derivedKey.toString('hex');
        const bufA = Buffer.from(derivedKeyHex, 'hex');
        const bufB = Buffer.from(originalKeyHex, 'hex');
        if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
          return { valid: true, needsUpgrade: false };
        }
      } catch {
        return { valid: false, needsUpgrade: false };
      }
    }
  }

  // 2. Legacy HMAC-SHA256 check
  const legacyHash = legacyHashPassword(plainText);
  const bufLegacy = Buffer.from(legacyHash, 'utf8');
  const bufStored = Buffer.from(storedHash, 'utf8');

  if (bufLegacy.length === bufStored.length && crypto.timingSafeEqual(bufLegacy, bufStored)) {
    return { valid: true, needsUpgrade: true };
  }

  return { valid: false, needsUpgrade: false };
}

// ============================================================================
// PERSISTENT FAILED LOGIN THROTTLING (Brute-Force & Credential Stuffing Defense)
// Stored in SQLite login_rate_limits table so it survives server restarts,
// container redeploys, and worker processes.
// ============================================================================

export async function recordFailedLogin(identifier: string): Promise<{ blocked: boolean; retryAfterMs: number }> {
  const key = identifier.toLowerCase().trim();
  const db = await getDatabase();
  const now = Date.now();
  const nowIso = new Date(now).toISOString();

  const existing = queryOne<{ identifier: string; failed_attempts: number; last_attempt: string; blocked_until: string | null }>(
    db,
    `SELECT identifier, failed_attempts, last_attempt, blocked_until FROM login_rate_limits WHERE identifier = ?`,
    [key]
  );

  const failedAttempts = (existing ? existing.failed_attempts : 0) + 1;
  let blockedUntilMs = 0;

  // Progressive delays:
  // 5 failed attempts: 30 second delay
  // 8 failed attempts: 2 minute delay
  // 12+ failed attempts: 5 minute delay
  if (failedAttempts >= 12) {
    blockedUntilMs = now + 5 * 60 * 1000;
  } else if (failedAttempts >= 8) {
    blockedUntilMs = now + 2 * 60 * 1000;
  } else if (failedAttempts >= 5) {
    blockedUntilMs = now + 30 * 1000;
  }

  const blockedUntilIso = blockedUntilMs > 0 ? new Date(blockedUntilMs).toISOString() : null;

  execute(
    db,
    `INSERT INTO login_rate_limits (identifier, failed_attempts, last_attempt, blocked_until)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(identifier) DO UPDATE SET
       failed_attempts = excluded.failed_attempts,
       last_attempt = excluded.last_attempt,
       blocked_until = excluded.blocked_until`,
    [key, failedAttempts, nowIso, blockedUntilIso]
  );
  saveDatabase();

  const retryAfterMs = Math.max(0, blockedUntilMs - now);
  return { blocked: retryAfterMs > 0, retryAfterMs };
}

export async function checkLoginRateLimit(identifier: string): Promise<{ blocked: boolean; retryAfterMs: number }> {
  const key = identifier.toLowerCase().trim();
  const db = await getDatabase();
  const now = Date.now();

  const existing = queryOne<{ identifier: string; failed_attempts: number; last_attempt: string; blocked_until: string | null }>(
    db,
    `SELECT identifier, failed_attempts, last_attempt, blocked_until FROM login_rate_limits WHERE identifier = ?`,
    [key]
  );

  if (!existing) return { blocked: false, retryAfterMs: 0 };

  if (existing.blocked_until) {
    const blockedUntilMs = new Date(existing.blocked_until).getTime();
    if (now < blockedUntilMs) {
      return { blocked: true, retryAfterMs: blockedUntilMs - now };
    }
  }

  // Reset if last attempt was over 15 minutes ago
  const lastAttemptMs = new Date(existing.last_attempt).getTime();
  if (now - lastAttemptMs > 15 * 60 * 1000) {
    execute(db, `DELETE FROM login_rate_limits WHERE identifier = ?`, [key]);
    saveDatabase();
    return { blocked: false, retryAfterMs: 0 };
  }

  return { blocked: false, retryAfterMs: 0 };
}

export async function recordSuccessfulLogin(identifier: string): Promise<void> {
  const key = identifier.toLowerCase().trim();
  const db = await getDatabase();
  execute(db, `DELETE FROM login_rate_limits WHERE identifier = ?`, [key]);
  saveDatabase();
}

// ============================================================================
// CRYPTOGRAPHIC SERVER-SIDE SESSION STORE (OWASP Session Management Standards)
// - Cryptographically random 32-byte tokens (256 bits entropy, CSPRNG).
// - Stored as SHA-256 hashes in SQLite user_sessions table.
// - Tokens cannot be guessed from user ID or timestamp.
// - Never trusts client-supplied x-user-id or x-user-role headers.
// - Expiration (7 days) and instant revocation upon logout enforced.
// ============================================================================

export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Creates a cryptographically random session and stores its SHA-256 hash in SQLite.
 * Returns the raw token (to be sent once to the client) and expiry.
 */
export async function createSession(
  userId: string,
  ip?: string,
  userAgent?: string
): Promise<{ token: string; expiresAt: string }> {
  const db = await getDatabase();
  const sessionId = `sess-${Date.now().toString(36)}-${crypto.randomBytes(8).toString('hex')}`;
  const rawToken = crypto.randomBytes(32).toString('hex'); // 64 hex characters (256 bits entropy)
  const tokenHash = hashSessionToken(rawToken);
  const now = new Date();
  const createdAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days lifespan

  execute(
    db,
    `INSERT INTO user_sessions (id, user_id, token_hash, created_at, expires_at, revoked_at, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, NULL, ?, ?)`,
    [sessionId, userId, tokenHash, createdAt, expiresAt, ip || null, userAgent || null]
  );
  saveDatabase();

  return { token: rawToken, expiresAt };
}

/**
 * Revokes an active session token immediately in the database.
 */
export async function revokeSession(rawToken: string): Promise<boolean> {
  if (!rawToken || typeof rawToken !== 'string') return false;
  const db = await getDatabase();
  const tokenHash = hashSessionToken(rawToken.trim());
  const now = new Date().toISOString();
  execute(
    db,
    `UPDATE user_sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL`,
    [now, tokenHash]
  );
  saveDatabase();
  return true;
}

/**
 * Revokes all active sessions for a given user (e.g. after password change).
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  execute(
    db,
    `UPDATE user_sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL`,
    [now, userId]
  );
  saveDatabase();
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  college?: string;
  course?: string;
  branch?: string;
  year?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Strictly verifies the caller's session token against the SQLite user_sessions table.
 * NEVER trusts client-supplied headers (x-user-id, x-user-role) or query/body parameters.
 * Rejects expired or revoked sessions immediately.
 */
export async function getAuthenticatedUser(req: Request): Promise<AuthenticatedUser | null> {
  let rawToken: string | null = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    rawToken = authHeader.substring(7).trim();
  } else if (req.headers['x-session-token']) {
    rawToken = String(req.headers['x-session-token']).trim();
  }

  // Strictly reject if no bearer/session token is provided.
  // Spoofed headers (x-user-id, x-user-role) are intentionally IGNORED.
  if (!rawToken) {
    return null;
  }

  try {
    const tokenHash = hashSessionToken(rawToken);
    const db = await getDatabase();

    const session = queryOne<{ id: string; user_id: string; expires_at: string; revoked_at: string | null }>(
      db,
      `SELECT id, user_id, expires_at, revoked_at
       FROM user_sessions
       WHERE token_hash = ?`,
      [tokenHash]
    );

    if (!session) {
      return null;
    }

    if (session.revoked_at) {
      return null; // Session has been revoked on logout
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
      return null; // Session has expired
    }

    const user = queryOne<AuthenticatedUser>(
      db,
      `SELECT id, name, email, role, status, college, course, branch, year, avatar_url, created_at, updated_at
       FROM users WHERE id = ?`,
      [session.user_id]
    );

    if (!user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('[AuthMiddleware] Error verifying session token in database:', err);
    return null;
  }
}

/**
 * Express middleware: Requires valid authenticated user (Student or Admin).
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required. Please log in to access this feature.',
    });
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({
      error: 'Forbidden: Account Inactive',
      message: `Your account status is ${user.status}. Please contact platform support.`,
    });
  }

  (req as any).user = user;
  next();
}

/**
 * Express middleware: Requires verified ADMINISTRATOR role in the database.
 * Never grants access simply because a client sent x-user-role: admin.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized: Admin Credentials Required',
      message: 'Please authenticate with valid administrator credentials.',
    });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden: Admin Privilege Required',
      message: 'Students are not authorized to perform administrative operations.',
    });
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({
      error: 'Forbidden: Administrator Inactive',
      message: 'This administrator account is currently inactive.',
    });
  }

  (req as any).user = user;
  next();
}

/**
 * Validates ownership of a resource to prevent Insecure Direct Object References (IDOR).
 * Allows access if the authenticated user owns the resource OR is an active platform admin.
 */
export function isResourceOwnerOrAdmin(
  authUser: AuthenticatedUser,
  resourceOwnerId: string,
  resourceOwnerEmail?: string
): boolean {
  if (authUser.role === 'admin' && authUser.status === 'ACTIVE') {
    return true;
  }
  if (authUser.id === resourceOwnerId) {
    return true;
  }
  if (resourceOwnerEmail && authUser.email.toLowerCase() === resourceOwnerEmail.toLowerCase()) {
    return true;
  }
  return false;
}
