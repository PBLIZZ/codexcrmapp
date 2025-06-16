'use client';

import { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { format } from 'date-fns';
import { 
  Calendar, 
  Tag, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock,
  BarChart
} from 'lucide-react';
import { Task } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TaskDetailViewProps {
  task: Task;
  onClose: () => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

export function TaskDetailView({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleComplete
}: TaskDetailViewProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const swipeableRef = useRef<HTMLDivElement>(null);
  
  // Format due date if present
  const formattedDueDate = task.due_date ? (() => {
    try {
      return format(new Date(task.due_date), 'PPPP');
    } catch (e) {
      return null;
    }
  })() : null;
  
  // Format created/updated dates
  const formattedCreatedAt = task.created_at ? (() => {
    try {
      return format(new Date(task.created_at), 'PPp');
    } catch (e) {
      return null;
    }
  })() : null;
  
  const formattedUpdatedAt = task.updated_at ? (() => {
    try {
      return format(new Date(task.updated_at), 'PPp');
    } catch (e) {
      return null;
    }
  })() : null;
  
  // Set up swipe handlers for mobile
  const { ref: swipeRef, ...swipeHandlers } = useSwipeable({
    onSwipedLeft: () => {
      // Swipe left to delete
      setShowDeleteConfirm(true);
    },
    onSwipedRight: () => {
      // Swipe right to toggle complete
      onToggleComplete(task.id, task.status !== 'done');
    },
    trackMouse: false,
    trackTouch: true
  });
  
  // Priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Status badge
  const getStatusBadge = () => {
    switch (task.status) {
      case 'done':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'todo':
        return <Badge className="bg-gray-500">To Do</Badge>;
      default:
        return <Badge>{task.status}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(task.id)}
                className="flex items-center"
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              ) : (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                  >
                    Confirm
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Swipeable content area */}
          <div 
            ref={(node) => {
              swipeableRef.current = node;
              // Attach swipeable's ref as well
              if (typeof swipeRef === 'function') {
                swipeRef(node);
              }
            }}
            {...swipeHandlers}
            className="touch-pan-y"
          >
            {/* Title and status */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                {getStatusBadge()}
              </div>
              
              {/* Complete/Uncomplete button */}
              <Button
                variant={task.status === 'done' ? 'destructive' : 'default'}
                className={`w-full mt-4 ${task.status === 'done' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' : 'bg-green-500 hover:bg-green-600'}`}
                onClick={() => onToggleComplete(task.id, task.status !== 'done')}
              >
                {task.status === 'done' ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            {/* Description */}
            {task.description && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-700 mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}
            
            {/* Metadata */}
            <div className="space-y-4">
              {/* Priority */}
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-700">Priority:</div>
                <div className={`font-medium ${getPriorityColor()}`}>
                  {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'None'}
                </div>
              </div>
              
              {/* Category */}
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-700">Category:</div>
                {task.category ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {task.category}
                  </Badge>
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
              
              {/* Due date */}
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-700">Due date:</div>
                {formattedDueDate ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formattedDueDate}
                  </Badge>
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
              
              {/* Contact */}
              {task.contact_id && (
                <div className="flex items-center">
                  <div className="w-24 text-sm font-medium text-gray-700">Contact:</div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Contact ID: {task.contact_id}
                  </Badge>
                </div>
              )}
              
              {/* Business impact */}
              {task.business_impact !== null && (
                <div className="flex items-center">
                  <div className="w-24 text-sm font-medium text-gray-700">Impact:</div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BarChart className="h-3 w-3" />
                    {task.business_impact}/10
                  </Badge>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            {/* Timestamps */}
            <div className="text-xs text-gray-500 space-y-1">
              {formattedCreatedAt && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Created: {formattedCreatedAt}
                </div>
              )}
              {formattedUpdatedAt && formattedUpdatedAt !== formattedCreatedAt && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated: {formattedUpdatedAt}
                </div>
              )}
              {task.ai_generated && (
                <div className="flex items-center mt-1">
                  <Badge variant="secondary" className="text-xs">AI Generated</Badge>
                </div>
              )}
            </div>
            
            {/* Mobile swipe hint */}
            <div className="mt-8 text-center text-xs text-gray-400 md:hidden">
              <p>Swipe right to mark as {task.status === 'done' ? 'incomplete' : 'complete'}</p>
              <p>Swipe left to delete</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}