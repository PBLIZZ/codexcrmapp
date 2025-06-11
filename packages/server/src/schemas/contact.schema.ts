import { z } from 'zod';

// Base schema for contact fields
export const contactBaseSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().optional().nullable(),
  phone_country_code: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  address_street: z.string().optional().nullable(),
  address_city: z.string().optional().nullable(),
  address_postal_code: z.string().optional().nullable(),
  address_country: z.string().optional().nullable(),
  website: z.string().url({ message: "Invalid URL" }).optional().nullable(),
  profile_image_url: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  social_handles: z.array(z.string()).optional().nullable(),
  source: z.string().optional().nullable(),
  last_contacted_at: z.preprocess((arg) => {
    if (arg === '' || arg === null || arg === undefined) return null;
    if (typeof arg === 'string' || arg instanceof Date) {
      const date = new Date(arg);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }, z.date().optional().nullable()),
  enriched_data: z.any().optional().nullable(),
  enrichment_status: z.string().optional().nullable(),
  wellness_goals: z.array(z.string()).optional().nullable(),
  wellness_journey_stage: z.string().optional().nullable(),
  wellness_status: z.string().optional().nullable(),
});

// Schema for creating a new contact
export const contactCreateSchema = contactBaseSchema;

// Schema for updating an existing contact
export const contactUpdateSchema = contactBaseSchema.partial().extend({
  id: z.string().uuid(),
});

// Schema for contact ID
export const contactIdSchema = z.object({
  contactId: z.string().uuid(),
});

// Schema for contact search/filter
export const contactFilterSchema = z.object({
  search: z.string().optional(),
  groupId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  journeyStage: z.string().optional(),
  source: z.string().optional(),
});

// Schema for contact profile
export const contactProfileSchema = z.object({
  contact_id: z.string().uuid(),
  detailed_bio: z.string().optional().nullable(),
  family_members: z.array(z.string()).optional().nullable(),
  personality_traits: z.array(z.string()).optional().nullable(),
  preferences: z.any().optional().nullable(),
  health_metrics: z.any().optional().nullable(),
  important_dates: z.any().optional().nullable(),
  wellness_history: z.string().optional().nullable(),
  custom_fields: z.any().optional().nullable(),
});

// Schema for contact with profile
export const contactWithProfileSchema = contactBaseSchema.extend({
  id: z.string().uuid(),
  profile: contactProfileSchema.optional().nullable(),
});

// Export all schemas
export const ContactSchemas = {
  base: contactBaseSchema,
  create: contactCreateSchema,
  update: contactUpdateSchema,
  id: contactIdSchema,
  filter: contactFilterSchema,
  profile: contactProfileSchema,
  withProfile: contactWithProfileSchema,
};