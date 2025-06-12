import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { TaskDependencyCreate, TaskDependencyModel } from '../models';
/**
 * Repository for task dependency-related database operations
 */
export declare class TaskDependenciesRepository {
    private supabase;
    constructor(supabase: ReturnType<typeof createClient<Database>>);
    /**
     * List all dependencies for a task
     * @param taskId The task ID
     * @returns Array of task dependencies
     */
    listDependenciesForTask(taskId: string): Promise<TaskDependencyModel[]>;
    /**
     * List all tasks that depend on a specific task
     * @param dependsOnTaskId The task ID that other tasks depend on
     * @returns Array of task dependencies
     */
    listTasksDependingOn(dependsOnTaskId: string): Promise<TaskDependencyModel[]>;
    /**
     * Get a task dependency by ID
     * @param id The task dependency ID
     * @returns The task dependency or null if not found
     */
    getById(id: string): Promise<TaskDependencyModel | null>;
    /**
     * Check if a dependency exists between two tasks
     * @param taskId The task ID
     * @param dependsOnTaskId The task ID that it depends on
     * @returns True if the dependency exists, false otherwise
     */
    dependencyExists(taskId: string, dependsOnTaskId: string): Promise<boolean>;
    /**
     * Create a new task dependency
     * @param dependency The task dependency data to create
     * @returns The created task dependency
     */
    create(dependency: TaskDependencyCreate): Promise<TaskDependencyModel>;
    /**
     * Delete a task dependency
     * @param id The task dependency ID to delete
     */
    delete(id: string): Promise<void>;
    /**
     * Delete a dependency between two tasks
     * @param taskId The task ID
     * @param dependsOnTaskId The task ID that it depends on
     */
    deleteDependency(taskId: string, dependsOnTaskId: string): Promise<void>;
    /**
     * Delete all dependencies for a task (both ways)
     * @param taskId The task ID
     */
    deleteAllForTask(taskId: string): Promise<void>;
    /**
     * Check if a task has any dependencies
     * @param taskId The task ID
     * @returns True if the task has dependencies, false otherwise
     */
    hasAnyDependencies(taskId: string): Promise<boolean>;
    /**
     * Check if any tasks depend on a specific task
     * @param taskId The task ID
     * @returns True if any tasks depend on this task, false otherwise
     */
    isADependencyForOthers(taskId: string): Promise<boolean>;
    /**
     * Get all task IDs that a task depends on
     * @param taskId The task ID
     * @returns Array of task IDs that the task depends on
     */
    getDependencyIds(taskId: string): Promise<string[]>;
    /**
     * Get all task IDs that depend on a specific task
     * @param taskId The task ID
     * @returns Array of task IDs that depend on the task
     */
    getDependentTaskIds(taskId: string): Promise<string[]>;
    /**
     * Check if creating a dependency would result in a circular dependency
     * @param taskId The task ID
     * @param dependsOnTaskId The task ID that it would depend on
     * @returns True if it would create a circular dependency, false otherwise
     */
    wouldCreateCircularDependency(taskId: string, dependsOnTaskId: string): Promise<boolean>;
    /**
     * Check if all dependencies for a task are completed
     * @param taskId The task ID
     * @returns True if all dependencies are completed, false otherwise
     */
    areAllDependenciesCompleted(taskId: string, tasksRepository: any): Promise<boolean>;
}
