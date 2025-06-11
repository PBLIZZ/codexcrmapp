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

// Type for ProjectTag from schema
export type ProjectTag = z.infer<typeof ProjectTagSchema>;

// Type for creating a new ProjectTag
export const ProjectTagCreateSchema = ProjectTagSchema.omit({
  id: true,
  created_at: true,
}).extend({
  id: z.string().uuid().optional(),
});

export type ProjectTagCreate = z.infer<typeof ProjectTagCreateSchema>;

/**
 * ProjectTag class with validation and business logic
 */
export class ProjectTagModel {
  private data: ProjectTag;

  constructor(data: ProjectTag) {
    // Validate data against schema
    this.data = ProjectTagSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get projectId(): string {
    return this.data.project_id;
  }

  get tagId(): string {
    return this.data.tag_id;
  }

  get userId(): string {
    return this.data.user_id;
  }

  get createdAt(): string | undefined {
    return this.data.created_at;
  }

  // Get full data
  getData(): ProjectTag {
    return this.data;
  }

  // Static methods for creating project tags
  static create(data: ProjectTagCreate): ProjectTagModel {
    const now = new Date().toISOString();
    
    const projectTagData: ProjectTag = {
      ...data,
      id: data.id || crypto.randomUUID(),
      created_at: now,
    };
    
    return new ProjectTagModel(projectTagData);
  }

  static fromDatabase(data: ProjectTag): ProjectTagModel {
    return new ProjectTagModel(data);
  }
}