import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { Checklist, ChecklistCreate, ChecklistUpdate, ChecklistModel } from '../models';

/**
 * Repository for checklist-related database operations
 */
export class ChecklistsRepository {
  private supabase: ReturnType<typeof createClient<Database>>;

  constructor(supabase: ReturnType<typeof createClient<Database>>) {
    this.supabase = supabase;
  }

  /**
   * List all checklists for a task
   * @param taskId The task ID
   * @returns Array of checklists
   */
  async listByTask(taskId: string): Promise<ChecklistModel[]> {
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

    return (data || []).map(checklist => ChecklistModel.fromDatabase(checklist as Checklist));
  }

  /**
   * Get a checklist by ID
   * @param id The checklist ID
   * @returns The checklist or null if not found
   */
  async getById(id: string): Promise<ChecklistModel | null> {
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

    return ChecklistModel.fromDatabase(data as Checklist);
  }

  /**
   * Create a new checklist
   * @param checklist The checklist data to create
   * @returns The created checklist
   */
  async create(checklist: ChecklistCreate): Promise<ChecklistModel> {
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

    return ChecklistModel.fromDatabase(data as Checklist);
  }

  /**
   * Update a checklist
   * @param checklist The checklist data to update
   * @returns The updated checklist
   */
  async update(checklist: ChecklistUpdate): Promise<ChecklistModel> {
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

    return ChecklistModel.fromDatabase(data as Checklist);
  }

  /**
   * Soft delete a checklist
   * @param id The checklist ID to delete
   */
  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('checklists')
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
  async delete(id: string): Promise<void> {
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
  async restore(id: string): Promise<ChecklistModel> {
    const { data, error } = await this.supabase
      .from('checklists')
      .update({ 
        deleted_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error restoring checklist:', error);
      throw error;
    }

    return ChecklistModel.fromDatabase(data as Checklist);
  }

  /**
   * Complete a checklist item
   * @param id The checklist ID to complete
   * @returns The completed checklist
   */
  async complete(id: string): Promise<ChecklistModel> {
    const { data, error } = await this.supabase
      .from('checklists')
      .update({ 
        is_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error completing checklist:', error);
      throw error;
    }

    return ChecklistModel.fromDatabase(data as Checklist);
  }

  /**
   * Reopen a completed checklist item
   * @param id The checklist ID to reopen
   * @returns The reopened checklist
   */
  async reopen(id: string): Promise<ChecklistModel> {
    const { data, error } = await this.supabase
      .from('checklists')
      .update({ 
        is_completed: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error reopening checklist:', error);
      throw error;
    }

    return ChecklistModel.fromDatabase(data as Checklist);
  }

  /**
   * Update positions of multiple checklists
   * @param checklists Array of checklist IDs and positions
   */
  async updatePositions(checklists: { id: string; position: number }[]): Promise<void> {
    // Use a transaction to update all positions at once
    const { error } = await this.supabase.rpc('update_checklist_positions', {
      checklist_positions: checklists
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
  async getCompletedByTask(taskId: string): Promise<ChecklistModel[]> {
    const { data, error } = await this.supabase
      .from('checklists')
      .select('*')
      .eq('task_id', taskId)
      .eq('is_completed', true)
      .is('deleted_at', null)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching completed checklists:', error);
      throw error;
    }

    return (data || []).map(checklist => ChecklistModel.fromDatabase(checklist as Checklist));
  }

  /**
   * Get incomplete checklists for a task
   * @param taskId The task ID
   * @returns Array of incomplete checklists
   */
  async getIncompleteByTask(taskId: string): Promise<ChecklistModel[]> {
    const { data, error } = await this.supabase
      .from('checklists')
      .select('*')
      .eq('task_id', taskId)
      .eq('is_completed', false)
      .is('deleted_at', null)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching incomplete checklists:', error);
      throw error;
    }

    return (data || []).map(checklist => ChecklistModel.fromDatabase(checklist as Checklist));
  }

  /**
   * Get completion percentage for a task
   * @param taskId The task ID
   * @returns Percentage of completed checklists (0-100)
   */
  async getCompletionPercentage(taskId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('checklists')
      .select('is_completed')
      .eq('task_id', taskId)
      .is('deleted_at', null);

    if (error) {
      console.error('Error fetching checklists for completion percentage:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return 0;
    }

    const completedCount = data.filter(item => item.is_completed).length;
    return Math.round((completedCount / data.length) * 100);
  }
}