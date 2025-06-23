import { z } from 'zod';
/**
 * Project model for the Things-like task management system
 * Projects can contain headings and tasks
 */
export declare const ProjectSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    due_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    archived: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    repeat_config: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    title: string;
    notes?: string | null | undefined;
    created_at?: string | undefined;
    status?: string | null | undefined;
    updated_at?: string | undefined;
    due_date?: string | null | undefined;
    archived?: boolean | null | undefined;
    completed_at?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
    deleted_at?: string | null | undefined;
}, {
    id: string;
    user_id: string;
    title: string;
    notes?: string | null | undefined;
    created_at?: string | undefined;
    status?: string | null | undefined;
    updated_at?: string | undefined;
    due_date?: string | null | undefined;
    archived?: boolean | null | undefined;
    completed_at?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
    deleted_at?: string | null | undefined;
}>;
export type Project = z.infer<typeof ProjectSchema>;
export declare const ProjectCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    due_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    archived: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    repeat_config: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "id" | "created_at" | "updated_at" | "deleted_at"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    title: string;
    id?: string | undefined;
    notes?: string | null | undefined;
    status?: string | null | undefined;
    due_date?: string | null | undefined;
    archived?: boolean | null | undefined;
    completed_at?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
}, {
    user_id: string;
    title: string;
    id?: string | undefined;
    notes?: string | null | undefined;
    status?: string | null | undefined;
    due_date?: string | null | undefined;
    archived?: boolean | null | undefined;
    completed_at?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
}>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export declare const ProjectUpdateSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    user_id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    due_date: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    archived: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    completed_at: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodAny>>>;
    repeat_config: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodAny>>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    notes?: string | null | undefined;
    status?: string | null | undefined;
    user_id?: string | undefined;
    title?: string | undefined;
    due_date?: string | null | undefined;
    archived?: boolean | null | undefined;
    completed_at?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
}, {
    id: string;
    notes?: string | null | undefined;
    status?: string | null | undefined;
    user_id?: string | undefined;
    title?: string | undefined;
    due_date?: string | null | undefined;
    archived?: boolean | null | undefined;
    completed_at?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
}>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
/**
 * Project class with validation and business logic
 */
export declare class ProjectModel {
    private data;
    constructor(data: Project);
    get id(): string;
    get title(): string;
    get notes(): string | null | undefined;
    get dueDate(): string | null | undefined;
    get archived(): boolean | null | undefined;
    get completedAt(): string | null | undefined;
    get metadata(): any | null | undefined;
    get repeatConfig(): any | null | undefined;
    get status(): string | null | undefined;
    get userId(): string;
    get createdAt(): string | undefined;
    get updatedAt(): string | undefined;
    get deletedAt(): string | null | undefined;
    getData(): Project;
    complete(): void;
    reopen(): void;
    archive(): void;
    unarchive(): void;
    softDelete(): void;
    restore(): void;
    update(data: Partial<ProjectUpdate>): void;
    static create(data: ProjectCreate): ProjectModel;
    static fromDatabase(data: Project): ProjectModel;
}
