import { createServerClient } from '@codexcrm/auth';
import type { Session, User } from '@supabase/supabase-js';
import { supabaseAdmin } from './supabaseAdmin';
/** Shape of the tRPC context object */
export interface Context {
    user: User | null;
    session: Session | null;
    supabaseAdmin: typeof supabaseAdmin;
    supabaseUser: ReturnType<typeof createServerClient>;
}
/** Builds tRPC context for each request */
export declare function createContext({ req: _req, }: {
    req: Request;
}): Promise<Context>;
//# sourceMappingURL=context.d.ts.map