import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { HeadingCreate, HeadingUpdate, HeadingModel } from '../models';
/**
 * Repository for heading-related database operations
 */
export declare class HeadingsRepository {
    private supabase;
    constructor(supabase: ReturnType<typeof createClient<Database>>);
    /**
     * List all headings for a project
     * @param projectId The project ID
     * @returns Array of headings
     */
    listByProject(projectId: string): Promise<HeadingModel[]>;
    /**
     * Get a heading by ID
     * @param id The heading ID
     * @returns The heading or null if not found
     */
    getById(id: string): Promise<HeadingModel | null>;
    /**
     * Create a new heading
     * @param heading The heading data to create
     * @returns The created heading
     */
    create(heading: HeadingCreate): Promise<HeadingModel>;
    /**
     * Update a heading
     * @param heading The heading data to update
     * @returns The updated heading
     */
    update(heading: HeadingUpdate): Promise<HeadingModel>;
    /**
     * Soft delete a heading
     * @param id The heading ID to delete
     */
    softDelete(id: string): Promise<void>;
    /**
     * Hard delete a heading
     * @param id The heading ID to delete
     */
    delete(id: string): Promise<void>;
    /**
     * Restore a soft-deleted heading
     * @param id The heading ID to restore
     * @returns The restored heading
     */
    restore(id: string): Promise<HeadingModel>;
    /**
     * Update positions of multiple headings
     * @param headings Array of heading IDs and positions
     */
    updatePositions(headings: {
        id: string;
        position: number;
    }[]): Promise<void>;
    /**
     * Move a heading to a different project
     * @param id The heading ID to move
     * @param projectId The new project ID
     * @returns The updated heading
     */
    moveToProject(id: string, projectId: string): Promise<HeadingModel>;
}
