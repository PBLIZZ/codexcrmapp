export declare const importRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("..").Context;
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
//# sourceMappingURL=import.d.ts.map