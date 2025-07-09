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

// src/routers/contact.ts
var contact_exports = {};
__export(contact_exports, {
  contactRouter: () => contactRouter
});
module.exports = __toCommonJS(contact_exports);
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

// src/routers/contact.ts
var contactInputSchema = import_zod.z.object({
  id: import_zod.z.string().uuid().optional(),
  full_name: import_zod.z.string().min(1, "Full name is required"),
  email: import_zod.z.string().email("Invalid email address").optional().nullable(),
  phone: import_zod.z.string().optional().nullable(),
  phone_country_code: import_zod.z.string().optional().nullable(),
  // New
  company_name: import_zod.z.string().optional().nullable(),
  job_title: import_zod.z.string().optional().nullable(),
  address_street: import_zod.z.string().optional().nullable(),
  // New
  address_city: import_zod.z.string().optional().nullable(),
  // New
  address_postal_code: import_zod.z.string().optional().nullable(),
  // New
  address_country: import_zod.z.string().optional().nullable(),
  // New
  website: import_zod.z.string().url({ message: "Invalid URL" }).optional().nullable(),
  // New
  profile_image_url: import_zod.z.string().optional().nullable(),
  // Reverted: No strict URL validation to support upload paths
  notes: import_zod.z.string().optional().nullable(),
  tags: import_zod.z.array(import_zod.z.string()).optional().nullable(),
  // New
  social_handles: import_zod.z.array(import_zod.z.string()).optional().nullable(),
  // New
  source: import_zod.z.string().optional().nullable(),
  last_contacted_at: import_zod.z.preprocess((arg) => {
    if (arg === "" || arg === null || arg === void 0) return null;
    if (typeof arg === "string" || arg instanceof Date) {
      const date = new Date(arg);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }, import_zod.z.date().optional().nullable()),
  enriched_data: import_zod.z.any().optional().nullable(),
  // New
  enrichment_status: import_zod.z.string().optional().nullable()
  // New
});
var contactRouter = router({
  // ===== Protected Procedures (require authentication) =====
  // Protected procedure for listing authenticated user's contacts
  list: protectedProcedure.input(
    import_zod.z.object({
      search: import_zod.z.string().optional(),
      groupId: import_zod.z.string().optional()
      // Remove UUID validation to handle all group ID formats
    })
  ).query(async ({ ctx, input }) => {
    const { search, groupId } = input;
    const userId = ctx.user?.id;
    if (!userId) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    if (groupId) {
      const { data: groupMembers, error: memberError } = await ctx.supabaseUser.from("group_members").select("contact_id").eq("group_id", groupId);
      if (memberError) {
        console.error("Error fetching group members:", memberError);
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to retrieve group members: ${memberError.message}`
        });
      }
      if (!groupMembers || groupMembers.length === 0) {
        return [];
      }
      const contactIds = groupMembers.map((member) => member.contact_id);
      let contactsQuery = ctx.supabaseUser.from("contacts").select("*").in("id", contactIds);
      if (search) {
        contactsQuery = contactsQuery.or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%`
        );
      }
      contactsQuery = contactsQuery.order("created_at", { ascending: false });
      const { data: contacts, error } = await contactsQuery;
      if (error) {
        console.error("Error fetching contacts for group:", error);
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to retrieve contacts for group: ${error.message}`
        });
      }
      return contacts || [];
    } else {
      let query = ctx.supabaseUser.from("contacts").select("*");
      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%`
        );
      }
      query = query.order("created_at", { ascending: false });
      const { data: contacts, error } = await query;
      if (error) {
        console.error("Error fetching all contacts:", error);
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to retrieve contacts: ${error.message}`
        });
      }
      return contacts || [];
    }
  }),
  // Fetch a single contact by ID
  getById: protectedProcedure.input(import_zod.z.object({ contactId: import_zod.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { data, error } = await ctx.supabaseUser.from("contacts").select("*").eq("id", input.contactId).single();
    if (error) {
      console.error("Error fetching contact by id:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contact",
        cause: error
      });
    }
    return data;
  }),
  save: protectedProcedure.input(contactInputSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const contactId = input.id;
    const fieldsToSave = {
      full_name: input.full_name,
      email: input.email || null,
      phone: input.phone || null,
      phone_country_code: input.phone_country_code || null,
      company_name: input.company_name || null,
      job_title: input.job_title || null,
      address_street: input.address_street || null,
      address_city: input.address_city || null,
      address_postal_code: input.address_postal_code || null,
      address_country: input.address_country || null,
      website: input.website || null,
      profile_image_url: input.profile_image_url || null,
      notes: input.notes || null,
      tags: input.tags || null,
      social_handles: input.social_handles || null,
      source: input.source || null,
      last_contacted_at: input.last_contacted_at || null,
      enriched_data: input.enriched_data || null,
      enrichment_status: input.enrichment_status || null
    };
    let dataObject = null;
    let dbError = null;
    try {
      if (contactId) {
        console.warn(`Attempting contact update for id: ${contactId}`, fieldsToSave);
        let attemptFields = { ...fieldsToSave };
        do {
          const updateOp = await ctx.supabaseUser.from("contacts").update(attemptFields).match({ id: contactId, user_id: ctx.user.id }).select().single();
          dataObject = updateOp.data;
          dbError = updateOp.error;
          if (dbError) {
            const columnMatch = dbError.message.match(/Could not find the '(.+)' column/);
            if (columnMatch && Object.hasOwn(attemptFields, columnMatch[1])) {
              console.warn(`${columnMatch[1]} column missing, retrying update without it`);
              delete attemptFields[columnMatch[1]];
              continue;
            }
          }
          break;
        } while (dbError !== null);
      } else {
        const insertPayload = { ...fieldsToSave, user_id: ctx.user.id };
        console.warn("[DEBUG] Attempting contact insert:", insertPayload);
        const insertOp = await ctx.supabaseUser.from("contacts").insert(insertPayload).select("id, created_at, updated_at, user_id, email, full_name, profile_image_url").single();
        dataObject = insertOp.data;
        dbError = insertOp.error;
        if (!dbError && !dataObject) {
          console.warn("Contact insert: Supabase insert succeeded but .select() returned no data (RLS visibility issue?). Constructing response from input.");
          dataObject = { ...insertPayload, id: void 0, created_at: void 0, updated_at: void 0 };
        }
      }
      if (dbError) {
        console.error("Supabase save error:", JSON.stringify(dbError, null, 2), { input, contactId });
        if (dbError.code === "23505") {
          throw new import_server2.TRPCError({
            code: "CONFLICT",
            message: `A contact with this email (${input.email}) already exists.`,
            cause: dbError
          });
        }
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Database error: ${dbError.message}`,
          cause: dbError
        });
      }
      if (!dataObject) {
        console.error("Supabase save returned no data and no explicit error after processing.", { input, contactId });
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save contact: No data returned from database operation."
        });
      }
      console.warn("Contact save successful:", dataObject);
      return dataObject;
    } catch (error) {
      if (error instanceof import_server2.TRPCError) {
        throw error;
      }
      console.error("Unhandled error in contact save procedure:", error, { input, contactId });
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while saving the contact.",
        cause: error instanceof Error ? error : void 0
      });
    }
  }),
  delete: protectedProcedure.input(import_zod.z.object({ contactId: import_zod.z.string().uuid() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { error } = await ctx.supabaseUser.from("contacts").delete().match({ id: input.contactId, user_id: ctx.user.id });
    if (error) {
      console.error("Error deleting contact:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete contact",
        cause: error
      });
    }
    return { success: true, contactId: input.contactId };
  }),
  // Update just the notes field of a contact
  updateNotes: protectedProcedure.input(import_zod.z.object({
    contactId: import_zod.z.string().uuid(),
    notes: import_zod.z.string()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { contactId, notes } = input;
    try {
      const { data: existingContact, error: fetchError } = await ctx.supabaseAdmin.from("contacts").select("id").eq("id", contactId).eq("user_id", ctx.user.id).single();
      if (fetchError || !existingContact) {
        throw new import_server2.TRPCError({
          code: "NOT_FOUND",
          message: "Contact not found or you do not have permission to update it"
        });
      }
      const { error: updateError } = await ctx.supabaseAdmin.from("contacts").update({ notes, updated_at: /* @__PURE__ */ new Date() }).eq("id", contactId).eq("user_id", ctx.user.id);
      if (updateError) {
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update contact notes: ${updateError.message}`
        });
      }
      return { success: true };
    } catch (error) {
      if (error instanceof import_server2.TRPCError) {
        throw error;
      }
      console.error("Unhandled error in updateNotes procedure:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update contact notes due to an unexpected error"
      });
    }
  }),
  // Get total count of contacts for the authenticated user
  getTotalContactsCount: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { count, error } = await ctx.supabaseUser.from("contacts").select("*", { count: "exact", head: true });
    if (error) {
      console.error("Failed to get total contact count:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not retrieve contact count."
      });
    }
    return { count: count ?? 0 };
  })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  contactRouter
});
