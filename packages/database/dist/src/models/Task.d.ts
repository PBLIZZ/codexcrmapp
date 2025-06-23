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
    is_checklist_item: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    parent_task_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    project_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    repeat_config: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
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
    position: number;
    title: string;
    category: TaskCategory;
    contact_id?: string | null | undefined;
    project_id?: string | null | undefined;
    heading_id?: string | null | undefined;
    parent_task_id?: string | null | undefined;
    notes?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    due_date?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
    is_checklist_item?: boolean | null | undefined;
    deleted_at?: string | null | undefined;
    completion_date?: string | null | undefined;
}, {
    id: string;
    user_id: string;
    position: number;
    title: string;
    contact_id?: string | null | undefined;
    project_id?: string | null | undefined;
    heading_id?: string | null | undefined;
    parent_task_id?: string | null | undefined;
    notes?: string | null | undefined;
    created_at?: string | undefined;
    priority?: TaskPriority | undefined;
    status?: TaskStatus | undefined;
    updated_at?: string | undefined;
    due_date?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
    category?: TaskCategory | undefined;
    is_checklist_item?: boolean | null | undefined;
    deleted_at?: string | null | undefined;
    completion_date?: string | null | undefined;
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
    is_checklist_item: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    parent_task_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    project_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    repeat_config: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
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
    position: number;
    title: string;
    category: TaskCategory;
    contact_id?: string | null | undefined;
    id?: string | undefined;
    project_id?: string | null | undefined;
    heading_id?: string | null | undefined;
    parent_task_id?: string | null | undefined;
    notes?: string | null | undefined;
    due_date?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
    is_checklist_item?: boolean | null | undefined;
}, {
    user_id: string;
    position: number;
    title: string;
    contact_id?: string | null | undefined;
    id?: string | undefined;
    project_id?: string | null | undefined;
    heading_id?: string | null | undefined;
    parent_task_id?: string | null | undefined;
    notes?: string | null | undefined;
    priority?: TaskPriority | undefined;
    status?: TaskStatus | undefined;
    due_date?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
    category?: TaskCategory | undefined;
    is_checklist_item?: boolean | null | undefined;
}>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export declare const TaskUpdateSchema: z.ZodObject<{
    contact_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    project_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    heading_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    parent_task_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TaskPriority>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TaskStatus>>>;
    user_id: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    due_date: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodAny>>>;
    repeat_config: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodAny>>>;
    category: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TaskCategory>>>;
    is_checklist_item: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    contact_id?: string | null | undefined;
    project_id?: string | null | undefined;
    heading_id?: string | null | undefined;
    parent_task_id?: string | null | undefined;
    notes?: string | null | undefined;
    priority?: TaskPriority | undefined;
    status?: TaskStatus | undefined;
    user_id?: string | undefined;
    position?: number | undefined;
    title?: string | undefined;
    due_date?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
    category?: TaskCategory | undefined;
    is_checklist_item?: boolean | null | undefined;
}, {
    id: string;
    contact_id?: string | null | undefined;
    project_id?: string | null | undefined;
    heading_id?: string | null | undefined;
    parent_task_id?: string | null | undefined;
    notes?: string | null | undefined;
    priority?: TaskPriority | undefined;
    status?: TaskStatus | undefined;
    user_id?: string | undefined;
    position?: number | undefined;
    title?: string | undefined;
    due_date?: string | null | undefined;
    metadata?: any;
    repeat_config?: any;
    category?: TaskCategory | undefined;
    is_checklist_item?: boolean | null | undefined;
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
    get isChecklistItem(): boolean | null | undefined;
    get metadata(): any | null | undefined;
    get parentTaskId(): string | null | undefined;
    get repeatConfig(): any | null | undefined;
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
    setPriority(priority: TaskPriority): void;
    static create(data: TaskCreate): TaskModel;
    static fromDatabase(data: Task): TaskModel;
}
