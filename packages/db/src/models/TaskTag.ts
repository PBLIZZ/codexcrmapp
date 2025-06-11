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

// Type for TaskTag from schema
export type TaskTag = z.infer<typeof TaskTagSchema>;

// Type for creating a new TaskTag
export const TaskTagCreateSchema = TaskTagSchema.omit({
  id: true,
  created_at: true,
}).extend({
  id: z.string().uuid().optional(),
});

export type TaskTagCreate = z.infer<typeof TaskTagCreateSchema>;

/**
 * TaskTag class with validation and business logic
 */
export class TaskTagModel {
  private data: TaskTag;

  constructor(data: TaskTag) {
    // Validate data against schema
    this.data = TaskTagSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get taskId(): string {
    return this.data.task_id;
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
  getData(): TaskTag {
    return this.data;
  }

  // Static methods for creating task tags
  static create(data: TaskTagCreate): TaskTagModel {
    const now = new Date().toISOString();
    
    const taskTagData: TaskTag = {
      ...data,
      id: data.id || crypto.randomUUID(),
      created_at: now,
    };
    
    return new TaskTagModel(taskTagData);
  }

  static fromDatabase(data: TaskTag): TaskTagModel {
    return new TaskTagModel(data);
  }
}