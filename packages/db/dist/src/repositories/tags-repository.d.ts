import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { TagCreate, TagUpdate, TagModel } from '../models';
/**
 * Repository for tag-related database operations
 */
export declare class TagsRepository {
    private supabase;
    constructor(supabase: ReturnType<typeof createClient<Database>>);
    /**
     * List all tags for a user
     * @param userId The user ID
     * @returns Array of tags
     */
    list(userId: string): Promise<TagModel[]>;
    /**
     * Get a tag by ID
     * @param id The tag ID
     * @returns The tag or null if not found
     */
    getById(id: string): Promise<TagModel | null>;
    /**
     * Get a tag by name
     * @param name The tag name
     * @param userId The user ID
     * @returns The tag or null if not found
     */
    getByName(name: string, userId: string): Promise<TagModel | null>;
    /**
     * Create a new tag
     * @param tag The tag data to create
     * @returns The created tag
     */
    create(tag: TagCreate): Promise<TagModel>;
    /**
     * Update a tag
     * @param tag The tag data to update
     * @returns The updated tag
     */
    update(tag: TagUpdate): Promise<TagModel>;
    /**
     * Soft delete a tag
     * @param id The tag ID to delete
     */
    softDelete(id: string): Promise<void>;
    /**
     * Hard delete a tag
     * @param id The tag ID to delete
     */
    delete(id: string): Promise<void>;
    /**
     * Restore a soft-deleted tag
     * @param id The tag ID to restore
     * @returns The restored tag
     */
    restore(id: string): Promise<TagModel>;
    /**
     * Get tags for a task
     * @param taskId The task ID
     * @returns Array of tags associated with the task
     */
    getForTask(taskId: string): Promise<TagModel[]>;
    /**
     * Get tags for a project
     * @param projectId The project ID
     * @returns Array of tags associated with the project
     */
    getForProject(projectId: string): Promise<TagModel[]>;
    /**
     * Add a tag to a task
     * @param taskId The task ID
     * @param tagId The tag ID
     * @param userId The user ID
     * @returns The created task tag relationship
     */
    addToTask(taskId: string, tagId: string, userId: string): Promise<void>;
    /**
     * Remove a tag from a task
     * @param taskId The task ID
     * @param tagId The tag ID
     */
    removeFromTask(taskId: string, tagId: string): Promise<void>;
    /**
     * Add a tag to a project
     * @param projectId The project ID
     * @param tagId The tag ID
     * @param userId The user ID
     * @returns The created project tag relationship
     */
    addToProject(projectId: string, tagId: string, userId: string): Promise<void>;
    /**
     * Remove a tag from a project
     * @param projectId The project ID
     * @param tagId The tag ID
     */
    removeFromProject(projectId: string, tagId: string): Promise<void>;
    /**
     * Get tasks with a specific tag
     * @param tagId The tag ID
     * @returns Array of task IDs with the tag
     */
    getTasksWithTag(tagId: string): Promise<string[]>;
    /**
     * Get projects with a specific tag
     * @param tagId The tag ID
     * @returns Array of project IDs with the tag
     */
    getProjectsWithTag(tagId: string): Promise<string[]>;
}
