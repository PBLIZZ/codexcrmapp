import {
  protectedProcedure,
  router
} from "../chunk-JTHPFO2B.mjs";

// src/routers/note.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
var noteInputSchema = z.object({
  id: z.string().uuid().optional(),
  contact_id: z.string().uuid(),
  session_id: z.string().uuid().optional().nullable(),
  content: z.string(),
  topic_tags: z.array(z.string()).optional().nullable(),
  key_insights: z.array(z.string()).optional().nullable(),
  ai_summary: z.string().optional().nullable(),
  sentiment_analysis: z.any().optional().nullable()
});
var noteUpdateSchema = noteInputSchema.partial().extend({
  id: z.string().uuid()
});
var noteIdSchema = z.object({
  noteId: z.string().uuid()
});
var noteFilterSchema = z.object({
  contactId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  topicTag: z.string().optional()
});
var aiAnalysisSchema = z.object({
  noteId: z.string().uuid(),
  summary: z.string().optional(),
  topicTags: z.array(z.string()).optional(),
  keyInsights: z.array(z.string()).optional(),
  sentimentAnalysis: z.any().optional()
});
var noteRouter = router({
  // Get all notes
  list: protectedProcedure.input(noteFilterSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
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
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch notes",
        cause: error
      });
    }
  }),
  // Get note by ID
  getById: protectedProcedure.input(noteIdSchema).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { data, error } = await ctx.supabaseUser.from("notes").select("*").eq("id", input.noteId).single();
      if (error) {
        if (error.code === "PGRST116") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Note not found"
          });
        }
        throw error;
      }
      return data;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error("Error fetching note by ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch note",
        cause: error
      });
    }
  }),
  // Create a new note
  create: protectedProcedure.input(noteInputSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
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
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create note",
        cause: error
      });
    }
  }),
  // Update a note
  update: protectedProcedure.input(noteUpdateSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { id, ...updates } = input;
      const { data, error } = await ctx.supabaseUser.from("notes").update(updates).eq("id", id).eq("user_id", ctx.user.id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating note:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update note",
        cause: error
      });
    }
  }),
  // Delete a note
  delete: protectedProcedure.input(noteIdSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { error } = await ctx.supabaseUser.from("notes").delete().eq("id", input.noteId).eq("user_id", ctx.user.id);
      if (error) throw error;
      return { success: true, noteId: input.noteId };
    } catch (error) {
      console.error("Error deleting note:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete note",
        cause: error
      });
    }
  }),
  // Update AI analysis for a note
  updateAiAnalysis: protectedProcedure.input(aiAnalysisSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
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
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update note AI analysis",
        cause: error
      });
    }
  }),
  // Get notes by topic tag
  getByTopicTag: protectedProcedure.input(z.object({ tag: z.string() })).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { data, error } = await ctx.supabaseUser.from("notes").select("*").contains("topic_tags", [input.tag]).order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching notes by topic tag:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch notes by topic tag",
        cause: error
      });
    }
  })
});
export {
  noteRouter
};
