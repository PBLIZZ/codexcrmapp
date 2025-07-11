import * as _trpc_server from '@trpc/server';
import * as _supabase_supabase_js from '@supabase/supabase-js';
import * as _codexcrm_database_prisma_generated_client_client from '@codexcrm/database/prisma/generated/client/client';

declare const router: _trpc_server.TRPCRouterBuilder<{
    ctx: {
        prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
        session: _supabase_supabase_js.AuthSession | null;
        supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
            PostgrestVersion: "12";
        }, "public", any>;
    };
    meta: object;
    errorShape: _trpc_server.TRPCDefaultErrorShape;
    transformer: true;
}>;
declare const publicProcedure: _trpc_server.TRPCProcedureBuilder<{
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: _supabase_supabase_js.AuthSession | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
}, object, object, _trpc_server.TRPCUnsetMarker, _trpc_server.TRPCUnsetMarker, _trpc_server.TRPCUnsetMarker, _trpc_server.TRPCUnsetMarker, false>;
declare const middleware: <$ContextOverrides>(fn: _trpc_server.TRPCMiddlewareFunction<{
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: _supabase_supabase_js.AuthSession | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
}, object, object, $ContextOverrides, unknown>) => _trpc_server.TRPCMiddlewareBuilder<{
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: _supabase_supabase_js.AuthSession | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
}, object, $ContextOverrides, unknown>;
/**
 * Role-based authorization middleware
 * Checks if the user has the required role
 * @param requiredRoles Array of roles that are allowed to access the resource
 */
declare const hasRole: (requiredRoles: string[]) => _trpc_server.TRPCMiddlewareBuilder<{
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: _supabase_supabase_js.AuthSession | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
}, object, {
    user: _supabase_supabase_js.AuthUser;
    roles: any;
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: _supabase_supabase_js.AuthSession | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
}, unknown>;
/**
 * Rate limiting middleware
 * Limits the number of requests a user can make in a given time period
 * @param limit Maximum number of requests
 * @param timeWindowMs Time window in milliseconds
 */
declare const rateLimit: (limit: number, timeWindowMs?: number) => _trpc_server.TRPCMiddlewareBuilder<{
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: _supabase_supabase_js.AuthSession | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
}, object, {
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: _supabase_supabase_js.AuthSession | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
}, unknown>;
declare const protectedProcedure: _trpc_server.TRPCProcedureBuilder<{
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: _supabase_supabase_js.AuthSession | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
}, object, {
    user: _supabase_supabase_js.AuthUser;
    prisma: _codexcrm_database_prisma_generated_client_client.PrismaClient;
    session: _supabase_supabase_js.AuthSession | null;
    supabaseAdmin: _supabase_supabase_js.SupabaseClient<any, {
        PostgrestVersion: "12";
    }, "public", any>;
}, _trpc_server.TRPCUnsetMarker, _trpc_server.TRPCUnsetMarker, _trpc_server.TRPCUnsetMarker, _trpc_server.TRPCUnsetMarker, false>;

export { hasRole, middleware, protectedProcedure, publicProcedure, rateLimit, router };
