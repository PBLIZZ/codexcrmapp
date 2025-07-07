import { z } from 'zod';
export declare const noteBaseSchema: z.ZodObject<{
    contact_id: z.ZodString;
    session_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    content: z.ZodString;
    topic_tags: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    key_insights: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    ai_summary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sentiment_analysis: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
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
export declare const noteCreateSchema: z.ZodObject<{
    contact_id: z.ZodString;
    session_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    content: z.ZodString;
    topic_tags: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    key_insights: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    ai_summary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sentiment_analysis: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
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
export declare const noteUpdateSchema: z.ZodObject<{
    contact_id: z.ZodOptional<z.ZodString>;
    session_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    content: z.ZodOptional<z.ZodString>;
    topic_tags: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
    key_insights: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
    ai_summary: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    sentiment_analysis: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodAny>>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
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
export declare const noteIdSchema: z.ZodObject<{
    noteId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    noteId: string;
}, {
    noteId: string;
}>;
export declare const noteFilterSchema: z.ZodObject<{
    contactId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    topicTag: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    hasAiSummary: z.ZodOptional<z.ZodBoolean>;
    sentiment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
export declare const aiAnalysisSchema: z.ZodObject<{
    noteId: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    topicTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    keyInsights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    sentimentAnalysis: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
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
export declare const sentimentAnalysisSchema: z.ZodObject<{
    overall: z.ZodString;
    score: z.ZodNumber;
    aspects: z.ZodOptional<z.ZodArray<z.ZodObject<{
        aspect: z.ZodString;
        sentiment: z.ZodString;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        sentiment: string;
        score: number;
        aspect: string;
    }, {
        sentiment: string;
        score: number;
        aspect: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
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
export declare const commonTopicTagsEnum: z.ZodEnum<["wellness_goals", "health_concerns", "progress_update", "feedback", "questions", "action_items", "follow_up", "personal", "professional", "other"]>;
export declare const NoteSchemas: {
    base: z.ZodObject<{
        contact_id: z.ZodString;
        session_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        content: z.ZodString;
        topic_tags: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        key_insights: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        ai_summary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        sentiment_analysis: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
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
    create: z.ZodObject<{
        contact_id: z.ZodString;
        session_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        content: z.ZodString;
        topic_tags: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        key_insights: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        ai_summary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        sentiment_analysis: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
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
    update: z.ZodObject<{
        contact_id: z.ZodOptional<z.ZodString>;
        session_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        content: z.ZodOptional<z.ZodString>;
        topic_tags: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        key_insights: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        ai_summary: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        sentiment_analysis: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodAny>>>;
    } & {
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
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
    id: z.ZodObject<{
        noteId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        noteId: string;
    }, {
        noteId: string;
    }>;
    filter: z.ZodObject<{
        contactId: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        topicTag: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        hasAiSummary: z.ZodOptional<z.ZodBoolean>;
        sentiment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
    aiAnalysis: z.ZodObject<{
        noteId: z.ZodString;
        summary: z.ZodOptional<z.ZodString>;
        topicTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        keyInsights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sentimentAnalysis: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
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
    sentimentAnalysis: z.ZodObject<{
        overall: z.ZodString;
        score: z.ZodNumber;
        aspects: z.ZodOptional<z.ZodArray<z.ZodObject<{
            aspect: z.ZodString;
            sentiment: z.ZodString;
            score: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            sentiment: string;
            score: number;
            aspect: string;
        }, {
            sentiment: string;
            score: number;
            aspect: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
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
    commonTopicTags: z.ZodEnum<["wellness_goals", "health_concerns", "progress_update", "feedback", "questions", "action_items", "follow_up", "personal", "professional", "other"]>;
};
//# sourceMappingURL=note.schema.d.ts.map