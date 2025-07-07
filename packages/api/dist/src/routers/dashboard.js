import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '@codexcrm/api/src/trpc';
// Define Zod schemas for validation
const dateRangeSchema = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});
// Define the dashboard router
export const dashboardRouter = router({
    // Get contact metrics
    contactMetrics: protectedProcedure
        .input(dateRangeSchema.optional())
        .query(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        try {
            // Default to last 30 days if no date range provided
            const endDate = input?.endDate ? new Date(input.endDate) : new Date();
            const startDate = input?.startDate
                ? new Date(input.startDate)
                : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();
            // Get total contacts count
            const { count: totalContacts, error: countError } = await ctx.supabaseUser
                .from('contacts')
                .select('*', { count: 'exact', head: true });
            if (countError)
                throw countError;
            // Get new contacts in date range
            const { data: newContacts, error: newContactsError } = await ctx.supabaseUser
                .from('contacts')
                .select('id')
                .gte('created_at', startDateStr)
                .lte('created_at', endDateStr);
            if (newContactsError)
                throw newContactsError;
            // Get contacts by wellness journey stage
            const { data: journeyStages, error: journeyError } = await ctx.supabaseUser
                .rpc('get_contacts_by_journey_stage');
            if (journeyError)
                throw journeyError;
            // Get contacts with recent activity
            const { data: recentActivity, error: activityError } = await ctx.supabaseUser
                .from('contacts')
                .select('id, full_name, last_contacted_at')
                .order('last_contacted_at', { ascending: false })
                .limit(5);
            if (activityError)
                throw activityError;
            return {
                totalContacts: totalContacts || 0,
                newContacts: newContacts?.length || 0,
                journeyStageDistribution: journeyStages || [],
                recentActivity: recentActivity || [],
            };
        }
        catch (error) {
            console.error('Error fetching contact metrics:', error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch contact metrics',
                cause: error,
            });
        }
    }),
    // Get session metrics
    sessionMetrics: protectedProcedure
        .input(dateRangeSchema.optional())
        .query(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        try {
            // Default to last 30 days if no date range provided
            const endDate = input?.endDate ? new Date(input.endDate) : new Date();
            const startDate = input?.startDate
                ? new Date(input.startDate)
                : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();
            // Get total sessions count
            const { count: totalSessions, error: countError } = await ctx.supabaseUser
                .from('sessions')
                .select('*', { count: 'exact', head: true });
            if (countError)
                throw countError;
            // Get sessions in date range
            const { data: sessionsInRange, error: rangeError } = await ctx.supabaseUser
                .from('sessions')
                .select('id, session_time, session_type')
                .gte('session_time', startDateStr)
                .lte('session_time', endDateStr)
                .order('session_time', { ascending: true });
            if (rangeError)
                throw rangeError;
            // Get sessions by type
            const { data: sessionTypes, error: typesError } = await ctx.supabaseUser
                .rpc('get_sessions_by_type');
            if (typesError)
                throw typesError;
            // Get upcoming sessions
            const now = new Date().toISOString();
            const { data: upcomingSessions, error: upcomingError } = await ctx.supabaseUser
                .from('sessions')
                .select('id, session_time, contact_id, contacts(full_name)')
                .gt('session_time', now)
                .order('session_time', { ascending: true })
                .limit(5);
            if (upcomingError)
                throw upcomingError;
            // Calculate sessions per day for chart
            const sessionsByDay = new Map();
            const dayMs = 24 * 60 * 60 * 1000;
            // Initialize all days in range with 0 sessions
            for (let d = new Date(startDate); d <= endDate; d = new Date(d.getTime() + dayMs)) {
                const dateStr = d.toISOString().split('T')[0];
                sessionsByDay.set(dateStr, 0);
            }
            // Count sessions per day
            sessionsInRange?.forEach((session) => {
                const dateStr = new Date(session.session_time).toISOString().split('T')[0];
                sessionsByDay.set(dateStr, (sessionsByDay.get(dateStr) || 0) + 1);
            });
            // Convert to array for chart data
            const sessionTrend = Array.from(sessionsByDay.entries()).map(([date, count]) => ({
                date,
                count,
            }));
            return {
                totalSessions: totalSessions || 0,
                sessionsInRange: sessionsInRange?.length || 0,
                sessionTypeDistribution: sessionTypes || [],
                upcomingSessions: upcomingSessions || [],
                sessionTrend,
            };
        }
        catch (error) {
            console.error('Error fetching session metrics:', error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch session metrics',
                cause: error,
            });
        }
    }),
    // Get AI action metrics
    aiActionMetrics: protectedProcedure
        .input(dateRangeSchema.optional())
        .query(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        try {
            // Default to last 30 days if no date range provided
            const endDate = input?.endDate ? new Date(input.endDate) : new Date();
            const startDate = input?.startDate
                ? new Date(input.startDate)
                : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();
            // Get total AI actions count
            const { count: totalActions, error: countError } = await ctx.supabaseUser
                .from('ai_actions')
                .select('*', { count: 'exact', head: true });
            if (countError)
                throw countError;
            // Get AI actions by status
            const { data: actionsByStatus, error: statusError } = await ctx.supabaseUser
                .rpc('get_ai_actions_by_status');
            if (statusError)
                throw statusError;
            // Get AI actions by type
            const { data: actionsByType, error: typeError } = await ctx.supabaseUser
                .rpc('get_ai_actions_by_type');
            if (typeError)
                throw typeError;
            // Get recent AI actions
            const { data: recentActions, error: recentError } = await ctx.supabaseUser
                .from('ai_actions')
                .select('id, action_type, suggestion, status, created_at')
                .order('created_at', { ascending: false })
                .limit(5);
            if (recentError)
                throw recentError;
            // Get implementation rate
            const { data: implementedActions, error: implementedError } = await ctx.supabaseUser
                .from('ai_actions')
                .select('id')
                .eq('implemented', true);
            if (implementedError)
                throw implementedError;
            const implementationRate = totalActions ? (implementedActions?.length || 0) / totalActions : 0;
            return {
                totalActions: totalActions || 0,
                actionsByStatus: actionsByStatus || [],
                actionsByType: actionsByType || [],
                recentActions: recentActions || [],
                implementationRate,
            };
        }
        catch (error) {
            console.error('Error fetching AI action metrics:', error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch AI action metrics',
                cause: error,
            });
        }
    }),
    // Get overall dashboard summary
    summary: protectedProcedure
        .input(dateRangeSchema.optional())
        .query(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        try {
            // Default to last 30 days if no date range provided
            const endDate = input?.endDate ? new Date(input.endDate) : new Date();
            const startDate = input?.startDate
                ? new Date(input.startDate)
                : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();
            // Get counts for key metrics
            const [{ count: totalContacts }, { count: totalSessions }, { count: totalActions }, { count: totalNotes }, { data: newContacts }, { data: upcomingSessions }, { data: pendingActions },] = await Promise.all([
                ctx.supabaseUser.from('contacts').select('*', { count: 'exact', head: true }),
                ctx.supabaseUser.from('sessions').select('*', { count: 'exact', head: true }),
                ctx.supabaseUser.from('ai_actions').select('*', { count: 'exact', head: true }),
                ctx.supabaseUser.from('notes').select('*', { count: 'exact', head: true }),
                ctx.supabaseUser.from('contacts').select('id').gte('created_at', startDateStr).lte('created_at', endDateStr),
                ctx.supabaseUser.from('sessions').select('id').gt('session_time', new Date().toISOString()),
                ctx.supabaseUser.from('ai_actions').select('id').eq('status', 'pending'),
            ]);
            return {
                totalContacts: totalContacts || 0,
                totalSessions: totalSessions || 0,
                totalAiActions: totalActions || 0,
                totalNotes: totalNotes || 0,
                newContactsCount: newContacts?.length || 0,
                upcomingSessionsCount: upcomingSessions?.length || 0,
                pendingActionsCount: pendingActions?.length || 0,
                dateRange: {
                    startDate: startDateStr,
                    endDate: endDateStr,
                },
            };
        }
        catch (error) {
            console.error('Error fetching dashboard summary:', error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch dashboard summary',
                cause: error,
            });
        }
    }),
});
