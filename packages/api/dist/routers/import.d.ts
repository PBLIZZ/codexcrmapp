import * as _trpc_server from '@trpc/server';
import * as _supabase_supabase_js from '@supabase/supabase-js';
import * as _codexcrm_database_prisma_generated_client_client from '@codexcrm/database/prisma/generated/client/client';

declare const importRouter: _trpc_server.TRPCBuiltRouter<{
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
}, _trpc_server.TRPCDecorateCreateRouterOptions<{
    contacts: _trpc_server.TRPCMutationProcedure<{
        input: {
            full_name: string;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            website?: string | null | undefined;
            tags?: string[] | null | undefined;
            notes?: string | null | undefined;
            phone_country_code?: string | null | undefined;
            job_title?: string | null | undefined;
            social_handles?: string[] | null | undefined;
            company?: string | null | undefined;
            address?: string | null | undefined;
        }[];
        output: {
            success: boolean;
            imported: number;
            errors: string[];
            skipped: number;
        } | {
            success: boolean;
            imported: number;
            errors: never[];
        };
        meta: object;
    }>;
}>>;

export { importRouter };
