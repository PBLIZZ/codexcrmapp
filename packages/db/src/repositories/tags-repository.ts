import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { Tag, TagCreate, TagUpdate, TagModel } from '../models';

/**
 * Repository for tag-related database operations
 */
export class TagsRepository {
  private supabase: ReturnType<typeof createClient<Database>>;

  constructor(supabase: ReturnType<typeof createClient<Database>>) {
    this.supabase = supabase;
  }

  /**
   * List all tags for a user
   * @param userId The user ID
   * @returns Array of tags
   */
  async list(userId: string): Promise<TagModel[]> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }

    return (data || []).map(tag => TagModel.fromDatabase(tag as Tag));
  }

  /**
   * Get a tag by ID
   * @param id The tag ID
   * @returns The tag or null if not found
   */
  async getById(id: string): Promise<TagModel | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching tag by ID:', error);
      throw error;
    }

    return TagModel.fromDatabase(data as Tag);
  }

  /**
   * Get a tag by name
   * @param name The tag name
   * @param userId The user ID
   * @returns The tag or null if not found
   */
  async getByName(name: string, userId: string): Promise<TagModel | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('name', name)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching tag by name:', error);
      throw error;
    }

    return TagModel.fromDatabase(data as Tag);
  }

  /**
   * Create a new tag
   * @param tag The tag data to create
   * @returns The created tag
   */
  async create(tag: TagCreate): Promise<TagModel> {
    const tagModel = TagModel.create(tag);
    const tagData = tagModel.getData();

    const { data, error } = await this.supabase
      .from('tags')
      .insert([tagData])
      .select()
      .single();

    if (error) {
      console.error('Error creating tag:', error);
      throw error;
    }

    return TagModel.fromDatabase(data as Tag);
  }

  /**
   * Update a tag
   * @param tag The tag data to update
   * @returns The updated tag
   */
  async update(tag: TagUpdate): Promise<TagModel> {
    const { data, error } = await this.supabase
      .from('tags')
      .update({ ...tag, updated_at: new Date().toISOString() })
      .eq('id', tag.id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error updating tag:', error);
      throw error;
    }

    return TagModel.fromDatabase(data as Tag);
  }

  /**
   * Soft delete a tag
   * @param id The tag ID to delete
   */
  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tags')
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error soft deleting tag:', error);
      throw error;
    }
  }

  /**
   * Hard delete a tag
   * @param id The tag ID to delete
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

  /**
   * Restore a soft-deleted tag
   * @param id The tag ID to restore
   * @returns The restored tag
   */
  async restore(id: string): Promise<TagModel> {
    const { data, error } = await this.supabase
      .from('tags')
      .update({ 
        deleted_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error restoring tag:', error);
      throw error;
    }

    return TagModel.fromDatabase(data as Tag);
  }

  /**
   * Get tags for a task
   * @param taskId The task ID
   * @returns Array of tags associated with the task
   */
  async getForTask(taskId: string): Promise<TagModel[]> {
    const { data, error } = await this.supabase
      .from('task_tags')
      .select('tag_id')
      .eq('task_id', taskId);

    if (error) {
      console.error(`Error fetching tag IDs for task ${taskId}:`, error);
      throw error;
    }

    const tagIds = (data || []).map(item => item.tag_id);
    if (tagIds.length === 0) {
      return [];
    }

    const { data: tags, error: tagsError } = await this.supabase
      .from('tags')
      .select('*')
      .in('id', tagIds)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (tagsError) {
      console.error(`Error fetching tags for task ${taskId}:`, tagsError);
      throw tagsError;
    }

    return (tags || []).map(tag => TagModel.fromDatabase(tag as Tag));
  }

  /**
   * Get tags for a project
   * @param projectId The project ID
   * @returns Array of tags associated with the project
   */
  async getForProject(projectId: string): Promise<TagModel[]> {
    const { data, error } = await this.supabase
      .from('project_tags')
      .select('tag_id')
      .eq('project_id', projectId);

    if (error) {
      console.error(`Error fetching tag IDs for project ${projectId}:`, error);
      throw error;
    }

    const tagIds = (data || []).map(item => item.tag_id);
    if (tagIds.length === 0) {
      return [];
    }

    const { data: tags, error: tagsError } = await this.supabase
      .from('tags')
      .select('*')
      .in('id', tagIds)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (tagsError) {
      console.error(`Error fetching tags for project ${projectId}:`, tagsError);
      throw tagsError;
    }

    return (tags || []).map(tag => TagModel.fromDatabase(tag as Tag));
  }

  /**
   * Add a tag to a task
   * @param taskId The task ID
   * @param tagId The tag ID
   * @param userId The user ID
   * @returns The created task tag relationship
   */
  async addToTask(taskId: string, tagId: string, userId: string): Promise<void> {
    // Check if the relationship already exists
    const { data: existingData, error: existingError } = await this.supabase
      .from('task_tags')
      .select('*')
      .eq('task_id', taskId)
      .eq('tag_id', tagId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing task tag:', existingError);
      throw existingError;
    }

    // If the relationship already exists, do nothing
    if (existingData) {
      return;
    }

    // Create the relationship
    const { error } = await this.supabase
      .from('task_tags')
      .insert([{
        id: crypto.randomUUID(),
        task_id: taskId,
        tag_id: tagId,
        user_id: userId,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error adding tag to task:', error);
      throw error;
    }
  }

  /**
   * Remove a tag from a task
   * @param taskId The task ID
   * @param tagId The tag ID
   */
  async removeFromTask(taskId: string, tagId: string): Promise<void> {
    const { error } = await this.supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag_id', tagId);

    if (error) {
      console.error('Error removing tag from task:', error);
      throw error;
    }
  }

  /**
   * Add a tag to a project
   * @param projectId The project ID
   * @param tagId The tag ID
   * @param userId The user ID
   * @returns The created project tag relationship
   */
  async addToProject(projectId: string, tagId: string, userId: string): Promise<void> {
    // Check if the relationship already exists
    const { data: existingData, error: existingError } = await this.supabase
      .from('project_tags')
      .select('*')
      .eq('project_id', projectId)
      .eq('tag_id', tagId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing project tag:', existingError);
      throw existingError;
    }

    // If the relationship already exists, do nothing
    if (existingData) {
      return;
    }

    // Create the relationship
    const { error } = await this.supabase
      .from('project_tags')
      .insert([{
        id: crypto.randomUUID(),
        project_id: projectId,
        tag_id: tagId,
        user_id: userId,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error adding tag to project:', error);
      throw error;
    }
  }

  /**
   * Remove a tag from a project
   * @param projectId The project ID
   * @param tagId The tag ID
   */
  async removeFromProject(projectId: string, tagId: string): Promise<void> {
    const { error } = await this.supabase
      .from('project_tags')
      .delete()
      .eq('project_id', projectId)
      .eq('tag_id', tagId);

    if (error) {
      console.error('Error removing tag from project:', error);
      throw error;
    }
  }

  /**
   * Get tasks with a specific tag
   * @param tagId The tag ID
   * @returns Array of task IDs with the tag
   */
  async getTasksWithTag(tagId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('task_tags')
      .select('task_id')
      .eq('tag_id', tagId);

    if (error) {
      console.error(`Error fetching tasks with tag ${tagId}:`, error);
      throw error;
    }

    return (data || []).map(item => item.task_id);
  }

  /**
   * Get projects with a specific tag
   * @param tagId The tag ID
   * @returns Array of project IDs with the tag
   */
  async getProjectsWithTag(tagId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('project_tags')
      .select('project_id')
      .eq('tag_id', tagId);

    if (error) {
      console.error(`Error fetching projects with tag ${tagId}:`, error);
      throw error;
    }

    return (data || []).map(item => item.project_id);
  }
}