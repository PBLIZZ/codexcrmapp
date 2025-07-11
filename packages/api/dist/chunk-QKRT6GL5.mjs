import {
  protectedProcedure,
  router
} from "./chunk-JTHPFO2B.mjs";

// src/routers/import.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
var csvContactInputSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().optional().nullable(),
  phone_country_code: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  // Note: maps to company_name in DB
  job_title: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  // Already converted to array by CSV processing
  social_handles: z.array(z.string()).optional().nullable(),
  address: z.string().optional().nullable()
});
var importRouter = router({
  // Bulk import contacts from CSV
  contacts: protectedProcedure.input(z.array(csvContactInputSchema)).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
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

export {
  importRouter
};
