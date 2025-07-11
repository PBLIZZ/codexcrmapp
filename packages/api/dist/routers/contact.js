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
var import_zod = require("zod");
var import_server2 = require("@trpc/server");

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
      // Optional group ID to filter contacts by
    })
  ).query(async ({ ctx, input }) => {
    const { search, groupId } = input;
    const userId = ctx.user?.id;
    if (!userId) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      if (groupId) {
        const groupMembers = await ctx.prisma.groupMember.findMany({
          where: {
            groupId,
            group: {
              userId
              // Ensure user has access to this group
            }
          },
          select: {
            contactId: true
          }
        });
        if (!groupMembers || groupMembers.length === 0) {
          return [];
        }
        const contactIds = groupMembers.map((member) => member.contactId);
        return await ctx.prisma.contact.findMany({
          where: {
            id: { in: contactIds },
            userId,
            ...search ? {
              OR: [
                { fullName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } }
              ]
            } : {}
          },
          orderBy: {
            createdAt: "desc"
          }
        });
      }
      return await ctx.prisma.contact.findMany({
        where: {
          userId,
          ...search ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } }
            ]
          } : {}
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve contacts",
        cause: error instanceof Error ? error : void 0
      });
    }
  }),
  // Fetch a single contact by ID
  getById: protectedProcedure.input(import_zod.z.object({ contactId: import_zod.z.string().uuid() })).query(async ({ input, ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const contact = await ctx.prisma.contact.findUnique({
        where: {
          id: input.contactId,
          userId
          // Ensures users can only see their own contacts
        }
      });
      if (!contact) {
        throw new import_server2.TRPCError({
          code: "NOT_FOUND",
          message: "Contact not found"
        });
      }
      return contact;
    } catch (error) {
      console.error("Error fetching contact by id:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contact",
        cause: error instanceof Error ? error : void 0
      });
    }
  }),
  save: protectedProcedure.input(contactInputSchema).mutation(async ({ input, ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const contactId = input.id;
    const contactData = {
      fullName: input.full_name
      // Required field
    };
    if (input.email !== void 0)
      contactData.email = input.email === null ? { set: "" } : input.email;
    if (input.phone !== void 0)
      contactData.phone = input.phone === null ? { set: null } : input.phone;
    if (input.phone_country_code !== void 0)
      contactData.phoneCountryCode = input.phone_country_code === null ? { set: null } : input.phone_country_code;
    if (input.company_name !== void 0)
      contactData.companyName = input.company_name === null ? { set: null } : input.company_name;
    if (input.job_title !== void 0)
      contactData.jobTitle = input.job_title === null ? { set: null } : input.job_title;
    if (input.address_street !== void 0)
      contactData.addressStreet = input.address_street === null ? { set: null } : input.address_street;
    if (input.address_city !== void 0)
      contactData.addressCity = input.address_city === null ? { set: null } : input.address_city;
    if (input.address_postal_code !== void 0)
      contactData.addressPostalCode = input.address_postal_code === null ? { set: null } : input.address_postal_code;
    if (input.address_country !== void 0)
      contactData.addressCountry = input.address_country === null ? { set: null } : input.address_country;
    if (input.website !== void 0)
      contactData.website = input.website === null ? { set: null } : input.website;
    if (input.profile_image_url !== void 0)
      contactData.profileImageUrl = input.profile_image_url === null ? { set: null } : input.profile_image_url;
    if (input.notes !== void 0)
      contactData.notes = input.notes === null ? { set: null } : input.notes;
    if (input.tags !== void 0)
      contactData.tags = input.tags === null ? { set: [] } : input.tags;
    if (input.social_handles !== void 0)
      contactData.socialHandles = input.social_handles === null ? { set: [] } : input.social_handles;
    if (input.source !== void 0)
      contactData.source = input.source === null ? { set: null } : input.source;
    if (input.last_contacted_at !== void 0)
      contactData.lastContactedAt = input.last_contacted_at === null ? { set: null } : input.last_contacted_at;
    if (input.enriched_data !== void 0)
      contactData.enrichedData = input.enriched_data === null ? { set: null } : input.enriched_data;
    if (input.enrichment_status !== void 0)
      contactData.enrichmentStatus = input.enrichment_status === null ? { set: null } : input.enrichment_status;
    try {
      let result;
      if (contactId) {
        console.warn(`Attempting contact update for id: ${contactId}`);
        const existingContact = await ctx.prisma.contact.findUnique({
          where: {
            id: contactId,
            userId
          }
        });
        if (!existingContact) {
          throw new import_server2.TRPCError({
            code: "NOT_FOUND",
            message: "Contact not found or you do not have permission to update it"
          });
        }
        result = await ctx.prisma.contact.update({
          where: {
            id: contactId
          },
          data: contactData
        });
      } else {
        console.warn("[DEBUG] Attempting contact insert");
        if (input.email) {
          const existingContactWithEmail = await ctx.prisma.contact.findFirst({
            where: {
              email: input.email,
              userId
            }
          });
          if (existingContactWithEmail) {
            throw new import_server2.TRPCError({
              code: "CONFLICT",
              message: `A contact with this email (${input.email}) already exists.`
            });
          }
        }
        const createData = {
          fullName: input.full_name,
          // Required field
          email: input.email ?? "",
          // Required by Prisma schema, provide empty string if null
          user: { connect: { id: userId } }
          // Required: use connect to link to existing user
        };
        if (input.phone !== void 0 && input.phone !== null) createData.phone = input.phone;
        if (input.phone_country_code !== void 0 && input.phone_country_code !== null)
          createData.phoneCountryCode = input.phone_country_code;
        if (input.company_name !== void 0 && input.company_name !== null)
          createData.companyName = input.company_name;
        if (input.job_title !== void 0 && input.job_title !== null)
          createData.jobTitle = input.job_title;
        if (input.address_street !== void 0 && input.address_street !== null)
          createData.addressStreet = input.address_street;
        if (input.address_city !== void 0 && input.address_city !== null)
          createData.addressCity = input.address_city;
        if (input.address_postal_code !== void 0 && input.address_postal_code !== null)
          createData.addressPostalCode = input.address_postal_code;
        if (input.address_country !== void 0 && input.address_country !== null)
          createData.addressCountry = input.address_country;
        if (input.website !== void 0 && input.website !== null)
          createData.website = input.website;
        if (input.profile_image_url !== void 0 && input.profile_image_url !== null)
          createData.profileImageUrl = input.profile_image_url;
        if (input.notes !== void 0 && input.notes !== null) createData.notes = input.notes;
        if (input.tags !== void 0) createData.tags = input.tags === null ? [] : input.tags;
        if (input.social_handles !== void 0)
          createData.socialHandles = input.social_handles === null ? [] : input.social_handles;
        if (input.source !== void 0 && input.source !== null) createData.source = input.source;
        if (input.last_contacted_at !== void 0)
          createData.lastContactedAt = input.last_contacted_at;
        if (input.enriched_data !== void 0) createData.enrichedData = input.enriched_data;
        if (input.enrichment_status !== void 0)
          createData.enrichmentStatus = input.enrichment_status;
        result = await ctx.prisma.contact.create({
          data: createData
        });
      }
      console.warn("Contact save successful:", result);
      return result;
    } catch (error) {
      if (error instanceof import_server2.TRPCError) {
        throw error;
      }
      console.error("Unhandled error in contact save procedure:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while saving the contact.",
        cause: error instanceof Error ? error : void 0
      });
    }
  }),
  delete: protectedProcedure.input(import_zod.z.object({ contactId: import_zod.z.string().uuid() })).mutation(async ({ input, ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const contact = await ctx.prisma.contact.findUnique({
        where: {
          id: input.contactId,
          userId
        }
      });
      if (!contact) {
        throw new import_server2.TRPCError({
          code: "NOT_FOUND",
          message: "Contact not found or you do not have permission to delete it"
        });
      }
      await ctx.prisma.contact.delete({
        where: {
          id: input.contactId,
          userId
          // Ensures users can only delete their own contacts
        }
      });
      return { success: true, contactId: input.contactId };
    } catch (error) {
      if (error instanceof import_server2.TRPCError) {
        throw error;
      }
      console.error("Unhandled error in delete procedure:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete contact due to an unexpected error",
        cause: error instanceof Error ? error : void 0
      });
    }
  }),
  // Update just the notes field of a contact
  updateNotes: protectedProcedure.input(
    import_zod.z.object({
      contactId: import_zod.z.string().uuid(),
      notes: import_zod.z.string()
    })
  ).mutation(async ({ input, ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    const { contactId, notes } = input;
    try {
      const existingContact = await ctx.prisma.contact.findUnique({
        where: {
          id: contactId,
          userId
        },
        select: { id: true }
      });
      if (!existingContact) {
        throw new import_server2.TRPCError({
          code: "NOT_FOUND",
          message: "Contact not found or you do not have permission to update it"
        });
      }
      await ctx.prisma.contact.update({
        where: {
          id: contactId,
          userId
          // Ensures users can only update their own contacts
        },
        data: {
          notes,
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
      return { success: true };
    } catch (error) {
      if (error instanceof import_server2.TRPCError) {
        throw error;
      }
      console.error("Unhandled error in updateNotes procedure:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update contact notes due to an unexpected error",
        cause: error instanceof Error ? error : void 0
      });
    }
  }),
  // Get total count of contacts for the authenticated user
  getTotalContactsCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const count = await ctx.prisma.contact.count({
        where: {
          userId
          // Ensures we only count user's own contacts
        }
      });
      return { count };
    } catch (error) {
      console.error("Failed to get total contact count:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not retrieve contact count.",
        cause: error instanceof Error ? error : void 0
      });
    }
  })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  contactRouter
});
