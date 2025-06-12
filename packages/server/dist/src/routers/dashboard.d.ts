export declare const dashboardRouter: import("@trpc/server/dist/unstable-core-do-not-import").BuiltRouter<{
    ctx: import("..").Context;
    meta: object;
    errorShape: import("@trpc/server/dist/unstable-core-do-not-import").DefaultErrorShape;
    transformer: true;
}, import("@trpc/server/dist/unstable-core-do-not-import").DecorateCreateRouterOptions<{
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
