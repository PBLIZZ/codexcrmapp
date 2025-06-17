import { z } from 'zod';
/**
 * Task model for the Things-like task management system
 * Tasks can be standalone or belong to projects under headings
 */
export declare enum TaskCategory {
    INBOX = "inbox",
    TODAY = "today",
    UPCOMING = "upcoming",
    ANYTIME = "anytime",
    SOMEDAY = "someday",
    LOGBOOK = "logbook"
}
export declare enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in-progress",
    DONE = "done",
    CANCELED = "canceled"
}
export declare enum TaskPriority {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    NONE = "none"
}
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof TaskStatus>>;
    priority: z.ZodDefault<z.ZodNativeEnum<typeof TaskPriority>>;
    category: z.ZodDefault<z.ZodNativeEnum<typeof TaskCategory>>;
    due_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    completion_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    is_repeating: z.ZodDefault<z.ZodBoolean>;
    repeat_rule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    project_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    heading_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    position: z.ZodNumber;
    user_id: z.ZodString;
    contact_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    priority: TaskPriority;
    status: TaskStatus;
    user_id: string;
    title: string;
    is_repeating: boolean;
    position: number;
    category: TaskCategory;
    notes?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    contact_id?: string | null | undefined;
    due_date?: string | null | undefined;
    repeat_rule?: string | null | undefined;
    deleted_at?: string | null | undefined;
    project_id?: string | null | undefined;
    completion_date?: string | null | undefined;
    heading_id?: string | null | undefined;
}, {
    id: string;
    user_id: string;
    title: string;
    position: number;
    priority?: TaskPriority | undefined;
    status?: TaskStatus | undefined;
    notes?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    contact_id?: string | null | undefined;
    due_date?: string | null | undefined;
    is_repeating?: boolean | undefined;
    repeat_rule?: string | null | undefined;
    deleted_at?: string | null | undefined;
    project_id?: string | null | undefined;
    category?: TaskCategory | undefined;
    completion_date?: string | null | undefined;
    heading_id?: string | null | undefined;
}>;
export type Task = z.infer<typeof TaskSchema>;
export declare const TaskCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof TaskStatus>>;
    priority: z.ZodDefault<z.ZodNativeEnum<typeof TaskPriority>>;
    category: z.ZodDefault<z.ZodNativeEnum<typeof TaskCategory>>;
    due_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    completion_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    is_repeating: z.ZodDefault<z.ZodBoolean>;
    repeat_rule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    project_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    heading_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    position: z.ZodNumber;
    user_id: z.ZodString;
    contact_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "id" | "created_at" | "updated_at" | "deleted_at" | "completion_date"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    priority: TaskPriority;
    status: TaskStatus;
    user_id: string;
    title: string;
    is_repeating: boolean;
    position: number;
    category: TaskCategory;
    id?: string | undefined;
    notes?: string | null | undefined;
    contact_id?: string | null | undefined;
    due_date?: string | null | undefined;
    repeat_rule?: string | null | undefined;
    project_id?: string | null | undefined;
    heading_id?: string | null | undefined;
}, {
    user_id: string;
    title: string;
    position: number;
    id?: string | undefined;
    priority?: TaskPriority | undefined;
    status?: TaskStatus | undefined;
    notes?: string | null | undefined;
    contact_id?: string | null | undefined;
    due_date?: string | null | undefined;
    is_repeating?: boolean | undefined;
    repeat_rule?: string | null | undefined;
    project_id?: string | null | undefined;
    category?: TaskCategory | undefined;
    heading_id?: string | null | undefined;
}>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export declare const TaskUpdateSchema: z.ZodObject<{
    priority: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TaskPriority>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TaskStatus>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    user_id: z.ZodOptional<z.ZodString>;
    contact_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    title: z.ZodOptional<z.ZodString>;
    due_date: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    is_repeating: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    repeat_rule: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    project_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    position: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TaskCategory>>>;
    heading_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    priority?: TaskPriority | undefined;
    status?: TaskStatus | undefined;
    notes?: string | null | undefined;
    user_id?: string | undefined;
    contact_id?: string | null | undefined;
    title?: string | undefined;
    due_date?: string | null | undefined;
    is_repeating?: boolean | undefined;
    repeat_rule?: string | null | undefined;
    project_id?: string | null | undefined;
    position?: number | undefined;
    category?: TaskCategory | undefined;
    heading_id?: string | null | undefined;
}, {
    id: string;
    priority?: TaskPriority | undefined;
    status?: TaskStatus | undefined;
    notes?: string | null | undefined;
    user_id?: string | undefined;
    contact_id?: string | null | undefined;
    title?: string | undefined;
    due_date?: string | null | undefined;
    is_repeating?: boolean | undefined;
    repeat_rule?: string | null | undefined;
    project_id?: string | null | undefined;
    position?: number | undefined;
    category?: TaskCategory | undefined;
    heading_id?: string | null | undefined;
}>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
/**
 * Task class with validation and business logic
 */
export declare class TaskModel {
    private data;
    constructor(data: Task);
    get id(): string;
    get title(): string;
    get notes(): string | null | undefined;
    get status(): TaskStatus;
    get priority(): TaskPriority;
    get category(): TaskCategory;
    get dueDate(): string | null | undefined;
    get completionDate(): string | null | undefined;
    get isRepeating(): boolean;
    get repeatRule(): string | null | undefined;
    get projectId(): string | null | undefined;
    get headingId(): string | null | undefined;
    get position(): number;
    get userId(): string;
    get contactId(): string | null | undefined;
    get createdAt(): string | undefined;
    get updatedAt(): string | undefined;
    get deletedAt(): string | null | undefined;
    getData(): Task;
    complete(): void;
    reopen(): void;
    cancel(): void;
    softDelete(): void;
    restore(): void;
    update(data: Partial<TaskUpdate>): void;
    setPosition(position: number): void;
    moveToCategory(category: TaskCategory): void;
    moveToProject(projectId: string | null, headingId?: string | null): void;
    setDueDate(dueDate: string | null): void;
    setDueDateAndMoveCategory(dueDate: string | null): void;
    setPriority(priority: TaskPriority): void;
    static create(data: TaskCreate): TaskModel;
    static fromDatabase(data: Task): TaskModel;
}
