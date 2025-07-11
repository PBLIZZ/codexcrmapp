// path: packages/database/src/index.ts
// @/SERVER-ONLY - This file should only be imported on the server.
import { PrismaClient } from '../prisma/generated/client/client';
import { Prisma } from '../prisma/generated/client/client';

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

// Export Prisma types
export { Prisma };

// Export model types
export type User = Prisma.UserModel;
export type Contact = Prisma.ContactModel;
export type Group = Prisma.GroupModel;
export type GroupMember = Prisma.GroupMemberModel;

// Create a Database type that mimics Supabase structure but uses Prisma types
export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: Prisma.ContactModel;
        Insert: Prisma.ContactCreateInput;
        Update: Prisma.ContactUpdateInput;
      };
      groups: {
        Row: Prisma.GroupModel;
        Insert: Prisma.GroupCreateInput;
        Update: Prisma.GroupUpdateInput;
      };
      group_members: {
        Row: Prisma.GroupMemberModel;
        Insert: Prisma.GroupMemberCreateInput;
        Update: Prisma.GroupMemberUpdateInput;
      };
      users: {
        Row: Prisma.UserModel;
        Insert: Prisma.UserCreateInput;
        Update: Prisma.UserUpdateInput;
      };
    };
  };
}
