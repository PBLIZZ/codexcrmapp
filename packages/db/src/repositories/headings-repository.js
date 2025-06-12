import { HeadingModel } from '../models';
/**
 * Repository for heading-related database operations
 */
export class HeadingsRepository {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    /**
     * List all headings for a project
     * @param projectId The project ID
     * @returns Array of headings
     */
    async listByProject(projectId) {
        const { data, error } = await this.supabase
            .from('headings')
            .select('*')
            .eq('project_id', projectId)
            .is('deleted_at', null)
            .order('position', { ascending: true });
        if (error) {
            console.error('Error fetching headings:', error);
            throw error;
        }
        return (data || []).map(heading => HeadingModel.fromDatabase(heading));
    }
    /**
     * Get a heading by ID
     * @param id The heading ID
     * @returns The heading or null if not found
     */
    async getById(id) {
        const { data, error } = await this.supabase
            .from('headings')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching heading by ID:', error);
            throw error;
        }
        return HeadingModel.fromDatabase(data);
    }
    /**
     * Create a new heading
     * @param heading The heading data to create
     * @returns The created heading
     */
    async create(heading) {
        const headingModel = HeadingModel.create(heading);
        const headingData = headingModel.getData();
        const { data, error } = await this.supabase
            .from('headings')
            .insert([headingData])
            .select()
            .single();
        if (error) {
            console.error('Error creating heading:', error);
            throw error;
        }
        return HeadingModel.fromDatabase(data);
    }
    /**
     * Update a heading
     * @param heading The heading data to update
     * @returns The updated heading
     */
    async update(heading) {
        const { data, error } = await this.supabase
            .from('headings')
            .update({ ...heading, updated_at: new Date().toISOString() })
            .eq('id', heading.id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error) {
            console.error('Error updating heading:', error);
            throw error;
        }
        return HeadingModel.fromDatabase(data);
    }
    /**
     * Soft delete a heading
     * @param id The heading ID to delete
     */
    async softDelete(id) {
        const { error } = await this.supabase
            .from('headings')
            .update({
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .eq('id', id);
        if (error) {
            console.error('Error soft deleting heading:', error);
            throw error;
        }
    }
    /**
     * Hard delete a heading
     * @param id The heading ID to delete
     */
    async delete(id) {
        const { error } = await this.supabase
            .from('headings')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting heading:', error);
            throw error;
        }
    }
    /**
     * Restore a soft-deleted heading
     * @param id The heading ID to restore
     * @returns The restored heading
     */
    async restore(id) {
        const { data, error } = await this.supabase
            .from('headings')
            .update({
            deleted_at: null,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error restoring heading:', error);
            throw error;
        }
        return HeadingModel.fromDatabase(data);
    }
    /**
     * Update positions of multiple headings
     * @param headings Array of heading IDs and positions
     */
    async updatePositions(headings) {
        // Use a transaction to update all positions at once
        const { error } = await this.supabase.rpc('update_heading_positions', {
            heading_positions: headings
        });
        if (error) {
            console.error('Error updating heading positions:', error);
            throw error;
        }
    }
    /**
     * Move a heading to a different project
     * @param id The heading ID to move
     * @param projectId The new project ID
     * @returns The updated heading
     */
    async moveToProject(id, projectId) {
        const { data, error } = await this.supabase
            .from('headings')
            .update({
            project_id: projectId,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error) {
            console.error('Error moving heading to project:', error);
            throw error;
        }
        return HeadingModel.fromDatabase(data);
    }
}
