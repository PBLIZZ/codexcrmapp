export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./context").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: true;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    contacts: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                search?: string | undefined;
                groupId?: string | undefined;
            };
            output: any;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId: string;
            };
            output: any;
            meta: object;
        }>;
        save: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                full_name: string;
                id?: string | undefined;
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
                enriched_data?: any;
                enrichment_status?: string | null | undefined;
            };
            output: Record<string, unknown>;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contactId: string;
            };
            output: {
                success: boolean;
                contactId: string;
            };
            meta: object;
        }>;
        updateNotes: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contactId: string;
                notes: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getTotalContactsCount: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                count: any;
            };
            meta: object;
        }>;
    }>>;
    groups: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        getGroupsForContact: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId: string;
            };
            output: any;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                groupId: string;
            };
            output: any;
            meta: object;
        }>;
        save: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                description?: string | null | undefined;
                id?: string | undefined;
                color?: string | null | undefined;
                emoji?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                groupId: string;
            };
            output: {
                success: boolean;
                deletedGroupId: string;
            };
            meta: object;
        }>;
        addContact: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contactId: string;
                groupId: string;
            };
            output: {
                success: boolean;
                message: string;
            } | {
                success: boolean;
                message?: undefined;
            };
            meta: object;
        }>;
        removeContact: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contactId: string;
                groupId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getContacts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                groupId: string;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    storage: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        getUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                fileName: string;
                contentType: string;
                folderPath?: string | undefined;
            };
            output: {
                signedUrl: string;
                path: string;
                token: string;
            };
            meta: object;
        }>;
        getFileUrl: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                filePath: string;
            };
            output: {
                signedUrl: string;
            };
            meta: object;
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                filePath: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    sessions: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId?: string | undefined;
                upcoming?: boolean | undefined;
                sessionType?: string | undefined;
                followUpNeeded?: boolean | undefined;
                limit?: number | undefined;
            } | undefined;
            output: any;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                sessionId: string;
            };
            output: any;
            meta: object;
        }>;
        getWithDetails: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                sessionId: string;
            };
            output: any;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contact_id: string;
                session_time: string;
                status?: string | null | undefined;
                id?: string | undefined;
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
            };
            output: any;
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                status?: string | null | undefined;
                contact_id?: string | undefined;
                notes?: string | null | undefined;
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
            };
            output: any;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sessionId: string;
            };
            output: {
                success: any;
                sessionId: string;
            };
            meta: object;
        }>;
        updateAiInsights: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sessionId: string;
                insights?: any;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    aiActions: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId?: string | undefined;
                sessionId?: string | undefined;
                status?: string | undefined;
                actionType?: string | undefined;
            } | undefined;
            output: any;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                actionId: string;
            };
            output: any;
            meta: object;
        }>;
        getWithDetails: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                actionId: string;
            };
            output: any;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                action_type: string;
                contact_id: string;
                suggestion: string;
                status?: string | undefined;
                id?: string | undefined;
                session_id?: string | null | undefined;
                priority?: string | null | undefined;
                context?: any;
                implemented?: boolean | undefined;
                implementation_date?: string | null | undefined;
                feedback?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                status?: string | undefined;
                action_type?: string | undefined;
                contact_id?: string | undefined;
                session_id?: string | null | undefined;
                suggestion?: string | undefined;
                priority?: string | null | undefined;
                context?: any;
                implemented?: boolean | undefined;
                implementation_date?: string | null | undefined;
                feedback?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                actionId: string;
            };
            output: {
                success: any;
                actionId: string;
            };
            meta: object;
        }>;
        updateStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                status: string;
                actionId: string;
                feedback?: string | undefined;
            };
            output: any;
            meta: object;
        }>;
        markImplemented: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                actionId: string;
                feedback?: string | undefined;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    notes: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId?: string | undefined;
                sessionId?: string | undefined;
                topicTag?: string | undefined;
            } | undefined;
            output: any;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                noteId: string;
            };
            output: any;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contact_id: string;
                content: string;
                id?: string | undefined;
                session_id?: string | null | undefined;
                topic_tags?: string[] | null | undefined;
                key_insights?: string[] | null | undefined;
                ai_summary?: string | null | undefined;
                sentiment_analysis?: any;
            };
            output: any;
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                contact_id?: string | undefined;
                session_id?: string | null | undefined;
                content?: string | undefined;
                topic_tags?: string[] | null | undefined;
                key_insights?: string[] | null | undefined;
                ai_summary?: string | null | undefined;
                sentiment_analysis?: any;
            };
            output: any;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                noteId: string;
            };
            output: {
                success: boolean;
                noteId: string;
            };
            meta: object;
        }>;
        updateAiAnalysis: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                noteId: string;
                summary?: string | undefined;
                topicTags?: string[] | undefined;
                keyInsights?: string[] | undefined;
                sentimentAnalysis?: any;
            };
            output: any;
            meta: object;
        }>;
        getByTopicTag: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                tag: string;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    dashboard: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        contactMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            output: {
                totalContacts: any;
                newContacts: any;
                journeyStageDistribution: any;
                recentActivity: any;
            };
            meta: object;
        }>;
        sessionMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            output: {
                totalSessions: any;
                sessionsInRange: any;
                sessionTypeDistribution: any;
                upcomingSessions: any;
                sessionTrend: {
                    date: any;
                    count: any;
                }[];
            };
            meta: object;
        }>;
        aiActionMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            output: {
                totalActions: any;
                actionsByStatus: any;
                actionsByType: any;
                recentActions: any;
                implementationRate: number;
            };
            meta: object;
        }>;
        summary: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                startDate?: string | undefined;
                endDate?: string | undefined;
            } | undefined;
            output: {
                totalContacts: any;
                totalSessions: any;
                totalAiActions: any;
                totalNotes: any;
                newContactsCount: any;
                upcomingSessionsCount: any;
                pendingActionsCount: any;
                dateRange: {
                    startDate: string;
                    endDate: string;
                };
            };
            meta: object;
        }>;
    }>>;
    tasks: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: true;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId?: string | null | undefined;
                view?: string | undefined;
                projectId?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                [x: string]: any;
                title?: unknown;
                notes?: unknown;
                status?: unknown;
                priority?: unknown;
                category?: unknown;
                dueDate?: unknown;
                completionDate?: unknown;
                contactId?: unknown;
                projectId?: unknown;
                headingId?: unknown;
                position?: unknown;
                is_repeating?: unknown;
            };
            output: any;
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                [x: string]: any;
                id?: unknown;
                title?: unknown;
                notes?: unknown;
                status?: unknown;
                priority?: unknown;
                category?: unknown;
                dueDate?: unknown;
                completionDate?: unknown;
                contactId?: unknown;
                projectId?: unknown;
                headingId?: unknown;
                position?: unknown;
                is_repeating?: unknown;
            };
            output: any;
            meta: object;
        }>;
        softDelete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        restore: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        complete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        reopen: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        cancel: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        updatePositions: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                position: number;
            }[];
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        moveToCategory: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                [x: string]: any;
                id?: unknown;
                category?: unknown;
            };
            output: any;
            meta: object;
        }>;
        moveToProject: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                projectId: string | null;
                headingId?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        setDueDate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                dueDate: string | null;
            };
            output: any;
            meta: object;
        }>;
        getCategoryCounts: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        getCategories: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: unknown[];
            meta: object;
        }>;
        getTasksByContactId: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId: string;
            };
            output: any;
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
