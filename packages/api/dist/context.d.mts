import * as _supabase_supabase_js from '@supabase/supabase-js';
import * as _codexcrm_database_prisma_generated_client_client from '@codexcrm/database/prisma/generated/client/client';
import { Session } from '@codexcrm/auth';

/**
 * Creates the inner context for an tRPC procedure.
 * This is the context that your business logic will receive.
 * @param session The user session object (or null).
 */
declare const createInnerTRPCContext: (session: Session | null) => {
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: Session | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
};
type Context = ReturnType<typeof createInnerTRPCContext>;

export { type Context, createInnerTRPCContext };
