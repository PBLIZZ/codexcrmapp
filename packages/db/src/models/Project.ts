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

// Type for Project from schema
export type Project = z.infer<typeof ProjectSchema>;

// Type for creating a new Project
export const ProjectCreateSchema = ProjectSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).extend({
  id: z.string().uuid().optional(),
});

export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;

// Type for updating a Project
export const ProjectUpdateSchema = ProjectCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;

/**
 * Project class with validation and business logic
 */
export class ProjectModel {
  private data: Project;

  constructor(data: Project) {
    // Validate data against schema
    this.data = ProjectSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get title(): string {
    return this.data.title;
  }

  get notes(): string | null | undefined {
    return this.data.notes;
  }

  get dueDate(): string | null | undefined {
    return this.data.due_date;
  }

  get isCompleted(): boolean {
    return this.data.is_completed;
  }

  get isRepeating(): boolean {
    return this.data.is_repeating;
  }

  get repeatRule(): string | null | undefined {
    return this.data.repeat_rule;
  }

  get userId(): string {
    return this.data.user_id;
  }

  get createdAt(): string | undefined {
    return this.data.created_at;
  }

  get updatedAt(): string | undefined {
    return this.data.updated_at;
  }

  get deletedAt(): string | null | undefined {
    return this.data.deleted_at;
  }

  // Get full data
  getData(): Project {
    return this.data;
  }

  // Business logic methods
  complete(): void {
    this.data.is_completed = true;
    this.data.updated_at = new Date().toISOString();
  }

  reopen(): void {
    this.data.is_completed = false;
    this.data.updated_at = new Date().toISOString();
  }

  softDelete(): void {
    this.data.deleted_at = new Date().toISOString();
    this.data.updated_at = new Date().toISOString();
  }

  restore(): void {
    this.data.deleted_at = null;
    this.data.updated_at = new Date().toISOString();
  }

  // Update project data
  update(data: Partial<ProjectUpdate>): void {
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
  static create(data: ProjectCreate): ProjectModel {
    const now = new Date().toISOString();
    
    const projectData: Project = {
      ...data,
      id: data.id || crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    
    return new ProjectModel(projectData);
  }

  static fromDatabase(data: Project): ProjectModel {
    return new ProjectModel(data);
  }
}