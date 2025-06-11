'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Filter,
  Tag,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskBoard } from './TaskBoard';
import { Task } from './TaskCard';
import { TaskForm } from './TaskForm';

interface TasksMainContentProps {
  selectedCategory: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryChange?: (category: string | null) => void;
}

export function TasksMainContent({
  selectedCategory,
  searchQuery,
  onSearchChange,
  onCategoryChange
}: TasksMainContentProps) {
  // State for UI controls
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  // Fetch tasks
  const {
    data: tasksData = [],
    isLoading,
    error: queryError
  } = api.tasks.list.useQuery(
    undefined,
    {
      // Keep previous data while loading new search/filter results
      placeholderData: (previousData) => previousData,
    }
  );

  // Fetch categories
  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = api.tasks.getCategories.useQuery();

  // Filter tasks based on search query, category, and priority
  const filteredTasks = tasksData.filter(task => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = !selectedCategory || task.category === selectedCategory;
    
    // Filter by priority
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Mutations
  const utils = api.useUtils();
  
  const createTaskMutation = api.tasks.create.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      setIsTaskFormOpen(false);
      setEditingTaskId(null);
    },
  });
  
  const updateTaskMutation = api.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      setIsTaskFormOpen(false);
      setEditingTaskId(null);
    },
  });

  // Handlers
  const handleEditTask = (taskId: string) => {
    const task = tasksData.find((t) => t.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      setIsTaskFormOpen(true);
    }
  };

  // Widgets data
  const totalTasks = tasksData.length;
  const todoCount = tasksData.filter(t => t.status === 'todo').length;
  const inProgressCount = tasksData.filter(t => t.status === 'in-progress').length;
  const doneCount = tasksData.filter(t => t.status === 'done').length;
  
  // High business impact tasks
  const highImpactCount = tasksData.filter(
    t => t.business_impact !== null && t.business_impact > 7
  ).length;

  return (
    <div className="flex-1 p-6 overflow-auto bg-slate-100">
      {/* Header with search and actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCategoryChange && onCategoryChange(null)}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => onCategoryChange && onCategoryChange(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Priority
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                  All Priorities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('high')}>
                  High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('low')}>
                  Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* AI Suggestions Button */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setShowAiSuggestions(!showAiSuggestions)}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            AI Suggestions
          </Button>

          {/* New Task Button */}
          <Button
            onClick={() => {
              setEditingTaskId(null);
              setIsTaskFormOpen(true);
            }}
            className="bg-teal-500 hover:bg-teal-600"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Tasks</span>
            <span className="text-2xl font-bold text-teal-600">{totalTasks}</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">To Do</span>
            <span className="text-2xl font-bold text-blue-600">{todoCount}</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">In Progress</span>
            <span className="text-2xl font-bold text-amber-600">{inProgressCount}</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">High Impact Tasks</span>
            <span className="text-2xl font-bold text-purple-600">{highImpactCount}</span>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              Business Impact &gt; 7
            </div>
          </div>
        </Card>
      </div>

      {/* AI Suggestions Panel */}
      {showAiSuggestions && (
        <Card className="p-4 mb-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center">
              <Lightbulb className="h-4 w-4 text-purple-500 mr-2" />
              AI Task Suggestions
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAiSuggestions(false)}
            >
              Hide
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-medium">Update client onboarding process</h4>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                Based on recent client feedback, consider updating the onboarding documents.
              </p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="text-xs mr-2">High Priority</Badge>
                <Badge variant="outline" className="text-xs">Business Impact: 8/10</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-medium">Follow up with Enterprise clients</h4>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                It's been 30+ days since the last contact with 3 enterprise clients.
              </p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="text-xs mr-2">Medium Priority</Badge>
                <Badge variant="outline" className="text-xs">Business Impact: 7/10</Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Task Board */}
      <TaskBoard 
        initialTasks={filteredTasks} 
        selectedCategory={selectedCategory}
      />

      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                onSubmit={async (data) => {
                  try {
                    // Convert Date object to ISO string for the server
                    const formattedData = {
                      ...data,
                      due_date: data.due_date ? data.due_date.toISOString() : null
                    };
                    
                    if (editingTaskId) {
                      await updateTaskMutation.mutateAsync({
                        ...formattedData,
                        id: editingTaskId,
                      });
                    } else {
                      await createTaskMutation.mutateAsync(formattedData);
                    }
                  } catch (error) {
                    console.error('Error submitting task:', error);
                  }
                }}
                initialData={tasksData.find((t) => t.id === editingTaskId)}
                isOpen={true}
                onClose={() => setIsTaskFormOpen(false)}
                isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
                error={createTaskMutation.error?.message || updateTaskMutation.error?.message || null}
                categories={categories}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}