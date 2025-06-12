export declare const contactRouter: import("@trpc/server/dist/unstable-core-do-not-import").BuiltRouter<{
    ctx: import("..").Context;
    meta: object;
    errorShape: import("@trpc/server/dist/unstable-core-do-not-import").DefaultErrorShape;
    transformer: true;
}, import("@trpc/server/dist/unstable-core-do-not-import").DecorateCreateRouterOptions<{
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
}>>;
