import {
  protectedProcedure,
  router
} from "./chunk-JTHPFO2B.mjs";

// src/routers/dashboard.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
var dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});
var dashboardRouter = router({
  // Get contact metrics
  contactMetrics: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const endDate = input?.endDate ? new Date(input.endDate) : /* @__PURE__ */ new Date();
      const startDate = input?.startDate ? new Date(input.startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1e3);
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      const totalContacts = await ctx.prisma.contact.count({
        where: {
          userId: ctx.user.id
        }
      });
      const newContacts = await ctx.prisma.contact.count({
        where: {
          userId: ctx.user.id,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      const contactsByStage = await ctx.prisma.contact.groupBy({
        by: ["wellnessJourneyStage"],
        where: {
          userId: ctx.user.id,
          wellnessJourneyStage: {
            not: null
          }
        },
        _count: true
      });
      const stageDistribution = contactsByStage.map((group) => ({
        stage: group.wellnessJourneyStage || "Unknown",
        count: group._count
      }));
      const recentActivity = await ctx.prisma.contact.findMany({
        where: {
          userId: ctx.user.id
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: 5,
        select: {
          id: true,
          fullName: true,
          email: true,
          profileImageUrl: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return {
        totalContacts: totalContacts || 0,
        newContacts: newContacts || 0,
        stageDistribution: stageDistribution || [],
        recentActivity: recentActivity || [],
        dateRange: {
          startDate: startDateStr,
          endDate: endDateStr
        }
      };
    } catch (error) {
      console.error("Error fetching contact metrics:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contact metrics",
        cause: error
      });
    }
  }),
  // Get overall dashboard summary with only available metrics
  summary: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const endDate = input && input.endDate ? new Date(input.endDate) : /* @__PURE__ */ new Date();
      const startDate = input && input.startDate ? new Date(input.startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1e3);
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      const [totalContacts, newContacts] = await Promise.all([
        // Total contacts
        ctx.prisma.contact.count({
          where: {
            userId: ctx.user.id
          }
        }),
        // New contacts in date range
        ctx.prisma.contact.findMany({
          where: {
            userId: ctx.user.id,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          select: {
            id: true
          }
        })
      ]);
      return {
        totalContacts: totalContacts || 0,
        newContactsCount: newContacts.length || 0,
        dateRange: {
          startDate: startDateStr,
          endDate: endDateStr
        }
      };
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch dashboard summary",
        cause: error
      });
    }
  })
});

export {
  dashboardRouter
};
