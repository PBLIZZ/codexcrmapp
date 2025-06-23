import { z } from 'zod';
/**
 * ProjectTag model for the Things-like task management system
 * Represents the many-to-many relationship between projects and tags
 */
// Validation schema for ProjectTag
export const ProjectTagSchema = z.object({
    id: z.string().uuid(),
    project_id: z.string().uuid(),
    tag_id: z.string().uuid(),
    user_id: z.string().uuid(),
    created_at: z.string().datetime().optional(),
});
// Type for creating a new ProjectTag
export const ProjectTagCreateSchema = ProjectTagSchema.omit({
    id: true,
    created_at: true,
}).extend({
    id: z.string().uuid().optional(),
});
/**
 * ProjectTag class with validation and business logic
 */
export class ProjectTagModel {
    data;
    constructor(data) {
        // Validate data against schema
        this.data = ProjectTagSchema.parse(data);
    }
    // Getters
    get id() {
        return this.data.id;
    }
    get projectId() {
        return this.data.project_id;
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
    // Static methods for creating project tags
    static create(data) {
        const now = new Date().toISOString();
        const projectTagData = {
            ...data,
            id: data.id || crypto.randomUUID(),
            created_at: now,
        };
        return new ProjectTagModel(projectTagData);
    }
    static fromDatabase(data) {
        return new ProjectTagModel(data);
    }
}
