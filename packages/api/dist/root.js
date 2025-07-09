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

// src/root.ts
var root_exports = {};
__export(root_exports, {
  appRouter: () => appRouter
});
module.exports = __toCommonJS(root_exports);

// src/routers/contact.ts
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

// src/routers/group.ts
var import_server3 = require("@trpc/server");
var import_zod2 = require("zod");
var groupInputSchema = import_zod2.z.object({
  id: import_zod2.z.string().uuid().optional(),
  // Optional for creation
  name: import_zod2.z.string().min(1, "Group name is required").max(100, "Name too long"),
  description: import_zod2.z.string().max(500, "Description too long").optional().nullable(),
  color: import_zod2.z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color").optional().nullable(),
  emoji: import_zod2.z.string().max(2, "Emoji should be 1-2 characters").or(import_zod2.z.literal("")).nullable().optional().transform((val) => val === "" ? null : val)
});
var groupContactSchema = import_zod2.z.object({
  groupId: import_zod2.z.string().uuid(),
  contactId: import_zod2.z.string().uuid()
});
var groupRouter = router({
  // Get all groups for a specific contact
  getGroupsForContact: protectedProcedure.input(import_zod2.z.object({ contactId: import_zod2.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { data: memberData, error: memberError } = await ctx.supabaseUser.from("group_members").select("group_id").eq("contact_id", input.contactId);
      if (memberError) {
        console.error("Error fetching group members:", memberError);
        throw new import_server3.TRPCError({
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
        throw new import_server3.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch groups for contact"
        });
      }
      return groupsData || [];
    } catch (err) {
      console.error("Unexpected error in getGroupsForContact:", err);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err instanceof Error ? err.message : "An unknown error occurred"
      });
    }
  }),
  // List all groups for the authenticated user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { data, error } = await ctx.supabaseUser.from("groups").select("*, group_members(*)").order("name");
    if (error) {
      console.error("Error fetching groups with contact counts:", error);
      throw new import_server3.TRPCError({
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
  getById: protectedProcedure.input(import_zod2.z.object({ groupId: import_zod2.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { data, error } = await ctx.supabaseUser.from("groups").select("*").eq("id", input.groupId).single();
    if (error) {
      console.error("Error fetching group by ID:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch group"
      });
    }
    return data;
  }),
  // Create or update a group
  save: protectedProcedure.input(groupInputSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
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
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to ${isUpdate ? "update" : "create"} group`
      });
    }
    return data;
  }),
  // Delete a group
  delete: protectedProcedure.input(import_zod2.z.object({ groupId: import_zod2.z.string().uuid() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { error } = await ctx.supabaseUser.from("groups").delete().eq("id", input.groupId).eq("user_id", ctx.user.id);
    if (error) {
      console.error("Error deleting group:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete group"
      });
    }
    return { success: true, deletedGroupId: input.groupId };
  }),
  // Add a contact to a group
  addContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { data: existing, error: existingError } = await ctx.supabaseUser.from("group_members").select("id").eq("group_id", input.groupId).eq("contact_id", input.contactId).single();
    if (existingError && existingError.code !== "PGRST116") {
      console.error("Error checking for existing group member:", existingError);
      throw new import_server3.TRPCError({
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
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add contact to group"
      });
    }
    return { success: true };
  }),
  // Remove a contact from a group
  removeContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { error } = await ctx.supabaseUser.from("group_members").delete().eq("contact_id", input.contactId).eq("group_id", input.groupId);
    if (error) {
      console.error("Error removing contact from group:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove contact from group"
      });
    }
    return { success: true };
  }),
  // Get all contacts in a group
  getContacts: protectedProcedure.input(import_zod2.z.object({ groupId: import_zod2.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { data: group, error: groupError } = await ctx.supabaseUser.from("groups").select("id").eq("id", input.groupId).single();
    if (groupError || !group) {
      throw new import_server3.TRPCError({ code: "NOT_FOUND", message: "Group not found" });
    }
    const { data, error } = await ctx.supabaseUser.from("group_members").select("contacts:contact_id (*)").eq("group_id", input.groupId);
    if (error) {
      console.error("Error fetching contacts in group:", error);
      throw new import_server3.TRPCError({
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

// src/routers/storage.ts
var import_server4 = require("@trpc/server");
var import_zod3 = require("zod");
var storageRouter = router({
  // Generate a presigned upload URL for direct browser-to-storage uploads
  getUploadUrl: protectedProcedure.input(
    import_zod3.z.object({
      fileName: import_zod3.z.string(),
      contentType: import_zod3.z.string(),
      folderPath: import_zod3.z.string().default("contacts")
    })
  ).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server4.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const filePath = `${input.folderPath}/${ctx.user.id}/${input.fileName}`;
      const { data, error } = await ctx.supabaseAdmin.storage.from("contact-profile-photo").createSignedUploadUrl(filePath);
      if (error) {
        console.error("Supabase createSignedUploadUrl error:", error);
        throw new import_server4.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate upload URL: ${error.message}`
        });
      }
      return {
        signedUrl: data.signedUrl,
        path: data.path,
        token: data.token
      };
    } catch (error) {
      console.error("Error generating upload URL:", error);
      throw new import_server4.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to generate upload URL"
      });
    }
  }),
  // Get a private URL for a specific file
  getFileUrl: protectedProcedure.input(
    import_zod3.z.object({
      filePath: import_zod3.z.string()
    })
  ).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server4.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { data, error } = await ctx.supabaseAdmin.storage.from("contact-profile-photo").createSignedUrl(input.filePath, 3600);
      if (error) {
        console.error("Supabase createSignedUrl error:", error);
        throw new import_server4.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate signed URL: ${error.message}`
        });
      }
      return {
        signedUrl: data.signedUrl
      };
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new import_server4.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to generate signed URL"
      });
    }
  }),
  // Delete a file from storage
  deleteFile: protectedProcedure.input(
    import_zod3.z.object({
      filePath: import_zod3.z.string()
    })
  ).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server4.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      if (!input.filePath.includes(`/${ctx.user.id}/`)) {
        throw new import_server4.TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own files"
        });
      }
      const { error } = await ctx.supabaseAdmin.storage.from("contact-profile-photo").remove([input.filePath]);
      if (error) {
        throw new import_server4.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete file: ${error.message}`
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new import_server4.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to delete file"
      });
    }
  })
});

// src/routers/dashboard.ts
var import_server5 = require("@trpc/server");
var import_zod4 = require("zod");
var dateRangeSchema = import_zod4.z.object({
  startDate: import_zod4.z.string().datetime().optional(),
  endDate: import_zod4.z.string().datetime().optional()
});
var dashboardRouter = router({
  // Get contact metrics
  contactMetrics: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server5.TRPCError({ code: "UNAUTHORIZED" });
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
      throw new import_server5.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contact metrics",
        cause: error
      });
    }
  }),
  // Get session metrics
  sessionMetrics: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server5.TRPCError({ code: "UNAUTHORIZED" });
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
      throw new import_server5.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch session metrics",
        cause: error
      });
    }
  }),
  // Get AI action metrics
  aiActionMetrics: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server5.TRPCError({ code: "UNAUTHORIZED" });
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
      throw new import_server5.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch AI action metrics",
        cause: error
      });
    }
  }),
  // Get overall dashboard summary
  summary: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server5.TRPCError({ code: "UNAUTHORIZED" });
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
      throw new import_server5.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch dashboard summary",
        cause: error
      });
    }
  })
});

// src/routers/import.ts
var import_server6 = require("@trpc/server");
var import_zod5 = require("zod");
var csvContactInputSchema = import_zod5.z.object({
  full_name: import_zod5.z.string().min(1, "Full name is required"),
  email: import_zod5.z.string().email("Invalid email address").optional().nullable(),
  phone: import_zod5.z.string().optional().nullable(),
  phone_country_code: import_zod5.z.string().optional().nullable(),
  company: import_zod5.z.string().optional().nullable(),
  // Note: maps to company_name in DB
  job_title: import_zod5.z.string().optional().nullable(),
  website: import_zod5.z.string().optional().nullable(),
  notes: import_zod5.z.string().optional().nullable(),
  tags: import_zod5.z.array(import_zod5.z.string()).optional().nullable(),
  // Already converted to array by CSV processing
  social_handles: import_zod5.z.array(import_zod5.z.string()).optional().nullable(),
  address: import_zod5.z.string().optional().nullable()
});
var importRouter = router({
  // Bulk import contacts from CSV
  contacts: protectedProcedure.input(import_zod5.z.array(csvContactInputSchema)).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server6.TRPCError({ code: "UNAUTHORIZED" });
    }
    if (input.length === 0) {
      return { success: true, imported: 0, errors: [] };
    }
    const importResults = {
      success: true,
      imported: 0,
      errors: [],
      skipped: 0
    };
    const contactsToInsert = input.map((contact) => ({
      full_name: contact.full_name,
      email: contact.email,
      phone: contact.phone,
      phone_country_code: contact.phone_country_code,
      company_name: contact.company,
      // Map company to company_name
      job_title: contact.job_title,
      website: contact.website,
      notes: contact.notes,
      tags: contact.tags,
      // Already converted to array by CSV processing
      social_handles: contact.social_handles,
      address_street: contact.address,
      // Map address to address_street
      user_id: ctx.user.id
    }));
    try {
      const { data, error } = await ctx.supabaseUser.from("contacts").insert(contactsToInsert).select("id, full_name, email");
      if (error) {
        importResults.success = false;
        importResults.errors.push(`Database error: ${error.message}`);
        return importResults;
      }
      importResults.imported = data?.length ?? 0;
      return importResults;
    } catch (error) {
      importResults.success = false;
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      importResults.errors.push(errorMessage);
      return importResults;
    }
  })
});

// src/root.ts
var appRouter = router({
  contacts: contactRouter,
  // Contact router (preferred)
  groups: groupRouter,
  // Groups management router
  storage: storageRouter,
  // Storage router for file uploads (photos)
  dashboard: dashboardRouter,
  // Dashboard metrics aggregation
  import: importRouter
  // Import functionality for CSV uploads
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  appRouter
});
