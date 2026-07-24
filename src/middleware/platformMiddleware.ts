import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { config } from '../core/config';
import { verifySession } from '../core/security';
import { Role, SessionClaims } from '../types/platform';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      auth?: SessionClaims;
    }
  }
}

const buckets = new Map<string, { count: number; resetAt: number }>();

export function requestContext(req: Request, res: Response, next: NextFunction): void {
  req.requestId = String(req.headers['x-request-id'] || crypto.randomUUID());
  res.setHeader('x-request-id', req.requestId);
  next();
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'");
  next();
}

export function cors(req: Request, res: Response, next: NextFunction): void {
  const origin = String(req.headers.origin || '');
  if (origin && config.corsOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
}

export function rateLimit(max = 120, windowMs = 60_000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    current.count += 1;
    if (current.count > max) {
      res.status(429).json({ ok: false, error: 'rate_limit_exceeded', requestId: req.requestId });
      return;
    }
    next();
  };
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const raw = req.headers.authorization || '';
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : '';
  const claims = verifySession(token, config.jwtSecret);
  if (!claims) {
    res.status(401).json({ ok: false, error: 'authentication_required', requestId: req.requestId });
    return;
  }
  req.auth = claims;
  next();
}

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ ok: false, error: 'insufficient_permissions', requestId: req.requestId });
      return;
    }
    next();
  };
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ ok: false, error: 'not_found', path: req.path, requestId: req.requestId });
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  console.error(JSON.stringify({
    level: 'error',
    requestId: req.requestId,
    error: error instanceof Error ? error.message : String(error),
  }));
  res.status(500).json({ ok: false, error: 'internal_error', requestId: req.requestId });
}
