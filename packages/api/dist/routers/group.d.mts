import * as _prisma_client_runtime_library from '@prisma/client/runtime/library';
import * as _trpc_server from '@trpc/server';
import * as _supabase_supabase_js from '@supabase/supabase-js';
import * as _codexcrm_database_prisma_generated_client_client from '@codexcrm/database/prisma/generated/client/client';

declare const groupRouter: _trpc_server.TRPCBuiltRouter<{
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
    getGroupsForContact: _trpc_server.TRPCQueryProcedure<{
        input: {
            contactId: string;
        };
        output: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            emoji: string | null;
            color: string | null;
        }[];
        meta: object;
    }>;
    list: _trpc_server.TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            name: string;
            description: string | null;
            color: string | null;
            emoji: string | null;
            createdAt: Date;
            updatedAt: Date;
            contactCount: number;
        }[];
        meta: object;
    }>;
    getById: _trpc_server.TRPCQueryProcedure<{
        input: {
            groupId: string;
        };
        output: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            emoji: string | null;
            color: string | null;
        };
        meta: object;
    }>;
    save: _trpc_server.TRPCMutationProcedure<{
        input: {
            name: string;
            id?: string | undefined;
            description?: string | null | undefined;
            emoji?: string | null | undefined;
            color?: string | null | undefined;
        };
        output: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            emoji: string | null;
            color: string | null;
        };
        meta: object;
    }>;
    delete: _trpc_server.TRPCMutationProcedure<{
        input: {
            groupId: string;
        };
        output: {
            success: boolean;
            deletedGroupId: string;
        };
        meta: object;
    }>;
    addContact: _trpc_server.TRPCMutationProcedure<{
        input: {
            groupId: string;
            contactId: string;
        };
        output: {
            success: boolean;
            message: string;
        } | {
            success: boolean;
            message?: undefined;
        };
        meta: object;
    }>;
    removeContact: _trpc_server.TRPCMutationProcedure<{
        input: {
            groupId: string;
            contactId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    getContacts: _trpc_server.TRPCQueryProcedure<{
        input: {
            groupId: string;
        };
        output: {
            id: string;
            fullName: string;
            email: string;
            phone: string | null;
            jobTitle: string | null;
            companyName: string | null;
            profileImageUrl: string | null;
            website: string | null;
            tags: string[];
            socialHandles: string[];
            addressStreet: string | null;
            addressCity: string | null;
            addressPostalCode: string | null;
            addressCountry: string | null;
            phoneCountryCode: string | null;
            notes: string | null;
            source: string | null;
            lastContactedAt: Date | null;
            wellnessGoals: string[];
            wellnessJourneyStage: string | null;
            wellnessStatus: string | null;
            lastAssessmentDate: Date | null;
            clientSince: Date | null;
            relationshipStatus: string | null;
            referralSource: string | null;
            enrichmentStatus: string | null;
            enrichedData: _prisma_client_runtime_library.JsonValue | null;
            communicationPreferences: _prisma_client_runtime_library.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
        meta: object;
    }>;
}>>;

export { groupRouter };
