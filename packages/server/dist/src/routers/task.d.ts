import { TaskStatus, TaskCategory, TaskPriority } from '@codexcrm/db/src/models';
export declare const taskRouter: import("@trpc/server/dist/unstable-core-do-not-import").BuiltRouter<{
    ctx: import("..").Context;
    meta: object;
    errorShape: import("@trpc/server/dist/unstable-core-do-not-import").DefaultErrorShape;
    transformer: true;
}, import("@trpc/server/dist/unstable-core-do-not-import").DecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            contactId?: string | null | undefined;
            view?: string | undefined;
            projectId?: string | null | undefined;
        };
        output: import("@codexcrm/db/src/models").TaskModel[];
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: import("@codexcrm/db/src/models").TaskModel | null;
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
            priority?: TaskPriority | undefined;
            notes?: string | undefined;
            status?: TaskStatus | undefined;
            contactId?: string | null | undefined;
            is_repeating?: boolean | undefined;
            position?: number | undefined;
            category?: TaskCategory | undefined;
            projectId?: string | null | undefined;
            dueDate?: string | null | undefined;
            completionDate?: string | null | undefined;
            headingId?: string | null | undefined;
        };
        output: import("@codexcrm/db/src/models").TaskModel;
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            priority?: TaskPriority | undefined;
            notes?: string | undefined;
            status?: TaskStatus | undefined;
            contactId?: string | null | undefined;
            title?: string | undefined;
            is_repeating?: boolean | undefined;
            position?: number | undefined;
            category?: TaskCategory | undefined;
            projectId?: string | null | undefined;
            dueDate?: string | null | undefined;
            completionDate?: string | null | undefined;
            headingId?: string | null | undefined;
        };
        output: import("@codexcrm/db/src/models").TaskModel;
        meta: object;
    }>;
    softDelete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    restore: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: import("@codexcrm/db/src/models").TaskModel;
        meta: object;
    }>;
    complete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: import("@codexcrm/db/src/models").TaskModel;
        meta: object;
    }>;
    reopen: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: import("@codexcrm/db/src/models").TaskModel;
        meta: object;
    }>;
    cancel: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: import("@codexcrm/db/src/models").TaskModel;
        meta: object;
    }>;
    updatePositions: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            position: number;
        }[];
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    moveToCategory: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            category: TaskCategory;
        };
        output: import("@codexcrm/db/src/models").TaskModel;
        meta: object;
    }>;
    moveToProject: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            projectId: string | null;
            headingId?: string | null | undefined;
        };
        output: import("@codexcrm/db/src/models").TaskModel;
        meta: object;
    }>;
    setDueDate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            dueDate: string | null;
        };
        output: import("@codexcrm/db/src/models").TaskModel;
        meta: object;
    }>;
    getCategoryCounts: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: Record<string, number>;
        meta: object;
    }>;
    getTasksByContactId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            contactId: string;
        };
        output: import("@codexcrm/db/src/models").TaskModel[];
        meta: object;
    }>;
}>>;
