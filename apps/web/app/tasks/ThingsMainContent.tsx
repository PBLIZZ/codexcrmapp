/**
 * ThingsMainContent - Core Task Management Component
 * 
 * This is the central component for the Things-inspired task management interface.
 * It handles all aspects of task management including:
 * 
 * 1. Data fetching & state management:
 *    - Task data fetching via tRPC
 *    - Local state for UI controls (search, filters, sorting, modals)
 *    - Task mutations (create, update, delete, reorder)
 * 
 * 2. Task organization & filtering:
 *    - View-based filtering (inbox, today, upcoming, someday, etc.)
 *    - Search functionality
 *    - Priority filtering
 *    - Custom sorting (date, priority, alphabetical)
 * 
 * 3. UI Components:
 *    - Task cards and lists
 *    - Form modals for task creation/editing
 *    - Detail view for individual tasks
 *    - Filter/sort controls
 *    - Keyboard shortcuts
 * 
 * It receives search parameters from the parent ThingsTasksLayout and coordinates
 * with CategoryView for rendering the appropriate task lists based on the current view.
 * 
 * Note: This file contains TypeScript errors related to tRPC mutation hooks (`isLoading`
 * property missing, should be `isPending`) that need to be fixed in a separate update.
 * 
 * Date: June 11, 2025
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Plus,
  Filter,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThingsTaskCard } from './ThingsTaskCard';
import { TaskForm, TaskFormValues, type TaskOutput } from './TaskForm';
import { TaskPriority, TaskStatus, TaskCategory } from '@codexcrm/db/src/models/Task';
import { CategoryView } from './CategoryViews';
import { DraggableTaskList } from './DraggableTaskList';
import { TaskDetailView } from './TaskDetailView';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';

interface ThingsMainContentProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ThingsMainContent({
  searchQuery,
  onSearchChange
}: ThingsMainContentProps) {
  // Get current view from URL
  const searchParams = useSearchParams();
  const currentView = searchParams?.get('view') || 'inbox';
  const currentProject = searchParams?.get('project') || null;
  
  // State for UI controls
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('date');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Fetch tasks
  const {
    data: tasksData,
    isLoading,
    error: queryError,
  } = api.tasks.list.useQuery(
    { view: currentView, projectId: currentProject },
    {
      placeholderData: (previousData) => previousData,
    }
  );
  
  // Fetch category counts
  const {
    data: categoryCounts = {},
    isLoading: categoriesLoading
  } = api.tasks.getCategoryCounts.useQuery();

  // Listen for custom event to open task form
  useEffect(() => {
    const handleOpenModal = () => {
      setEditingTaskId(null);
      setIsTaskFormOpen(true);
    };

    window.addEventListener('open-add-task-modal', handleOpenModal);

    return () => {
      window.removeEventListener('open-add-task-modal', handleOpenModal);
    };
  }, []);

  // Use the raw tRPC output directly
  const tasks = useMemo(() => {
    return tasksData || [];
  }, [tasksData]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter(task => {
      const matchesSearch = searchQuery
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesPriority = priorityFilter
        ? task.priority === priorityFilter
        : true;

      if (!matchesSearch || !matchesPriority) {
        return false;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      switch (currentView) {
        case 'inbox':
          return !task.project_id && task.status !== TaskStatus.DONE;
        case 'today':
          return (
            task.due_date &&
            new Date(task.due_date) >= today &&
            new Date(task.due_date) < tomorrow
          );
        case 'upcoming':
          return task.due_date && new Date(task.due_date) >= tomorrow;
        case 'anytime':
          return !!task.project_id && !task.due_date;
        case 'someday':
          return task.priority === TaskPriority.LOW;
        case 'logbook':
          return task.status === TaskStatus.DONE;
        case 'project':
          return task.project_id === currentProject;
        default:
          return true;
      }
    });
  }, [tasks, currentView, currentProject, searchQuery, priorityFilter]);
  
  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch(sortBy) {
      case 'priority':
        const priorityOrder: { [key: string]: number } = { [TaskPriority.HIGH]: 0, [TaskPriority.MEDIUM]: 1, [TaskPriority.LOW]: 2, [TaskPriority.NONE]: 3 };
        return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'date':
      default:
        return (a.position ?? 0) - (b.position ?? 0);
    }
  });
  
  // Mutations
  const utils = api.useUtils();
  
  const createTaskMutation = api.tasks.create.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      utils.tasks.getCategoryCounts.invalidate();
      setIsTaskFormOpen(false);
      setEditingTaskId(null);
    },
  });
  
  const updateTaskMutation = api.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      utils.tasks.getCategoryCounts.invalidate();
      setIsTaskFormOpen(false);
      setEditingTaskId(null);
    },
  });
  
  const deleteTaskMutation = api.tasks.delete.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      utils.tasks.getCategoryCounts.invalidate();
    },
  });
  
  // Handlers
  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      setIsTaskFormOpen(true);
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate({ id: taskId });
    }
  };
  
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation.mutate({
      id: taskId,
      status: newStatus,
    });
  };
  
  const handleReorderTasks = (reorderedTasks: TaskOutput[]) => {
    reorderedTasks.forEach((task, index) => {
      updateTaskMutation.mutate({
        id: task.id,
        position: index,
      });
    });
  };
  
  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTaskMutation.mutate({
      id: taskId,
      status: completed ? TaskStatus.DONE : TaskStatus.TODO,
    });
  };
  
  const handleFormSubmit = async (data: TaskFormValues) => {
    try {
      const submissionData = {
        ...data,
        category: data.category as TaskCategory, // Cast to enum
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
      };

      if (editingTaskId) {
        await updateTaskMutation.mutateAsync({ id: editingTaskId, ...submissionData });
      } else {
        await createTaskMutation.mutateAsync(submissionData);
      }
      setIsTaskFormOpen(false);
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  // Get view title
  const getViewTitle = () => {
    switch(currentView) {
      case 'inbox': return 'Inbox';
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'anytime': return 'Anytime';
      case 'someday': return 'Someday';
      case 'logbook': return 'Logbook';
      case 'project': return currentProject || 'Project';
      default: return 'Tasks';
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-white">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation />
      
      {/* Header with title and actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{getViewTitle()}</h1>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Sort
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortBy('date')}
                className={sortBy === 'date' ? 'bg-gray-100' : ''}
              >
                Date
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('priority')}
                className={sortBy === 'priority' ? 'bg-gray-100' : ''}
              >
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('alphabetical')}
                className={sortBy === 'alphabetical' ? 'bg-gray-100' : ''}
              >
                Alphabetical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter(TaskPriority.HIGH)}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter(TaskPriority.MEDIUM)}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter(TaskPriority.LOW)}>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* New Task Button */}
          <Button
            onClick={() => {
              setEditingTaskId(null);
              setIsTaskFormOpen(true);
            }}
            className="bg-teal-500 hover:bg-teal-600 text-white"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>
      
      {/* Category View with Draggable Task List */}
      <CategoryView
        viewType={currentView}
        projectName={currentProject}
        tasks={sortedTasks}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onEdit={(taskId) => {
          setSelectedTaskId(taskId);
        }}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        onToggleComplete={handleToggleComplete}
        onAddTask={() => {
          setEditingTaskId(null);
          setIsTaskFormOpen(true);
        }}
      />
      
      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingTaskId ? 'Edit Task' : 'New Task'}
                </h2>
                <button
                  onClick={() => setIsTaskFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <TaskForm
                initialData={editingTaskId ? tasks.find(t => t.id === editingTaskId) : null}
                onSubmit={handleFormSubmit}
                onClose={() => setIsTaskFormOpen(false)}
                isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
                error={createTaskMutation.error?.message || updateTaskMutation.error?.message}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task Detail View */}
      {selectedTaskId && (
        <TaskDetailView
          task={tasks.find(t => t.id === selectedTaskId) || null}
          onClose={() => setSelectedTaskId(null)}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
      
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onNewTask={() => {
          setEditingTaskId(null);
          setIsTaskFormOpen(true);
        }}
        onToggleSearch={() => {
          const searchInput = document.querySelector('input[placeholder="Search tasks..."]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }}
        onToggleSidebar={() => {
          setIsSidebarVisible(!isSidebarVisible);
          // Dispatch custom event to notify sidebar
          window.dispatchEvent(new CustomEvent('toggle-sidebar', {
            detail: { visible: !isSidebarVisible }
          }));
        }}
        onEscape={() => {
          if (selectedTaskId) {
            setSelectedTaskId(null);
          } else if (isTaskFormOpen) {
            setIsTaskFormOpen(false);
          } else if (isSearchFocused) {
            const searchInput = document.querySelector('input[placeholder="Search tasks..."]') as HTMLInputElement;
            if (searchInput) {
              searchInput.blur();
              onSearchChange('');
            }
          }
        }}
      />
      
      {/* Floating Action Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button
          onClick={() => {
            setEditingTaskId(null);
            setIsTaskFormOpen(true);
          }}
          className="bg-teal-500 hover:bg-teal-600 text-white h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}