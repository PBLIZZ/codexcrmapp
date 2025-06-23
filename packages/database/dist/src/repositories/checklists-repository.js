import { ChecklistModel, } from '../models';
/**
 * Repository for checklist-related database operations
 */
export class ChecklistsRepository {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    /**
     * List all checklists for a task
     * @param taskId The task ID
     * @returns Array of checklists
     */
    async listByTask(taskId) {
        const { data, error } = await this.supabase
            .from('checklists')
            .select('*')
            .eq('task_id', taskId)
            .is('deleted_at', null)
            .order('position', { ascending: true });
        if (error) {
            console.error('Error fetching checklists:', error);
            throw error;
        }
        return (data || []).map((checklist) => ChecklistModel.fromDatabase(checklist));
    }
    /**
     * Get a checklist by ID
     * @param id The checklist ID
     * @returns The checklist or null if not found
     */
    async getById(id) {
        const { data, error } = await this.supabase
            .from('checklists')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching checklist by ID:', error);
            throw error;
        }
        return ChecklistModel.fromDatabase(data);
    }
    /**
     * Create a new checklist
     * @param checklist The checklist data to create
     * @returns The created checklist
     */
    async create(checklist) {
        const checklistModel = ChecklistModel.create(checklist);
        const checklistData = checklistModel.getData();
        const { data, error } = await this.supabase
            .from('checklists')
            .insert([checklistData])
            .select()
            .single();
        if (error) {
            console.error('Error creating checklist:', error);
            throw error;
        }
        return ChecklistModel.fromDatabase(data);
    }
    /**
     * Update a checklist
     * @param checklist The checklist data to update
     * @returns The updated checklist
     */
    async update(checklist) {
        const { data, error } = await this.supabase
            .from('checklists')
            .update({ ...checklist, updated_at: new Date().toISOString() })
            .eq('id', checklist.id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error) {
            console.error('Error updating checklist:', error);
            throw error;
        }
        return ChecklistModel.fromDatabase(data);
    }
    /**
     * Soft delete a checklist
     * @param id The checklist ID to delete
     */
    async softDelete(id) {
        const { error } = await this.supabase
            .from('checklists')
            .update({
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .eq('id', id);
        if (error) {
            console.error('Error soft deleting checklist:', error);
            throw error;
        }
    }
    /**
     * Hard delete a checklist
     * @param id The checklist ID to delete
     */
    async delete(id) {
        const { error } = await this.supabase
            .from('checklists')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting checklist:', error);
            throw error;
        }
    }
    /**
     * Restore a soft-deleted checklist
     * @param id The checklist ID to restore
     * @returns The restored checklist
     */
    async restore(id) {
        const { data, error } = await this.supabase
            .from('checklists')
            .update({
            deleted_at: null,
            updated_at: new Date().toISOString(),
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error restoring checklist:', error);
            throw error;
        }
        return ChecklistModel.fromDatabase(data);
    }
    /**
     * Complete a checklist item
     * @param id The checklist ID to complete
     * @returns The completed checklist
     */
    async complete(id) {
        const { data, error } = await this.supabase
            .from('checklists')
            .update({
            completed: true,
            updated_at: new Date().toISOString(),
        })
            .eq('id', id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error) {
            console.error('Error completing checklist:', error);
            throw error;
        }
        return ChecklistModel.fromDatabase(data);
    }
    /**
     * Reopen a completed checklist item
     * @param id The checklist ID to reopen
     * @returns The reopened checklist
     */
    async reopen(id) {
        const { data, error } = await this.supabase
            .from('checklists')
            .update({
            completed: false,
            updated_at: new Date().toISOString(),
        })
            .eq('id', id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error) {
            console.error('Error reopening checklist:', error);
            throw error;
        }
        return ChecklistModel.fromDatabase(data);
    }
    /**
     * Update positions of multiple checklists
     * @param checklists Array of checklist IDs and positions
     */
    async updatePositions(checklists) {
        // Use a transaction to update all positions at once
        const { error } = await this.supabase.rpc('update_checklist_positions', {
            checklist_item_positions: checklists,
        });
        if (error) {
            console.error('Error updating checklist positions:', error);
            throw error;
        }
    }
    /**
     * Get completed checklists for a task
     * @param taskId The task ID
     * @returns Array of completed checklists
     */
    async getCompletedByTask(taskId) {
        const { data, error } = await this.supabase
            .from('checklists')
            .select('*')
            .eq('task_id', taskId)
            .eq('completed', true)
            .is('deleted_at', null)
            .order('position', { ascending: true });
        if (error) {
            console.error('Error fetching completed checklists:', error);
            throw error;
        }
        return (data || []).map((checklist) => ChecklistModel.fromDatabase(checklist));
    }
    /**
     * Get incomplete checklists for a task
     * @param taskId The task ID
     * @returns Array of incomplete checklists
     */
    async getIncompleteByTask(taskId) {
        const { data, error } = await this.supabase
            .from('checklists')
            .select('*')
            .eq('task_id', taskId)
            .eq('completed', false)
            .is('deleted_at', null)
            .order('position', { ascending: true });
        if (error) {
            console.error('Error fetching incomplete checklists:', error);
            throw error;
        }
        return (data || []).map((checklist) => ChecklistModel.fromDatabase(checklist));
    }
    /**
     * Get completion percentage for a task
     * @param taskId The task ID
     * @returns Percentage of completed checklists (0-100)
     */
    async getCompletionPercentage(taskId) {
        // First, get all checklist IDs associated with the task
        const { data: checklistIds, error: checklistError } = await this.supabase
            .from('checklists')
            .select('id')
            .eq('task_id', taskId)
            .is('deleted_at', null);
        if (checklistError) {
            console.error('Error fetching checklist IDs for completion percentage:', checklistError);
            throw checklistError;
        }
        if (!checklistIds || checklistIds.length === 0) {
            return 0; // No checklists for this task, so 0% completion
        }
        const ids = checklistIds.map((c) => c.id);
        // Now, get all checklist items for these checklists
        const { data: checklistItems, error: itemsError } = await this.supabase
            .from('checklist_items')
            .select('completed')
            .in('checklist_id', ids)
            .is('deleted_at', null); // Assuming checklist_items also have a deleted_at column, if not, remove this line
        if (itemsError) {
            console.error('Error fetching checklist items for completion percentage:', itemsError);
            throw itemsError;
        }
        if (!checklistItems || checklistItems.length === 0) {
            return 0; // No items in checklists, so 0% completion
        }
        const completedCount = checklistItems.filter((item) => item.completed).length;
        return Math.round((completedCount / checklistItems.length) * 100);
    }
}
