import { PrismaClient } from '../prisma/generated/client/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
export * from '../prisma/generated/client/client';