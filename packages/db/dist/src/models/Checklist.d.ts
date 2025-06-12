import { z } from 'zod';
/**
 * Checklist model for the Things-like task management system
 * Checklists are subtasks within a task
 */
export declare const ChecklistSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    is_completed: z.ZodDefault<z.ZodBoolean>;
    task_id: z.ZodString;
    position: z.ZodNumber;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    is_completed: boolean;
    user_id: string;
    position: number;
    task_id: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    deleted_at?: string | null | undefined;
}, {
    id: string;
    title: string;
    user_id: string;
    position: number;
    task_id: string;
    is_completed?: boolean | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    deleted_at?: string | null | undefined;
}>;
export type Checklist = z.infer<typeof ChecklistSchema>;
export declare const ChecklistCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    is_completed: z.ZodDefault<z.ZodBoolean>;
    task_id: z.ZodString;
    position: z.ZodNumber;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "id" | "created_at" | "updated_at" | "deleted_at"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    is_completed: boolean;
    user_id: string;
    position: number;
    task_id: string;
    id?: string | undefined;
}, {
    title: string;
    user_id: string;
    position: number;
    task_id: string;
    id?: string | undefined;
    is_completed?: boolean | undefined;
}>;
export type ChecklistCreate = z.infer<typeof ChecklistCreateSchema>;
export declare const ChecklistUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    is_completed: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    user_id: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodNumber>;
    task_id: z.ZodOptional<z.ZodString>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title?: string | undefined;
    is_completed?: boolean | undefined;
    user_id?: string | undefined;
    position?: number | undefined;
    task_id?: string | undefined;
}, {
    id: string;
    title?: string | undefined;
    is_completed?: boolean | undefined;
    user_id?: string | undefined;
    position?: number | undefined;
    task_id?: string | undefined;
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
    get isCompleted(): boolean;
    get taskId(): string;
    get position(): number;
    get userId(): string;
    get createdAt(): string | undefined;
    get updatedAt(): string | undefined;
    get deletedAt(): string | null | undefined;
    getData(): Checklist;
    complete(): void;
    reopen(): void;
    softDelete(): void;
    restore(): void;
    update(data: Partial<ChecklistUpdate>): void;
    setPosition(position: number): void;
    static create(data: ChecklistCreate): ChecklistModel;
    static fromDatabase(data: Checklist): ChecklistModel;
}
