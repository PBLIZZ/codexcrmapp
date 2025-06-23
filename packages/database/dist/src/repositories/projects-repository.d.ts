import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { ProjectCreate, ProjectUpdate, ProjectModel } from '../models';
/**
 * Repository for project-related database operations
 */
export declare class ProjectsRepository {
    private supabase;
    constructor(supabase: ReturnType<typeof createClient<Database>>);
    /**
     * List all projects for a user
     * @param userId The user ID
     * @returns Array of projects
     */
    list(userId: string): Promise<ProjectModel[]>;
    /**
     * Get a project by ID
     * @param id The project ID
     * @returns The project or null if not found
     */
    getById(id: string): Promise<ProjectModel | null>;
    /**
     * Create a new project
     * @param project The project data to create
     * @returns The created project
     */
    create(project: ProjectCreate): Promise<ProjectModel>;
    /**
     * Update a project
     * @param project The project data to update
     * @returns The updated project
     */
    update(project: ProjectUpdate): Promise<ProjectModel>;
    /**
     * Soft delete a project
     * @param id The project ID to delete
     */
    softDelete(id: string): Promise<void>;
    /**
     * Hard delete a project
     * @param id The project ID to delete
     */
    delete(id: string): Promise<void>;
    /**
     * Restore a soft-deleted project
     * @param id The project ID to restore
     * @returns The restored project
     */
    restore(id: string): Promise<ProjectModel>;
    /**
     * Complete a project
     * @param id The project ID to complete
     * @returns The completed project
     */
    complete(id: string): Promise<ProjectModel>;
    /**
     * Reopen a completed project
     * @param id The project ID to reopen
     * @returns The reopened project
     */
    reopen(id: string): Promise<ProjectModel>;
    /**
     * Get completed projects
     * @param userId The user ID
     * @returns Array of completed projects
     */
    getCompleted(userId: string): Promise<ProjectModel[]>;
    /**
     * Get active (not completed) projects
     * @param userId The user ID
     * @returns Array of active projects
     */
    getActive(userId: string): Promise<ProjectModel[]>;
    /**
     * Get projects with due dates
     * @param userId The user ID
     * @returns Array of projects with due dates
     */
    getWithDueDate(userId: string): Promise<ProjectModel[]>;
    /**
     * Get projects due today
     * @param userId The user ID
     * @returns Array of projects due today
     */
    getDueToday(userId: string): Promise<ProjectModel[]>;
    /**
     * Get projects due in the future (after today)
     * @param userId The user ID
     * @returns Array of projects due in the future
     */
    getDueInFuture(userId: string): Promise<ProjectModel[]>;
    /**
     * Get projects that are overdue
     * @param userId The user ID
     * @returns Array of overdue projects
     */
    getOverdue(userId: string): Promise<ProjectModel[]>;
}
