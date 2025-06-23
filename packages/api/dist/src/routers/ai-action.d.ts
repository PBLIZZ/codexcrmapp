export declare const aiActionRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("..").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: true;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            contactId?: string | undefined;
            sessionId?: string | undefined;
            status?: string | undefined;
            actionType?: string | undefined;
        } | undefined;
        output: any;
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
            action_type: string;
            contact_id: string;
            suggestion: string;
            status?: string | undefined;
            id?: string | undefined;
            session_id?: string | null | undefined;
            priority?: string | null | undefined;
            context?: any;
            implemented?: boolean | undefined;
            implementation_date?: string | null | undefined;
            feedback?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            status?: string | undefined;
            action_type?: string | undefined;
            contact_id?: string | undefined;
            session_id?: string | null | undefined;
            suggestion?: string | undefined;
            priority?: string | null | undefined;
            context?: any;
            implemented?: boolean | undefined;
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
            success: any;
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
