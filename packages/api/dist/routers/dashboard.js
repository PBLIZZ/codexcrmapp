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
      const { count: totalContacts, error: countError } = await ctx.supabaseUser.from("contacts").select("*", { count: "exact", head: true });
      if (countError) throw countError;
      const { data: newContacts, error: newContactsError } = await ctx.supabaseUser.from("contacts").select("id").gte("created_at", startDateStr).lte("created_at", endDateStr);
      if (newContactsError) throw newContactsError;
      const { data: journeyStages, error: journeyError } = await ctx.supabaseUser.rpc("get_contacts_by_journey_stage");
      if (journeyError) throw journeyError;
      const { data: recentActivity, error: activityError } = await ctx.supabaseUser.from("contacts").select("id, full_name, last_contacted_at").order("last_contacted_at", { ascending: false }).limit(5);
      if (activityError) throw activityError;
      return {
        totalContacts: totalContacts || 0,
        newContacts: newContacts?.length || 0,
        journeyStageDistribution: journeyStages || [],
        recentActivity: recentActivity || []
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
  // Get session metrics
  sessionMetrics: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const endDate = input?.endDate ? new Date(input.endDate) : /* @__PURE__ */ new Date();
      const startDate = input?.startDate ? new Date(input.startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1e3);
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      const { count: totalSessions, error: countError } = await ctx.supabaseUser.from("sessions").select("*", { count: "exact", head: true });
      if (countError) throw countError;
      const { data: sessionsInRange, error: rangeError } = await ctx.supabaseUser.from("sessions").select("id, session_time, session_type").gte("session_time", startDateStr).lte("session_time", endDateStr).order("session_time", { ascending: true });
      if (rangeError) throw rangeError;
      const { data: sessionTypes, error: typesError } = await ctx.supabaseUser.rpc("get_sessions_by_type");
      if (typesError) throw typesError;
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const { data: upcomingSessions, error: upcomingError } = await ctx.supabaseUser.from("sessions").select("id, session_time, contact_id, contacts(full_name)").gt("session_time", now).order("session_time", { ascending: true }).limit(5);
      if (upcomingError) throw upcomingError;
      const sessionsByDay = /* @__PURE__ */ new Map();
      const dayMs = 24 * 60 * 60 * 1e3;
      for (let d = new Date(startDate); d <= endDate; d = new Date(d.getTime() + dayMs)) {
        const dateStr = d.toISOString().split("T")[0];
        sessionsByDay.set(dateStr, 0);
      }
      sessionsInRange?.forEach((session) => {
        const dateStr = new Date(session.session_time).toISOString().split("T")[0];
        sessionsByDay.set(dateStr, (sessionsByDay.get(dateStr) || 0) + 1);
      });
      const sessionTrend = Array.from(sessionsByDay.entries()).map(([date, count]) => ({
        date,
        count
      }));
      return {
        totalSessions: totalSessions || 0,
        sessionsInRange: sessionsInRange?.length || 0,
        sessionTypeDistribution: sessionTypes || [],
        upcomingSessions: upcomingSessions || [],
        sessionTrend
      };
    } catch (error) {
      console.error("Error fetching session metrics:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch session metrics",
        cause: error
      });
    }
  }),
  // Get AI action metrics
  aiActionMetrics: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const endDate = input?.endDate ? new Date(input.endDate) : /* @__PURE__ */ new Date();
      const startDate = input?.startDate ? new Date(input.startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1e3);
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      const { count: totalActions, error: countError } = await ctx.supabaseUser.from("ai_actions").select("*", { count: "exact", head: true });
      if (countError) throw countError;
      const { data: actionsByStatus, error: statusError } = await ctx.supabaseUser.rpc("get_ai_actions_by_status");
      if (statusError) throw statusError;
      const { data: actionsByType, error: typeError } = await ctx.supabaseUser.rpc("get_ai_actions_by_type");
      if (typeError) throw typeError;
      const { data: recentActions, error: recentError } = await ctx.supabaseUser.from("ai_actions").select("id, action_type, suggestion, status, created_at").order("created_at", { ascending: false }).limit(5);
      if (recentError) throw recentError;
      const { data: implementedActions, error: implementedError } = await ctx.supabaseUser.from("ai_actions").select("id").eq("implemented", true);
      if (implementedError) throw implementedError;
      const implementationRate = totalActions ? (implementedActions?.length || 0) / totalActions : 0;
      return {
        totalActions: totalActions || 0,
        actionsByStatus: actionsByStatus || [],
        actionsByType: actionsByType || [],
        recentActions: recentActions || [],
        implementationRate
      };
    } catch (error) {
      console.error("Error fetching AI action metrics:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch AI action metrics",
        cause: error
      });
    }
  }),
  // Get overall dashboard summary
  summary: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const endDate = input?.endDate ? new Date(input.endDate) : /* @__PURE__ */ new Date();
      const startDate = input?.startDate ? new Date(input.startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1e3);
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      const [
        { count: totalContacts },
        { count: totalSessions },
        { count: totalActions },
        { count: totalNotes },
        { data: newContacts },
        { data: upcomingSessions },
        { data: pendingActions }
      ] = await Promise.all([
        ctx.supabaseUser.from("contacts").select("*", { count: "exact", head: true }),
        ctx.supabaseUser.from("sessions").select("*", { count: "exact", head: true }),
        ctx.supabaseUser.from("ai_actions").select("*", { count: "exact", head: true }),
        ctx.supabaseUser.from("notes").select("*", { count: "exact", head: true }),
        ctx.supabaseUser.from("contacts").select("id").gte("created_at", startDateStr).lte("created_at", endDateStr),
        ctx.supabaseUser.from("sessions").select("id").gt("session_time", (/* @__PURE__ */ new Date()).toISOString()),
        ctx.supabaseUser.from("ai_actions").select("id").eq("status", "pending")
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
