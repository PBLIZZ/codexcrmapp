export declare const dashboardRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("..").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: true;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
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
//# sourceMappingURL=dashboard.d.ts.map