export declare const router: <TInput extends import("@trpc/server/dist/unstable-core-do-not-import").CreateRouterOptions>(input: TInput) => import("@trpc/server/dist/unstable-core-do-not-import").BuiltRouter<{
    ctx: import("./context").Context;
    meta: object;
    errorShape: import("@trpc/server/dist/unstable-core-do-not-import").DefaultErrorShape;
    transformer: true;
}, import("@trpc/server/dist/unstable-core-do-not-import").DecorateCreateRouterOptions<TInput>>;
export declare const publicProcedure: import("@trpc/server/dist/unstable-core-do-not-import").ProcedureBuilder<import("./context").Context, object, object, typeof import("@trpc/server/dist/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/dist/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/dist/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/dist/unstable-core-do-not-import").unsetMarker, false>;
export declare const middleware: <$ContextOverrides>(fn: import("@trpc/server/dist/unstable-core-do-not-import").MiddlewareFunction<import("./context").Context, object, object, $ContextOverrides, unknown>) => import("@trpc/server/dist/unstable-core-do-not-import").MiddlewareBuilder<import("./context").Context, object, $ContextOverrides, unknown>;
/**
 * Role-based authorization middleware
 * Checks if the user has the required role
 * @param requiredRoles Array of roles that are allowed to access the resource
 */
export declare const hasRole: (requiredRoles: string[]) => import("@trpc/server/dist/unstable-core-do-not-import").MiddlewareBuilder<import("./context").Context, object, {
    user: import("@supabase/supabase-js").AuthUser;
    roles: any;
    session: import("@supabase/supabase-js").AuthSession | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, unknown>;
/**
 * Rate limiting middleware
 * Limits the number of requests a user can make in a given time period
 * @param limit Maximum number of requests
 * @param timeWindowMs Time window in milliseconds
 */
export declare const rateLimit: (limit: number, timeWindowMs?: number) => import("@trpc/server/dist/unstable-core-do-not-import").MiddlewareBuilder<import("./context").Context, object, {
    user: import("@supabase/supabase-js").AuthUser | null;
    session: import("@supabase/supabase-js").AuthSession | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, unknown>;
export declare const protectedProcedure: import("@trpc/server/dist/unstable-core-do-not-import").ProcedureBuilder<import("./context").Context, object, {
    user: import("@supabase/supabase-js").AuthUser;
    session: import("@supabase/supabase-js").AuthSession | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, typeof import("@trpc/server/dist/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/dist/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/dist/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/dist/unstable-core-do-not-import").unsetMarker, false>;
