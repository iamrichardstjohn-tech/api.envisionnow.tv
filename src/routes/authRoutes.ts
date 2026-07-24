import { Router } from 'express';
import { config } from '../core/config';
import { hashPassword, signSession, verifyPassword } from '../core/security';
import { authenticate, rateLimit } from '../middleware/platformMiddleware';
import { platformStore } from '../services/platformStore';
import { Role } from '../types/platform';

export const authRouter = Router();

authRouter.post('/register', rateLimit(10, 60_000), (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const displayName = String(req.body?.displayName || '').trim();
  const password = String(req.body?.password || '');
  const requestedRole = String(req.body?.role || 'USER').toUpperCase() as Role;
  const allowedPublicRoles: Role[] = ['USER', 'ACTOR', 'CREATOR', 'FILMMAKER', 'WRITER', 'PARTNER'];

  if (!email.includes('@') || displayName.length < 2 || password.length < 10) {
    res.status(400).json({
      ok: false,
      error: 'invalid_registration',
      requirements: { displayName: '2+ characters', password: '10+ characters', email: 'valid email' },
      requestId: req.requestId,
    });
    return;
  }
  if (platformStore.findUserByEmail(email)) {
    res.status(409).json({ ok: false, error: 'email_already_registered', requestId: req.requestId });
    return;
  }

  const role = allowedPublicRoles.includes(requestedRole) ? requestedRole : 'USER';
  const user = platformStore.createUser({
    email,
    displayName,
    role,
    passwordHash: hashPassword(password),
    status: 'pending',
  });

  platformStore.addAudit({
    requestId: req.requestId,
    actor: user.id,
    action: 'user.register',
    resource: 'user',
    outcome: 'success',
    metadata: { role },
  });

  res.status(201).json({
    ok: true,
    user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role, status: user.status },
    note: 'Registration is stored in ephemeral memory until DATABASE_URL persistence is implemented.',
    requestId: req.requestId,
  });
});

authRouter.post('/login', rateLimit(8, 60_000), (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const user = platformStore.findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    platformStore.addAudit({
      requestId: req.requestId,
      actor: email || 'anonymous',
      action: 'user.login',
      resource: 'session',
      outcome: 'denied',
    });
    res.status(401).json({ ok: false, error: 'invalid_credentials', requestId: req.requestId });
    return;
  }

  const token = signSession({ sub: user.id, email: user.email, role: user.role }, config.jwtSecret);
  platformStore.addAudit({
    requestId: req.requestId,
    actor: user.id,
    action: 'user.login',
    resource: 'session',
    outcome: 'success',
  });

  res.json({ ok: true, token, user: { id: user.id, displayName: user.displayName, role: user.role }, requestId: req.requestId });
});

authRouter.get('/me', authenticate, (req, res) => {
  const user = req.auth ? platformStore.findUserById(req.auth.sub) : undefined;
  res.json({
    ok: true,
    user: user ? { id: user.id, email: user.email, displayName: user.displayName, role: user.role, status: user.status } : req.auth,
    requestId: req.requestId,
  });
});
