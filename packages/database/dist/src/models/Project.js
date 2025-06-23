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
    archived: z.boolean().nullable().optional(),
    completed_at: z.string().datetime().nullable().optional(),
    metadata: z.any().nullable().optional(),
    repeat_config: z.any().nullable().optional(),
    status: z.string().nullable().optional(),
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
    get archived() {
        return this.data.archived;
    }
    get completedAt() {
        return this.data.completed_at;
    }
    get metadata() {
        return this.data.metadata;
    }
    get repeatConfig() {
        return this.data.repeat_config;
    }
    get status() {
        return this.data.status;
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
        this.data.status = 'completed'; // Assuming a 'completed' status exists
        this.data.completed_at = new Date().toISOString();
        this.data.updated_at = new Date().toISOString();
    }
    reopen() {
        this.data.status = 'active'; // Assuming an 'active' status exists
        this.data.completed_at = null;
        this.data.updated_at = new Date().toISOString();
    }
    archive() {
        this.data.archived = true;
        this.data.updated_at = new Date().toISOString();
    }
    unarchive() {
        this.data.archived = false;
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
            archived: data.archived ?? false,
            status: data.status ?? 'active', // Assuming a default status
            created_at: now,
            updated_at: now,
            completed_at: null,
            deleted_at: null,
        };
        return new ProjectModel(projectData);
    }
    static fromDatabase(data) {
        return new ProjectModel(data);
    }
}
