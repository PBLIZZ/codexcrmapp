import { ProjectModel } from '../models';
/**
 * Repository for project-related database operations
 */
export class ProjectsRepository {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    /**
     * List all projects for a user
     * @param userId The user ID
     * @returns Array of projects
     */
    async list(userId) {
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
        return (data || []).map(project => ProjectModel.fromDatabase(project));
    }
    /**
     * Get a project by ID
     * @param id The project ID
     * @returns The project or null if not found
     */
    async getById(id) {
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching project by ID:', error);
            throw error;
        }
        return ProjectModel.fromDatabase(data);
    }
    /**
     * Create a new project
     * @param project The project data to create
     * @returns The created project
     */
    async create(project) {
        const projectModel = ProjectModel.create(project);
        const projectData = projectModel.getData();
        const { data, error } = await this.supabase
            .from('projects')
            .insert([projectData])
            .select()
            .single();
        if (error) {
            console.error('Error creating project:', error);
            throw error;
        }
        return ProjectModel.fromDatabase(data);
    }
    /**
     * Update a project
     * @param project The project data to update
     * @returns The updated project
     */
    async update(project) {
        const { data, error } = await this.supabase
            .from('projects')
            .update({ ...project, updated_at: new Date().toISOString() })
            .eq('id', project.id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error) {
            console.error('Error updating project:', error);
            throw error;
        }
        return ProjectModel.fromDatabase(data);
    }
    /**
     * Soft delete a project
     * @param id The project ID to delete
     */
    async softDelete(id) {
        const { error } = await this.supabase
            .from('projects')
            .update({
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .eq('id', id);
        if (error) {
            console.error('Error soft deleting project:', error);
            throw error;
        }
    }
    /**
     * Hard delete a project
     * @param id The project ID to delete
     */
    async delete(id) {
        const { error } = await this.supabase
            .from('projects')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }
    /**
     * Restore a soft-deleted project
     * @param id The project ID to restore
     * @returns The restored project
     */
    async restore(id) {
        const { data, error } = await this.supabase
            .from('projects')
            .update({
            deleted_at: null,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error restoring project:', error);
            throw error;
        }
        return ProjectModel.fromDatabase(data);
    }
    /**
     * Complete a project
     * @param id The project ID to complete
     * @returns The completed project
     */
    async complete(id) {
        const { data, error } = await this.supabase
            .from('projects')
            .update({
            is_completed: true,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error) {
            console.error('Error completing project:', error);
            throw error;
        }
        return ProjectModel.fromDatabase(data);
    }
    /**
     * Reopen a completed project
     * @param id The project ID to reopen
     * @returns The reopened project
     */
    async reopen(id) {
        const { data, error } = await this.supabase
            .from('projects')
            .update({
            is_completed: false,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error) {
            console.error('Error reopening project:', error);
            throw error;
        }
        return ProjectModel.fromDatabase(data);
    }
    /**
     * Get completed projects
     * @param userId The user ID
     * @returns Array of completed projects
     */
    async getCompleted(userId) {
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .eq('is_completed', true)
            .is('deleted_at', null)
            .order('updated_at', { ascending: false });
        if (error) {
            console.error('Error fetching completed projects:', error);
            throw error;
        }
        return (data || []).map(project => ProjectModel.fromDatabase(project));
    }
    /**
     * Get active (not completed) projects
     * @param userId The user ID
     * @returns Array of active projects
     */
    async getActive(userId) {
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .eq('is_completed', false)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching active projects:', error);
            throw error;
        }
        return (data || []).map(project => ProjectModel.fromDatabase(project));
    }
    /**
     * Get projects with due dates
     * @param userId The user ID
     * @returns Array of projects with due dates
     */
    async getWithDueDate(userId) {
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .not('due_date', 'is', null)
            .is('deleted_at', null)
            .order('due_date', { ascending: true });
        if (error) {
            console.error('Error fetching projects with due dates:', error);
            throw error;
        }
        return (data || []).map(project => ProjectModel.fromDatabase(project));
    }
    /**
     * Get projects due today
     * @param userId The user ID
     * @returns Array of projects due today
     */
    async getDueToday(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .gte('due_date', today.toISOString())
            .lt('due_date', tomorrow.toISOString())
            .eq('is_completed', false)
            .is('deleted_at', null)
            .order('due_date', { ascending: true });
        if (error) {
            console.error('Error fetching projects due today:', error);
            throw error;
        }
        return (data || []).map(project => ProjectModel.fromDatabase(project));
    }
    /**
     * Get projects due in the future (after today)
     * @param userId The user ID
     * @returns Array of projects due in the future
     */
    async getDueInFuture(userId) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .gte('due_date', tomorrow.toISOString())
            .eq('is_completed', false)
            .is('deleted_at', null)
            .order('due_date', { ascending: true });
        if (error) {
            console.error('Error fetching projects due in future:', error);
            throw error;
        }
        return (data || []).map(project => ProjectModel.fromDatabase(project));
    }
    /**
     * Get projects that are overdue
     * @param userId The user ID
     * @returns Array of overdue projects
     */
    async getOverdue(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .lt('due_date', today.toISOString())
            .eq('is_completed', false)
            .is('deleted_at', null)
            .order('due_date', { ascending: true });
        if (error) {
            console.error('Error fetching overdue projects:', error);
            throw error;
        }
        return (data || []).map(project => ProjectModel.fromDatabase(project));
    }
}
