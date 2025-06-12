export declare const storageRouter: import("@trpc/server/dist/unstable-core-do-not-import").BuiltRouter<{
    ctx: import("..").Context;
    meta: object;
    errorShape: import("@trpc/server/dist/unstable-core-do-not-import").DefaultErrorShape;
    transformer: true;
}, import("@trpc/server/dist/unstable-core-do-not-import").DecorateCreateRouterOptions<{
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
