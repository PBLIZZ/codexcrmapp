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
    is_completed: z.ZodDefault<z.ZodBoolean>;
    is_repeating: z.ZodDefault<z.ZodBoolean>;
    repeat_rule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    title: string;
    is_completed: boolean;
    is_repeating: boolean;
    notes?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    due_date?: string | null | undefined;
    repeat_rule?: string | null | undefined;
    deleted_at?: string | null | undefined;
}, {
    id: string;
    user_id: string;
    title: string;
    notes?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    due_date?: string | null | undefined;
    is_completed?: boolean | undefined;
    is_repeating?: boolean | undefined;
    repeat_rule?: string | null | undefined;
    deleted_at?: string | null | undefined;
}>;
export type Project = z.infer<typeof ProjectSchema>;
export declare const ProjectCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    due_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    is_completed: z.ZodDefault<z.ZodBoolean>;
    is_repeating: z.ZodDefault<z.ZodBoolean>;
    repeat_rule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "id" | "created_at" | "updated_at" | "deleted_at"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    title: string;
    is_completed: boolean;
    is_repeating: boolean;
    id?: string | undefined;
    notes?: string | null | undefined;
    due_date?: string | null | undefined;
    repeat_rule?: string | null | undefined;
}, {
    user_id: string;
    title: string;
    id?: string | undefined;
    notes?: string | null | undefined;
    due_date?: string | null | undefined;
    is_completed?: boolean | undefined;
    is_repeating?: boolean | undefined;
    repeat_rule?: string | null | undefined;
}>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export declare const ProjectUpdateSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    user_id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    due_date: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    is_completed: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    is_repeating: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    repeat_rule: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    notes?: string | null | undefined;
    user_id?: string | undefined;
    title?: string | undefined;
    due_date?: string | null | undefined;
    is_completed?: boolean | undefined;
    is_repeating?: boolean | undefined;
    repeat_rule?: string | null | undefined;
}, {
    id: string;
    notes?: string | null | undefined;
    user_id?: string | undefined;
    title?: string | undefined;
    due_date?: string | null | undefined;
    is_completed?: boolean | undefined;
    is_repeating?: boolean | undefined;
    repeat_rule?: string | null | undefined;
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
    get isCompleted(): boolean;
    get isRepeating(): boolean;
    get repeatRule(): string | null | undefined;
    get userId(): string;
    get createdAt(): string | undefined;
    get updatedAt(): string | undefined;
    get deletedAt(): string | null | undefined;
    getData(): Project;
    complete(): void;
    reopen(): void;
    softDelete(): void;
    restore(): void;
    update(data: Partial<ProjectUpdate>): void;
    static create(data: ProjectCreate): ProjectModel;
    static fromDatabase(data: Project): ProjectModel;
}
