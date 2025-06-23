import { z } from 'zod';

// Base schema for session fields
export const sessionBaseSchema = z.object({
  contact_id: z.string().uuid(),
  session_time: z.string().datetime(),
  session_type: z.string().optional().nullable(),
  duration_minutes: z.number().int().positive().optional().nullable(),
  location: z.string().optional().nullable(),
  virtual_meeting_link: z.string().url().optional().nullable(),
  notes: z.string().optional().nullable(),
  key_topics: z.array(z.string()).optional().nullable(),
  outcomes: z.string().optional().nullable(),
  follow_up_needed: z.boolean().optional().nullable(),
  follow_up_details: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  service_id: z.string().uuid().optional().nullable(),
  program_id: z.string().uuid().optional().nullable(),
  sentiment: z.string().optional().nullable(),
  ai_insights: z.any().optional().nullable(),
});

// Schema for creating a new session
export const sessionCreateSchema = sessionBaseSchema;

// Schema for updating an existing session
export const sessionUpdateSchema = sessionBaseSchema.partial().extend({
  id: z.string().uuid(),
});

// Schema for session ID
export const sessionIdSchema = z.object({
  sessionId: z.string().uuid(),
});

// Schema for session search/filter
export const sessionFilterSchema = z.object({
  contactId: z.string().uuid().optional(),
  upcoming: z.boolean().optional(),
  sessionType: z.string().optional(),
  followUpNeeded: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().positive().optional(),
});

// Schema for session attendee
export const sessionAttendeeSchema = z.object({
  session_id: z.string().uuid(),
  contact_id: z.string().uuid(),
  attended: z.boolean().optional(),
  notes: z.string().optional().nullable(),
});

// Schema for AI insights update
export const aiInsightsSchema = z.object({
  sessionId: z.string().uuid(),
  insights: z.any(),
});

// Schema for date range
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Export all schemas
export const SessionSchemas = {
  base: sessionBaseSchema,
  create: sessionCreateSchema,
  update: sessionUpdateSchema,
  id: sessionIdSchema,
  filter: sessionFilterSchema,
  attendee: sessionAttendeeSchema,
  aiInsights: aiInsightsSchema,
  dateRange: dateRangeSchema,
};