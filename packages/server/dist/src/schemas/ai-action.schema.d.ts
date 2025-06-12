import { z } from 'zod';
export declare const aiActionBaseSchema: z.ZodObject<{
    action_type: z.ZodString;
    contact_id: z.ZodString;
    session_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    suggestion: z.ZodString;
    status: z.ZodDefault<z.ZodString>;
    priority: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    context: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    implemented: z.ZodDefault<z.ZodBoolean>;
    implementation_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    feedback: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    contact_id: string;
    action_type: string;
    implemented: boolean;
    suggestion: string;
    priority?: string | null | undefined;
    session_id?: string | null | undefined;
    context?: any;
    implementation_date?: string | null | undefined;
    feedback?: string | null | undefined;
}, {
    contact_id: string;
    action_type: string;
    suggestion: string;
    priority?: string | null | undefined;
    status?: string | undefined;
    session_id?: string | null | undefined;
    implemented?: boolean | undefined;
    context?: any;
    implementation_date?: string | null | undefined;
    feedback?: string | null | undefined;
}>;
export declare const aiActionCreateSchema: z.ZodObject<{
    action_type: z.ZodString;
    contact_id: z.ZodString;
    session_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    suggestion: z.ZodString;
    status: z.ZodDefault<z.ZodString>;
    priority: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    context: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    implemented: z.ZodDefault<z.ZodBoolean>;
    implementation_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    feedback: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    contact_id: string;
    action_type: string;
    implemented: boolean;
    suggestion: string;
    priority?: string | null | undefined;
    session_id?: string | null | undefined;
    context?: any;
    implementation_date?: string | null | undefined;
    feedback?: string | null | undefined;
}, {
    contact_id: string;
    action_type: string;
    suggestion: string;
    priority?: string | null | undefined;
    status?: string | undefined;
    session_id?: string | null | undefined;
    implemented?: boolean | undefined;
    context?: any;
    implementation_date?: string | null | undefined;
    feedback?: string | null | undefined;
}>;
export declare const aiActionUpdateSchema: z.ZodObject<{
    action_type: z.ZodOptional<z.ZodString>;
    contact_id: z.ZodOptional<z.ZodString>;
    session_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    suggestion: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    context: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodAny>>>;
    implemented: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    implementation_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    feedback: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    priority?: string | null | undefined;
    status?: string | undefined;
    contact_id?: string | undefined;
    session_id?: string | null | undefined;
    action_type?: string | undefined;
    implemented?: boolean | undefined;
    suggestion?: string | undefined;
    context?: any;
    implementation_date?: string | null | undefined;
    feedback?: string | null | undefined;
}, {
    id: string;
    priority?: string | null | undefined;
    status?: string | undefined;
    contact_id?: string | undefined;
    session_id?: string | null | undefined;
    action_type?: string | undefined;
    implemented?: boolean | undefined;
    suggestion?: string | undefined;
    context?: any;
    implementation_date?: string | null | undefined;
    feedback?: string | null | undefined;
}>;
export declare const aiActionIdSchema: z.ZodObject<{
    actionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    actionId: string;
}, {
    actionId: string;
}>;
export declare const aiActionStatusUpdateSchema: z.ZodObject<{
    actionId: z.ZodString;
    status: z.ZodString;
    feedback: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    actionId: string;
    feedback?: string | undefined;
}, {
    status: string;
    actionId: string;
    feedback?: string | undefined;
}>;
export declare const aiActionImplementSchema: z.ZodObject<{
    actionId: z.ZodString;
    feedback: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    actionId: string;
    feedback?: string | undefined;
}, {
    actionId: string;
    feedback?: string | undefined;
}>;
export declare const aiActionFilterSchema: z.ZodObject<{
    contactId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    actionType: z.ZodOptional<z.ZodString>;
    implemented: z.ZodOptional<z.ZodBoolean>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: string | undefined;
    contactId?: string | undefined;
    implemented?: boolean | undefined;
    sessionId?: string | undefined;
    actionType?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    status?: string | undefined;
    contactId?: string | undefined;
    implemented?: boolean | undefined;
    sessionId?: string | undefined;
    actionType?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export declare const aiActionTypeEnum: z.ZodEnum<["contact_enrichment", "follow_up_suggestion", "session_insight", "wellness_recommendation", "relationship_opportunity", "content_suggestion", "other"]>;
export declare const aiActionStatusEnum: z.ZodEnum<["pending", "approved", "rejected", "implemented", "deferred"]>;
export declare const aiActionPriorityEnum: z.ZodEnum<["high", "medium", "low"]>;
export declare const AiActionSchemas: {
    base: z.ZodObject<{
        action_type: z.ZodString;
        contact_id: z.ZodString;
        session_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        suggestion: z.ZodString;
        status: z.ZodDefault<z.ZodString>;
        priority: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        context: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
        implemented: z.ZodDefault<z.ZodBoolean>;
        implementation_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        feedback: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        contact_id: string;
        action_type: string;
        implemented: boolean;
        suggestion: string;
        priority?: string | null | undefined;
        session_id?: string | null | undefined;
        context?: any;
        implementation_date?: string | null | undefined;
        feedback?: string | null | undefined;
    }, {
        contact_id: string;
        action_type: string;
        suggestion: string;
        priority?: string | null | undefined;
        status?: string | undefined;
        session_id?: string | null | undefined;
        implemented?: boolean | undefined;
        context?: any;
        implementation_date?: string | null | undefined;
        feedback?: string | null | undefined;
    }>;
    create: z.ZodObject<{
        action_type: z.ZodString;
        contact_id: z.ZodString;
        session_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        suggestion: z.ZodString;
        status: z.ZodDefault<z.ZodString>;
        priority: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        context: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
        implemented: z.ZodDefault<z.ZodBoolean>;
        implementation_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        feedback: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        contact_id: string;
        action_type: string;
        implemented: boolean;
        suggestion: string;
        priority?: string | null | undefined;
        session_id?: string | null | undefined;
        context?: any;
        implementation_date?: string | null | undefined;
        feedback?: string | null | undefined;
    }, {
        contact_id: string;
        action_type: string;
        suggestion: string;
        priority?: string | null | undefined;
        status?: string | undefined;
        session_id?: string | null | undefined;
        implemented?: boolean | undefined;
        context?: any;
        implementation_date?: string | null | undefined;
        feedback?: string | null | undefined;
    }>;
    update: z.ZodObject<{
        action_type: z.ZodOptional<z.ZodString>;
        contact_id: z.ZodOptional<z.ZodString>;
        session_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        suggestion: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        context: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodAny>>>;
        implemented: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        implementation_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        feedback: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    } & {
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        priority?: string | null | undefined;
        status?: string | undefined;
        contact_id?: string | undefined;
        session_id?: string | null | undefined;
        action_type?: string | undefined;
        implemented?: boolean | undefined;
        suggestion?: string | undefined;
        context?: any;
        implementation_date?: string | null | undefined;
        feedback?: string | null | undefined;
    }, {
        id: string;
        priority?: string | null | undefined;
        status?: string | undefined;
        contact_id?: string | undefined;
        session_id?: string | null | undefined;
        action_type?: string | undefined;
        implemented?: boolean | undefined;
        suggestion?: string | undefined;
        context?: any;
        implementation_date?: string | null | undefined;
        feedback?: string | null | undefined;
    }>;
    id: z.ZodObject<{
        actionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        actionId: string;
    }, {
        actionId: string;
    }>;
    statusUpdate: z.ZodObject<{
        actionId: z.ZodString;
        status: z.ZodString;
        feedback: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        actionId: string;
        feedback?: string | undefined;
    }, {
        status: string;
        actionId: string;
        feedback?: string | undefined;
    }>;
    implement: z.ZodObject<{
        actionId: z.ZodString;
        feedback: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        actionId: string;
        feedback?: string | undefined;
    }, {
        actionId: string;
        feedback?: string | undefined;
    }>;
    filter: z.ZodObject<{
        contactId: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        actionType: z.ZodOptional<z.ZodString>;
        implemented: z.ZodOptional<z.ZodBoolean>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: string | undefined;
        contactId?: string | undefined;
        implemented?: boolean | undefined;
        sessionId?: string | undefined;
        actionType?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        status?: string | undefined;
        contactId?: string | undefined;
        implemented?: boolean | undefined;
        sessionId?: string | undefined;
        actionType?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
    types: z.ZodEnum<["contact_enrichment", "follow_up_suggestion", "session_insight", "wellness_recommendation", "relationship_opportunity", "content_suggestion", "other"]>;
    statuses: z.ZodEnum<["pending", "approved", "rejected", "implemented", "deferred"]>;
    priorities: z.ZodEnum<["high", "medium", "low"]>;
};
