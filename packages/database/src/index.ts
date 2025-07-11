// path: packages/database/src/index.ts
// @/SERVER-ONLY - This file should only be imported on the server.
import { PrismaClient } from '../prisma/generated/client/client';

// This ensures that in development, we don't end up with a dozen
// prisma clients from hot-reloading. In production, it's a no-op.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
