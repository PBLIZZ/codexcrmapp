import { z } from 'zod';
/**
 * TaskTag model for the Things-like task management system
 * Represents the many-to-many relationship between tasks and tags
 */
export declare const TaskTagSchema: z.ZodObject<{
    id: z.ZodString;
    task_id: z.ZodString;
    tag_id: z.ZodString;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    task_id: string;
    tag_id: string;
    created_at?: string | undefined;
}, {
    id: string;
    user_id: string;
    task_id: string;
    tag_id: string;
    created_at?: string | undefined;
}>;
export type TaskTag = z.infer<typeof TaskTagSchema>;
export declare const TaskTagCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    task_id: z.ZodString;
    tag_id: z.ZodString;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
}, "id" | "created_at"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    task_id: string;
    tag_id: string;
    id?: string | undefined;
}, {
    user_id: string;
    task_id: string;
    tag_id: string;
    id?: string | undefined;
}>;
export type TaskTagCreate = z.infer<typeof TaskTagCreateSchema>;
/**
 * TaskTag class with validation and business logic
 */
export declare class TaskTagModel {
    private data;
    constructor(data: TaskTag);
    get id(): string;
    get taskId(): string;
    get tagId(): string;
    get userId(): string;
    get createdAt(): string | undefined;
    getData(): TaskTag;
    static create(data: TaskTagCreate): TaskTagModel;
    static fromDatabase(data: TaskTag): TaskTagModel;
}
