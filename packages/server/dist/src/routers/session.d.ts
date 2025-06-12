export declare const sessionRouter: import("@trpc/server/dist/unstable-core-do-not-import").BuiltRouter<{
    ctx: import("..").Context;
    meta: object;
    errorShape: import("@trpc/server/dist/unstable-core-do-not-import").DefaultErrorShape;
    transformer: true;
}, import("@trpc/server/dist/unstable-core-do-not-import").DecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            contactId?: string | undefined;
            upcoming?: boolean | undefined;
            sessionType?: string | undefined;
            followUpNeeded?: boolean | undefined;
            limit?: number | undefined;
        } | undefined;
        output: any[];
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            sessionId: string;
        };
        output: any;
        meta: object;
    }>;
    getWithDetails: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            sessionId: string;
        };
        output: any;
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            contact_id: string;
            session_time: string;
            id?: string | undefined;
            notes?: string | null | undefined;
            status?: string | null | undefined;
            session_type?: string | null | undefined;
            follow_up_needed?: boolean | null | undefined;
            duration_minutes?: number | null | undefined;
            location?: string | null | undefined;
            virtual_meeting_link?: string | null | undefined;
            key_topics?: string[] | null | undefined;
            outcomes?: string | null | undefined;
            follow_up_details?: string | null | undefined;
            service_id?: string | null | undefined;
            program_id?: string | null | undefined;
            sentiment?: string | null | undefined;
            ai_insights?: any;
        };
        output: any;
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            notes?: string | null | undefined;
            status?: string | null | undefined;
            contact_id?: string | undefined;
            session_time?: string | undefined;
            session_type?: string | null | undefined;
            follow_up_needed?: boolean | null | undefined;
            duration_minutes?: number | null | undefined;
            location?: string | null | undefined;
            virtual_meeting_link?: string | null | undefined;
            key_topics?: string[] | null | undefined;
            outcomes?: string | null | undefined;
            follow_up_details?: string | null | undefined;
            service_id?: string | null | undefined;
            program_id?: string | null | undefined;
            sentiment?: string | null | undefined;
            ai_insights?: any;
        };
        output: any;
        meta: object;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            sessionId: string;
        };
        output: {
            success: boolean;
            sessionId: string;
        };
        meta: object;
    }>;
    updateAiInsights: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            sessionId: string;
            insights?: any;
        };
        output: any;
        meta: object;
    }>;
}>>;
