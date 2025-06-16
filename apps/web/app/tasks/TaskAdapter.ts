import { Task } from './TaskCard';
import { TaskStatus, TaskPriority } from '@codexcrm/db/src/models/Task';

// This represents the shape of the task data coming from the API
export interface TaskModel {
  id: string;
  title: string;
  status: string; // Will be cast to TaskStatus
  priority: string; // Will be cast to TaskPriority
  category: string | null;
  position: number;
  user_id: string;
  
  // Properties with different names in Task interface
  due_date?: string | null;
  contact_id?: string | null;
  business_impact?: number | null;
  ai_generated?: boolean;
  project_id?: string | null;
  
  // Properties that might not exist in the API model
  description?: string | null;
  color?: string | null;
  
  // Additional properties
  created_at?: string;
  updated_at?: string;
}

/**
 * Converts a TaskModel from the API to a Task for the UI
 */
export function adaptTaskModelToTask(taskModel: TaskModel): Task {
  // Safely cast string values to enum types
  const getTaskStatus = (status: string): TaskStatus => {
    if (Object.values(TaskStatus).includes(status as TaskStatus)) {
      return status as TaskStatus;
    }
    return TaskStatus.TODO; // Default
  };
  
  const getTaskPriority = (priority: string): TaskPriority => {
    if (Object.values(TaskPriority).includes(priority as TaskPriority)) {
      return priority as TaskPriority;
    }
    return TaskPriority.MEDIUM; // Default
  };

  return {
    id: taskModel.id,
    title: taskModel.title,
    description: taskModel.description || null,
    status: getTaskStatus(taskModel.status),
    priority: getTaskPriority(taskModel.priority),
    category: taskModel.category,
    color: taskModel.color || null,
    due_date: taskModel.due_date || null,
    contact_id: taskModel.contact_id || null,
    business_impact: taskModel.business_impact || null,
    position: taskModel.position,
    ai_generated: taskModel.ai_generated || false,
    user_id: taskModel.user_id,
    created_at: taskModel.created_at,
    updated_at: taskModel.updated_at
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
    due_date: task.due_date,
    contact_id: task.contact_id,
    business_impact: task.business_impact,
    position: task.position,
    ai_generated: task.ai_generated,
    user_id: task.user_id,
    created_at: task.created_at,
    updated_at: task.updated_at
  };
}