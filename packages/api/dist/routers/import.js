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

// src/routers/import.ts
var import_exports = {};
__export(import_exports, {
  importRouter: () => importRouter
});
module.exports = __toCommonJS(import_exports);
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

// src/routers/import.ts
var csvContactInputSchema = import_zod.z.object({
  full_name: import_zod.z.string().min(1, "Full name is required"),
  email: import_zod.z.string().email("Invalid email address").optional().nullable(),
  phone: import_zod.z.string().optional().nullable(),
  phone_country_code: import_zod.z.string().optional().nullable(),
  company: import_zod.z.string().optional().nullable(),
  // Note: maps to company_name in DB
  job_title: import_zod.z.string().optional().nullable(),
  website: import_zod.z.string().optional().nullable(),
  notes: import_zod.z.string().optional().nullable(),
  tags: import_zod.z.array(import_zod.z.string()).optional().nullable(),
  // Already converted to array by CSV processing
  social_handles: import_zod.z.array(import_zod.z.string()).optional().nullable(),
  address: import_zod.z.string().optional().nullable()
});
var importRouter = router({
  // Bulk import contacts from CSV
  contacts: protectedProcedure.input(import_zod.z.array(csvContactInputSchema)).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  importRouter
});
