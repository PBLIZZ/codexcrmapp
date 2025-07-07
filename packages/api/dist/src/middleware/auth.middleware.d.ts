import type { Context } from '@codexcrm/api/src/context';
declare const middleware: <$ContextOverrides>(fn: import("@trpc/server").TRPCMiddlewareFunction<Context, object, object, $ContextOverrides, unknown>) => import("@trpc/server").TRPCMiddlewareBuilder<Context, object, $ContextOverrides, unknown>;
/**
 * Authentication middleware
 * Checks if the user is authenticated and adds the user to the context
 */
export declare const isAuthenticated: import("@trpc/server").TRPCMiddlewareBuilder<Context, object, {
    user: import("@supabase/supabase-js").AuthUser;
    session: import("@supabase/supabase-js").AuthSession | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, unknown>;
/**
 * Role-based authorization middleware
 * Checks if the user has the required role
 * @param requiredRoles Array of roles that are allowed to access the resource
 */
export declare const hasRole: (requiredRoles: string[]) => import("@trpc/server").TRPCMiddlewareBuilder<Context, object, {
    user: import("@supabase/supabase-js").AuthUser;
    roles: any;
    session: import("@supabase/supabase-js").AuthSession | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, unknown>;
/**
 * Owner-based authorization middleware
 * Checks if the user is the owner of the resource
 * @param getResourceOwnerId Function that returns the owner ID of the resource
 */
export declare const isOwner: <TInput>(getResourceOwnerId: (input: TInput, ctx: Context) => Promise<string | null>) => import("@trpc/server").TRPCMiddlewareBuilder<Context, object, {
    user: import("@supabase/supabase-js").AuthUser;
    session: import("@supabase/supabase-js").AuthSession | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, unknown>;
/**
 * Combine multiple middleware functions
 * @param middlewares Array of middleware functions to combine
 */
export declare const combineMiddlewares: (middlewares: ReturnType<typeof middleware>[]) => import("@trpc/server").TRPCMiddlewareBuilder<Context, object, {
    user: import("@supabase/supabase-js").AuthUser | null;
    session: import("@supabase/supabase-js").AuthSession | null;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    supabaseUser: any;
}, unknown>;
export {};
//# sourceMappingURL=auth.middleware.d.ts.map