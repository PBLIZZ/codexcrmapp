'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { 
  Calendar, 
  Tag, 
  MoreHorizontal, 
  Circle, 
  Check,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Task } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ThingsTaskCardProps {
  task: Task;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

export function ThingsTaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onToggleComplete
}: ThingsTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = task.status === 'done';

  // Set up sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  // Format due date if present
  const formattedDueDate = task.due_date ? (() => {
    try {
      return format(new Date(task.due_date), 'MMM d');
    } catch (e) {
      return null;
    }
  })() : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`
          px-3 py-2 rounded-md border border-transparent
          ${isHovered ? 'bg-gray-100' : 'bg-transparent'} 
          ${isCompleted ? 'opacity-60' : 'opacity-100'}
          transition-all duration-150
        `}
      >
        <div className="flex items-start gap-2">
          {/* Checkbox */}
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-5 w-5 rounded-full hover:bg-transparent"
            onClick={() => onToggleComplete(task.id, !isCompleted)}
          >
            {isCompleted ? (
              <div className="h-5 w-5 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center">
                <Check className="h-3 w-3 text-gray-600" />
              </div>
            ) : (
              <div className="h-5 w-5 rounded-full border border-gray-300 hover:border-gray-400" />
            )}
          </Button>

          {/* Task Content */}
          <div className="flex-1 min-w-0" {...listeners}>
            <div className="flex items-center justify-between">
              <h3 className={`font-medium text-sm truncate ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              
              {/* Actions (only visible on hover) */}
              {isHovered && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit(task.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onStatusChange(task.id, task.status === 'todo' ? 'in-progress' : 'todo')}
                    >
                      {task.status === 'todo' ? 'Move to In Progress' : 'Move to To Do'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(task.id)}
                      className="text-red-600 hover:text-red-700 focus:text-red-700"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            {/* Task details (expandable) */}
            {task.description && (
              <div className="mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-5 text-xs text-gray-500 hover:text-gray-700 hover:bg-transparent"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ChevronRight className="h-3 w-3 mr-1" />
                  )}
                  Notes
                </Button>
                
                {isExpanded && (
                  <p className="text-xs text-gray-600 mt-1 ml-4 pl-1 border-l-2 border-gray-200">
                    {task.description}
                  </p>
                )}
              </div>
            )}
            
            {/* Task metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {/* Priority indicator */}
              {task.priority && (
                <Badge 
                  variant="outline" 
                  className={`
                    text-xs px-1.5 py-0 h-5 font-normal
                    ${task.priority === 'high' ? 'border-red-200 bg-red-50 text-red-700' : 
                      task.priority === 'medium' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : 
                      'border-blue-200 bg-blue-50 text-blue-700'}
                  `}
                >
                  {task.priority}
                </Badge>
              )}
              
              {/* Due date */}
              {formattedDueDate && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-1.5 py-0 h-5 font-normal border-gray-200 bg-gray-50 text-gray-700 flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  {formattedDueDate}
                </Badge>
              )}
              
              {/* Category/Project */}
              {task.category && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-1.5 py-0 h-5 font-normal border-gray-200 bg-gray-50 text-gray-700 flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {task.category}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}