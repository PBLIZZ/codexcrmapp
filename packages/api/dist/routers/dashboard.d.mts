import * as _trpc_server from '@trpc/server';
import * as _supabase_supabase_js from '@supabase/supabase-js';
import * as _codexcrm_database_prisma_generated_client_client from '@codexcrm/database/prisma/generated/client/client';

declare const dashboardRouter: _trpc_server.TRPCBuiltRouter<{
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
    contactMetrics: _trpc_server.TRPCQueryProcedure<{
        input: {
            startDate?: string | undefined;
            endDate?: string | undefined;
        } | undefined;
        output: {
            totalContacts: number;
            newContacts: number;
            stageDistribution: {
                stage: string;
                count: number;
            }[];
            recentActivity: {
                id: string;
                fullName: string;
                email: string;
                profileImageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
            dateRange: {
                startDate: string;
                endDate: string;
            };
        };
        meta: object;
    }>;
    summary: _trpc_server.TRPCQueryProcedure<{
        input: {
            startDate?: string | undefined;
            endDate?: string | undefined;
        } | undefined;
        output: {
            totalContacts: number;
            newContactsCount: number;
            dateRange: {
                startDate: string;
                endDate: string;
            };
        };
        meta: object;
    }>;
}>>;

export { dashboardRouter };
