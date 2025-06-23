import { z } from 'zod';
// Base schema for AI action fields
export const aiActionBaseSchema = z.object({
    action_type: z.string(),
    contact_id: z.string().uuid(),
    session_id: z.string().uuid().optional().nullable(),
    suggestion: z.string(),
    status: z.string().default('pending'),
    priority: z.string().optional().nullable(),
    context: z.any().optional().nullable(),
    implemented: z.boolean().default(false),
    implementation_date: z.string().datetime().optional().nullable(),
    feedback: z.string().optional().nullable(),
});
// Schema for creating a new AI action
export const aiActionCreateSchema = aiActionBaseSchema;
// Schema for updating an existing AI action
export const aiActionUpdateSchema = aiActionBaseSchema.partial().extend({
    id: z.string().uuid(),
});
// Schema for AI action ID
export const aiActionIdSchema = z.object({
    actionId: z.string().uuid(),
});
// Schema for AI action status update
export const aiActionStatusUpdateSchema = z.object({
    actionId: z.string().uuid(),
    status: z.string(),
    feedback: z.string().optional(),
});
// Schema for marking AI action as implemented
export const aiActionImplementSchema = z.object({
    actionId: z.string().uuid(),
    feedback: z.string().optional(),
});
// Schema for AI action search/filter
export const aiActionFilterSchema = z.object({
    contactId: z.string().uuid().optional(),
    sessionId: z.string().uuid().optional(),
    status: z.string().optional(),
    actionType: z.string().optional(),
    implemented: z.boolean().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});
// Schema for AI action types enum
export const aiActionTypeEnum = z.enum([
    'contact_enrichment',
    'follow_up_suggestion',
    'session_insight',
    'wellness_recommendation',
    'relationship_opportunity',
    'content_suggestion',
    'other',
]);
// Schema for AI action status enum
export const aiActionStatusEnum = z.enum([
    'pending',
    'approved',
    'rejected',
    'implemented',
    'deferred',
]);
// Schema for AI action priority enum
export const aiActionPriorityEnum = z.enum([
    'high',
    'medium',
    'low',
]);
// Export all schemas
export const AiActionSchemas = {
    base: aiActionBaseSchema,
    create: aiActionCreateSchema,
    update: aiActionUpdateSchema,
    id: aiActionIdSchema,
    statusUpdate: aiActionStatusUpdateSchema,
    implement: aiActionImplementSchema,
    filter: aiActionFilterSchema,
    types: aiActionTypeEnum,
    statuses: aiActionStatusEnum,
    priorities: aiActionPriorityEnum,
};
