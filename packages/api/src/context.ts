// path: packages/api/src/context.ts
// This file is now PURE. It has no knowledge of Next.js or HTTP requests.

import prisma from '@codexcrm/database';
import type { Session } from '@codexcrm/auth';
import { supabaseAdmin } from './supabaseAdmin';

/**
 * Creates the inner context for an tRPC procedure.
 * This is the context that your business logic will receive.
 * @param session The user session object (or null).
 */
export const createInnerTRPCContext = (session: Session | null) => {
  return {
    prisma,
    session,
    supabaseAdmin, // Added for storage operations
  };
};

// We also export the type for convenience.
export type Context = ReturnType<typeof createInnerTRPCContext>;
