export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./context").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: true;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    contacts: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                search?: string | undefined;
                groupId?: string | undefined;
            };
            output: any;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId: string;
            };
            output: any;
            meta: object;
        }>;
        save: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                full_name: string;
                id?: string | undefined;
                email?: string | null | undefined;
                phone?: string | null | undefined;
                phone_country_code?: string | null | undefined;
                company_name?: string | null | undefined;
                job_title?: string | null | undefined;
                address_street?: string | null | undefined;
                address_city?: string | null | undefined;
                address_postal_code?: string | null | undefined;
                address_country?: string | null | undefined;
                website?: string | null | undefined;
                profile_image_url?: string | null | undefined;
                notes?: string | null | undefined;
                tags?: string[] | null | undefined;
                social_handles?: string[] | null | undefined;
                source?: string | null | undefined;
                last_contacted_at?: unknown;
                enriched_data?: any;
                enrichment_status?: string | null | undefined;
            };
            output: Record<string, unknown>;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contactId: string;
            };
            output: {
                success: boolean;
                contactId: string;
            };
            meta: object;
        }>;
        updateNotes: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                notes: string;
                contactId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getTotalContactsCount: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                count: any;
            };
            meta: object;
        }>;
    }>>;
    groups: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        getGroupsForContact: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId: string;
            };
            output: any;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                groupId: string;
            };
            output: any;
            meta: object;
        }>;
        save: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                description?: string | null | undefined;
                id?: string | undefined;
                color?: string | null | undefined;
                emoji?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                groupId: string;
            };
            output: {
                success: boolean;
                deletedGroupId: string;
            };
            meta: object;
        }>;
        addContact: import("@trpc/server").TRPCMutationProcedure<{
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
        removeContact: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                groupId: string;
                contactId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getContacts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                groupId: string;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    storage: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        getUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
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
        getFileUrl: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                filePath: string;
            };
            output: {
                signedUrl: string;
            };
            meta: object;
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                filePath: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    dashboard: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        contactMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            output: {
                totalContacts: any;
                newContacts: any;
                journeyStageDistribution: any;
                recentActivity: any;
            };
            meta: object;
        }>;
        sessionMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            output: {
                totalSessions: any;
                sessionsInRange: any;
                sessionTypeDistribution: any;
                upcomingSessions: any;
                sessionTrend: {
                    date: any;
                    count: any;
                }[];
            };
            meta: object;
        }>;
        aiActionMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            output: {
                totalActions: any;
                actionsByStatus: any;
                actionsByType: any;
                recentActions: any;
                implementationRate: number;
            };
            meta: object;
        }>;
        summary: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            output: {
                totalContacts: any;
                totalSessions: any;
                totalAiActions: any;
                totalNotes: any;
                newContactsCount: any;
                upcomingSessionsCount: any;
                pendingActionsCount: any;
                dateRange: {
                    startDate: string;
                    endDate: string;
                };
            };
            meta: object;
        }>;
    }>>;
    import: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        contacts: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                full_name: string;
                email?: string | null | undefined;
                phone?: string | null | undefined;
                phone_country_code?: string | null | undefined;
                job_title?: string | null | undefined;
                website?: string | null | undefined;
                notes?: string | null | undefined;
                tags?: string[] | null | undefined;
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
export type AppRouter = typeof appRouter;
//# sourceMappingURL=root.d.ts.map