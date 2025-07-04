import { z } from 'zod';
// Base schema for note fields
export const noteBaseSchema = z.object({
    contact_id: z.string().uuid(),
    session_id: z.string().uuid().optional().nullable(),
    content: z.string(),
    topic_tags: z.array(z.string()).optional().nullable(),
    key_insights: z.array(z.string()).optional().nullable(),
    ai_summary: z.string().optional().nullable(),
    sentiment_analysis: z.any().optional().nullable(),
});
// Schema for creating a new note
export const noteCreateSchema = noteBaseSchema;
// Schema for updating an existing note
export const noteUpdateSchema = noteBaseSchema.partial().extend({
    id: z.string().uuid(),
});
// Schema for note ID
export const noteIdSchema = z.object({
    noteId: z.string().uuid(),
});
// Schema for note search/filter
export const noteFilterSchema = z.object({
    contactId: z.string().uuid().optional(),
    sessionId: z.string().uuid().optional(),
    topicTag: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    hasAiSummary: z.boolean().optional(),
    sentiment: z.string().optional(),
});
// Schema for AI analysis update
export const aiAnalysisSchema = z.object({
    noteId: z.string().uuid(),
    summary: z.string().optional(),
    topicTags: z.array(z.string()).optional(),
    keyInsights: z.array(z.string()).optional(),
    sentimentAnalysis: z.any().optional(),
});
// Schema for sentiment analysis result
export const sentimentAnalysisSchema = z.object({
    overall: z.string(),
    score: z.number().min(-1).max(1),
    aspects: z.array(z.object({
        aspect: z.string(),
        sentiment: z.string(),
        score: z.number().min(-1).max(1),
    })).optional(),
});
// Schema for common topic tags
export const commonTopicTagsEnum = z.enum([
    'wellness_goals',
    'health_concerns',
    'progress_update',
    'feedback',
    'questions',
    'action_items',
    'follow_up',
    'personal',
    'professional',
    'other',
]);
// Export all schemas
export const NoteSchemas = {
    base: noteBaseSchema,
    create: noteCreateSchema,
    update: noteUpdateSchema,
    id: noteIdSchema,
    filter: noteFilterSchema,
    aiAnalysis: aiAnalysisSchema,
    sentimentAnalysis: sentimentAnalysisSchema,
    commonTopicTags: commonTopicTagsEnum,
};
