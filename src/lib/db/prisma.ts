import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getNormalizedDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  // Strip any accidental surrounding quotes pasted into Vercel env settings
  const url = raw.trim().replace(/^["']+|["']+$/g, '').trim();
  if (!url) return undefined;

  // Ensure Supabase transaction pooler (port 6543) always has pgbouncer=true
  if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}pgbouncer=true`;
  }
  return url;
}

const dbUrl = getNormalizedDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(dbUrl ? { datasources: { db: { url: dbUrl } } } : {}),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
