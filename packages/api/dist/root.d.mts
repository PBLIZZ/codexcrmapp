import * as _prisma_client_runtime_library from '@prisma/client/runtime/library';
import * as _trpc_server from '@trpc/server';
import * as _supabase_supabase_js from '@supabase/supabase-js';
import * as _codexcrm_database_prisma_generated_client_client from '@codexcrm/database/prisma/generated/client/client';

declare const appRouter: _trpc_server.TRPCBuiltRouter<{
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
    contacts: _trpc_server.TRPCBuiltRouter<{
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
        list: _trpc_server.TRPCQueryProcedure<{
            input: {
                search?: string | undefined;
                groupId?: string | undefined;
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
        getById: _trpc_server.TRPCQueryProcedure<{
            input: {
                contactId: string;
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
            };
            meta: object;
        }>;
        save: _trpc_server.TRPCMutationProcedure<{
            input: {
                full_name: string;
                id?: string | undefined;
                email?: string | null | undefined;
                phone?: string | null | undefined;
                website?: string | null | undefined;
                tags?: string[] | null | undefined;
                notes?: string | null | undefined;
                source?: string | null | undefined;
                phone_country_code?: string | null | undefined;
                company_name?: string | null | undefined;
                job_title?: string | null | undefined;
                address_street?: string | null | undefined;
                address_city?: string | null | undefined;
                address_postal_code?: string | null | undefined;
                address_country?: string | null | undefined;
                profile_image_url?: string | null | undefined;
                social_handles?: string[] | null | undefined;
                last_contacted_at?: unknown;
                enriched_data?: any;
                enrichment_status?: string | null | undefined;
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
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: {
                contactId: string;
            };
            output: {
                success: boolean;
                contactId: string;
            };
            meta: object;
        }>;
        updateNotes: _trpc_server.TRPCMutationProcedure<{
            input: {
                notes: string;
                contactId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getTotalContactsCount: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                count: number;
            };
            meta: object;
        }>;
    }>>;
    groups: _trpc_server.TRPCBuiltRouter<{
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
    storage: _trpc_server.TRPCBuiltRouter<{
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
    dashboard: _trpc_server.TRPCBuiltRouter<{
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
    import: _trpc_server.TRPCBuiltRouter<{
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
}>>;
type AppRouter = typeof appRouter;

export { type AppRouter, appRouter };
