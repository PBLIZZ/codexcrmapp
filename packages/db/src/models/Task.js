import { z } from 'zod';
/**
 * Task model for the Things-like task management system
 * Tasks can be standalone or belong to projects under headings
 */
// Define the system categories enum
export var TaskCategory;
(function (TaskCategory) {
    TaskCategory["INBOX"] = "inbox";
    TaskCategory["TODAY"] = "today";
    TaskCategory["UPCOMING"] = "upcoming";
    TaskCategory["ANYTIME"] = "anytime";
    TaskCategory["SOMEDAY"] = "someday";
    TaskCategory["LOGBOOK"] = "logbook";
})(TaskCategory || (TaskCategory = {}));
// Define the task status enum
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in-progress";
    TaskStatus["DONE"] = "done";
    TaskStatus["CANCELED"] = "canceled";
})(TaskStatus || (TaskStatus = {}));
// Define the task priority enum
export var TaskPriority;
(function (TaskPriority) {
    TaskPriority["HIGH"] = "high";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["LOW"] = "low";
    TaskPriority["NONE"] = "none";
})(TaskPriority || (TaskPriority = {}));
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
// Type for updating a Task
export const TaskUpdateSchema = TaskCreateSchema.partial().extend({
    id: z.string().uuid(),
});
/**
 * Task class with validation and business logic
 */
export class TaskModel {
    data;
    constructor(data) {
        // Validate data against schema
        this.data = TaskSchema.parse(data);
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
    get status() {
        return this.data.status;
    }
    get priority() {
        return this.data.priority;
    }
    get category() {
        return this.data.category;
    }
    get dueDate() {
        return this.data.due_date;
    }
    get completionDate() {
        return this.data.completion_date;
    }
    get isRepeating() {
        return this.data.is_repeating;
    }
    get repeatRule() {
        return this.data.repeat_rule;
    }
    get projectId() {
        return this.data.project_id;
    }
    get headingId() {
        return this.data.heading_id;
    }
    get position() {
        return this.data.position;
    }
    get userId() {
        return this.data.user_id;
    }
    get contactId() {
        return this.data.contact_id;
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
        this.data.status = TaskStatus.DONE;
        this.data.completion_date = new Date().toISOString();
        this.data.category = TaskCategory.LOGBOOK;
        this.data.updated_at = new Date().toISOString();
    }
    reopen() {
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
            }
            else if (dueDate.getTime() === today.getTime()) {
                // Due today
                this.data.category = TaskCategory.TODAY;
            }
            else {
                // Future date
                this.data.category = TaskCategory.UPCOMING;
            }
        }
        else {
            // No due date, move to Inbox
            this.data.category = TaskCategory.INBOX;
        }
        this.data.updated_at = new Date().toISOString();
    }
    cancel() {
        this.data.status = TaskStatus.CANCELED;
        this.data.category = TaskCategory.LOGBOOK;
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
    // Update task data
    update(data) {
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
    setPosition(position) {
        this.data.position = position;
        this.data.updated_at = new Date().toISOString();
    }
    // Move to a different category
    moveToCategory(category) {
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
    moveToProject(projectId, headingId = null) {
        this.data.project_id = projectId;
        this.data.heading_id = headingId;
        this.data.updated_at = new Date().toISOString();
    }
    // Set due date and update category accordingly
    setDueDate(dueDate) {
        this.data.due_date = dueDate;
        if (dueDate) {
            const dueDateObj = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dueDateObj < today) {
                // Past due date, move to Today
                this.data.category = TaskCategory.TODAY;
            }
            else if (dueDateObj.getTime() === today.getTime()) {
                // Due today
                this.data.category = TaskCategory.TODAY;
            }
            else {
                // Future date
                this.data.category = TaskCategory.UPCOMING;
            }
        }
        else {
            // If removing due date and task is in Today or Upcoming, move to Anytime
            if (this.data.category === TaskCategory.TODAY ||
                this.data.category === TaskCategory.UPCOMING) {
                if (this.data.status !== TaskStatus.DONE) {
                    this.data.category = TaskCategory.ANYTIME;
                }
            }
        }
        this.data.updated_at = new Date().toISOString();
    }
    // If a due date is set, move from someday/inbox to today if not already active/completed
    setDueDateAndMoveCategory(dueDate) {
        if (dueDate) {
            if (this.data.category === TaskCategory.SOMEDAY ||
                this.data.category === TaskCategory.INBOX) {
                if (this.data.status !== TaskStatus.DONE) {
                    this.moveToCategory(TaskCategory.TODAY);
                }
            }
        }
        else {
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
    setPriority(priority) {
        this.data.priority = priority;
        this.data.updated_at = new Date().toISOString();
    }
    // Static methods for creating tasks
    static create(data) {
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
            }
            else if (dueDate.getTime() === today.getTime()) {
                // Due today
                category = TaskCategory.TODAY;
            }
            else {
                // Future date
                category = TaskCategory.UPCOMING;
            }
        }
        const taskData = {
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
    static fromDatabase(data) {
        return new TaskModel(data);
    }
}
