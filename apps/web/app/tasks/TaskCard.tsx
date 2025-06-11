'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Calendar, 
  User, 
  Tag, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowRight, 
  ArrowDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskStatus, TaskPriority } from '@codexcrm/db/src/models';

// Re-export the enums for other components to use
export { TaskStatus, TaskPriority };

// Define the Task interface
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
  business_impact: number | null;
  position: number;
  ai_generated: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Priority badge color
  const priorityColors: Record<TaskPriority, string> = {
    [TaskPriority.HIGH]: 'bg-red-500 hover:bg-red-600',
    [TaskPriority.MEDIUM]: 'bg-yellow-500 hover:bg-yellow-600',
    [TaskPriority.LOW]: 'bg-blue-500 hover:bg-blue-600',
    [TaskPriority.NONE]: 'bg-gray-500 hover:bg-gray-600',
  };

  // Status change options based on current status
  const getStatusChangeOptions = () => {
    if (!task || !task.status) return [];

    switch (task.status) {
      case TaskStatus.TODO:
        return [{ label: 'Move to In Progress', value: TaskStatus.IN_PROGRESS }];
      case TaskStatus.IN_PROGRESS:
        return [
          { label: 'Move to To Do', value: TaskStatus.TODO },
          { label: 'Move to Done', value: TaskStatus.DONE },
        ];
      case TaskStatus.DONE:
        return [
          { label: 'Move to To Do', value: TaskStatus.TODO },
          { label: 'Move to In Progress', value: TaskStatus.IN_PROGRESS },
        ];
      default:
        return [];
    }
  };

  // Priority icon
  const PriorityIcon = () => {
    if (!task || !task.priority) return null;
    
    switch (task.priority) {
      case TaskPriority.HIGH:
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case TaskPriority.MEDIUM:
        return <ArrowRight className="h-4 w-4 text-yellow-500" />;
      case TaskPriority.LOW:
        return <ArrowDown className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="mb-3"
    >
      <Card className="border-l-4 shadow-sm hover:shadow-md transition-shadow duration-200" 
        style={{ borderLeftColor: task.color || '#e2e8f0' }}>
        <CardHeader className="p-3 pb-0 cursor-grab" {...listeners}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <PriorityIcon />
              <h3 className="font-medium text-sm">{task.title}</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Status change options */}
                {getStatusChangeOptions().map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => onStatusChange(task.id, option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(task.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 hover:text-red-700 focus:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 pt-2">
          {/* Show description preview or full description based on expanded state */}
          {task.description && (
            <p className={`text-gray-600 text-xs ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {task.description}
            </p>
          )}
          
          {/* Show "Show more" button if description is long */}
          {task.description && task.description.length > 100 && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-xs mt-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </Button>
          )}
        </CardContent>
        
        <CardFooter className="p-3 pt-0 flex flex-wrap gap-2 items-center">
          {/* Priority badge */}
          <Badge className={cn('text-white', priorityColors[task.priority] || priorityColors[TaskPriority.NONE])}>
            {task.priority || 'Unknown'}
          </Badge>
          
          {/* Category badge */}
          {task.category && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {task.category}
            </Badge>
          )}
          
          {/* Due date badge */}
          {task.due_date && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {(() => {
                try {
                  return new Date(task.due_date).toLocaleDateString();
                } catch (e) {
                  console.error('Invalid date format:', task.due_date);
                  return 'Invalid date';
                }
              })()}
            </Badge>
          )}
          
          {/* Contact badge */}
          {task.contact_id && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <User className="h-3 w-3" />
              Contact
            </Badge>
          )}
          
          {/* AI generated badge */}
          {task.ai_generated && (
            <Badge variant="secondary" className="text-xs">
              AI
            </Badge>
          )}
          
          {/* Business impact indicator */}
          {task.business_impact !== null && (
            <div className="ml-auto text-xs text-gray-500 flex items-center">
              Impact: 
              <span className="font-medium ml-1">
                {task.business_impact}/10
              </span>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}