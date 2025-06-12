import { z } from 'zod';
/**
 * TaskDependency model for the Things-like task management system
 * Represents dependencies between tasks (one task depends on another)
 */
export declare const TaskDependencySchema: z.ZodObject<{
    id: z.ZodString;
    task_id: z.ZodString;
    depends_on_task_id: z.ZodString;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    task_id: string;
    depends_on_task_id: string;
    created_at?: string | undefined;
}, {
    id: string;
    user_id: string;
    task_id: string;
    depends_on_task_id: string;
    created_at?: string | undefined;
}>;
export type TaskDependency = z.infer<typeof TaskDependencySchema>;
export declare const TaskDependencyCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    task_id: z.ZodString;
    depends_on_task_id: z.ZodString;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
}, "id" | "created_at"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    task_id: string;
    depends_on_task_id: string;
    id?: string | undefined;
}, {
    user_id: string;
    task_id: string;
    depends_on_task_id: string;
    id?: string | undefined;
}>;
export type TaskDependencyCreate = z.infer<typeof TaskDependencyCreateSchema>;
/**
 * TaskDependency class with validation and business logic
 */
export declare class TaskDependencyModel {
    private data;
    constructor(data: TaskDependency);
    get id(): string;
    get taskId(): string;
    get dependsOnTaskId(): string;
    get userId(): string;
    get createdAt(): string | undefined;
    getData(): TaskDependency;
    static create(data: TaskDependencyCreate): TaskDependencyModel;
    static fromDatabase(data: TaskDependency): TaskDependencyModel;
}
