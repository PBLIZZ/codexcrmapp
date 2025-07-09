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

// src/routers/note.ts
var note_exports = {};
__export(note_exports, {
  noteRouter: () => noteRouter
});
module.exports = __toCommonJS(note_exports);
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

// src/routers/note.ts
var noteInputSchema = import_zod.z.object({
  id: import_zod.z.string().uuid().optional(),
  contact_id: import_zod.z.string().uuid(),
  session_id: import_zod.z.string().uuid().optional().nullable(),
  content: import_zod.z.string(),
  topic_tags: import_zod.z.array(import_zod.z.string()).optional().nullable(),
  key_insights: import_zod.z.array(import_zod.z.string()).optional().nullable(),
  ai_summary: import_zod.z.string().optional().nullable(),
  sentiment_analysis: import_zod.z.any().optional().nullable()
});
var noteUpdateSchema = noteInputSchema.partial().extend({
  id: import_zod.z.string().uuid()
});
var noteIdSchema = import_zod.z.object({
  noteId: import_zod.z.string().uuid()
});
var noteFilterSchema = import_zod.z.object({
  contactId: import_zod.z.string().uuid().optional(),
  sessionId: import_zod.z.string().uuid().optional(),
  topicTag: import_zod.z.string().optional()
});
var aiAnalysisSchema = import_zod.z.object({
  noteId: import_zod.z.string().uuid(),
  summary: import_zod.z.string().optional(),
  topicTags: import_zod.z.array(import_zod.z.string()).optional(),
  keyInsights: import_zod.z.array(import_zod.z.string()).optional(),
  sentimentAnalysis: import_zod.z.any().optional()
});
var noteRouter = router({
  // Get all notes
  list: protectedProcedure.input(noteFilterSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      let query = ctx.supabaseUser.from("notes").select("*");
      if (input?.contactId) {
        query = query.eq("contact_id", input.contactId);
      }
      if (input?.sessionId) {
        query = query.eq("session_id", input.sessionId);
      }
      if (input?.topicTag) {
        query = query.contains("topic_tags", [input.topicTag]);
      }
      query = query.order("created_at", { ascending: false });
      const { data, error } = await query;
      if (error) {
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch notes",
        cause: error
      });
    }
  }),
  // Get note by ID
  getById: protectedProcedure.input(noteIdSchema).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { data, error } = await ctx.supabaseUser.from("notes").select("*").eq("id", input.noteId).single();
      if (error) {
        if (error.code === "PGRST116") {
          throw new import_server2.TRPCError({
            code: "NOT_FOUND",
            message: "Note not found"
          });
        }
        throw error;
      }
      return data;
    } catch (error) {
      if (error instanceof import_server2.TRPCError) throw error;
      console.error("Error fetching note by ID:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch note",
        cause: error
      });
    }
  }),
  // Create a new note
  create: protectedProcedure.input(noteInputSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { data, error } = await ctx.supabaseUser.from("notes").insert({
        ...input,
        user_id: ctx.user.id
      }).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating note:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create note",
        cause: error
      });
    }
  }),
  // Update a note
  update: protectedProcedure.input(noteUpdateSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { id, ...updates } = input;
      const { data, error } = await ctx.supabaseUser.from("notes").update(updates).eq("id", id).eq("user_id", ctx.user.id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating note:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update note",
        cause: error
      });
    }
  }),
  // Delete a note
  delete: protectedProcedure.input(noteIdSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { error } = await ctx.supabaseUser.from("notes").delete().eq("id", input.noteId).eq("user_id", ctx.user.id);
      if (error) throw error;
      return { success: true, noteId: input.noteId };
    } catch (error) {
      console.error("Error deleting note:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete note",
        cause: error
      });
    }
  }),
  // Update AI analysis for a note
  updateAiAnalysis: protectedProcedure.input(aiAnalysisSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const updates = {};
      if (input.summary !== void 0) {
        updates.ai_summary = input.summary;
      }
      if (input.topicTags !== void 0) {
        updates.topic_tags = input.topicTags;
      }
      if (input.keyInsights !== void 0) {
        updates.key_insights = input.keyInsights;
      }
      if (input.sentimentAnalysis !== void 0) {
        updates.sentiment_analysis = input.sentimentAnalysis;
      }
      const { data, error } = await ctx.supabaseUser.from("notes").update(updates).eq("id", input.noteId).eq("user_id", ctx.user.id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating note AI analysis:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update note AI analysis",
        cause: error
      });
    }
  }),
  // Get notes by topic tag
  getByTopicTag: protectedProcedure.input(import_zod.z.object({ tag: import_zod.z.string() })).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { data, error } = await ctx.supabaseUser.from("notes").select("*").contains("topic_tags", [input.tag]).order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching notes by topic tag:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch notes by topic tag",
        cause: error
      });
    }
  })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  noteRouter
});
