import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

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
        const totalContacts = await ctx.prisma.contact.count({
          where: {
            userId: ctx.user.id,
          },
        });

        // Get new contacts in date range
        const newContacts = await ctx.prisma.contact.count({
          where: {
            userId: ctx.user.id,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        // Get contacts by wellness journey stage
        const contactsByStage = await ctx.prisma.contact.groupBy({
          by: ['wellnessJourneyStage'],
          where: {
            userId: ctx.user.id,
            wellnessJourneyStage: {
              not: null,
            },
          },
          _count: true,
        });

        // Transform to expected format
        const stageDistribution = contactsByStage.map((group) => ({
          stage: group.wellnessJourneyStage || 'Unknown',
          count: group._count,
        }));

        // Get recent activity (last 5 contacts added or updated)
        const recentActivity = await ctx.prisma.contact.findMany({
          where: {
            userId: ctx.user.id,
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 5,
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImageUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return {
          totalContacts: totalContacts || 0,
          newContacts: newContacts || 0,
          stageDistribution: stageDistribution || [],
          recentActivity: recentActivity || [],
          dateRange: {
            startDate: startDateStr,
            endDate: endDateStr,
          },
        };
      } catch (error) {
        console.error('Error fetching contact metrics:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contact metrics',
          cause: error,
        });
      }
    }),

  // Get overall dashboard summary with only available metrics
  summary: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      // Default to last 30 days if no date range provided
      const endDate = input && input.endDate ? new Date(input.endDate) : new Date();
      const startDate =
        input && input.startDate
          ? new Date(input.startDate)
          : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();

      // Get contacts metrics using Prisma model
      const [totalContacts, newContacts] = await Promise.all([
        // Total contacts
        ctx.prisma.contact.count({
          where: {
            userId: ctx.user.id,
          },
        }),

        // New contacts in date range
        ctx.prisma.contact.findMany({
          where: {
            userId: ctx.user.id,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            id: true,
          },
        }),
      ]);

      // Return only what we can provide from existing tables
      return {
        totalContacts: totalContacts || 0,
        newContactsCount: newContacts.length || 0,
        dateRange: {
          startDate: startDateStr,
          endDate: endDateStr,
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch dashboard summary',
        cause: error,
      });
    }
  }),
});
