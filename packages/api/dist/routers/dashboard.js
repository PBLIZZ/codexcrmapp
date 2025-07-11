"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routers/dashboard.ts
var dashboard_exports = {};
__export(dashboard_exports, {
  dashboardRouter: () => dashboardRouter
});
module.exports = __toCommonJS(dashboard_exports);
var import_server2 = require("@trpc/server");
var import_zod = require("zod");

// src/trpc.ts
var import_server = require("@trpc/server");
var import_superjson = __toESM(require("superjson"));
var t = import_server.initTRPC.context().create({
  transformer: import_superjson.default
});
var router = t.router;
var publicProcedure = t.procedure;
var middleware = t.middleware;
var isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) throw new import_server.TRPCError({
    code: "UNAUTHORIZED",
    message: "You must be logged in to access this resource"
  });
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});
var protectedProcedure = t.procedure.use(isAuthed);

// src/routers/dashboard.ts
var dateRangeSchema = import_zod.z.object({
  startDate: import_zod.z.string().datetime().optional(),
  endDate: import_zod.z.string().datetime().optional()
});
var dashboardRouter = router({
  // Get contact metrics
  contactMetrics: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
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
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contact metrics",
        cause: error
      });
    }
  }),
  // Get overall dashboard summary with only available metrics
  summary: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
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
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch dashboard summary",
        cause: error
      });
    }
  })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dashboardRouter
});
