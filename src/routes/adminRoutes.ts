import { Router } from 'express';
import { config } from '../core/config';
import { authenticate, authorize } from '../middleware/platformMiddleware';
import { platformStore } from '../services/platformStore';

export const adminRouter = Router();

adminRouter.get('/summary', authenticate, authorize('OWNER', 'ADMIN', 'DEVTEAM'), (req, res) => {
  res.json({
    ok: true,
    service: 'envisionnow-enterprise-backend',
    environment: config.env,
    persistenceMode: config.persistenceMode,
    metrics: platformStore.metrics(),
    requestId: req.requestId,
  });
});

adminRouter.get('/audit', authenticate, authorize('OWNER', 'ADMIN'), (req, res) => {
  res.json({ ok: true, events: platformStore.listAudit(), requestId: req.requestId });
});
