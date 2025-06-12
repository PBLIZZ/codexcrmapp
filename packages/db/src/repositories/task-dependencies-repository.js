import { TaskDependencyModel } from '../models';
/**
 * Repository for task dependency-related database operations
 */
export class TaskDependenciesRepository {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    /**
     * List all dependencies for a task
     * @param taskId The task ID
     * @returns Array of task dependencies
     */
    async listDependenciesForTask(taskId) {
        const { data, error } = await this.supabase
            .from('task_dependencies')
            .select('*')
            .eq('task_id', taskId);
        if (error) {
            console.error('Error fetching task dependencies:', error);
            throw error;
        }
        return (data || []).map(dependency => TaskDependencyModel.fromDatabase(dependency));
    }
    /**
     * List all tasks that depend on a specific task
     * @param dependsOnTaskId The task ID that other tasks depend on
     * @returns Array of task dependencies
     */
    async listTasksDependingOn(dependsOnTaskId) {
        const { data, error } = await this.supabase
            .from('task_dependencies')
            .select('*')
            .eq('depends_on_task_id', dependsOnTaskId);
        if (error) {
            console.error('Error fetching tasks depending on task:', error);
            throw error;
        }
        return (data || []).map(dependency => TaskDependencyModel.fromDatabase(dependency));
    }
    /**
     * Get a task dependency by ID
     * @param id The task dependency ID
     * @returns The task dependency or null if not found
     */
    async getById(id) {
        const { data, error } = await this.supabase
            .from('task_dependencies')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching task dependency by ID:', error);
            throw error;
        }
        return TaskDependencyModel.fromDatabase(data);
    }
    /**
     * Check if a dependency exists between two tasks
     * @param taskId The task ID
     * @param dependsOnTaskId The task ID that it depends on
     * @returns True if the dependency exists, false otherwise
     */
    async dependencyExists(taskId, dependsOnTaskId) {
        const { data, error } = await this.supabase
            .from('task_dependencies')
            .select('id')
            .eq('task_id', taskId)
            .eq('depends_on_task_id', dependsOnTaskId)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return false;
            }
            console.error('Error checking task dependency existence:', error);
            throw error;
        }
        return !!data;
    }
    /**
     * Create a new task dependency
     * @param dependency The task dependency data to create
     * @returns The created task dependency
     */
    async create(dependency) {
        // Check for circular dependencies
        if (await this.wouldCreateCircularDependency(dependency.task_id, dependency.depends_on_task_id)) {
            throw new Error('Cannot create circular dependency');
        }
        // Check if dependency already exists
        if (await this.dependencyExists(dependency.task_id, dependency.depends_on_task_id)) {
            throw new Error('Dependency already exists');
        }
        const dependencyModel = TaskDependencyModel.create(dependency);
        const dependencyData = dependencyModel.getData();
        const { data, error } = await this.supabase
            .from('task_dependencies')
            .insert([dependencyData])
            .select()
            .single();
        if (error) {
            console.error('Error creating task dependency:', error);
            throw error;
        }
        return TaskDependencyModel.fromDatabase(data);
    }
    /**
     * Delete a task dependency
     * @param id The task dependency ID to delete
     */
    async delete(id) {
        const { error } = await this.supabase
            .from('task_dependencies')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting task dependency:', error);
            throw error;
        }
    }
    /**
     * Delete a dependency between two tasks
     * @param taskId The task ID
     * @param dependsOnTaskId The task ID that it depends on
     */
    async deleteDependency(taskId, dependsOnTaskId) {
        const { error } = await this.supabase
            .from('task_dependencies')
            .delete()
            .eq('task_id', taskId)
            .eq('depends_on_task_id', dependsOnTaskId);
        if (error) {
            console.error('Error deleting task dependency:', error);
            throw error;
        }
    }
    /**
     * Delete all dependencies for a task (both ways)
     * @param taskId The task ID
     */
    async deleteAllForTask(taskId) {
        // Delete dependencies where task depends on others
        const { error: error1 } = await this.supabase
            .from('task_dependencies')
            .delete()
            .eq('task_id', taskId);
        if (error1) {
            console.error('Error deleting task dependencies (as dependent):', error1);
            throw error1;
        }
        // Delete dependencies where others depend on this task
        const { error: error2 } = await this.supabase
            .from('task_dependencies')
            .delete()
            .eq('depends_on_task_id', taskId);
        if (error2) {
            console.error('Error deleting task dependencies (as dependency):', error2);
            throw error2;
        }
    }
    /**
     * Check if a task has any dependencies
     * @param taskId The task ID
     * @returns True if the task has dependencies, false otherwise
     */
    async hasAnyDependencies(taskId) {
        const { count, error } = await this.supabase
            .from('task_dependencies')
            .select('*', { count: 'exact', head: true })
            .eq('task_id', taskId);
        if (error) {
            console.error('Error checking if task has dependencies:', error);
            throw error;
        }
        return count !== null && count > 0;
    }
    /**
     * Check if any tasks depend on a specific task
     * @param taskId The task ID
     * @returns True if any tasks depend on this task, false otherwise
     */
    async isADependencyForOthers(taskId) {
        const { count, error } = await this.supabase
            .from('task_dependencies')
            .select('*', { count: 'exact', head: true })
            .eq('depends_on_task_id', taskId);
        if (error) {
            console.error('Error checking if task is a dependency for others:', error);
            throw error;
        }
        return count !== null && count > 0;
    }
    /**
     * Get all task IDs that a task depends on
     * @param taskId The task ID
     * @returns Array of task IDs that the task depends on
     */
    async getDependencyIds(taskId) {
        const { data, error } = await this.supabase
            .from('task_dependencies')
            .select('depends_on_task_id')
            .eq('task_id', taskId);
        if (error) {
            console.error('Error fetching dependency IDs:', error);
            throw error;
        }
        return (data || []).map(item => item.depends_on_task_id);
    }
    /**
     * Get all task IDs that depend on a specific task
     * @param taskId The task ID
     * @returns Array of task IDs that depend on the task
     */
    async getDependentTaskIds(taskId) {
        const { data, error } = await this.supabase
            .from('task_dependencies')
            .select('task_id')
            .eq('depends_on_task_id', taskId);
        if (error) {
            console.error('Error fetching dependent task IDs:', error);
            throw error;
        }
        return (data || []).map(item => item.task_id);
    }
    /**
     * Check if creating a dependency would result in a circular dependency
     * @param taskId The task ID
     * @param dependsOnTaskId The task ID that it would depend on
     * @returns True if it would create a circular dependency, false otherwise
     */
    async wouldCreateCircularDependency(taskId, dependsOnTaskId) {
        // If they're the same task, it's circular
        if (taskId === dependsOnTaskId) {
            return true;
        }
        // Check if the dependency target depends on the task (directly or indirectly)
        const visited = new Set();
        const toVisit = [dependsOnTaskId];
        while (toVisit.length > 0) {
            const currentTaskId = toVisit.pop();
            if (visited.has(currentTaskId)) {
                continue;
            }
            visited.add(currentTaskId);
            // If we find the original task in the dependency chain, it's circular
            if (currentTaskId === taskId) {
                return true;
            }
            // Add all dependencies of the current task to the queue
            const dependencies = await this.getDependencyIds(currentTaskId);
            toVisit.push(...dependencies);
        }
        return false;
    }
    /**
     * Check if all dependencies for a task are completed
     * @param taskId The task ID
     * @returns True if all dependencies are completed, false otherwise
     */
    async areAllDependenciesCompleted(taskId, tasksRepository) {
        const dependencyIds = await this.getDependencyIds(taskId);
        if (dependencyIds.length === 0) {
            return true;
        }
        for (const dependencyId of dependencyIds) {
            const task = await tasksRepository.getById(dependencyId);
            if (!task || task.status !== 'completed') {
                return false;
            }
        }
        return true;
    }
}
