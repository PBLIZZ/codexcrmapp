import { z } from 'zod';
export declare const sessionBaseSchema: z.ZodObject<{
    contact_id: z.ZodString;
    session_time: z.ZodString;
    session_type: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    duration_minutes: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    virtual_meeting_link: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    key_topics: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    outcomes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    follow_up_needed: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    follow_up_details: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    service_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    program_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sentiment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    ai_insights: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    contact_id: string;
    session_time: string;
    status?: string | null | undefined;
    notes?: string | null | undefined;
    session_type?: string | null | undefined;
    duration_minutes?: number | null | undefined;
    location?: string | null | undefined;
    virtual_meeting_link?: string | null | undefined;
    key_topics?: string[] | null | undefined;
    outcomes?: string | null | undefined;
    follow_up_needed?: boolean | null | undefined;
    follow_up_details?: string | null | undefined;
    service_id?: string | null | undefined;
    program_id?: string | null | undefined;
    sentiment?: string | null | undefined;
    ai_insights?: any;
}, {
    contact_id: string;
    session_time: string;
    status?: string | null | undefined;
    notes?: string | null | undefined;
    session_type?: string | null | undefined;
    duration_minutes?: number | null | undefined;
    location?: string | null | undefined;
    virtual_meeting_link?: string | null | undefined;
    key_topics?: string[] | null | undefined;
    outcomes?: string | null | undefined;
    follow_up_needed?: boolean | null | undefined;
    follow_up_details?: string | null | undefined;
    service_id?: string | null | undefined;
    program_id?: string | null | undefined;
    sentiment?: string | null | undefined;
    ai_insights?: any;
}>;
export declare const sessionCreateSchema: z.ZodObject<{
    contact_id: z.ZodString;
    session_time: z.ZodString;
    session_type: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    duration_minutes: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    virtual_meeting_link: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    key_topics: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    outcomes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    follow_up_needed: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    follow_up_details: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    service_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    program_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sentiment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    ai_insights: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    contact_id: string;
    session_time: string;
    status?: string | null | undefined;
    notes?: string | null | undefined;
    session_type?: string | null | undefined;
    duration_minutes?: number | null | undefined;
    location?: string | null | undefined;
    virtual_meeting_link?: string | null | undefined;
    key_topics?: string[] | null | undefined;
    outcomes?: string | null | undefined;
    follow_up_needed?: boolean | null | undefined;
    follow_up_details?: string | null | undefined;
    service_id?: string | null | undefined;
    program_id?: string | null | undefined;
    sentiment?: string | null | undefined;
    ai_insights?: any;
}, {
    contact_id: string;
    session_time: string;
    status?: string | null | undefined;
    notes?: string | null | undefined;
    session_type?: string | null | undefined;
    duration_minutes?: number | null | undefined;
    location?: string | null | undefined;
    virtual_meeting_link?: string | null | undefined;
    key_topics?: string[] | null | undefined;
    outcomes?: string | null | undefined;
    follow_up_needed?: boolean | null | undefined;
    follow_up_details?: string | null | undefined;
    service_id?: string | null | undefined;
    program_id?: string | null | undefined;
    sentiment?: string | null | undefined;
    ai_insights?: any;
}>;
export declare const sessionUpdateSchema: z.ZodObject<{
    contact_id: z.ZodOptional<z.ZodString>;
    session_time: z.ZodOptional<z.ZodString>;
    session_type: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    duration_minutes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    virtual_meeting_link: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    key_topics: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
    outcomes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    follow_up_needed: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodBoolean>>>;
    follow_up_details: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    status: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    service_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    program_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    sentiment: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    ai_insights: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodAny>>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    status?: string | null | undefined;
    notes?: string | null | undefined;
    contact_id?: string | undefined;
    session_time?: string | undefined;
    session_type?: string | null | undefined;
    duration_minutes?: number | null | undefined;
    location?: string | null | undefined;
    virtual_meeting_link?: string | null | undefined;
    key_topics?: string[] | null | undefined;
    outcomes?: string | null | undefined;
    follow_up_needed?: boolean | null | undefined;
    follow_up_details?: string | null | undefined;
    service_id?: string | null | undefined;
    program_id?: string | null | undefined;
    sentiment?: string | null | undefined;
    ai_insights?: any;
}, {
    id: string;
    status?: string | null | undefined;
    notes?: string | null | undefined;
    contact_id?: string | undefined;
    session_time?: string | undefined;
    session_type?: string | null | undefined;
    duration_minutes?: number | null | undefined;
    location?: string | null | undefined;
    virtual_meeting_link?: string | null | undefined;
    key_topics?: string[] | null | undefined;
    outcomes?: string | null | undefined;
    follow_up_needed?: boolean | null | undefined;
    follow_up_details?: string | null | undefined;
    service_id?: string | null | undefined;
    program_id?: string | null | undefined;
    sentiment?: string | null | undefined;
    ai_insights?: any;
}>;
export declare const sessionIdSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
}, {
    sessionId: string;
}>;
export declare const sessionFilterSchema: z.ZodObject<{
    contactId: z.ZodOptional<z.ZodString>;
    upcoming: z.ZodOptional<z.ZodBoolean>;
    sessionType: z.ZodOptional<z.ZodString>;
    followUpNeeded: z.ZodOptional<z.ZodBoolean>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    contactId?: string | undefined;
    upcoming?: boolean | undefined;
    sessionType?: string | undefined;
    followUpNeeded?: boolean | undefined;
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    contactId?: string | undefined;
    upcoming?: boolean | undefined;
    sessionType?: string | undefined;
    followUpNeeded?: boolean | undefined;
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export declare const sessionAttendeeSchema: z.ZodObject<{
    session_id: z.ZodString;
    contact_id: z.ZodString;
    attended: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    contact_id: string;
    session_id: string;
    notes?: string | null | undefined;
    attended?: boolean | undefined;
}, {
    contact_id: string;
    session_id: string;
    notes?: string | null | undefined;
    attended?: boolean | undefined;
}>;
export declare const aiInsightsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    insights: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    insights?: any;
}, {
    sessionId: string;
    insights?: any;
}>;
export declare const dateRangeSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export declare const SessionSchemas: {
    base: z.ZodObject<{
        contact_id: z.ZodString;
        session_time: z.ZodString;
        session_type: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        duration_minutes: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        virtual_meeting_link: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        key_topics: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        outcomes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        follow_up_needed: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        follow_up_details: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        service_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        program_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        sentiment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        ai_insights: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        contact_id: string;
        session_time: string;
        status?: string | null | undefined;
        notes?: string | null | undefined;
        session_type?: string | null | undefined;
        duration_minutes?: number | null | undefined;
        location?: string | null | undefined;
        virtual_meeting_link?: string | null | undefined;
        key_topics?: string[] | null | undefined;
        outcomes?: string | null | undefined;
        follow_up_needed?: boolean | null | undefined;
        follow_up_details?: string | null | undefined;
        service_id?: string | null | undefined;
        program_id?: string | null | undefined;
        sentiment?: string | null | undefined;
        ai_insights?: any;
    }, {
        contact_id: string;
        session_time: string;
        status?: string | null | undefined;
        notes?: string | null | undefined;
        session_type?: string | null | undefined;
        duration_minutes?: number | null | undefined;
        location?: string | null | undefined;
        virtual_meeting_link?: string | null | undefined;
        key_topics?: string[] | null | undefined;
        outcomes?: string | null | undefined;
        follow_up_needed?: boolean | null | undefined;
        follow_up_details?: string | null | undefined;
        service_id?: string | null | undefined;
        program_id?: string | null | undefined;
        sentiment?: string | null | undefined;
        ai_insights?: any;
    }>;
    create: z.ZodObject<{
        contact_id: z.ZodString;
        session_time: z.ZodString;
        session_type: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        duration_minutes: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        virtual_meeting_link: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        key_topics: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        outcomes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        follow_up_needed: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        follow_up_details: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        service_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        program_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        sentiment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        ai_insights: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        contact_id: string;
        session_time: string;
        status?: string | null | undefined;
        notes?: string | null | undefined;
        session_type?: string | null | undefined;
        duration_minutes?: number | null | undefined;
        location?: string | null | undefined;
        virtual_meeting_link?: string | null | undefined;
        key_topics?: string[] | null | undefined;
        outcomes?: string | null | undefined;
        follow_up_needed?: boolean | null | undefined;
        follow_up_details?: string | null | undefined;
        service_id?: string | null | undefined;
        program_id?: string | null | undefined;
        sentiment?: string | null | undefined;
        ai_insights?: any;
    }, {
        contact_id: string;
        session_time: string;
        status?: string | null | undefined;
        notes?: string | null | undefined;
        session_type?: string | null | undefined;
        duration_minutes?: number | null | undefined;
        location?: string | null | undefined;
        virtual_meeting_link?: string | null | undefined;
        key_topics?: string[] | null | undefined;
        outcomes?: string | null | undefined;
        follow_up_needed?: boolean | null | undefined;
        follow_up_details?: string | null | undefined;
        service_id?: string | null | undefined;
        program_id?: string | null | undefined;
        sentiment?: string | null | undefined;
        ai_insights?: any;
    }>;
    update: z.ZodObject<{
        contact_id: z.ZodOptional<z.ZodString>;
        session_time: z.ZodOptional<z.ZodString>;
        session_type: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        duration_minutes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
        location: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        virtual_meeting_link: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        key_topics: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        outcomes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        follow_up_needed: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodBoolean>>>;
        follow_up_details: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        status: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        service_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        program_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        sentiment: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        ai_insights: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodAny>>>;
    } & {
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status?: string | null | undefined;
        notes?: string | null | undefined;
        contact_id?: string | undefined;
        session_time?: string | undefined;
        session_type?: string | null | undefined;
        duration_minutes?: number | null | undefined;
        location?: string | null | undefined;
        virtual_meeting_link?: string | null | undefined;
        key_topics?: string[] | null | undefined;
        outcomes?: string | null | undefined;
        follow_up_needed?: boolean | null | undefined;
        follow_up_details?: string | null | undefined;
        service_id?: string | null | undefined;
        program_id?: string | null | undefined;
        sentiment?: string | null | undefined;
        ai_insights?: any;
    }, {
        id: string;
        status?: string | null | undefined;
        notes?: string | null | undefined;
        contact_id?: string | undefined;
        session_time?: string | undefined;
        session_type?: string | null | undefined;
        duration_minutes?: number | null | undefined;
        location?: string | null | undefined;
        virtual_meeting_link?: string | null | undefined;
        key_topics?: string[] | null | undefined;
        outcomes?: string | null | undefined;
        follow_up_needed?: boolean | null | undefined;
        follow_up_details?: string | null | undefined;
        service_id?: string | null | undefined;
        program_id?: string | null | undefined;
        sentiment?: string | null | undefined;
        ai_insights?: any;
    }>;
    id: z.ZodObject<{
        sessionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
    }, {
        sessionId: string;
    }>;
    filter: z.ZodObject<{
        contactId: z.ZodOptional<z.ZodString>;
        upcoming: z.ZodOptional<z.ZodBoolean>;
        sessionType: z.ZodOptional<z.ZodString>;
        followUpNeeded: z.ZodOptional<z.ZodBoolean>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        contactId?: string | undefined;
        upcoming?: boolean | undefined;
        sessionType?: string | undefined;
        followUpNeeded?: boolean | undefined;
        limit?: number | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        contactId?: string | undefined;
        upcoming?: boolean | undefined;
        sessionType?: string | undefined;
        followUpNeeded?: boolean | undefined;
        limit?: number | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
    attendee: z.ZodObject<{
        session_id: z.ZodString;
        contact_id: z.ZodString;
        attended: z.ZodOptional<z.ZodBoolean>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        contact_id: string;
        session_id: string;
        notes?: string | null | undefined;
        attended?: boolean | undefined;
    }, {
        contact_id: string;
        session_id: string;
        notes?: string | null | undefined;
        attended?: boolean | undefined;
    }>;
    aiInsights: z.ZodObject<{
        sessionId: z.ZodString;
        insights: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
        insights?: any;
    }, {
        sessionId: string;
        insights?: any;
    }>;
    dateRange: z.ZodObject<{
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
};
