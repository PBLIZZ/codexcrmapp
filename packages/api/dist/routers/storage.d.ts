import * as _trpc_server from '@trpc/server';
import * as _supabase_supabase_js from '@supabase/supabase-js';
import * as _codexcrm_database_prisma_generated_client_client from '@codexcrm/database/prisma/generated/client/client';

declare const storageRouter: _trpc_server.TRPCBuiltRouter<{
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
    getUploadUrl: _trpc_server.TRPCMutationProcedure<{
        input: {
            fileName: string;
            contentType: string;
            folderPath?: string | undefined;
        };
        output: {
            signedUrl: string;
            path: string;
            token: string;
        };
        meta: object;
    }>;
    getFileUrl: _trpc_server.TRPCQueryProcedure<{
        input: {
            filePath: string;
        };
        output: {
            signedUrl: string;
        };
        meta: object;
    }>;
    deleteFile: _trpc_server.TRPCMutationProcedure<{
        input: {
            filePath: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;

export { storageRouter };
