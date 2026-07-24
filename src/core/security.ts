import crypto from 'crypto';
import { SessionClaims } from '../types/platform';

function b64url(input: Buffer | string): string {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function fromB64url(input: string): Buffer {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized + '='.repeat((4 - normalized.length % 4) % 4), 'base64');
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${b64url(salt)}.${b64url(hash)}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltEncoded, hashEncoded] = stored.split('.');
  if (!saltEncoded || !hashEncoded) return false;
  const salt = fromB64url(saltEncoded);
  const expected = fromB64url(hashEncoded);
  const actual = crypto.scryptSync(password, salt, expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

export function signSession(
  claims: Omit<SessionClaims, 'exp'>,
  secret: string,
  ttlSeconds = 60 * 60 * 8
): string {
  if (!secret) throw new Error('JWT_SECRET is not configured.');
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({ ...claims, exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  const signature = b64url(crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest());
  return `${header}.${payload}.${signature}`;
}

export function verifySession(token: string, secret: string): SessionClaims | null {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature || !secret) return null;
    const expected = b64url(crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest());
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const claims = JSON.parse(fromB64url(payload).toString('utf8')) as SessionClaims;
    if (claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

export function randomId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
