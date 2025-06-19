export declare const groupRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("..").Context;
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
            id?: string | undefined;
            description?: string | null | undefined;
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
