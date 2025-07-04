import { z } from 'zod';

// Schema for date range
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Schema for contact metrics response
export const contactMetricsSchema = z.object({
  totalContacts: z.number(),
  newContacts: z.number(),
  journeyStageDistribution: z.array(
    z.object({
      wellness_journey_stage: z.string(),
      count: z.number(),
    })
  ),
  recentActivity: z.array(
    z.object({
      id: z.string().uuid(),
      full_name: z.string(),
      last_contacted_at: z.string().nullable(),
    })
  ),
});

// Schema for session metrics response
export const sessionMetricsSchema = z.object({
  totalSessions: z.number(),
  sessionsInRange: z.number(),
  sessionTypeDistribution: z.array(
    z.object({
      session_type: z.string(),
      count: z.number(),
    })
  ),
  upcomingSessions: z.array(
    z.object({
      id: z.string().uuid(),
      session_time: z.string(),
      contact_id: z.string().uuid(),
      contacts: z.object({
        full_name: z.string(),
      }).optional(),
    })
  ),
  sessionTrend: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
    })
  ),
});

// Schema for AI action metrics response
export const aiActionMetricsSchema = z.object({
  totalActions: z.number(),
  actionsByStatus: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
    })
  ),
  actionsByType: z.array(
    z.object({
      action_type: z.string(),
      count: z.number(),
    })
  ),
  recentActions: z.array(
    z.object({
      id: z.string().uuid(),
      action_type: z.string(),
      suggestion: z.string(),
      status: z.string(),
      created_at: z.string(),
    })
  ),
  implementationRate: z.number(),
});

// Schema for dashboard summary response
export const dashboardSummarySchema = z.object({
  totalContacts: z.number(),
  totalSessions: z.number(),
  totalAiActions: z.number(),
  totalNotes: z.number(),
  newContactsCount: z.number(),
  upcomingSessionsCount: z.number(),
  pendingActionsCount: z.number(),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
});

// Schema for time period filter
export const timePeriodSchema = z.enum([
  'today',
  'yesterday',
  'this_week',
  'last_week',
  'this_month',
  'last_month',
  'this_quarter',
  'last_quarter',
  'this_year',
  'last_year',
  'custom',
]);

// Schema for dashboard filter
export const dashboardFilterSchema = z.object({
  timePeriod: timePeriodSchema.optional(),
  dateRange: dateRangeSchema.optional(),
  includeContacts: z.boolean().optional(),
  includeSessions: z.boolean().optional(),
  includeAiActions: z.boolean().optional(),
  includeNotes: z.boolean().optional(),
});

// Export all schemas
export const DashboardSchemas = {
  dateRange: dateRangeSchema,
  contactMetrics: contactMetricsSchema,
  sessionMetrics: sessionMetricsSchema,
  aiActionMetrics: aiActionMetricsSchema,
  summary: dashboardSummarySchema,
  timePeriod: timePeriodSchema,
  filter: dashboardFilterSchema,
};