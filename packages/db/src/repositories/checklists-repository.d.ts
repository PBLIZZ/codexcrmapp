import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { ChecklistCreate, ChecklistUpdate, ChecklistModel } from '../models';
/**
 * Repository for checklist-related database operations
 */
export declare class ChecklistsRepository {
    private supabase;
    constructor(supabase: ReturnType<typeof createClient<Database>>);
    /**
     * List all checklists for a task
     * @param taskId The task ID
     * @returns Array of checklists
     */
    listByTask(taskId: string): Promise<ChecklistModel[]>;
    /**
     * Get a checklist by ID
     * @param id The checklist ID
     * @returns The checklist or null if not found
     */
    getById(id: string): Promise<ChecklistModel | null>;
    /**
     * Create a new checklist
     * @param checklist The checklist data to create
     * @returns The created checklist
     */
    create(checklist: ChecklistCreate): Promise<ChecklistModel>;
    /**
     * Update a checklist
     * @param checklist The checklist data to update
     * @returns The updated checklist
     */
    update(checklist: ChecklistUpdate): Promise<ChecklistModel>;
    /**
     * Soft delete a checklist
     * @param id The checklist ID to delete
     */
    softDelete(id: string): Promise<void>;
    /**
     * Hard delete a checklist
     * @param id The checklist ID to delete
     */
    delete(id: string): Promise<void>;
    /**
     * Restore a soft-deleted checklist
     * @param id The checklist ID to restore
     * @returns The restored checklist
     */
    restore(id: string): Promise<ChecklistModel>;
    /**
     * Complete a checklist item
     * @param id The checklist ID to complete
     * @returns The completed checklist
     */
    complete(id: string): Promise<ChecklistModel>;
    /**
     * Reopen a completed checklist item
     * @param id The checklist ID to reopen
     * @returns The reopened checklist
     */
    reopen(id: string): Promise<ChecklistModel>;
    /**
     * Update positions of multiple checklists
     * @param checklists Array of checklist IDs and positions
     */
    updatePositions(checklists: {
        id: string;
        position: number;
    }[]): Promise<void>;
    /**
     * Get completed checklists for a task
     * @param taskId The task ID
     * @returns Array of completed checklists
     */
    getCompletedByTask(taskId: string): Promise<ChecklistModel[]>;
    /**
     * Get incomplete checklists for a task
     * @param taskId The task ID
     * @returns Array of incomplete checklists
     */
    getIncompleteByTask(taskId: string): Promise<ChecklistModel[]>;
    /**
     * Get completion percentage for a task
     * @param taskId The task ID
     * @returns Percentage of completed checklists (0-100)
     */
    getCompletionPercentage(taskId: string): Promise<number>;
}
