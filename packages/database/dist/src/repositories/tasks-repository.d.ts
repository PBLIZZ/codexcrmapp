import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { TaskCreate, TaskUpdate, TaskModel, TaskCategory } from '../models';
interface TaskFilters {
    view?: string;
    projectId?: string | null;
    contactId?: string | null;
}
/**
 * Repository for task-related database operations
 */
export declare class TasksRepository {
    private supabase;
    constructor(supabase: ReturnType<typeof createClient<Database>>);
    /**
     * List tasks for a user with optional filters.
     * @param userId The user ID.
     * @param filters Optional filters for the query.
     * @returns Array of tasks.
     */
    list(userId: string, filters?: TaskFilters): Promise<TaskModel[]>;
    /**
     * Get a task by ID
     * @param id The task ID
     * @returns The task or null if not found
     */
    getById(id: string): Promise<TaskModel | null>;
    /**
     * Create a new task
     * @param task The task data to create
     * @returns The created task
     */
    create(task: TaskCreate): Promise<TaskModel>;
    /**
     * Update a task
     * @param task The task data to update
     * @returns The updated task
     */
    update(task: TaskUpdate): Promise<TaskModel>;
    /**
     * Soft delete a task
     * @param id The task ID to delete
     */
    softDelete(id: string): Promise<void>;
    /**
     * Hard delete a task
     * @param id The task ID to delete
     */
    delete(id: string): Promise<void>;
    /**
     * Restore a soft-deleted task
     * @param id The task ID to restore
     * @returns The restored task
     */
    restore(id: string): Promise<TaskModel>;
    /**
     * Complete a task
     * @param id The task ID to complete
     * @returns The completed task
     */
    complete(id: string): Promise<TaskModel>;
    /**
     * Reopen a completed task
     * @param id The task ID to reopen
     * @returns The reopened task
     */
    reopen(id: string): Promise<TaskModel>;
    /**
     * Cancel a task
     * @param id The task ID to cancel
     * @returns The canceled task
     */
    cancel(id: string): Promise<TaskModel>;
    /**
     * Update positions of multiple tasks
     * @param tasks Array of task IDs and positions
     */
    updatePositions(tasks: {
        id: string;
        position: number;
    }[]): Promise<void>;
    /**
     * Move a task to a different category
     * @param id The task ID to move
     * @param category The new category
     * @returns The updated task
     */
    moveToCategory(id: string, category: TaskCategory): Promise<TaskModel>;
    /**
     * Move a task to a different project and/or heading
     * @param id The task ID to move
     * @param projectId The new project ID (null for no project)
     * @param headingId The new heading ID (null for no heading)
     * @returns The updated task
     */
    moveToProject(id: string, projectId: string | null, headingId?: string | null): Promise<TaskModel>;
    /**
     * Set the due date for a task
     * @param id The task ID
     * @param dueDate The new due date
     * @returns The updated task
     */
    setDueDate(id: string, dueDate: string | null): Promise<TaskModel>;
    /**
     * Get tasks for a specific contact.
     * @param userId The user ID.
     * @param contactId The contact ID.
     * @returns Array of tasks for the contact.
     */
    getTasksByContactId(userId: string, contactId: string): Promise<TaskModel[]>;
    /**
     * Get counts for each task category view.
     * @param userId The user ID.
     * @returns An object with counts for each category.
     */
    getCategoryCounts(userId: string): Promise<Record<string, number>>;
    private getCategoryCountsFallback;
}
export {};
