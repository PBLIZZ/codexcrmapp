'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { TaskCard, TaskList, PriorityBadge, StatusBadge, TaskProgress, DueDate, Assignee, } from '../ui/task-card';
export function TaskCardDemo({ className }) {
    const [layout, setLayout] = useState('grid');
    const [columns, setColumns] = useState(2);
    // Sample tasks data
    const tasks = [
        {
            title: 'Implement Authentication',
            description: 'Set up user authentication with JWT and secure routes',
            priority: 'high',
            status: 'in-progress',
            progress: 60,
            dueDate: '2025-06-15',
            assignee: {
                name: 'John Doe',
                avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
            },
            tags: ['Backend', 'Security'],
        },
        {
            title: 'Design Dashboard UI',
            description: 'Create wireframes and mockups for the main dashboard',
            priority: 'medium',
            status: 'todo',
            progress: 20,
            dueDate: '2025-06-20',
            assignee: {
                name: 'Jane Smith',
                avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
            },
            tags: ['UI/UX', 'Design'],
        },
        {
            title: 'API Integration',
            description: 'Connect frontend with backend API endpoints',
            priority: 'high',
            status: 'review',
            progress: 90,
            dueDate: '2025-06-10',
            assignee: {
                name: 'Michael Chen',
            },
            tags: ['Frontend', 'API'],
        },
        {
            title: 'Database Optimization',
            description: 'Improve query performance and add indexes',
            priority: 'low',
            status: 'done',
            progress: 100,
            dueDate: '2025-06-05',
            assignee: {
                name: 'Sarah Johnson',
            },
            tags: ['Database', 'Performance'],
        },
        {
            title: 'Fix Responsive Layout',
            description: 'Address mobile layout issues on small screens',
            priority: 'urgent',
            status: 'blocked',
            progress: 30,
            dueDate: '2025-06-08',
            assignee: {
                name: 'Alex Wong',
            },
            tags: ['Frontend', 'Responsive'],
        },
        {
            title: 'Write Documentation',
            description: 'Create user and developer documentation',
            priority: 'medium',
            status: 'todo',
            progress: 10,
            dueDate: '2025-06-25',
            assignee: {
                name: 'Emily Davis',
            },
            tags: ['Documentation'],
        },
    ];
    return (_jsxs("div", { className: cn('space-y-6', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Task Cards" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("div", { className: "flex items-center space-x-1 mr-4", children: [_jsx("button", { onClick: () => setLayout('grid'), className: cn('p-1 rounded-md', layout === 'grid'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'), children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { width: "7", height: "7", x: "3", y: "3", rx: "1" }), _jsx("rect", { width: "7", height: "7", x: "14", y: "3", rx: "1" }), _jsx("rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }), _jsx("rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" })] }) }), _jsx("button", { onClick: () => setLayout('list'), className: cn('p-1 rounded-md', layout === 'list'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'), children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "8", x2: "21", y1: "6", y2: "6" }), _jsx("line", { x1: "8", x2: "21", y1: "12", y2: "12" }), _jsx("line", { x1: "8", x2: "21", y1: "18", y2: "18" }), _jsx("line", { x1: "3", x2: "3.01", y1: "6", y2: "6" }), _jsx("line", { x1: "3", x2: "3.01", y1: "12", y2: "12" }), _jsx("line", { x1: "3", x2: "3.01", y1: "18", y2: "18" })] }) })] }), layout === 'grid' && (_jsx("div", { className: "flex items-center space-x-1", children: [1, 2, 3, 4].map((col) => (_jsx("button", { onClick: () => setColumns(col), className: cn('px-2 py-1 rounded-md text-sm', columns === col
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'), children: col }, col))) }))] })] }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Task List" }), _jsx(TaskList, { tasks: tasks, layout: layout, columns: columns, gap: "md" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Task Card Variants" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(TaskCard, { title: "Default Variant", description: "Default styling", priority: "medium", status: "todo", progress: 50, variant: "default" }), _jsx(TaskCard, { title: "Primary Variant", description: "Primary styling", priority: "medium", status: "in-progress", progress: 50, variant: "primary" }), _jsx(TaskCard, { title: "Accent Variant", description: "Accent styling", priority: "medium", status: "review", progress: 50, variant: "accent" }), _jsx(TaskCard, { title: "Outline Variant", description: "Outline styling", priority: "medium", status: "done", progress: 50, variant: "outline" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Task Card Sizes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(TaskCard, { title: "Small Size", description: "Compact layout", priority: "medium", status: "todo", size: "sm" }), _jsx(TaskCard, { title: "Medium Size", description: "Standard layout", priority: "medium", status: "in-progress", size: "md" }), _jsx(TaskCard, { title: "Large Size", description: "Spacious layout with more details and information", priority: "medium", status: "done", size: "lg" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Interactive Task Cards" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(TaskCard, { title: "With Hover Effect", description: "Hover over me to see the effect", priority: "medium", status: "todo", withHover: true }), _jsx(TaskCard, { title: "With Shadow", description: "Card with shadow effect", priority: "medium", status: "todo", withShadow: true })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Task Card Components" }), _jsxs("div", { className: "p-4 border border-border rounded-lg space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Priority Badges" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(PriorityBadge, { priority: "low" }), _jsx(PriorityBadge, { priority: "medium" }), _jsx(PriorityBadge, { priority: "high" }), _jsx(PriorityBadge, { priority: "urgent" }), _jsx(PriorityBadge, { priority: "custom", customColor: "#9c27b0" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Status Badges" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(StatusBadge, { status: "todo" }), _jsx(StatusBadge, { status: "in-progress" }), _jsx(StatusBadge, { status: "review" }), _jsx(StatusBadge, { status: "done" }), _jsx(StatusBadge, { status: "blocked" }), _jsx(StatusBadge, { status: "custom", customColor: "#ff9800" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Task Progress" }), _jsxs("div", { className: "space-y-2 max-w-md", children: [_jsx(TaskProgress, { value: 25, showLabel: true }), _jsx(TaskProgress, { value: 50, showLabel: true }), _jsx(TaskProgress, { value: 75, showLabel: true }), _jsx(TaskProgress, { value: 100, showLabel: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Due Dates" }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx(DueDate, { date: "2025-06-30" }), _jsx(DueDate, { date: "2025-05-15", isPastDue: true }), _jsx(DueDate, { date: "2025-06-30", showIcon: false })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Assignees" }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx(Assignee, { name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/44.jpg" }), _jsx(Assignee, { name: "Jane Smith" }), _jsx(Assignee, { name: "Michael Chen", size: "sm" }), _jsx(Assignee, { name: "Sarah Johnson", size: "lg" })] })] })] })] })] })] }));
}
//# sourceMappingURL=TaskCardDemo.js.map