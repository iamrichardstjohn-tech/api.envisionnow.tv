export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || '',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,https://envisionnow.tv,https://www.envisionnow.tv')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean),
  adminEmail: process.env.OWNER_EMAIL || '',
  databaseUrl: process.env.DATABASE_URL || '',
  persistenceMode: process.env.DATABASE_URL ? 'postgresql-required-adapter' : 'ephemeral-memory',
  isProduction: process.env.NODE_ENV === 'production',
};

export function assertProductionConfig(): void {
  if (!config.isProduction) return;
  const missing = [];
  if (!config.jwtSecret || config.jwtSecret.length < 32) missing.push('JWT_SECRET (minimum 32 characters)');
  if (!config.adminEmail) missing.push('OWNER_EMAIL');
  if (missing.length) {
    throw new Error(`Production configuration incomplete: ${missing.join(', ')}`);
  }
}
