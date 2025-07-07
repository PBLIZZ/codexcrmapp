import { contactBaseSchema, contactCreateSchema, contactUpdateSchema, contactIdSchema, contactFilterSchema, contactProfileSchema, contactWithProfileSchema } from './contact.schema';
import { sessionBaseSchema, sessionCreateSchema, sessionUpdateSchema, sessionIdSchema, sessionFilterSchema, sessionAttendeeSchema, aiInsightsSchema as sessionAiInsightsSchema, dateRangeSchema as sessionDateRangeSchema } from './session.schema';
import { aiActionBaseSchema, aiActionCreateSchema, aiActionUpdateSchema, aiActionIdSchema, aiActionStatusUpdateSchema, aiActionImplementSchema, aiActionFilterSchema, aiActionTypeEnum, aiActionStatusEnum, aiActionPriorityEnum } from './ai-action.schema';
import { noteBaseSchema, noteCreateSchema, noteUpdateSchema, noteIdSchema, noteFilterSchema, aiAnalysisSchema, sentimentAnalysisSchema, commonTopicTagsEnum } from './note.schema';
import { dateRangeSchema as dashboardDateRangeSchema, contactMetricsSchema, sessionMetricsSchema, aiActionMetricsSchema, dashboardSummarySchema, timePeriodSchema, dashboardFilterSchema } from './dashboard.schema';
export { contactBaseSchema, contactCreateSchema, contactUpdateSchema, contactIdSchema, contactFilterSchema, contactProfileSchema, contactWithProfileSchema };
export { sessionBaseSchema, sessionCreateSchema, sessionUpdateSchema, sessionIdSchema, sessionFilterSchema, sessionAttendeeSchema, sessionAiInsightsSchema, sessionDateRangeSchema };
export { aiActionBaseSchema, aiActionCreateSchema, aiActionUpdateSchema, aiActionIdSchema, aiActionStatusUpdateSchema, aiActionImplementSchema, aiActionFilterSchema, aiActionTypeEnum, aiActionStatusEnum, aiActionPriorityEnum };
export { noteBaseSchema, noteCreateSchema, noteUpdateSchema, noteIdSchema, noteFilterSchema, aiAnalysisSchema, sentimentAnalysisSchema, commonTopicTagsEnum };
export { dashboardDateRangeSchema, contactMetricsSchema, sessionMetricsSchema, aiActionMetricsSchema, dashboardSummarySchema, timePeriodSchema, dashboardFilterSchema };
export declare const Schemas: {
    Contact: {
        base: import("zod").ZodObject<{
            full_name: import("zod").ZodString;
            email: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            phone: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            phone_country_code: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            company_name: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            job_title: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_street: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_city: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_postal_code: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_country: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            website: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            profile_image_url: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            notes: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            tags: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            social_handles: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            source: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            last_contacted_at: import("zod").ZodEffects<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodDate>>, Date | null | undefined, unknown>;
            enriched_data: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
            enrichment_status: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            wellness_goals: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            wellness_journey_stage: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            wellness_status: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
        }, "strip", import("zod").ZodTypeAny, {
            full_name: string;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            phone_country_code?: string | null | undefined;
            company_name?: string | null | undefined;
            job_title?: string | null | undefined;
            address_street?: string | null | undefined;
            address_city?: string | null | undefined;
            address_postal_code?: string | null | undefined;
            address_country?: string | null | undefined;
            website?: string | null | undefined;
            profile_image_url?: string | null | undefined;
            notes?: string | null | undefined;
            tags?: string[] | null | undefined;
            social_handles?: string[] | null | undefined;
            source?: string | null | undefined;
            last_contacted_at?: Date | null | undefined;
            enriched_data?: Record<string, unknown> | null | undefined;
            enrichment_status?: string | null | undefined;
            wellness_goals?: string[] | null | undefined;
            wellness_journey_stage?: string | null | undefined;
            wellness_status?: string | null | undefined;
        }, {
            full_name: string;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            phone_country_code?: string | null | undefined;
            company_name?: string | null | undefined;
            job_title?: string | null | undefined;
            address_street?: string | null | undefined;
            address_city?: string | null | undefined;
            address_postal_code?: string | null | undefined;
            address_country?: string | null | undefined;
            website?: string | null | undefined;
            profile_image_url?: string | null | undefined;
            notes?: string | null | undefined;
            tags?: string[] | null | undefined;
            social_handles?: string[] | null | undefined;
            source?: string | null | undefined;
            last_contacted_at?: unknown;
            enriched_data?: Record<string, unknown> | null | undefined;
            enrichment_status?: string | null | undefined;
            wellness_goals?: string[] | null | undefined;
            wellness_journey_stage?: string | null | undefined;
            wellness_status?: string | null | undefined;
        }>;
        create: import("zod").ZodObject<{
            full_name: import("zod").ZodString;
            email: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            phone: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            phone_country_code: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            company_name: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            job_title: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_street: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_city: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_postal_code: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_country: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            website: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            profile_image_url: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            notes: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            tags: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            social_handles: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            source: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            last_contacted_at: import("zod").ZodEffects<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodDate>>, Date | null | undefined, unknown>;
            enriched_data: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
            enrichment_status: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            wellness_goals: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            wellness_journey_stage: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            wellness_status: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
        }, "strip", import("zod").ZodTypeAny, {
            full_name: string;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            phone_country_code?: string | null | undefined;
            company_name?: string | null | undefined;
            job_title?: string | null | undefined;
            address_street?: string | null | undefined;
            address_city?: string | null | undefined;
            address_postal_code?: string | null | undefined;
            address_country?: string | null | undefined;
            website?: string | null | undefined;
            profile_image_url?: string | null | undefined;
            notes?: string | null | undefined;
            tags?: string[] | null | undefined;
            social_handles?: string[] | null | undefined;
            source?: string | null | undefined;
            last_contacted_at?: Date | null | undefined;
            enriched_data?: Record<string, unknown> | null | undefined;
            enrichment_status?: string | null | undefined;
            wellness_goals?: string[] | null | undefined;
            wellness_journey_stage?: string | null | undefined;
            wellness_status?: string | null | undefined;
        }, {
            full_name: string;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            phone_country_code?: string | null | undefined;
            company_name?: string | null | undefined;
            job_title?: string | null | undefined;
            address_street?: string | null | undefined;
            address_city?: string | null | undefined;
            address_postal_code?: string | null | undefined;
            address_country?: string | null | undefined;
            website?: string | null | undefined;
            profile_image_url?: string | null | undefined;
            notes?: string | null | undefined;
            tags?: string[] | null | undefined;
            social_handles?: string[] | null | undefined;
            source?: string | null | undefined;
            last_contacted_at?: unknown;
            enriched_data?: Record<string, unknown> | null | undefined;
            enrichment_status?: string | null | undefined;
            wellness_goals?: string[] | null | undefined;
            wellness_journey_stage?: string | null | undefined;
            wellness_status?: string | null | undefined;
        }>;
        update: import("zod").ZodObject<{
            full_name: import("zod").ZodOptional<import("zod").ZodString>;
            email: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            phone: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            phone_country_code: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            company_name: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            job_title: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            address_street: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            address_city: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            address_postal_code: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            address_country: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            website: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            profile_image_url: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            notes: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            tags: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
            social_handles: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
            source: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            last_contacted_at: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodDate>>, Date | null | undefined, unknown>>;
            enriched_data: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>>;
            enrichment_status: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            wellness_goals: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
            wellness_journey_stage: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            wellness_status: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
        } & {
            id: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            id: string;
            full_name?: string | undefined;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            phone_country_code?: string | null | undefined;
            company_name?: string | null | undefined;
            job_title?: string | null | undefined;
            address_street?: string | null | undefined;
            address_city?: string | null | undefined;
            address_postal_code?: string | null | undefined;
            address_country?: string | null | undefined;
            website?: string | null | undefined;
            profile_image_url?: string | null | undefined;
            notes?: string | null | undefined;
            tags?: string[] | null | undefined;
            social_handles?: string[] | null | undefined;
            source?: string | null | undefined;
            last_contacted_at?: Date | null | undefined;
            enriched_data?: Record<string, unknown> | null | undefined;
            enrichment_status?: string | null | undefined;
            wellness_goals?: string[] | null | undefined;
            wellness_journey_stage?: string | null | undefined;
            wellness_status?: string | null | undefined;
        }, {
            id: string;
            full_name?: string | undefined;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            phone_country_code?: string | null | undefined;
            company_name?: string | null | undefined;
            job_title?: string | null | undefined;
            address_street?: string | null | undefined;
            address_city?: string | null | undefined;
            address_postal_code?: string | null | undefined;
            address_country?: string | null | undefined;
            website?: string | null | undefined;
            profile_image_url?: string | null | undefined;
            notes?: string | null | undefined;
            tags?: string[] | null | undefined;
            social_handles?: string[] | null | undefined;
            source?: string | null | undefined;
            last_contacted_at?: unknown;
            enriched_data?: Record<string, unknown> | null | undefined;
            enrichment_status?: string | null | undefined;
            wellness_goals?: string[] | null | undefined;
            wellness_journey_stage?: string | null | undefined;
            wellness_status?: string | null | undefined;
        }>;
        id: import("zod").ZodObject<{
            contactId: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            contactId: string;
        }, {
            contactId: string;
        }>;
        filter: import("zod").ZodObject<{
            search: import("zod").ZodOptional<import("zod").ZodString>;
            groupId: import("zod").ZodOptional<import("zod").ZodString>;
            tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            journeyStage: import("zod").ZodOptional<import("zod").ZodString>;
            source: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            search?: string | undefined;
            tags?: string[] | undefined;
            source?: string | undefined;
            groupId?: string | undefined;
            journeyStage?: string | undefined;
        }, {
            search?: string | undefined;
            tags?: string[] | undefined;
            source?: string | undefined;
            groupId?: string | undefined;
            journeyStage?: string | undefined;
        }>;
        profile: import("zod").ZodObject<{
            contact_id: import("zod").ZodString;
            detailed_bio: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            family_members: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            personality_traits: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            preferences: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
            health_metrics: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
            important_dates: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
            wellness_history: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            custom_fields: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
        }, "strip", import("zod").ZodTypeAny, {
            contact_id: string;
            detailed_bio?: string | null | undefined;
            family_members?: string[] | null | undefined;
            personality_traits?: string[] | null | undefined;
            preferences?: Record<string, unknown> | null | undefined;
            health_metrics?: Record<string, unknown> | null | undefined;
            important_dates?: Record<string, unknown> | null | undefined;
            wellness_history?: string | null | undefined;
            custom_fields?: Record<string, unknown> | null | undefined;
        }, {
            contact_id: string;
            detailed_bio?: string | null | undefined;
            family_members?: string[] | null | undefined;
            personality_traits?: string[] | null | undefined;
            preferences?: Record<string, unknown> | null | undefined;
            health_metrics?: Record<string, unknown> | null | undefined;
            important_dates?: Record<string, unknown> | null | undefined;
            wellness_history?: string | null | undefined;
            custom_fields?: Record<string, unknown> | null | undefined;
        }>;
        withProfile: import("zod").ZodObject<{
            full_name: import("zod").ZodString;
            email: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            phone: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            phone_country_code: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            company_name: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            job_title: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_street: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_city: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_postal_code: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            address_country: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            website: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            profile_image_url: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            notes: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            tags: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            social_handles: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            source: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            last_contacted_at: import("zod").ZodEffects<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodDate>>, Date | null | undefined, unknown>;
            enriched_data: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
            enrichment_status: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            wellness_goals: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            wellness_journey_stage: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            wellness_status: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
        } & {
            id: import("zod").ZodString;
            profile: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodObject<{
                contact_id: import("zod").ZodString;
                detailed_bio: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
                family_members: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                personality_traits: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                preferences: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
                health_metrics: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
                important_dates: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
                wellness_history: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
                custom_fields: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
            }, "strip", import("zod").ZodTypeAny, {
                contact_id: string;
                detailed_bio?: string | null | undefined;
                family_members?: string[] | null | undefined;
                personality_traits?: string[] | null | undefined;
                preferences?: Record<string, unknown> | null | undefined;
                health_metrics?: Record<string, unknown> | null | undefined;
                important_dates?: Record<string, unknown> | null | undefined;
                wellness_history?: string | null | undefined;
                custom_fields?: Record<string, unknown> | null | undefined;
            }, {
                contact_id: string;
                detailed_bio?: string | null | undefined;
                family_members?: string[] | null | undefined;
                personality_traits?: string[] | null | undefined;
                preferences?: Record<string, unknown> | null | undefined;
                health_metrics?: Record<string, unknown> | null | undefined;
                important_dates?: Record<string, unknown> | null | undefined;
                wellness_history?: string | null | undefined;
                custom_fields?: Record<string, unknown> | null | undefined;
            }>>>;
        }, "strip", import("zod").ZodTypeAny, {
            id: string;
            full_name: string;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            phone_country_code?: string | null | undefined;
            company_name?: string | null | undefined;
            job_title?: string | null | undefined;
            address_street?: string | null | undefined;
            address_city?: string | null | undefined;
            address_postal_code?: string | null | undefined;
            address_country?: string | null | undefined;
            website?: string | null | undefined;
            profile_image_url?: string | null | undefined;
            notes?: string | null | undefined;
            tags?: string[] | null | undefined;
            social_handles?: string[] | null | undefined;
            source?: string | null | undefined;
            last_contacted_at?: Date | null | undefined;
            enriched_data?: Record<string, unknown> | null | undefined;
            enrichment_status?: string | null | undefined;
            wellness_goals?: string[] | null | undefined;
            wellness_journey_stage?: string | null | undefined;
            wellness_status?: string | null | undefined;
            profile?: {
                contact_id: string;
                detailed_bio?: string | null | undefined;
                family_members?: string[] | null | undefined;
                personality_traits?: string[] | null | undefined;
                preferences?: Record<string, unknown> | null | undefined;
                health_metrics?: Record<string, unknown> | null | undefined;
                important_dates?: Record<string, unknown> | null | undefined;
                wellness_history?: string | null | undefined;
                custom_fields?: Record<string, unknown> | null | undefined;
            } | null | undefined;
        }, {
            id: string;
            full_name: string;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            phone_country_code?: string | null | undefined;
            company_name?: string | null | undefined;
            job_title?: string | null | undefined;
            address_street?: string | null | undefined;
            address_city?: string | null | undefined;
            address_postal_code?: string | null | undefined;
            address_country?: string | null | undefined;
            website?: string | null | undefined;
            profile_image_url?: string | null | undefined;
            notes?: string | null | undefined;
            tags?: string[] | null | undefined;
            social_handles?: string[] | null | undefined;
            source?: string | null | undefined;
            last_contacted_at?: unknown;
            enriched_data?: Record<string, unknown> | null | undefined;
            enrichment_status?: string | null | undefined;
            wellness_goals?: string[] | null | undefined;
            wellness_journey_stage?: string | null | undefined;
            wellness_status?: string | null | undefined;
            profile?: {
                contact_id: string;
                detailed_bio?: string | null | undefined;
                family_members?: string[] | null | undefined;
                personality_traits?: string[] | null | undefined;
                preferences?: Record<string, unknown> | null | undefined;
                health_metrics?: Record<string, unknown> | null | undefined;
                important_dates?: Record<string, unknown> | null | undefined;
                wellness_history?: string | null | undefined;
                custom_fields?: Record<string, unknown> | null | undefined;
            } | null | undefined;
        }>;
    };
    Session: any;
    AiAction: any;
    Note: {
        base: import("zod").ZodObject<{
            contact_id: import("zod").ZodString;
            session_id: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            content: import("zod").ZodString;
            topic_tags: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            key_insights: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            ai_summary: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            sentiment_analysis: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodAny>>;
        }, "strip", import("zod").ZodTypeAny, {
            contact_id: string;
            content: string;
            session_id?: string | null | undefined;
            topic_tags?: string[] | null | undefined;
            key_insights?: string[] | null | undefined;
            ai_summary?: string | null | undefined;
            sentiment_analysis?: any;
        }, {
            contact_id: string;
            content: string;
            session_id?: string | null | undefined;
            topic_tags?: string[] | null | undefined;
            key_insights?: string[] | null | undefined;
            ai_summary?: string | null | undefined;
            sentiment_analysis?: any;
        }>;
        create: import("zod").ZodObject<{
            contact_id: import("zod").ZodString;
            session_id: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            content: import("zod").ZodString;
            topic_tags: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            key_insights: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            ai_summary: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>;
            sentiment_analysis: import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodAny>>;
        }, "strip", import("zod").ZodTypeAny, {
            contact_id: string;
            content: string;
            session_id?: string | null | undefined;
            topic_tags?: string[] | null | undefined;
            key_insights?: string[] | null | undefined;
            ai_summary?: string | null | undefined;
            sentiment_analysis?: any;
        }, {
            contact_id: string;
            content: string;
            session_id?: string | null | undefined;
            topic_tags?: string[] | null | undefined;
            key_insights?: string[] | null | undefined;
            ai_summary?: string | null | undefined;
            sentiment_analysis?: any;
        }>;
        update: import("zod").ZodObject<{
            contact_id: import("zod").ZodOptional<import("zod").ZodString>;
            session_id: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            content: import("zod").ZodOptional<import("zod").ZodString>;
            topic_tags: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
            key_insights: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
            ai_summary: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
            sentiment_analysis: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodAny>>>;
        } & {
            id: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            id: string;
            contact_id?: string | undefined;
            session_id?: string | null | undefined;
            content?: string | undefined;
            topic_tags?: string[] | null | undefined;
            key_insights?: string[] | null | undefined;
            ai_summary?: string | null | undefined;
            sentiment_analysis?: any;
        }, {
            id: string;
            contact_id?: string | undefined;
            session_id?: string | null | undefined;
            content?: string | undefined;
            topic_tags?: string[] | null | undefined;
            key_insights?: string[] | null | undefined;
            ai_summary?: string | null | undefined;
            sentiment_analysis?: any;
        }>;
        id: import("zod").ZodObject<{
            noteId: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            noteId: string;
        }, {
            noteId: string;
        }>;
        filter: import("zod").ZodObject<{
            contactId: import("zod").ZodOptional<import("zod").ZodString>;
            sessionId: import("zod").ZodOptional<import("zod").ZodString>;
            topicTag: import("zod").ZodOptional<import("zod").ZodString>;
            startDate: import("zod").ZodOptional<import("zod").ZodString>;
            endDate: import("zod").ZodOptional<import("zod").ZodString>;
            hasAiSummary: import("zod").ZodOptional<import("zod").ZodBoolean>;
            sentiment: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            contactId?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            sessionId?: string | undefined;
            topicTag?: string | undefined;
            hasAiSummary?: boolean | undefined;
            sentiment?: string | undefined;
        }, {
            contactId?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            sessionId?: string | undefined;
            topicTag?: string | undefined;
            hasAiSummary?: boolean | undefined;
            sentiment?: string | undefined;
        }>;
        aiAnalysis: import("zod").ZodObject<{
            noteId: import("zod").ZodString;
            summary: import("zod").ZodOptional<import("zod").ZodString>;
            topicTags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            keyInsights: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            sentimentAnalysis: import("zod").ZodOptional<import("zod").ZodAny>;
        }, "strip", import("zod").ZodTypeAny, {
            noteId: string;
            summary?: string | undefined;
            topicTags?: string[] | undefined;
            keyInsights?: string[] | undefined;
            sentimentAnalysis?: any;
        }, {
            noteId: string;
            summary?: string | undefined;
            topicTags?: string[] | undefined;
            keyInsights?: string[] | undefined;
            sentimentAnalysis?: any;
        }>;
        sentimentAnalysis: import("zod").ZodObject<{
            overall: import("zod").ZodString;
            score: import("zod").ZodNumber;
            aspects: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                aspect: import("zod").ZodString;
                sentiment: import("zod").ZodString;
                score: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                sentiment: string;
                score: number;
                aspect: string;
            }, {
                sentiment: string;
                score: number;
                aspect: string;
            }>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            overall: string;
            score: number;
            aspects?: {
                sentiment: string;
                score: number;
                aspect: string;
            }[] | undefined;
        }, {
            overall: string;
            score: number;
            aspects?: {
                sentiment: string;
                score: number;
                aspect: string;
            }[] | undefined;
        }>;
        commonTopicTags: import("zod").ZodEnum<["wellness_goals", "health_concerns", "progress_update", "feedback", "questions", "action_items", "follow_up", "personal", "professional", "other"]>;
    };
    Dashboard: {
        dateRange: import("zod").ZodObject<{
            startDate: import("zod").ZodOptional<import("zod").ZodString>;
            endDate: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            startDate?: string | undefined;
            endDate?: string | undefined;
        }, {
            startDate?: string | undefined;
            endDate?: string | undefined;
        }>;
        contactMetrics: import("zod").ZodObject<{
            totalContacts: import("zod").ZodNumber;
            newContacts: import("zod").ZodNumber;
            journeyStageDistribution: import("zod").ZodArray<import("zod").ZodObject<{
                wellness_journey_stage: import("zod").ZodString;
                count: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                count: number;
                wellness_journey_stage: string;
            }, {
                count: number;
                wellness_journey_stage: string;
            }>, "many">;
            recentActivity: import("zod").ZodArray<import("zod").ZodObject<{
                id: import("zod").ZodString;
                full_name: import("zod").ZodString;
                last_contacted_at: import("zod").ZodNullable<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                id: string;
                full_name: string;
                last_contacted_at: string | null;
            }, {
                id: string;
                full_name: string;
                last_contacted_at: string | null;
            }>, "many">;
        }, "strip", import("zod").ZodTypeAny, {
            totalContacts: number;
            newContacts: number;
            journeyStageDistribution: {
                count: number;
                wellness_journey_stage: string;
            }[];
            recentActivity: {
                id: string;
                full_name: string;
                last_contacted_at: string | null;
            }[];
        }, {
            totalContacts: number;
            newContacts: number;
            journeyStageDistribution: {
                count: number;
                wellness_journey_stage: string;
            }[];
            recentActivity: {
                id: string;
                full_name: string;
                last_contacted_at: string | null;
            }[];
        }>;
        sessionMetrics: import("zod").ZodObject<{
            totalSessions: import("zod").ZodNumber;
            sessionsInRange: import("zod").ZodNumber;
            sessionTypeDistribution: import("zod").ZodArray<import("zod").ZodObject<{
                session_type: import("zod").ZodString;
                count: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                count: number;
                session_type: string;
            }, {
                count: number;
                session_type: string;
            }>, "many">;
            upcomingSessions: import("zod").ZodArray<import("zod").ZodObject<{
                id: import("zod").ZodString;
                session_time: import("zod").ZodString;
                contact_id: import("zod").ZodString;
                contacts: import("zod").ZodOptional<import("zod").ZodObject<{
                    full_name: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    full_name: string;
                }, {
                    full_name: string;
                }>>;
            }, "strip", import("zod").ZodTypeAny, {
                id: string;
                contact_id: string;
                session_time: string;
                contacts?: {
                    full_name: string;
                } | undefined;
            }, {
                id: string;
                contact_id: string;
                session_time: string;
                contacts?: {
                    full_name: string;
                } | undefined;
            }>, "many">;
            sessionTrend: import("zod").ZodArray<import("zod").ZodObject<{
                date: import("zod").ZodString;
                count: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                date: string;
                count: number;
            }, {
                date: string;
                count: number;
            }>, "many">;
        }, "strip", import("zod").ZodTypeAny, {
            sessionTrend: {
                date: string;
                count: number;
            }[];
            totalSessions: number;
            sessionsInRange: number;
            sessionTypeDistribution: {
                count: number;
                session_type: string;
            }[];
            upcomingSessions: {
                id: string;
                contact_id: string;
                session_time: string;
                contacts?: {
                    full_name: string;
                } | undefined;
            }[];
        }, {
            sessionTrend: {
                date: string;
                count: number;
            }[];
            totalSessions: number;
            sessionsInRange: number;
            sessionTypeDistribution: {
                count: number;
                session_type: string;
            }[];
            upcomingSessions: {
                id: string;
                contact_id: string;
                session_time: string;
                contacts?: {
                    full_name: string;
                } | undefined;
            }[];
        }>;
        aiActionMetrics: import("zod").ZodObject<{
            totalActions: import("zod").ZodNumber;
            actionsByStatus: import("zod").ZodArray<import("zod").ZodObject<{
                status: import("zod").ZodString;
                count: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                status: string;
                count: number;
            }, {
                status: string;
                count: number;
            }>, "many">;
            actionsByType: import("zod").ZodArray<import("zod").ZodObject<{
                action_type: import("zod").ZodString;
                count: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                count: number;
                action_type: string;
            }, {
                count: number;
                action_type: string;
            }>, "many">;
            recentActions: import("zod").ZodArray<import("zod").ZodObject<{
                id: import("zod").ZodString;
                action_type: import("zod").ZodString;
                suggestion: import("zod").ZodString;
                status: import("zod").ZodString;
                created_at: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id: string;
                status: string;
                created_at: string;
                action_type: string;
                suggestion: string;
            }, {
                id: string;
                status: string;
                created_at: string;
                action_type: string;
                suggestion: string;
            }>, "many">;
            implementationRate: import("zod").ZodNumber;
        }, "strip", import("zod").ZodTypeAny, {
            implementationRate: number;
            totalActions: number;
            actionsByStatus: {
                status: string;
                count: number;
            }[];
            actionsByType: {
                count: number;
                action_type: string;
            }[];
            recentActions: {
                id: string;
                status: string;
                created_at: string;
                action_type: string;
                suggestion: string;
            }[];
        }, {
            implementationRate: number;
            totalActions: number;
            actionsByStatus: {
                status: string;
                count: number;
            }[];
            actionsByType: {
                count: number;
                action_type: string;
            }[];
            recentActions: {
                id: string;
                status: string;
                created_at: string;
                action_type: string;
                suggestion: string;
            }[];
        }>;
        summary: import("zod").ZodObject<{
            totalContacts: import("zod").ZodNumber;
            totalSessions: import("zod").ZodNumber;
            totalAiActions: import("zod").ZodNumber;
            totalNotes: import("zod").ZodNumber;
            newContactsCount: import("zod").ZodNumber;
            upcomingSessionsCount: import("zod").ZodNumber;
            pendingActionsCount: import("zod").ZodNumber;
            dateRange: import("zod").ZodObject<{
                startDate: import("zod").ZodString;
                endDate: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                startDate: string;
                endDate: string;
            }, {
                startDate: string;
                endDate: string;
            }>;
        }, "strip", import("zod").ZodTypeAny, {
            totalContacts: number;
            totalSessions: number;
            totalAiActions: number;
            totalNotes: number;
            newContactsCount: number;
            upcomingSessionsCount: number;
            pendingActionsCount: number;
            dateRange: {
                startDate: string;
                endDate: string;
            };
        }, {
            totalContacts: number;
            totalSessions: number;
            totalAiActions: number;
            totalNotes: number;
            newContactsCount: number;
            upcomingSessionsCount: number;
            pendingActionsCount: number;
            dateRange: {
                startDate: string;
                endDate: string;
            };
        }>;
        timePeriod: import("zod").ZodEnum<["today", "yesterday", "this_week", "last_week", "this_month", "last_month", "this_quarter", "last_quarter", "this_year", "last_year", "custom"]>;
        filter: import("zod").ZodObject<{
            timePeriod: import("zod").ZodOptional<import("zod").ZodEnum<["today", "yesterday", "this_week", "last_week", "this_month", "last_month", "this_quarter", "last_quarter", "this_year", "last_year", "custom"]>>;
            dateRange: import("zod").ZodOptional<import("zod").ZodObject<{
                startDate: import("zod").ZodOptional<import("zod").ZodString>;
                endDate: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                startDate?: string | undefined;
                endDate?: string | undefined;
            }, {
                startDate?: string | undefined;
                endDate?: string | undefined;
            }>>;
            includeContacts: import("zod").ZodOptional<import("zod").ZodBoolean>;
            includeSessions: import("zod").ZodOptional<import("zod").ZodBoolean>;
            includeAiActions: import("zod").ZodOptional<import("zod").ZodBoolean>;
            includeNotes: import("zod").ZodOptional<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            dateRange?: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            timePeriod?: "custom" | "today" | "yesterday" | "this_week" | "last_week" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "this_year" | "last_year" | undefined;
            includeContacts?: boolean | undefined;
            includeSessions?: boolean | undefined;
            includeAiActions?: boolean | undefined;
            includeNotes?: boolean | undefined;
        }, {
            dateRange?: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            timePeriod?: "custom" | "today" | "yesterday" | "this_week" | "last_week" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "this_year" | "last_year" | undefined;
            includeContacts?: boolean | undefined;
            includeSessions?: boolean | undefined;
            includeAiActions?: boolean | undefined;
            includeNotes?: boolean | undefined;
        }>;
    };
};
//# sourceMappingURL=index.d.ts.map