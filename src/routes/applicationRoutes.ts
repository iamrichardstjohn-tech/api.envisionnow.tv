import { Router } from 'express';
import { authenticate, authorize, rateLimit } from '../middleware/platformMiddleware';
import { platformStore } from '../services/platformStore';

export const applicationRouter = Router();

const allowedTypes = new Set(['actor', 'filmmaker', 'creator', 'writer', 'musician', 'podcaster', 'partner']);

applicationRouter.post('/', rateLimit(12, 60_000), (req, res) => {
  const type = String(req.body?.type || '').toLowerCase();
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const message = String(req.body?.message || '').trim().slice(0, 4000);

  if (!allowedTypes.has(type) || name.length < 2 || !email.includes('@')) {
    res.status(400).json({ ok: false, error: 'invalid_application', requestId: req.requestId });
    return;
  }

  const record = platformStore.createApplication({
    type: type as any,
    name,
    email,
    message,
  });

  platformStore.addAudit({
    requestId: req.requestId,
    actor: email,
    action: 'application.submit',
    resource: `application:${record.id}`,
    outcome: 'success',
    metadata: { type },
  });

  res.status(201).json({ ok: true, application: record, requestId: req.requestId });
});

applicationRouter.get('/', authenticate, authorize('OWNER', 'ADMIN', 'DEVTEAM'), (req, res) => {
  res.json({ ok: true, applications: platformStore.listApplications(), requestId: req.requestId });
});
