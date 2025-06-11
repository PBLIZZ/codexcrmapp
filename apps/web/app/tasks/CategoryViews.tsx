'use client';

import { useState } from 'react';
import { 
  Inbox, 
  Calendar, 
  CalendarDays, 
  Infinity, 
  Archive, 
  CheckCircle2,
  FolderClosed,
  Plus,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from './TaskCard';
import { VirtualizedTaskList } from './VirtualizedTaskList';

interface CategoryViewProps {
  viewType: string;
  projectName?: string | null;
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onAddTask: () => void;
}

export function CategoryView({
  viewType,
  projectName,
  tasks,
  isLoading,
  searchQuery,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleComplete,
  onAddTask
}: CategoryViewProps) {
  // Get view title and icon
  const getViewInfo = () => {
    switch(viewType) {
      case 'inbox':
        return { 
          title: 'Inbox', 
          icon: Inbox, 
          description: 'Tasks without a category',
          emptyMessage: 'Your inbox is empty. Great job!'
        };
      case 'today':
        return { 
          title: 'Today', 
          icon: Calendar, 
          description: 'Tasks due today',
          emptyMessage: 'No tasks due today. Take a break!'
        };
      case 'upcoming':
        return { 
          title: 'Upcoming', 
          icon: CalendarDays, 
          description: 'Tasks with future due dates',
          emptyMessage: 'No upcoming tasks. You\'re all caught up!'
        };
      case 'anytime':
        return { 
          title: 'Anytime', 
          icon: Infinity, 
          description: 'Tasks with a category but no due date',
          emptyMessage: 'No anytime tasks. Add some tasks that can be done whenever!'
        };
      case 'someday':
        return { 
          title: 'Someday', 
          icon: Archive, 
          description: 'Low priority tasks',
          emptyMessage: 'No someday tasks. Add some tasks for the future!'
        };
      case 'logbook':
        return { 
          title: 'Logbook', 
          icon: CheckCircle2, 
          description: 'Completed tasks',
          emptyMessage: 'No completed tasks yet. Keep working!'
        };
      case 'project':
        return { 
          title: projectName || 'Project', 
          icon: FolderClosed, 
          description: `Tasks in the ${projectName} project`,
          emptyMessage: `No tasks in ${projectName}. Add some tasks to get started!`
        };
      default:
        return { 
          title: 'Tasks', 
          icon: Calendar, 
          description: 'All tasks',
          emptyMessage: 'No tasks found. Add some tasks to get started!'
        };
    }
  };

  const viewInfo = getViewInfo();
  const ViewIcon = viewInfo.icon;

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
      <ViewIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-500 mb-4">{viewInfo.emptyMessage}</p>
      <Button
        onClick={onAddTask}
        className="bg-teal-500 hover:bg-teal-600 text-white"
        size="sm"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add a task
      </Button>
    </div>
  );

  // Search empty state
  const SearchEmptyState = () => (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
      <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-500 mb-4">No tasks found matching "{searchQuery}"</p>
      <Button
        onClick={onAddTask}
        className="bg-teal-500 hover:bg-teal-600 text-white"
        size="sm"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add a task
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <ViewIcon className="h-6 w-6 text-gray-700" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{viewInfo.title}</h1>
          <p className="text-sm text-gray-500">{viewInfo.description}</p>
        </div>
      </div>

      <VirtualizedTaskList
        tasks={tasks}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onToggleComplete={onToggleComplete}
        isLoading={isLoading}
        emptyState={searchQuery ? <SearchEmptyState /> : <EmptyState />}
      />
    </div>
  );
}