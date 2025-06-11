import { z } from 'zod';

/**
 * Checklist model for the Things-like task management system
 * Checklists are subtasks within a task
 */

// Validation schema for Checklist
export const ChecklistSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  is_completed: z.boolean().default(false),
  task_id: z.string().uuid(),
  position: z.number().int().nonnegative(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  deleted_at: z.string().datetime().nullable().optional(),
});

// Type for Checklist from schema
export type Checklist = z.infer<typeof ChecklistSchema>;

// Type for creating a new Checklist
export const ChecklistCreateSchema = ChecklistSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).extend({
  id: z.string().uuid().optional(),
});

export type ChecklistCreate = z.infer<typeof ChecklistCreateSchema>;

// Type for updating a Checklist
export const ChecklistUpdateSchema = ChecklistCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export type ChecklistUpdate = z.infer<typeof ChecklistUpdateSchema>;

/**
 * Checklist class with validation and business logic
 */
export class ChecklistModel {
  private data: Checklist;

  constructor(data: Checklist) {
    // Validate data against schema
    this.data = ChecklistSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get title(): string {
    return this.data.title;
  }

  get isCompleted(): boolean {
    return this.data.is_completed;
  }

  get taskId(): string {
    return this.data.task_id;
  }

  get position(): number {
    return this.data.position;
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
  getData(): Checklist {
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

  // Update checklist data
  update(data: Partial<ChecklistUpdate>): void {
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
  setPosition(position: number): void {
    this.data.position = position;
    this.data.updated_at = new Date().toISOString();
  }

  // Static methods for creating checklists
  static create(data: ChecklistCreate): ChecklistModel {
    const now = new Date().toISOString();
    
    const checklistData: Checklist = {
      ...data,
      id: data.id || crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    
    return new ChecklistModel(checklistData);
  }

  static fromDatabase(data: Checklist): ChecklistModel {
    return new ChecklistModel(data);
  }
}