import { z } from 'zod';
/**
 * Project model for the Things-like task management system
 * Projects can contain headings and tasks
 */
// Validation schema for Project
export const ProjectSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    notes: z.string().nullable().optional(),
    due_date: z.string().nullable().optional(),
    is_completed: z.boolean().default(false),
    is_repeating: z.boolean().default(false),
    repeat_rule: z.string().nullable().optional(),
    user_id: z.string().uuid(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    deleted_at: z.string().datetime().nullable().optional(),
});
// Type for creating a new Project
export const ProjectCreateSchema = ProjectSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
}).extend({
    id: z.string().uuid().optional(),
});
// Type for updating a Project
export const ProjectUpdateSchema = ProjectCreateSchema.partial().extend({
    id: z.string().uuid(),
});
/**
 * Project class with validation and business logic
 */
export class ProjectModel {
    data;
    constructor(data) {
        // Validate data against schema
        this.data = ProjectSchema.parse(data);
    }
    // Getters
    get id() {
        return this.data.id;
    }
    get title() {
        return this.data.title;
    }
    get notes() {
        return this.data.notes;
    }
    get dueDate() {
        return this.data.due_date;
    }
    get isCompleted() {
        return this.data.is_completed;
    }
    get isRepeating() {
        return this.data.is_repeating;
    }
    get repeatRule() {
        return this.data.repeat_rule;
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
    complete() {
        this.data.is_completed = true;
        this.data.updated_at = new Date().toISOString();
    }
    reopen() {
        this.data.is_completed = false;
        this.data.updated_at = new Date().toISOString();
    }
    softDelete() {
        this.data.deleted_at = new Date().toISOString();
        this.data.updated_at = new Date().toISOString();
    }
    restore() {
        this.data.deleted_at = null;
        this.data.updated_at = new Date().toISOString();
    }
    // Update project data
    update(data) {
        // Validate update data
        const validatedData = ProjectUpdateSchema.partial().parse(data);
        // Update fields
        this.data = {
            ...this.data,
            ...validatedData,
            updated_at: new Date().toISOString(),
        };
    }
    // Static methods for creating projects
    static create(data) {
        const now = new Date().toISOString();
        const projectData = {
            ...data,
            id: data.id || crypto.randomUUID(),
            created_at: now,
            updated_at: now,
            deleted_at: null,
        };
        return new ProjectModel(projectData);
    }
    static fromDatabase(data) {
        return new ProjectModel(data);
    }
}
