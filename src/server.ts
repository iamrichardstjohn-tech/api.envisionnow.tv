import express from 'express';
import path from 'path';
import { assertProductionConfig, config } from './core/config';
import { requestContext, securityHeaders, cors, rateLimit, notFound, errorHandler } from './middleware/platformMiddleware';
import { authRouter } from './routes/authRoutes';
import { applicationRouter } from './routes/applicationRoutes';
import { catalogRouter } from './routes/catalogRoutes';
import { adminRouter } from './routes/adminRoutes';
import { setStreamRoutes } from './routes/streamRoutes';

assertProductionConfig();

export const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(requestContext);
app.use(securityHeaders);
app.use(cors);
app.use(rateLimit());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (_req, res) => res.redirect('/admin/'));
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'envisionnow-enterprise-backend',
    version: '2.0.0',
    environment: config.env,
    persistenceMode: config.persistenceMode,
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});
app.get('/ready', (req, res) => {
  res.json({
    ok: true,
    ready: !config.isProduction || Boolean(config.jwtSecret && config.adminEmail),
    databaseConfigured: Boolean(config.databaseUrl),
    requestId: req.requestId,
  });
});
app.get('/api-docs', (_req, res) => res.sendFile(path.join(process.cwd(), 'docs/openapi.json')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/applications', applicationRouter);
app.use('/api/v1/catalog', catalogRouter);
app.use('/api/v1/admin', adminRouter);
setStreamRoutes(app);

app.use(notFound);
app.use(errorHandler);

if (process.env.VERCEL !== '1' && require.main === module) {
  app.listen(config.port, () => {
    console.log(JSON.stringify({
      level: 'info',
      message: 'EnvisionNow.TV enterprise backend started',
      port: config.port,
      environment: config.env,
      persistenceMode: config.persistenceMode,
    }));
  });
}

export default app;
