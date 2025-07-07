export declare const noteRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("..").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: true;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            contactId?: string | undefined;
            sessionId?: string | undefined;
            topicTag?: string | undefined;
        } | undefined;
        output: any;
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            noteId: string;
        };
        output: any;
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            contact_id: string;
            content: string;
            id?: string | undefined;
            session_id?: string | null | undefined;
            topic_tags?: string[] | null | undefined;
            key_insights?: string[] | null | undefined;
            ai_summary?: string | null | undefined;
            sentiment_analysis?: any;
        };
        output: any;
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            contact_id?: string | undefined;
            session_id?: string | null | undefined;
            content?: string | undefined;
            topic_tags?: string[] | null | undefined;
            key_insights?: string[] | null | undefined;
            ai_summary?: string | null | undefined;
            sentiment_analysis?: any;
        };
        output: any;
        meta: object;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            noteId: string;
        };
        output: {
            success: boolean;
            noteId: string;
        };
        meta: object;
    }>;
    updateAiAnalysis: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            noteId: string;
            summary?: string | undefined;
            topicTags?: string[] | undefined;
            keyInsights?: string[] | undefined;
            sentimentAnalysis?: any;
        };
        output: any;
        meta: object;
    }>;
    getByTopicTag: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            tag: string;
        };
        output: any;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=note.d.ts.map