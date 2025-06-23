import { z } from 'zod';
/**
 * Checklist model for the Things-like task management system
 * Checklists are subtasks within a task
 */
export declare const ChecklistSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    task_id: z.ZodString;
    position: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    task_id: string;
    user_id: string;
    title: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    position?: number | null | undefined;
    description?: string | null | undefined;
    deleted_at?: string | null | undefined;
}, {
    id: string;
    task_id: string;
    user_id: string;
    title: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    position?: number | null | undefined;
    description?: string | null | undefined;
    deleted_at?: string | null | undefined;
}>;
export type Checklist = z.infer<typeof ChecklistSchema>;
export declare const ChecklistCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    task_id: z.ZodString;
    position: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "id" | "created_at" | "updated_at" | "deleted_at"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    task_id: string;
    user_id: string;
    title: string;
    id?: string | undefined;
    position?: number | null | undefined;
    description?: string | null | undefined;
}, {
    task_id: string;
    user_id: string;
    title: string;
    id?: string | undefined;
    position?: number | null | undefined;
    description?: string | null | undefined;
}>;
export type ChecklistCreate = z.infer<typeof ChecklistCreateSchema>;
export declare const ChecklistUpdateSchema: z.ZodObject<{
    task_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    task_id?: string | undefined;
    user_id?: string | undefined;
    position?: number | null | undefined;
    title?: string | undefined;
    description?: string | null | undefined;
}, {
    id: string;
    task_id?: string | undefined;
    user_id?: string | undefined;
    position?: number | null | undefined;
    title?: string | undefined;
    description?: string | null | undefined;
}>;
export type ChecklistUpdate = z.infer<typeof ChecklistUpdateSchema>;
/**
 * Checklist class with validation and business logic
 */
export declare class ChecklistModel {
    private data;
    constructor(data: Checklist);
    get id(): string;
    get title(): string;
    get taskId(): string;
    get position(): number | null | undefined;
    get userId(): string;
    get createdAt(): string | undefined;
    get updatedAt(): string | undefined;
    get deletedAt(): string | null | undefined;
    getData(): Checklist;
    softDelete(): void;
    restore(): void;
    update(data: Partial<ChecklistUpdate>): void;
    setPosition(position: number): void;
    static create(data: ChecklistCreate): ChecklistModel;
    static fromDatabase(data: Checklist): ChecklistModel;
}
