// Import all schemas
import { ContactSchemas, contactBaseSchema, contactCreateSchema, contactUpdateSchema, contactIdSchema, contactFilterSchema, contactProfileSchema, contactWithProfileSchema } from './contact.schema';
import { SessionSchemas, sessionBaseSchema, sessionCreateSchema, sessionUpdateSchema, sessionIdSchema, sessionFilterSchema, sessionAttendeeSchema, aiInsightsSchema as sessionAiInsightsSchema, dateRangeSchema as sessionDateRangeSchema } from './session.schema';
import { AiActionSchemas, aiActionBaseSchema, aiActionCreateSchema, aiActionUpdateSchema, aiActionIdSchema, aiActionStatusUpdateSchema, aiActionImplementSchema, aiActionFilterSchema, aiActionTypeEnum, aiActionStatusEnum, aiActionPriorityEnum } from './ai-action.schema';
import { NoteSchemas, noteBaseSchema, noteCreateSchema, noteUpdateSchema, noteIdSchema, noteFilterSchema, aiAnalysisSchema, sentimentAnalysisSchema, commonTopicTagsEnum } from './note.schema';
import { DashboardSchemas, dateRangeSchema as dashboardDateRangeSchema, contactMetricsSchema, sessionMetricsSchema, aiActionMetricsSchema, dashboardSummarySchema, timePeriodSchema, dashboardFilterSchema } from './dashboard.schema';
// Export contact schemas
export { contactBaseSchema, contactCreateSchema, contactUpdateSchema, contactIdSchema, contactFilterSchema, contactProfileSchema, contactWithProfileSchema };
// Export session schemas
export { sessionBaseSchema, sessionCreateSchema, sessionUpdateSchema, sessionIdSchema, sessionFilterSchema, sessionAttendeeSchema, sessionAiInsightsSchema, sessionDateRangeSchema };
// Export AI action schemas
export { aiActionBaseSchema, aiActionCreateSchema, aiActionUpdateSchema, aiActionIdSchema, aiActionStatusUpdateSchema, aiActionImplementSchema, aiActionFilterSchema, aiActionTypeEnum, aiActionStatusEnum, aiActionPriorityEnum };
// Export note schemas
export { noteBaseSchema, noteCreateSchema, noteUpdateSchema, noteIdSchema, noteFilterSchema, aiAnalysisSchema, sentimentAnalysisSchema, commonTopicTagsEnum };
// Export dashboard schemas
export { dashboardDateRangeSchema, contactMetricsSchema, sessionMetricsSchema, aiActionMetricsSchema, dashboardSummarySchema, timePeriodSchema, dashboardFilterSchema };
// Combined schemas object for convenience
export const Schemas = {
    Contact: ContactSchemas,
    Session: SessionSchemas,
    AiAction: AiActionSchemas,
    Note: NoteSchemas,
    Dashboard: DashboardSchemas,
};
