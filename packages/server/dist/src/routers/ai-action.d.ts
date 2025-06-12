export declare const aiActionRouter: import("@trpc/server/dist/unstable-core-do-not-import").BuiltRouter<{
    ctx: import("..").Context;
    meta: object;
    errorShape: import("@trpc/server/dist/unstable-core-do-not-import").DefaultErrorShape;
    transformer: true;
}, import("@trpc/server/dist/unstable-core-do-not-import").DecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            status?: string | undefined;
            contactId?: string | undefined;
            sessionId?: string | undefined;
            actionType?: string | undefined;
        } | undefined;
        output: any[];
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            actionId: string;
        };
        output: any;
        meta: object;
    }>;
    getWithDetails: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            actionId: string;
        };
        output: any;
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            contact_id: string;
            action_type: string;
            suggestion: string;
            id?: string | undefined;
            priority?: string | null | undefined;
            status?: string | undefined;
            session_id?: string | null | undefined;
            implemented?: boolean | undefined;
            context?: any;
            implementation_date?: string | null | undefined;
            feedback?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            priority?: string | null | undefined;
            status?: string | undefined;
            contact_id?: string | undefined;
            session_id?: string | null | undefined;
            action_type?: string | undefined;
            implemented?: boolean | undefined;
            suggestion?: string | undefined;
            context?: any;
            implementation_date?: string | null | undefined;
            feedback?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            actionId: string;
        };
        output: {
            success: boolean;
            actionId: string;
        };
        meta: object;
    }>;
    updateStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            status: string;
            actionId: string;
            feedback?: string | undefined;
        };
        output: any;
        meta: object;
    }>;
    markImplemented: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            actionId: string;
            feedback?: string | undefined;
        };
        output: any;
        meta: object;
    }>;
}>>;
