import { requireAuth } from '@/lib/auth/require-auth';

export const metadata = {
  title: "Tasks | CodexCRM",
  description: "Organize and track your tasks with advanced project management features.",
  keywords: ["tasks","project management","productivity","workflow"]
};

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/server';
import TasksTableClient from './TasksTableClient';
import { TasksWidgets } from '@/components/tasks/TasksWidgets';
import { ThingsTaskCard } from './ThingsTaskCard';
import { TaskForm, TaskFormValues, type TaskOutput } from './TaskForm';
import { TaskPriority, TaskStatus, TaskCategory } from '@codexcrm/db/src/models/Task';
import { CategoryView } from './CategoryViews';
import { DraggableTaskList } from './DraggableTaskList';
import { TaskDetailView } from './TaskDetailView';
import { KeyboardShortcuts } from './KeyboardShortcuts';

// Define the Task interface based on our database schema
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string | null;
  color: string | null;
  due_date: string | null;
  contact_id: string | null;
  project_id: string | null;
  business_impact: number | null;
  position: number;
  ai_generated: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

// A simple loading state for the page content
function TasksPageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

// Server component to fetch data
export default async function TasksPage() {
  await requireAuth();

  // Fetch tasks from Supabase
  try {
    const supabase = await createClient();
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    // Transform the data to match the Task interface
    const formattedTasks: Task[] = tasks?.map((task: any) => ({
      id: task.id,
      title: task.title || 'Untitled Task',
      description: task.description || null,
      status: task.status as TaskStatus || TaskStatus.TODO,
      priority: task.priority as TaskPriority || TaskPriority.MEDIUM,
      category: task.category || null,
      color: task.color || null,
      due_date: task.due_date || null,
      contact_id: task.contact_id || null,
      project_id: task.project_id || null,
      business_impact: task.business_impact || null,
      position: task.position || 0,
      ai_generated: task.ai_generated || false,
      user_id: task.user_id,
      created_at: task.created_at,
      updated_at: task.updated_at
    })) || [];

    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Suspense fallback={<TasksPageSkeleton />}>
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">All Tasks</h3>
                  <span className="text-xl">📋</span>
                </div>
                <div className="p-6 pt-0">
                  <div className="text-2xl font-bold">{formattedTasks.length}</div>
                </div>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">To Do</h3>
                  <span className="text-xl">📝</span>
                </div>
                <div className="p-6 pt-0">
                  <div className="text-2xl font-bold">{formattedTasks.filter(t => t.status === TaskStatus.TODO).length}</div>
                </div>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">In Progress</h3>
                  <span className="text-xl">⏳</span>
                </div>
                <div className="p-6 pt-0">
                  <div className="text-2xl font-bold">{formattedTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}</div>
                </div>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">Completed</h3>
                  <span className="text-xl">✅</span>
                </div>
                <div className="p-6 pt-0">
                  <div className="text-2xl font-bold">{formattedTasks.filter(t => t.status === TaskStatus.DONE).length}</div>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border">
              <div className="p-4">
                <h2 className="text-xl font-semibold">Task List</h2>
                <p className="text-sm text-gray-500">{formattedTasks.length} tasks found</p>
              </div>
              <div className="divide-y">
                {formattedTasks.length > 0 ? (
                  formattedTasks.map((task) => (
                    <div key={task.id} className="p-4 hover:bg-gray-50">
                      <h3 className="font-medium">{task.title}</h3>
                      {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                      <div className="flex gap-2 mt-2">
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                          {task.status}
                        </span>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700">
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No tasks found. Create your first task to get started.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error('Error in TasksPage:', error);
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tasks</h2>
          <p className="text-red-700">There was a problem fetching your tasks. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}