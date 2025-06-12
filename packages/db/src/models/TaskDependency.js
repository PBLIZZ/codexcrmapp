import { z } from 'zod';
/**
 * TaskDependency model for the Things-like task management system
 * Represents dependencies between tasks (one task depends on another)
 */
// Validation schema for TaskDependency
export const TaskDependencySchema = z.object({
    id: z.string().uuid(),
    task_id: z.string().uuid(),
    depends_on_task_id: z.string().uuid(),
    user_id: z.string().uuid(),
    created_at: z.string().datetime().optional(),
});
// Type for creating a new TaskDependency
export const TaskDependencyCreateSchema = TaskDependencySchema.omit({
    id: true,
    created_at: true,
}).extend({
    id: z.string().uuid().optional(),
});
/**
 * TaskDependency class with validation and business logic
 */
export class TaskDependencyModel {
    data;
    constructor(data) {
        // Validate data against schema
        this.data = TaskDependencySchema.parse(data);
    }
    // Getters
    get id() {
        return this.data.id;
    }
    get taskId() {
        return this.data.task_id;
    }
    get dependsOnTaskId() {
        return this.data.depends_on_task_id;
    }
    get userId() {
        return this.data.user_id;
    }
    get createdAt() {
        return this.data.created_at;
    }
    // Get full data
    getData() {
        return this.data;
    }
    // Static methods for creating task dependencies
    static create(data) {
        const now = new Date().toISOString();
        const taskDependencyData = {
            ...data,
            id: data.id || crypto.randomUUID(),
            created_at: now,
        };
        return new TaskDependencyModel(taskDependencyData);
    }
    static fromDatabase(data) {
        return new TaskDependencyModel(data);
    }
}
