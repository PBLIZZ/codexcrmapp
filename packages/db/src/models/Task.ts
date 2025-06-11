import { z } from 'zod';

/**
 * Task model for the Things-like task management system
 * Tasks can be standalone or belong to projects under headings
 */

// Define the system categories enum
export enum TaskCategory {
  INBOX = 'inbox',
  TODAY = 'today',
  UPCOMING = 'upcoming',
  ANYTIME = 'anytime',
  SOMEDAY = 'someday',
  LOGBOOK = 'logbook',
}

// Define the task status enum
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  CANCELED = 'canceled',
}

// Define the task priority enum
export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none',
}

// Validation schema for Task
export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  notes: z.string().nullable().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.NONE),
  category: z.nativeEnum(TaskCategory).default(TaskCategory.INBOX),
  due_date: z.string().nullable().optional(),
  completion_date: z.string().nullable().optional(),
  is_repeating: z.boolean().default(false),
  repeat_rule: z.string().nullable().optional(),
  project_id: z.string().uuid().nullable().optional(),
  heading_id: z.string().uuid().nullable().optional(),
  position: z.number().int().nonnegative(),
  user_id: z.string().uuid(),
  contact_id: z.string().uuid().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  deleted_at: z.string().datetime().nullable().optional(),
});

// Type for Task from schema
export type Task = z.infer<typeof TaskSchema>;

// Type for creating a new Task
export const TaskCreateSchema = TaskSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  completion_date: true,
}).extend({
  id: z.string().uuid().optional(),
});

export type TaskCreate = z.infer<typeof TaskCreateSchema>;

// Type for updating a Task
export const TaskUpdateSchema = TaskCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;

/**
 * Task class with validation and business logic
 */
export class TaskModel {
  private data: Task;

  constructor(data: Task) {
    // Validate data against schema
    this.data = TaskSchema.parse(data);
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

  get status(): TaskStatus {
    return this.data.status;
  }

  get priority(): TaskPriority {
    return this.data.priority;
  }

  get category(): TaskCategory {
    return this.data.category;
  }

  get dueDate(): string | null | undefined {
    return this.data.due_date;
  }

  get completionDate(): string | null | undefined {
    return this.data.completion_date;
  }

  get isRepeating(): boolean {
    return this.data.is_repeating;
  }

  get repeatRule(): string | null | undefined {
    return this.data.repeat_rule;
  }

  get projectId(): string | null | undefined {
    return this.data.project_id;
  }

  get headingId(): string | null | undefined {
    return this.data.heading_id;
  }

  get position(): number {
    return this.data.position;
  }

  get userId(): string {
    return this.data.user_id;
  }

  get contactId(): string | null | undefined {
    return this.data.contact_id;
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
  getData(): Task {
    return this.data;
  }

  // Business logic methods
  complete(): void {
    this.data.status = TaskStatus.DONE;
    this.data.completion_date = new Date().toISOString();
    this.data.category = TaskCategory.LOGBOOK;
    this.data.updated_at = new Date().toISOString();
  }

  reopen(): void {
    this.data.status = TaskStatus.TODO;
    this.data.completion_date = null;
    
    // Determine appropriate category based on due date
    if (this.data.due_date) {
      const dueDate = new Date(this.data.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        // Past due date, move to Today
        this.data.category = TaskCategory.TODAY;
      } else if (dueDate.getTime() === today.getTime()) {
        // Due today
        this.data.category = TaskCategory.TODAY;
      } else {
        // Future date
        this.data.category = TaskCategory.UPCOMING;
      }
    } else {
      // No due date, move to Inbox
      this.data.category = TaskCategory.INBOX;
    }
    
    this.data.updated_at = new Date().toISOString();
  }

  cancel(): void {
    this.data.status = TaskStatus.CANCELED;
    this.data.category = TaskCategory.LOGBOOK;
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

  // Update task data
  update(data: Partial<TaskUpdate>): void {
    // Validate update data
    const validatedData = TaskUpdateSchema.partial().parse(data);
    
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

  // Move to a different category
  moveToCategory(category: TaskCategory): void {
    this.data.category = category;
    this.data.updated_at = new Date().toISOString();
    
    // If moving to Logbook, mark as completed
    if (category === TaskCategory.LOGBOOK && this.data.status !== TaskStatus.DONE) {
      this.data.status = TaskStatus.DONE;
      this.data.completion_date = new Date().toISOString();
    }
    
    // If moving out of Logbook, mark as active if it was completed
    if (category !== TaskCategory.LOGBOOK && this.data.status === TaskStatus.DONE) {
      this.data.status = TaskStatus.TODO;
      this.data.completion_date = null;
    }
  }

  // Move to a different project
  moveToProject(projectId: string | null, headingId: string | null = null): void {
    this.data.project_id = projectId;
    this.data.heading_id = headingId;
    this.data.updated_at = new Date().toISOString();
  }

  // Set due date and update category accordingly
  setDueDate(dueDate: string | null): void {
    this.data.due_date = dueDate;
    
    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDateObj < today) {
        // Past due date, move to Today
        this.data.category = TaskCategory.TODAY;
      } else if (dueDateObj.getTime() === today.getTime()) {
        // Due today
        this.data.category = TaskCategory.TODAY;
      } else {
        // Future date
        this.data.category = TaskCategory.UPCOMING;
      }
    } else {
      // If removing due date and task is in Today or Upcoming, move to Anytime
      if (
        this.data.category === TaskCategory.TODAY || 
        this.data.category === TaskCategory.UPCOMING
      ) {
        if (this.data.status !== TaskStatus.DONE) {
          this.data.category = TaskCategory.ANYTIME;
        }
      }
    }
    
    this.data.updated_at = new Date().toISOString();
  }

  // If a due date is set, move from someday/inbox to today if not already active/completed
  setDueDateAndMoveCategory(dueDate: string | null): void {
    if (dueDate) {
      if (
        this.data.category === TaskCategory.SOMEDAY ||
        this.data.category === TaskCategory.INBOX
      ) {
        if (this.data.status !== TaskStatus.DONE) {
          this.moveToCategory(TaskCategory.TODAY);
        }
      }
    } else {
      // If due date is removed, move from today to anytime if not completed
      if (this.data.category === TaskCategory.TODAY) {
        if (this.data.status !== TaskStatus.DONE) {
          this.moveToCategory(TaskCategory.ANYTIME);
        }
      }
    }
    this.data.updated_at = new Date().toISOString();
  }

  // Set priority
  setPriority(priority: TaskPriority): void {
    this.data.priority = priority;
    this.data.updated_at = new Date().toISOString();
  }

  // Static methods for creating tasks
  static create(data: TaskCreate): TaskModel {
    const now = new Date().toISOString();
    
    // Set default category based on due date if provided
    let category = data.category || TaskCategory.INBOX;
    
    if (data.due_date) {
      const dueDate = new Date(data.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        // Past due date, set to Today
        category = TaskCategory.TODAY;
      } else if (dueDate.getTime() === today.getTime()) {
        // Due today
        category = TaskCategory.TODAY;
      } else {
        // Future date
        category = TaskCategory.UPCOMING;
      }
    }
    
    const taskData: Task = {
      ...data,
      id: data.id || crypto.randomUUID(),
      category,
      status: TaskStatus.TODO,
      completion_date: null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    
    return new TaskModel(taskData);
  }

  static fromDatabase(data: Task): TaskModel {
    return new TaskModel(data);
  }
}