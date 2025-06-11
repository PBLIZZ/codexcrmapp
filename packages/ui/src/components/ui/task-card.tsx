'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';

// Priority badge component
export interface PriorityBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'custom';
  customColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge = forwardRef<HTMLDivElement, PriorityBadgeProps>(
  ({ className, priority, customColor, size = 'md', ...props }, ref) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      custom: '',
    };

    const priorityLabels = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
      custom: 'Custom',
    };

    const sizeClasses = {
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-xs px-2 py-1',
      lg: 'text-sm px-2.5 py-1.5',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          priorityColors[priority],
          sizeClasses[size],
          className
        )}
        style={priority === 'custom' && customColor ? { backgroundColor: customColor } : {}}
        {...props}
      >
        {priorityLabels[priority]}
      </div>
    );
  }
);

PriorityBadge.displayName = 'PriorityBadge';

// Status badge component
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked' | 'custom';
  customColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, customColor, size = 'md', ...props }, ref) => {
    const statusColors = {
      todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      review: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      custom: '',
    };

    const statusLabels = {
      todo: 'To Do',
      'in-progress': 'In Progress',
      review: 'Review',
      done: 'Done',
      blocked: 'Blocked',
      custom: 'Custom',
    };

    const sizeClasses = {
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-xs px-2 py-1',
      lg: 'text-sm px-2.5 py-1.5',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          statusColors[status],
          sizeClasses[size],
          className
        )}
        style={status === 'custom' && customColor ? { backgroundColor: customColor } : {}}
        {...props}
      >
        {statusLabels[status]}
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

// Task progress component
export interface TaskProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TaskProgress = forwardRef<HTMLDivElement, TaskProgressProps>(
  ({ className, value, max = 100, showLabel = false, size = 'md', ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    return (
      <div
        ref={ref}
        className={cn('space-y-1', className)}
        {...props}
      >
        <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    );
  }
);

TaskProgress.displayName = 'TaskProgress';

// Due date component
export interface DueDateProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date | string;
  showIcon?: boolean;
  isPastDue?: boolean;
}

export const DueDate = forwardRef<HTMLDivElement, DueDateProps>(
  ({ className, date, showIcon = true, isPastDue, ...props }, ref) => {
    // Format date
    const formatDate = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Check if date is past due
    const checkPastDue = (date: Date | string) => {
      if (isPastDue !== undefined) return isPastDue;
      const d = typeof date === 'string' ? new Date(date) : date;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d < today;
    };

    const pastDue = checkPastDue(date);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center text-sm',
          pastDue ? 'text-red-500' : 'text-muted-foreground',
          className
        )}
        {...props}
      >
        {showIcon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        )}
        <span>{formatDate(date)}</span>
      </div>
    );
  }
);

DueDate.displayName = 'DueDate';

// Assignee component
export interface AssigneeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Assignee = forwardRef<HTMLDivElement, AssigneeProps>(
  ({ className, name, avatar, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-6 w-6 text-xs',
      md: 'h-8 w-8 text-sm',
      lg: 'h-10 w-10 text-base',
    };

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    return (
      <div
        ref={ref}
        className={cn('flex items-center space-x-2', className)}
        {...props}
      >
        <div
          className={cn(
            'rounded-full flex items-center justify-center bg-primary/10 text-primary',
            sizeClasses[size]
          )}
        >
          {avatar ? (
            <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <span className="text-sm">{name}</span>
      </div>
    );
  }
);

Assignee.displayName = 'Assignee';

// Main task card component
export interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  progress?: number;
  dueDate?: Date | string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'accent' | 'outline';
  withHover?: boolean;
  withShadow?: boolean;
  footer?: React.ReactNode;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  (
    {
      className,
      title,
      description,
      priority = 'medium',
      status = 'todo',
      progress,
      dueDate,
      assignee,
      tags,
      size = 'md',
      variant = 'default',
      withHover = false,
      withShadow = false,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    const { isDarkMode } = useTheme();

    // Size classes
    const sizeClasses = {
      sm: 'p-3 space-y-2',
      md: 'p-4 space-y-3',
      lg: 'p-6 space-y-4',
    };

    // Variant classes based on theme
    const variantClasses = {
      default: 'bg-card text-card-foreground',
      primary: 'bg-primary text-primary-foreground',
      accent: 'bg-accent text-accent-foreground',
      outline: 'border border-border bg-transparent',
    };

    // Shadow classes
    const shadowClass = withShadow ? (isDarkMode ? 'shadow-md shadow-black/20' : 'shadow-md shadow-black/10') : '';

    // Hover effect classes
    const hoverClass = withHover
      ? variant === 'default'
        ? 'hover:bg-muted/50 transition-colors'
        : variant === 'primary'
        ? 'hover:bg-primary/90 transition-colors'
        : variant === 'accent'
        ? 'hover:bg-accent/90 transition-colors'
        : 'hover:bg-muted/10 transition-colors'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          variantClasses[variant],
          sizeClasses[size],
          shadowClass,
          hoverClass,
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <h3 className="font-medium">{title}</h3>
          <div className="flex space-x-2">
            {priority && <PriorityBadge priority={priority} size="sm" />}
            {status && <StatusBadge status={status} size="sm" />}
          </div>
        </div>

        {description && <p className="text-sm text-muted-foreground">{description}</p>}

        {progress !== undefined && <TaskProgress value={progress} showLabel size="sm" />}

        {(assignee || dueDate) && (
          <div className="flex items-center justify-between text-sm">
            {assignee && <Assignee name={assignee.name} avatar={assignee.avatar} size="sm" />}
            {dueDate && <DueDate date={dueDate} />}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {children && <div>{children}</div>}

        {footer && <div className="pt-2 border-t border-border/50">{footer}</div>}
      </div>
    );
  }
);

TaskCard.displayName = 'TaskCard';

// Task list component
export interface TaskListProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: TaskCardProps[];
  layout?: 'grid' | 'list';
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export const TaskList = forwardRef<HTMLDivElement, TaskListProps>(
  (
    { className, tasks, layout = 'grid', columns = 1, gap = 'md', ...props },
    ref
  ) => {
    // Layout classes
    const layoutClasses = {
      grid: 'grid',
      list: 'flex flex-col',
    };

    // Column classes
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };

    // Gap classes
    const gapClasses = {
      sm: layout === 'grid' ? 'gap-2' : 'space-y-2',
      md: layout === 'grid' ? 'gap-4' : 'space-y-4',
      lg: layout === 'grid' ? 'gap-6' : 'space-y-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          layoutClasses[layout],
          layout === 'grid' && columnClasses[columns],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {tasks.map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>
    );
  }
);

TaskList.displayName = 'TaskList';