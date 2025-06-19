export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: import("./context").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: true;
}>;
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const middleware: <$ContextOverrides>(fn: import("@trpc/server").TRPCMiddlewareFunction<import("./context").Context, object, object, $ContextOverrides, unknown>) => import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, $ContextOverrides, unknown>;
/**
 * Role-based authorization middleware
 * Checks if the user has the required role
 * @param requiredRoles Array of roles that are allowed to access the resource
 */
export declare const hasRole: (requiredRoles: string[]) => import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    user: import("@supabase/auth-js").User;
    roles: any;
    session: import("@supabase/auth-js").Session | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, unknown>;
/**
 * Rate limiting middleware
 * Limits the number of requests a user can make in a given time period
 * @param limit Maximum number of requests
 * @param timeWindowMs Time window in milliseconds
 */
export declare const rateLimit: (limit: number, timeWindowMs?: number) => import("@trpc/server").TRPCMiddlewareBuilder<import("./context").Context, object, {
    user: import("@supabase/auth-js").User | null;
    session: import("@supabase/auth-js").Session | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, unknown>;
export declare const protectedProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context").Context, object, {
    user: import("@supabase/auth-js").User;
    session: import("@supabase/auth-js").Session | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
