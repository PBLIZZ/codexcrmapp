import { Task } from './TaskCard';

// This represents the shape of the task data coming from the API
export interface TaskModel {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string | null;
  position: number;
  userId: string;
  
  // Properties with different names in Task interface
  dueDate?: string | null;
  contactId?: string | null;
  businessImpact?: number | null;
  aiGenerated?: boolean;
  
  // Properties that might not exist in the API model
  description?: string | null;
  color?: string | null;
  
  // Additional properties
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Converts a TaskModel from the API to a Task for the UI
 */
export function adaptTaskModelToTask(taskModel: TaskModel): Task {
  return {
    id: taskModel.id,
    title: taskModel.title,
    description: taskModel.description || null,
    status: taskModel.status,
    priority: taskModel.priority,
    category: taskModel.category,
    color: taskModel.color || null,
    due_date: taskModel.dueDate || null,
    contact_id: taskModel.contactId || null,
    business_impact: taskModel.businessImpact || null,
    position: taskModel.position,
    ai_generated: taskModel.aiGenerated || false,
    user_id: taskModel.userId,
    created_at: taskModel.createdAt,
    updated_at: taskModel.updatedAt
  };
}

/**
 * Converts a Task from the UI to a TaskModel for the API
 */
export function adaptTaskToTaskModel(task: Task): TaskModel {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    category: task.category,
    color: task.color,
    dueDate: task.due_date,
    contactId: task.contact_id,
    businessImpact: task.business_impact,
    position: task.position,
    aiGenerated: task.ai_generated,
    userId: task.user_id,
    createdAt: task.created_at,
    updatedAt: task.updated_at
  };
}