import { z } from 'zod';
/**
 * TaskTag model for the Things-like task management system
 * Represents the many-to-many relationship between tasks and tags
 */
// Validation schema for TaskTag
export const TaskTagSchema = z.object({
    id: z.string().uuid(),
    task_id: z.string().uuid(),
    tag_id: z.string().uuid(),
    user_id: z.string().uuid(),
    created_at: z.string().datetime().optional(),
});
// Type for creating a new TaskTag
export const TaskTagCreateSchema = TaskTagSchema.omit({
    id: true,
    created_at: true,
}).extend({
    id: z.string().uuid().optional(),
});
/**
 * TaskTag class with validation and business logic
 */
export class TaskTagModel {
    data;
    constructor(data) {
        // Validate data against schema
        this.data = TaskTagSchema.parse(data);
    }
    // Getters
    get id() {
        return this.data.id;
    }
    get taskId() {
        return this.data.task_id;
    }
    get tagId() {
        return this.data.tag_id;
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
    // Static methods for creating task tags
    static create(data) {
        const now = new Date().toISOString();
        const taskTagData = {
            ...data,
            id: data.id || crypto.randomUUID(),
            created_at: now,
        };
        return new TaskTagModel(taskTagData);
    }
    static fromDatabase(data) {
        return new TaskTagModel(data);
    }
}
