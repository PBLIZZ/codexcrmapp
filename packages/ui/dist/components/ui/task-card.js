'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';
export const PriorityBadge = forwardRef(({ className, priority, customColor, size = 'md', ...props }, ref) => {
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
    return (_jsx("div", { ref: ref, className: cn('inline-flex items-center rounded-full font-medium', priorityColors[priority], sizeClasses[size], className), style: priority === 'custom' && customColor ? { backgroundColor: customColor } : {}, ...props, children: priorityLabels[priority] }));
});
PriorityBadge.displayName = 'PriorityBadge';
export const StatusBadge = forwardRef(({ className, status, customColor, size = 'md', ...props }, ref) => {
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
    return (_jsx("div", { ref: ref, className: cn('inline-flex items-center rounded-full font-medium', statusColors[status], sizeClasses[size], className), style: status === 'custom' && customColor ? { backgroundColor: customColor } : {}, ...props, children: statusLabels[status] }));
});
StatusBadge.displayName = 'StatusBadge';
export const TaskProgress = forwardRef(({ className, value, max = 100, showLabel = false, size = 'md', ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };
    return (_jsxs("div", { ref: ref, className: cn('space-y-1', className), ...props, children: [_jsx("div", { className: cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size]), children: _jsx("div", { className: "bg-primary h-full rounded-full transition-all duration-300 ease-in-out", style: { width: `${percentage}%` } }) }), showLabel && (_jsxs("div", { className: "flex justify-between items-center text-xs text-muted-foreground", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [Math.round(percentage), "%"] })] }))] }));
});
TaskProgress.displayName = 'TaskProgress';
export const DueDate = forwardRef(({ className, date, showIcon = true, isPastDue, ...props }, ref) => {
    // Format date
    const formatDate = (date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };
    // Check if date is past due
    const checkPastDue = (date) => {
        if (isPastDue !== undefined)
            return isPastDue;
        const d = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d < today;
    };
    const pastDue = checkPastDue(date);
    return (_jsxs("div", { ref: ref, className: cn('flex items-center text-sm', pastDue ? 'text-red-500' : 'text-muted-foreground', className), ...props, children: [showIcon && (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "mr-1", children: [_jsx("rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", ry: "2" }), _jsx("line", { x1: "16", x2: "16", y1: "2", y2: "6" }), _jsx("line", { x1: "8", x2: "8", y1: "2", y2: "6" }), _jsx("line", { x1: "3", x2: "21", y1: "10", y2: "10" })] })), _jsx("span", { children: formatDate(date) })] }));
});
DueDate.displayName = 'DueDate';
export const Assignee = forwardRef(({ className, name, avatar, size = 'md', ...props }, ref) => {
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
    return (_jsxs("div", { ref: ref, className: cn('flex items-center space-x-2', className), ...props, children: [_jsx("div", { className: cn('rounded-full flex items-center justify-center bg-primary/10 text-primary', sizeClasses[size]), children: avatar ? (_jsx("img", { src: avatar, alt: name, className: "h-full w-full rounded-full object-cover" })) : (_jsx("span", { children: initials })) }), _jsx("span", { className: "text-sm", children: name })] }));
});
Assignee.displayName = 'Assignee';
export const TaskCard = forwardRef(({ className, title, description, priority = 'medium', status = 'todo', progress, dueDate, assignee, tags, size = 'md', variant = 'default', withHover = false, withShadow = false, footer, children, ...props }, ref) => {
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
    return (_jsxs("div", { ref: ref, className: cn('rounded-lg', variantClasses[variant], sizeClasses[size], shadowClass, hoverClass, className), ...props, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("h3", { className: "font-medium", children: title }), _jsxs("div", { className: "flex space-x-2", children: [priority && _jsx(PriorityBadge, { priority: priority, size: "sm" }), status && _jsx(StatusBadge, { status: status, size: "sm" })] })] }), description && _jsx("p", { className: "text-sm text-muted-foreground", children: description }), progress !== undefined && _jsx(TaskProgress, { value: progress, showLabel: true, size: "sm" }), (assignee || dueDate) && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [assignee && _jsx(Assignee, { name: assignee.name, avatar: assignee.avatar, size: "sm" }), dueDate && _jsx(DueDate, { date: dueDate })] })), tags && tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1", children: tags.map((tag, index) => (_jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary", children: tag }, index))) })), children && _jsx("div", { children: children }), footer && _jsx("div", { className: "pt-2 border-t border-border/50", children: footer })] }));
});
TaskCard.displayName = 'TaskCard';
export const TaskList = forwardRef(({ className, tasks, layout = 'grid', columns = 1, gap = 'md', ...props }, ref) => {
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
    return (_jsx("div", { ref: ref, className: cn(layoutClasses[layout], layout === 'grid' && columnClasses[columns], gapClasses[gap], className), ...props, children: tasks.map((task, index) => (_jsx(TaskCard, { ...task }, index))) }));
});
TaskList.displayName = 'TaskList';
//# sourceMappingURL=task-card.js.map