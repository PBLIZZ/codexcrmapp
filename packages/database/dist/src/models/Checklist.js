import { z } from 'zod';
/**
 * Checklist model for the Things-like task management system
 * Checklists are subtasks within a task
 */
// Validation schema for Checklist
export const ChecklistSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().nullable().optional(),
    task_id: z.string().uuid(),
    position: z.number().int().nonnegative().nullable().optional(),
    user_id: z.string().uuid(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    deleted_at: z.string().datetime().nullable().optional(),
});
// Type for creating a new Checklist
export const ChecklistCreateSchema = ChecklistSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
}).extend({
    id: z.string().uuid().optional(),
});
// Type for updating a Checklist
export const ChecklistUpdateSchema = ChecklistCreateSchema.partial().extend({
    id: z.string().uuid(),
});
/**
 * Checklist class with validation and business logic
 */
export class ChecklistModel {
    data;
    constructor(data) {
        // Validate data against schema
        this.data = ChecklistSchema.parse(data);
    }
    // Getters
    get id() {
        return this.data.id;
    }
    get title() {
        return this.data.title;
    }
    get taskId() {
        return this.data.task_id;
    }
    get position() {
        return this.data.position;
    }
    get userId() {
        return this.data.user_id;
    }
    get createdAt() {
        return this.data.created_at;
    }
    get updatedAt() {
        return this.data.updated_at;
    }
    get deletedAt() {
        return this.data.deleted_at;
    }
    // Get full data
    getData() {
        return this.data;
    }
    // Business logic methods
    softDelete() {
        this.data.deleted_at = new Date().toISOString();
        this.data.updated_at = new Date().toISOString();
    }
    restore() {
        this.data.deleted_at = null;
        this.data.updated_at = new Date().toISOString();
    }
    // Update checklist data
    update(data) {
        // Validate update data
        const validatedData = ChecklistUpdateSchema.partial().parse(data);
        // Update fields
        this.data = {
            ...this.data,
            ...validatedData,
            updated_at: new Date().toISOString(),
        };
    }
    // Update position
    setPosition(position) {
        this.data.position = position;
        this.data.updated_at = new Date().toISOString();
    }
    // Static methods for creating checklists
    static create(data) {
        const now = new Date().toISOString();
        const checklistData = {
            ...data,
            id: data.id || crypto.randomUUID(),
            created_at: now,
            updated_at: now,
            deleted_at: null,
        };
        return new ChecklistModel(checklistData);
    }
    static fromDatabase(data) {
        return new ChecklistModel(data);
    }
}
