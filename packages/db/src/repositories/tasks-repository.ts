import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { 
  Task, 
  TaskCreate, 
  TaskUpdate, 
  TaskModel, 
  TaskCategory, 
  TaskStatus,
  TaskPriority 
} from '../models';

interface TaskFilters {
  view?: string;
  projectId?: string | null;
  contactId?: string | null;
}

/**
 * Repository for task-related database operations
 */
export class TasksRepository {
  private supabase: ReturnType<typeof createClient<Database>>;

  constructor(supabase: ReturnType<typeof createClient<Database>>) {
    this.supabase = supabase;
  }

  /**
   * List tasks for a user with optional filters.
   * @param userId The user ID.
   * @param filters Optional filters for the query.
   * @returns Array of tasks.
   */
  async list(userId: string, filters: TaskFilters = {}): Promise<TaskModel[]> {
    let query = this.supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null);

    const { view, projectId, contactId } = filters;

    if (contactId) {
      query = query.eq('contact_id', contactId);
    } else {
      switch (view) {
        case 'inbox':
          query = query.is('project_id', null).neq('status', TaskStatus.DONE);
          break;
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          query = query.gte('due_date', today.toISOString()).lt('due_date', tomorrow.toISOString());
          break;
        case 'upcoming':
          const nextDay = new Date();
          nextDay.setDate(nextDay.getDate() + 1);
          nextDay.setHours(0, 0, 0, 0);
          query = query.gte('due_date', nextDay.toISOString());
          break;
        case 'anytime':
          query = query.not('project_id', 'is', null).is('due_date', null);
          break;
        case 'someday':
           query = query.eq('priority', 'low');
          break;
        case 'logbook':
          query = query.eq('status', TaskStatus.DONE);
          break;
        case 'project':
          if (projectId) {
            query = query.eq('project_id', projectId);
          }
          break;
      }
    }

    const { data, error } = await query.order('position', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return (data || []).map(task => TaskModel.fromDatabase(task as Task));
  }

  /**
   * Get a task by ID
   * @param id The task ID
   * @returns The task or null if not found
   */
  async getById(id: string): Promise<TaskModel | null> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching task by ID:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Create a new task
   * @param task The task data to create
   * @returns The created task
   */
  async create(task: TaskCreate): Promise<TaskModel> {
    const taskModel = TaskModel.create(task);
    const taskData = taskModel.getData();

    const { data, error } = await this.supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Update a task
   * @param task The task data to update
   * @returns The updated task
   */
  async update(task: TaskUpdate): Promise<TaskModel> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ ...task, updated_at: new Date().toISOString() })
      .eq('id', task.id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Soft delete a task
   * @param id The task ID to delete
   */
  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tasks')
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error soft deleting task:', error);
      throw error;
    }
  }

  /**
   * Hard delete a task
   * @param id The task ID to delete
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Restore a soft-deleted task
   * @param id The task ID to restore
   * @returns The restored task
   */
  async restore(id: string): Promise<TaskModel> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ 
        deleted_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error restoring task:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Complete a task
   * @param id The task ID to complete
   * @returns The completed task
   */
  async complete(id: string): Promise<TaskModel> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ 
        status: TaskStatus.DONE,
        completion_date: new Date().toISOString(),
        category: TaskCategory.LOGBOOK,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error completing task:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Reopen a completed task
   * @param id The task ID to reopen
   * @returns The reopened task
   */
  async reopen(id: string): Promise<TaskModel> {
    const task = await this.getById(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    let category = TaskCategory.INBOX;
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        category = TaskCategory.TODAY;
      } else if (dueDate.getTime() === today.getTime()) {
        category = TaskCategory.TODAY;
      } else {
        category = TaskCategory.UPCOMING;
      }
    }

    const { data, error } = await this.supabase
      .from('tasks')
      .update({ 
        status: TaskStatus.TODO,
        completion_date: null,
        category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error reopening task:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Cancel a task
   * @param id The task ID to cancel
   * @returns The canceled task
   */
  async cancel(id: string): Promise<TaskModel> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ 
        status: TaskStatus.CANCELED,
        category: TaskCategory.LOGBOOK,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error canceling task:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Update positions of multiple tasks
   * @param tasks Array of task IDs and positions
   */
  async updatePositions(tasks: { id: string; position: number }[]): Promise<void> {
    const { error } = await this.supabase.rpc('update_task_positions', {
      task_positions: tasks
    });

    if (error) {
      console.error('Error updating task positions:', error);
      throw error;
    }
  }

  /**
   * Move a task to a different category
   * @param id The task ID to move
   * @param category The new category
   * @returns The updated task
   */
  async moveToCategory(id: string, category: TaskCategory): Promise<TaskModel> {
    let updateData: any = { 
      category,
      updated_at: new Date().toISOString()
    };

    if (category === TaskCategory.LOGBOOK) {
      updateData.status = TaskStatus.DONE;
      updateData.completion_date = new Date().toISOString();
    }
    
    if (category !== TaskCategory.LOGBOOK) {
      const task = await this.getById(id);
      if (task && task.status === TaskStatus.DONE) {
        updateData.status = TaskStatus.TODO;
        updateData.completion_date = null;
      }
    }

    const { data, error } = await this.supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error moving task to category:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Move a task to a different project and/or heading
   * @param id The task ID to move
   * @param projectId The new project ID (null for no project)
   * @param headingId The new heading ID (null for no heading)
   * @returns The updated task
   */
  async moveToProject(id: string, projectId: string | null, headingId: string | null = null): Promise<TaskModel> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ 
        project_id: projectId,
        heading_id: headingId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error moving task to project:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Set the due date for a task
   * @param id The task ID
   * @param dueDate The new due date
   * @returns The updated task
   */
  async setDueDate(id: string, dueDate: string | null): Promise<TaskModel> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({
        due_date: dueDate,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error setting due date:', error);
      throw error;
    }

    return TaskModel.fromDatabase(data as Task);
  }

  /**
   * Get tasks for a specific contact.
   * @param userId The user ID.
   * @param contactId The contact ID.
   * @returns Array of tasks for the contact.
   */
  async getTasksByContactId(userId: string, contactId: string): Promise<TaskModel[]> {
    return this.list(userId, { contactId });
  }

  /**
   * Get counts for each task category view.
   * @param userId The user ID.
   * @returns An object with counts for each category.
   */
  async getCategoryCounts(userId: string): Promise<Record<string, number>> {
    const { data, error } = await this.supabase.rpc('get_task_category_counts', { p_user_id: userId });
    if (error) {
      console.error('Error getting category counts, falling back:', error);
      return this.getCategoryCountsFallback(userId);
    }
    return data as Record<string, number>;
  }

  private async getCategoryCountsFallback(userId: string): Promise<Record<string, number>> {
    const views = ['inbox', 'today', 'upcoming', 'anytime', 'someday', 'logbook'];
    const counts: Record<string, number> = {};

    for (const view of views) {
      let query = this.supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('deleted_at', null);

      switch (view) {
        case 'inbox':
          query = query.is('project_id', null).neq('status', TaskStatus.DONE);
          break;
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          query = query.gte('due_date', today.toISOString()).lt('due_date', tomorrow.toISOString());
          break;
        case 'upcoming':
          const nextDay = new Date();
          nextDay.setDate(nextDay.getDate() + 1);
          nextDay.setHours(0, 0, 0, 0);
          query = query.gte('due_date', nextDay.toISOString());
          break;
        case 'anytime':
          query = query.not('project_id', 'is', null).is('due_date', null);
          break;
        case 'someday':
          query = query.eq('priority', 'low');
          break;
        case 'logbook':
          query = query.eq('status', TaskStatus.DONE);
          break;
      }
      const { count } = await query;
      counts[view] = count || 0;
    }

    return counts;
  }
}