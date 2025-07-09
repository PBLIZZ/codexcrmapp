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

// src/routers/group.ts
var group_exports = {};
__export(group_exports, {
  groupRouter: () => groupRouter
});
module.exports = __toCommonJS(group_exports);
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

// src/routers/group.ts
var groupInputSchema = import_zod.z.object({
  id: import_zod.z.string().uuid().optional(),
  // Optional for creation
  name: import_zod.z.string().min(1, "Group name is required").max(100, "Name too long"),
  description: import_zod.z.string().max(500, "Description too long").optional().nullable(),
  color: import_zod.z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color").optional().nullable(),
  emoji: import_zod.z.string().max(2, "Emoji should be 1-2 characters").or(import_zod.z.literal("")).nullable().optional().transform((val) => val === "" ? null : val)
});
var groupContactSchema = import_zod.z.object({
  groupId: import_zod.z.string().uuid(),
  contactId: import_zod.z.string().uuid()
});
var groupRouter = router({
  // Get all groups for a specific contact
  getGroupsForContact: protectedProcedure.input(import_zod.z.object({ contactId: import_zod.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { data: memberData, error: memberError } = await ctx.supabaseUser.from("group_members").select("group_id").eq("contact_id", input.contactId);
      if (memberError) {
        console.error("Error fetching group members:", memberError);
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch group memberships"
        });
      }
      if (!memberData || memberData.length === 0) {
        return [];
      }
      const groupIds = memberData.map(
        (item) => item.group_id
      );
      const { data: groupsData, error: groupsError } = await ctx.supabaseUser.from("groups").select("id, name, description, color, created_at, updated_at").eq("user_id", ctx.user.id).in("id", groupIds);
      if (groupsError) {
        console.error("Error fetching groups for contact:", groupsError);
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch groups for contact"
        });
      }
      return groupsData || [];
    } catch (err) {
      console.error("Unexpected error in getGroupsForContact:", err);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err instanceof Error ? err.message : "An unknown error occurred"
      });
    }
  }),
  // List all groups for the authenticated user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { data, error } = await ctx.supabaseUser.from("groups").select("*, group_members(*)").order("name");
    if (error) {
      console.error("Error fetching groups with contact counts:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch groups"
      });
    }
    return (data || []).map((group) => {
      const contactCount = Array.isArray(group.group_members) ? group.group_members.length : 0;
      const { group_members, ...groupFields } = group;
      return {
        ...groupFields,
        contactCount
      };
    });
  }),
  // Get a single group by ID
  getById: protectedProcedure.input(import_zod.z.object({ groupId: import_zod.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { data, error } = await ctx.supabaseUser.from("groups").select("*").eq("id", input.groupId).single();
    if (error) {
      console.error("Error fetching group by ID:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch group"
      });
    }
    return data;
  }),
  // Create or update a group
  save: protectedProcedure.input(groupInputSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const isUpdate = !!input.id;
    const groupData = {
      ...input,
      user_id: ctx.user.id,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!isUpdate) {
      delete groupData.id;
    }
    const { data, error } = await ctx.supabaseUser.from("groups").upsert(groupData).select().single();
    if (error) {
      console.error("Error saving group:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to ${isUpdate ? "update" : "create"} group`
      });
    }
    return data;
  }),
  // Delete a group
  delete: protectedProcedure.input(import_zod.z.object({ groupId: import_zod.z.string().uuid() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { error } = await ctx.supabaseUser.from("groups").delete().eq("id", input.groupId).eq("user_id", ctx.user.id);
    if (error) {
      console.error("Error deleting group:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete group"
      });
    }
    return { success: true, deletedGroupId: input.groupId };
  }),
  // Add a contact to a group
  addContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { data: existing, error: existingError } = await ctx.supabaseUser.from("group_members").select("id").eq("group_id", input.groupId).eq("contact_id", input.contactId).single();
    if (existingError && existingError.code !== "PGRST116") {
      console.error("Error checking for existing group member:", existingError);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not verify group membership."
      });
    }
    if (existing) {
      return { success: true, message: "Contact already in group." };
    }
    const { error } = await ctx.supabaseUser.from("group_members").insert([
      {
        group_id: input.groupId,
        contact_id: input.contactId
        // user_id field removed as it doesn't exist in the table schema
      }
    ]);
    if (error) {
      console.error("Detailed error adding contact to group:", JSON.stringify(error, null, 2));
      console.error("Original error object adding contact to group:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add contact to group"
      });
    }
    return { success: true };
  }),
  // Remove a contact from a group
  removeContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { error } = await ctx.supabaseUser.from("group_members").delete().eq("contact_id", input.contactId).eq("group_id", input.groupId);
    if (error) {
      console.error("Error removing contact from group:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove contact from group"
      });
    }
    return { success: true };
  }),
  // Get all contacts in a group
  getContacts: protectedProcedure.input(import_zod.z.object({ groupId: import_zod.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { data: group, error: groupError } = await ctx.supabaseUser.from("groups").select("id").eq("id", input.groupId).single();
    if (groupError || !group) {
      throw new import_server2.TRPCError({ code: "NOT_FOUND", message: "Group not found" });
    }
    const { data, error } = await ctx.supabaseUser.from("group_members").select("contacts:contact_id (*)").eq("group_id", input.groupId);
    if (error) {
      console.error("Error fetching contacts in group:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contacts in group"
      });
    }
    if (!data) {
      return [];
    }
    return data.map((item) => item.contacts).filter(Boolean);
  })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  groupRouter
});
