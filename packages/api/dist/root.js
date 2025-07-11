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

// src/routers/group.ts
var import_server3 = require("@trpc/server");
var import_zod2 = require("zod");
var import_client = require("@codexcrm/database/prisma/generated/client/client");
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
      const contact = await ctx.prisma.contact.findUnique({
        where: {
          id: input.contactId,
          userId: ctx.user.id
        }
      });
      if (!contact) {
        throw new import_server3.TRPCError({
          code: "NOT_FOUND",
          message: "Contact not found or you do not have permission to access it"
        });
      }
      const groupMembers = await ctx.prisma.groupMember.findMany({
        where: {
          contactId: input.contactId
        },
        include: {
          group: true
        }
      });
      const groups = groupMembers.map((member) => member.group).filter((group) => group.userId === ctx.user.id);
      return groups;
    } catch (error) {
      console.error("Error fetching groups for contact:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch groups for contact",
        cause: error
      });
    }
  }),
  // List all groups for the authenticated user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const groups = await ctx.prisma.group.findMany({
        where: {
          userId: ctx.user.id
        },
        include: {
          members: true
        },
        orderBy: {
          name: "asc"
        }
      });
      return groups.map((group) => {
        const contactCount = group.members.length;
        return {
          id: group.id,
          name: group.name,
          description: group.description,
          color: group.color,
          emoji: group.emoji,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          contactCount
        };
      });
    } catch (error) {
      console.error("Error fetching groups with contact counts:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch groups",
        cause: error
      });
    }
  }),
  // Get a single group by ID
  getById: protectedProcedure.input(import_zod2.z.object({ groupId: import_zod2.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          userId: ctx.user.id
          // Ensure user only accesses their own groups
        }
      });
      if (!group) {
        throw new import_server3.TRPCError({
          code: "NOT_FOUND",
          message: "Group not found"
        });
      }
      return group;
    } catch (error) {
      console.error("Error fetching group by ID:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch group",
        cause: error
      });
    }
  }),
  // Create or update a group
  save: protectedProcedure.input(groupInputSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const isUpdate = !!input.id;
      if (isUpdate) {
        const existingGroup = await ctx.prisma.group.findUnique({
          where: {
            id: input.id,
            userId: ctx.user.id
          }
        });
        if (!existingGroup) {
          throw new import_server3.TRPCError({
            code: "NOT_FOUND",
            message: "Group not found or you do not have permission to update it"
          });
        }
        return await ctx.prisma.group.update({
          where: {
            id: input.id
          },
          data: {
            name: input.name,
            description: input.description,
            color: input.color,
            emoji: input.emoji
          }
        });
      } else {
        return await ctx.prisma.group.create({
          data: {
            name: input.name,
            description: input.description,
            color: input.color,
            emoji: input.emoji,
            user: {
              connect: {
                id: ctx.user.id
              }
            }
          }
        });
      }
    } catch (error) {
      console.error("Error saving group:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to ${input.id ? "update" : "create"} group`,
        cause: error
      });
    }
  }),
  // Delete a group
  delete: protectedProcedure.input(import_zod2.z.object({ groupId: import_zod2.z.string().uuid() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const existingGroup = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          userId: ctx.user.id
        }
      });
      if (!existingGroup) {
        throw new import_server3.TRPCError({
          code: "NOT_FOUND",
          message: "Group not found or you do not have permission to delete it"
        });
      }
      await ctx.prisma.group.delete({
        where: {
          id: input.groupId
        }
      });
      return { success: true, deletedGroupId: input.groupId };
    } catch (error) {
      console.error("Error deleting group:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete group",
        cause: error
      });
    }
  }),
  // Add a contact to a group
  addContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const [group, contact] = await Promise.all([
        ctx.prisma.group.findUnique({
          where: {
            id: input.groupId,
            userId: ctx.user.id
          }
        }),
        ctx.prisma.contact.findUnique({
          where: {
            id: input.contactId,
            userId: ctx.user.id
          }
        })
      ]);
      if (!group) {
        throw new import_server3.TRPCError({
          code: "NOT_FOUND",
          message: "Group not found or you do not have permission to access it"
        });
      }
      if (!contact) {
        throw new import_server3.TRPCError({
          code: "NOT_FOUND",
          message: "Contact not found or you do not have permission to access it"
        });
      }
      const existingRelationship = await ctx.prisma.groupMember.findUnique({
        where: {
          groupId_contactId: {
            groupId: input.groupId,
            contactId: input.contactId
          }
        }
      });
      if (existingRelationship) {
        return { success: true, message: "Contact already in group." };
      }
      await ctx.prisma.groupMember.create({
        data: {
          group: {
            connect: { id: input.groupId }
          },
          contact: {
            connect: { id: input.contactId }
          }
        }
      });
      return { success: true };
    } catch (error) {
      console.error("Error adding contact to group:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add contact to group",
        cause: error
      });
    }
  }),
  // Remove a contact from a group
  removeContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          userId: ctx.user.id
        }
      });
      if (!group) {
        throw new import_server3.TRPCError({
          code: "NOT_FOUND",
          message: "Group not found or you do not have permission to modify it"
        });
      }
      await ctx.prisma.groupMember.delete({
        where: {
          groupId_contactId: {
            groupId: input.groupId,
            contactId: input.contactId
          }
        }
      });
      return { success: true };
    } catch (error) {
      if (error instanceof import_client.Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return { success: true };
      }
      console.error("Error removing contact from group:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove contact from group",
        cause: error
      });
    }
  }),
  // Get all contacts in a group
  getContacts: protectedProcedure.input(import_zod2.z.object({ groupId: import_zod2.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          userId: ctx.user.id
        }
      });
      if (!group) {
        throw new import_server3.TRPCError({
          code: "NOT_FOUND",
          message: "Group not found or you do not have permission to access it"
        });
      }
      const groupWithMembers = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId
        },
        include: {
          members: {
            include: {
              contact: true
            }
          }
        }
      });
      if (!groupWithMembers || !groupWithMembers.members) {
        return [];
      }
      return groupWithMembers.members.map((member) => member.contact);
    } catch (error) {
      console.error("Error fetching contacts in group:", error);
      throw new import_server3.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contacts in group",
        cause: error
      });
    }
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
      throw new import_server5.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contact metrics",
        cause: error
      });
    }
  }),
  // Get overall dashboard summary with only available metrics
  summary: protectedProcedure.input(dateRangeSchema.optional()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new import_server5.TRPCError({ code: "UNAUTHORIZED" });
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
      const prismaContacts = contactsToInsert.map((contact) => {
        const prismaContact = {
          fullName: contact.full_name,
          // Email is required in the schema, provide an empty string if missing
          email: contact.email || "",
          // Handle nullable fields properly
          phone: contact.phone ?? void 0,
          phoneCountryCode: contact.phone_country_code ?? void 0,
          companyName: contact.company_name ?? void 0,
          jobTitle: contact.job_title ?? void 0,
          website: contact.website ?? void 0,
          notes: contact.notes ?? void 0,
          // Required arrays - provide empty arrays if null/undefined
          tags: contact.tags ?? [],
          socialHandles: contact.social_handles ?? [],
          // For wellness goals (required array in schema)
          wellnessGoals: [],
          // Optional fields
          addressStreet: contact.address_street ?? void 0,
          // Connect to the user
          user: {
            connect: {
              id: ctx.user.id
            }
          }
        };
        return prismaContact;
      });
      const createdContacts = await Promise.all(
        prismaContacts.map(
          (contactData) => ctx.prisma.contact.create({
            data: contactData,
            select: {
              id: true,
              fullName: true,
              email: true
            }
          })
        )
      );
      importResults.imported = createdContacts.length;
      return importResults;
    } catch (error) {
      importResults.success = false;
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      importResults.errors.push(errorMessage);
      console.error("Error importing contacts:", error);
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
