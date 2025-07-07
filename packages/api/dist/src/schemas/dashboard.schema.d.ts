import { z } from 'zod';
export declare const dateRangeSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export declare const contactMetricsSchema: z.ZodObject<{
    totalContacts: z.ZodNumber;
    newContacts: z.ZodNumber;
    journeyStageDistribution: z.ZodArray<z.ZodObject<{
        wellness_journey_stage: z.ZodString;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        count: number;
        wellness_journey_stage: string;
    }, {
        count: number;
        wellness_journey_stage: string;
    }>, "many">;
    recentActivity: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodString;
        last_contacted_at: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name: string;
        last_contacted_at: string | null;
    }, {
        id: string;
        full_name: string;
        last_contacted_at: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    totalContacts: number;
    newContacts: number;
    journeyStageDistribution: {
        count: number;
        wellness_journey_stage: string;
    }[];
    recentActivity: {
        id: string;
        full_name: string;
        last_contacted_at: string | null;
    }[];
}, {
    totalContacts: number;
    newContacts: number;
    journeyStageDistribution: {
        count: number;
        wellness_journey_stage: string;
    }[];
    recentActivity: {
        id: string;
        full_name: string;
        last_contacted_at: string | null;
    }[];
}>;
export declare const sessionMetricsSchema: z.ZodObject<{
    totalSessions: z.ZodNumber;
    sessionsInRange: z.ZodNumber;
    sessionTypeDistribution: z.ZodArray<z.ZodObject<{
        session_type: z.ZodString;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        count: number;
        session_type: string;
    }, {
        count: number;
        session_type: string;
    }>, "many">;
    upcomingSessions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        session_time: z.ZodString;
        contact_id: z.ZodString;
        contacts: z.ZodOptional<z.ZodObject<{
            full_name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            full_name: string;
        }, {
            full_name: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        contact_id: string;
        session_time: string;
        contacts?: {
            full_name: string;
        } | undefined;
    }, {
        id: string;
        contact_id: string;
        session_time: string;
        contacts?: {
            full_name: string;
        } | undefined;
    }>, "many">;
    sessionTrend: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        date: string;
        count: number;
    }, {
        date: string;
        count: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    sessionTrend: {
        date: string;
        count: number;
    }[];
    totalSessions: number;
    sessionsInRange: number;
    sessionTypeDistribution: {
        count: number;
        session_type: string;
    }[];
    upcomingSessions: {
        id: string;
        contact_id: string;
        session_time: string;
        contacts?: {
            full_name: string;
        } | undefined;
    }[];
}, {
    sessionTrend: {
        date: string;
        count: number;
    }[];
    totalSessions: number;
    sessionsInRange: number;
    sessionTypeDistribution: {
        count: number;
        session_type: string;
    }[];
    upcomingSessions: {
        id: string;
        contact_id: string;
        session_time: string;
        contacts?: {
            full_name: string;
        } | undefined;
    }[];
}>;
export declare const aiActionMetricsSchema: z.ZodObject<{
    totalActions: z.ZodNumber;
    actionsByStatus: z.ZodArray<z.ZodObject<{
        status: z.ZodString;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        status: string;
        count: number;
    }, {
        status: string;
        count: number;
    }>, "many">;
    actionsByType: z.ZodArray<z.ZodObject<{
        action_type: z.ZodString;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        count: number;
        action_type: string;
    }, {
        count: number;
        action_type: string;
    }>, "many">;
    recentActions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        action_type: z.ZodString;
        suggestion: z.ZodString;
        status: z.ZodString;
        created_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status: string;
        created_at: string;
        action_type: string;
        suggestion: string;
    }, {
        id: string;
        status: string;
        created_at: string;
        action_type: string;
        suggestion: string;
    }>, "many">;
    implementationRate: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    implementationRate: number;
    totalActions: number;
    actionsByStatus: {
        status: string;
        count: number;
    }[];
    actionsByType: {
        count: number;
        action_type: string;
    }[];
    recentActions: {
        id: string;
        status: string;
        created_at: string;
        action_type: string;
        suggestion: string;
    }[];
}, {
    implementationRate: number;
    totalActions: number;
    actionsByStatus: {
        status: string;
        count: number;
    }[];
    actionsByType: {
        count: number;
        action_type: string;
    }[];
    recentActions: {
        id: string;
        status: string;
        created_at: string;
        action_type: string;
        suggestion: string;
    }[];
}>;
export declare const dashboardSummarySchema: z.ZodObject<{
    totalContacts: z.ZodNumber;
    totalSessions: z.ZodNumber;
    totalAiActions: z.ZodNumber;
    totalNotes: z.ZodNumber;
    newContactsCount: z.ZodNumber;
    upcomingSessionsCount: z.ZodNumber;
    pendingActionsCount: z.ZodNumber;
    dateRange: z.ZodObject<{
        startDate: z.ZodString;
        endDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        startDate: string;
        endDate: string;
    }, {
        startDate: string;
        endDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    totalContacts: number;
    totalSessions: number;
    totalAiActions: number;
    totalNotes: number;
    newContactsCount: number;
    upcomingSessionsCount: number;
    pendingActionsCount: number;
    dateRange: {
        startDate: string;
        endDate: string;
    };
}, {
    totalContacts: number;
    totalSessions: number;
    totalAiActions: number;
    totalNotes: number;
    newContactsCount: number;
    upcomingSessionsCount: number;
    pendingActionsCount: number;
    dateRange: {
        startDate: string;
        endDate: string;
    };
}>;
export declare const timePeriodSchema: z.ZodEnum<["today", "yesterday", "this_week", "last_week", "this_month", "last_month", "this_quarter", "last_quarter", "this_year", "last_year", "custom"]>;
export declare const dashboardFilterSchema: z.ZodObject<{
    timePeriod: z.ZodOptional<z.ZodEnum<["today", "yesterday", "this_week", "last_week", "this_month", "last_month", "this_quarter", "last_quarter", "this_year", "last_year", "custom"]>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>>;
    includeContacts: z.ZodOptional<z.ZodBoolean>;
    includeSessions: z.ZodOptional<z.ZodBoolean>;
    includeAiActions: z.ZodOptional<z.ZodBoolean>;
    includeNotes: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    dateRange?: {
        startDate?: string | undefined;
        endDate?: string | undefined;
    } | undefined;
    timePeriod?: "custom" | "today" | "yesterday" | "this_week" | "last_week" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "this_year" | "last_year" | undefined;
    includeContacts?: boolean | undefined;
    includeSessions?: boolean | undefined;
    includeAiActions?: boolean | undefined;
    includeNotes?: boolean | undefined;
}, {
    dateRange?: {
        startDate?: string | undefined;
        endDate?: string | undefined;
    } | undefined;
    timePeriod?: "custom" | "today" | "yesterday" | "this_week" | "last_week" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "this_year" | "last_year" | undefined;
    includeContacts?: boolean | undefined;
    includeSessions?: boolean | undefined;
    includeAiActions?: boolean | undefined;
    includeNotes?: boolean | undefined;
}>;
export declare const DashboardSchemas: {
    dateRange: z.ZodObject<{
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
    contactMetrics: z.ZodObject<{
        totalContacts: z.ZodNumber;
        newContacts: z.ZodNumber;
        journeyStageDistribution: z.ZodArray<z.ZodObject<{
            wellness_journey_stage: z.ZodString;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            count: number;
            wellness_journey_stage: string;
        }, {
            count: number;
            wellness_journey_stage: string;
        }>, "many">;
        recentActivity: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            full_name: z.ZodString;
            last_contacted_at: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            full_name: string;
            last_contacted_at: string | null;
        }, {
            id: string;
            full_name: string;
            last_contacted_at: string | null;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        totalContacts: number;
        newContacts: number;
        journeyStageDistribution: {
            count: number;
            wellness_journey_stage: string;
        }[];
        recentActivity: {
            id: string;
            full_name: string;
            last_contacted_at: string | null;
        }[];
    }, {
        totalContacts: number;
        newContacts: number;
        journeyStageDistribution: {
            count: number;
            wellness_journey_stage: string;
        }[];
        recentActivity: {
            id: string;
            full_name: string;
            last_contacted_at: string | null;
        }[];
    }>;
    sessionMetrics: z.ZodObject<{
        totalSessions: z.ZodNumber;
        sessionsInRange: z.ZodNumber;
        sessionTypeDistribution: z.ZodArray<z.ZodObject<{
            session_type: z.ZodString;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            count: number;
            session_type: string;
        }, {
            count: number;
            session_type: string;
        }>, "many">;
        upcomingSessions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            session_time: z.ZodString;
            contact_id: z.ZodString;
            contacts: z.ZodOptional<z.ZodObject<{
                full_name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                full_name: string;
            }, {
                full_name: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            contact_id: string;
            session_time: string;
            contacts?: {
                full_name: string;
            } | undefined;
        }, {
            id: string;
            contact_id: string;
            session_time: string;
            contacts?: {
                full_name: string;
            } | undefined;
        }>, "many">;
        sessionTrend: z.ZodArray<z.ZodObject<{
            date: z.ZodString;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            date: string;
            count: number;
        }, {
            date: string;
            count: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        sessionTrend: {
            date: string;
            count: number;
        }[];
        totalSessions: number;
        sessionsInRange: number;
        sessionTypeDistribution: {
            count: number;
            session_type: string;
        }[];
        upcomingSessions: {
            id: string;
            contact_id: string;
            session_time: string;
            contacts?: {
                full_name: string;
            } | undefined;
        }[];
    }, {
        sessionTrend: {
            date: string;
            count: number;
        }[];
        totalSessions: number;
        sessionsInRange: number;
        sessionTypeDistribution: {
            count: number;
            session_type: string;
        }[];
        upcomingSessions: {
            id: string;
            contact_id: string;
            session_time: string;
            contacts?: {
                full_name: string;
            } | undefined;
        }[];
    }>;
    aiActionMetrics: z.ZodObject<{
        totalActions: z.ZodNumber;
        actionsByStatus: z.ZodArray<z.ZodObject<{
            status: z.ZodString;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            status: string;
            count: number;
        }, {
            status: string;
            count: number;
        }>, "many">;
        actionsByType: z.ZodArray<z.ZodObject<{
            action_type: z.ZodString;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            count: number;
            action_type: string;
        }, {
            count: number;
            action_type: string;
        }>, "many">;
        recentActions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            action_type: z.ZodString;
            suggestion: z.ZodString;
            status: z.ZodString;
            created_at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            status: string;
            created_at: string;
            action_type: string;
            suggestion: string;
        }, {
            id: string;
            status: string;
            created_at: string;
            action_type: string;
            suggestion: string;
        }>, "many">;
        implementationRate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        implementationRate: number;
        totalActions: number;
        actionsByStatus: {
            status: string;
            count: number;
        }[];
        actionsByType: {
            count: number;
            action_type: string;
        }[];
        recentActions: {
            id: string;
            status: string;
            created_at: string;
            action_type: string;
            suggestion: string;
        }[];
    }, {
        implementationRate: number;
        totalActions: number;
        actionsByStatus: {
            status: string;
            count: number;
        }[];
        actionsByType: {
            count: number;
            action_type: string;
        }[];
        recentActions: {
            id: string;
            status: string;
            created_at: string;
            action_type: string;
            suggestion: string;
        }[];
    }>;
    summary: z.ZodObject<{
        totalContacts: z.ZodNumber;
        totalSessions: z.ZodNumber;
        totalAiActions: z.ZodNumber;
        totalNotes: z.ZodNumber;
        newContactsCount: z.ZodNumber;
        upcomingSessionsCount: z.ZodNumber;
        pendingActionsCount: z.ZodNumber;
        dateRange: z.ZodObject<{
            startDate: z.ZodString;
            endDate: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            startDate: string;
            endDate: string;
        }, {
            startDate: string;
            endDate: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        totalContacts: number;
        totalSessions: number;
        totalAiActions: number;
        totalNotes: number;
        newContactsCount: number;
        upcomingSessionsCount: number;
        pendingActionsCount: number;
        dateRange: {
            startDate: string;
            endDate: string;
        };
    }, {
        totalContacts: number;
        totalSessions: number;
        totalAiActions: number;
        totalNotes: number;
        newContactsCount: number;
        upcomingSessionsCount: number;
        pendingActionsCount: number;
        dateRange: {
            startDate: string;
            endDate: string;
        };
    }>;
    timePeriod: z.ZodEnum<["today", "yesterday", "this_week", "last_week", "this_month", "last_month", "this_quarter", "last_quarter", "this_year", "last_year", "custom"]>;
    filter: z.ZodObject<{
        timePeriod: z.ZodOptional<z.ZodEnum<["today", "yesterday", "this_week", "last_week", "this_month", "last_month", "this_quarter", "last_quarter", "this_year", "last_year", "custom"]>>;
        dateRange: z.ZodOptional<z.ZodObject<{
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            startDate?: string | undefined;
            endDate?: string | undefined;
        }, {
            startDate?: string | undefined;
            endDate?: string | undefined;
        }>>;
        includeContacts: z.ZodOptional<z.ZodBoolean>;
        includeSessions: z.ZodOptional<z.ZodBoolean>;
        includeAiActions: z.ZodOptional<z.ZodBoolean>;
        includeNotes: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        dateRange?: {
            startDate?: string | undefined;
            endDate?: string | undefined;
        } | undefined;
        timePeriod?: "custom" | "today" | "yesterday" | "this_week" | "last_week" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "this_year" | "last_year" | undefined;
        includeContacts?: boolean | undefined;
        includeSessions?: boolean | undefined;
        includeAiActions?: boolean | undefined;
        includeNotes?: boolean | undefined;
    }, {
        dateRange?: {
            startDate?: string | undefined;
            endDate?: string | undefined;
        } | undefined;
        timePeriod?: "custom" | "today" | "yesterday" | "this_week" | "last_week" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "this_year" | "last_year" | undefined;
        includeContacts?: boolean | undefined;
        includeSessions?: boolean | undefined;
        includeAiActions?: boolean | undefined;
        includeNotes?: boolean | undefined;
    }>;
};
//# sourceMappingURL=dashboard.schema.d.ts.map