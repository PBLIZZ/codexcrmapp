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
var import_client = require("@codexcrm/database/prisma/generated/client/client");

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
      const contact = await ctx.prisma.contact.findUnique({
        where: {
          id: input.contactId,
          userId: ctx.user.id
        }
      });
      if (!contact) {
        throw new import_server2.TRPCError({
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
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch groups for contact",
        cause: error
      });
    }
  }),
  // List all groups for the authenticated user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
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
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch groups",
        cause: error
      });
    }
  }),
  // Get a single group by ID
  getById: protectedProcedure.input(import_zod.z.object({ groupId: import_zod.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
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
        throw new import_server2.TRPCError({
          code: "NOT_FOUND",
          message: "Group not found"
        });
      }
      return group;
    } catch (error) {
      console.error("Error fetching group by ID:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch group",
        cause: error
      });
    }
  }),
  // Create or update a group
  save: protectedProcedure.input(groupInputSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
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
          throw new import_server2.TRPCError({
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
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to ${input.id ? "update" : "create"} group`,
        cause: error
      });
    }
  }),
  // Delete a group
  delete: protectedProcedure.input(import_zod.z.object({ groupId: import_zod.z.string().uuid() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const existingGroup = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          userId: ctx.user.id
        }
      });
      if (!existingGroup) {
        throw new import_server2.TRPCError({
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
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete group",
        cause: error
      });
    }
  }),
  // Add a contact to a group
  addContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
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
        throw new import_server2.TRPCError({
          code: "NOT_FOUND",
          message: "Group not found or you do not have permission to access it"
        });
      }
      if (!contact) {
        throw new import_server2.TRPCError({
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
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add contact to group",
        cause: error
      });
    }
  }),
  // Remove a contact from a group
  removeContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          userId: ctx.user.id
        }
      });
      if (!group) {
        throw new import_server2.TRPCError({
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
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove contact from group",
        cause: error
      });
    }
  }),
  // Get all contacts in a group
  getContacts: protectedProcedure.input(import_zod.z.object({ groupId: import_zod.z.string().uuid() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          userId: ctx.user.id
        }
      });
      if (!group) {
        throw new import_server2.TRPCError({
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
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contacts in group",
        cause: error
      });
    }
  })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  groupRouter
});
