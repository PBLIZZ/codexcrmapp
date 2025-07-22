// path: packages/db/src/index.ts
// @/SERVER-ONLY - This file should only be imported on the server.
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

// This ensures that in development, we don't end up with a dozen
// prisma clients from hot-reloading. In production, it's a no-op.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export as both prisma and db for flexibility
export const db = prisma;
export default prisma;

// Export Prisma types
export { Prisma };

// Export model types
export type User = Prisma.UserGetPayload<Record<string, never>>;
export type Contact = Prisma.ContactGetPayload<Record<string, never>>;
export type Group = Prisma.GroupGetPayload<Record<string, never>>;
export type GroupMember = Prisma.GroupMemberGetPayload<Record<string, never>>;

// Create a Database type that mimics Supabase structure but uses Prisma types
export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: Contact;
        Insert: Prisma.ContactCreateInput;
        Update: Prisma.ContactUpdateInput;
      };
      groups: {
        Row: Group;
        Insert: Prisma.GroupCreateInput;
        Update: Prisma.GroupUpdateInput;
      };
      group_members: {
        Row: GroupMember;
        Insert: Prisma.GroupMemberCreateInput;
        Update: Prisma.GroupMemberUpdateInput;
      };
      users: {
        Row: User;
        Insert: Prisma.UserCreateInput;
        Update: Prisma.UserUpdateInput;
      };
    };
  };
}
