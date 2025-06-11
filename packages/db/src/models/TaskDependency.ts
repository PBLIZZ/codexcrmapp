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

// Type for TaskDependency from schema
export type TaskDependency = z.infer<typeof TaskDependencySchema>;

// Type for creating a new TaskDependency
export const TaskDependencyCreateSchema = TaskDependencySchema.omit({
  id: true,
  created_at: true,
}).extend({
  id: z.string().uuid().optional(),
});

export type TaskDependencyCreate = z.infer<typeof TaskDependencyCreateSchema>;

/**
 * TaskDependency class with validation and business logic
 */
export class TaskDependencyModel {
  private data: TaskDependency;

  constructor(data: TaskDependency) {
    // Validate data against schema
    this.data = TaskDependencySchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get taskId(): string {
    return this.data.task_id;
  }

  get dependsOnTaskId(): string {
    return this.data.depends_on_task_id;
  }

  get userId(): string {
    return this.data.user_id;
  }

  get createdAt(): string | undefined {
    return this.data.created_at;
  }

  // Get full data
  getData(): TaskDependency {
    return this.data;
  }

  // Static methods for creating task dependencies
  static create(data: TaskDependencyCreate): TaskDependencyModel {
    const now = new Date().toISOString();
    
    const taskDependencyData: TaskDependency = {
      ...data,
      id: data.id || crypto.randomUUID(),
      created_at: now,
    };
    
    return new TaskDependencyModel(taskDependencyData);
  }

  static fromDatabase(data: TaskDependency): TaskDependencyModel {
    return new TaskDependencyModel(data);
  }
}