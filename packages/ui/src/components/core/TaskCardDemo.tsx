'use client';

import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  TaskCard,
  TaskList,
  PriorityBadge,
  StatusBadge,
  TaskProgress,
  DueDate,
  Assignee,
} from '../ui/task-card';

export interface TaskCardDemoProps {
  className?: string;
}

export function TaskCardDemo({ className }: TaskCardDemoProps) {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [columns, setColumns] = useState<1 | 2 | 3 | 4>(2);

  // Sample tasks data
  const tasks = [
    {
      title: 'Implement Authentication',
      description: 'Set up user authentication with JWT and secure routes',
      priority: 'high' as const,
      status: 'in-progress' as const,
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
      priority: 'medium' as const,
      status: 'todo' as const,
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
      priority: 'high' as const,
      status: 'review' as const,
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
      priority: 'low' as const,
      status: 'done' as const,
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
      priority: 'urgent' as const,
      status: 'blocked' as const,
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
      priority: 'medium' as const,
      status: 'todo' as const,
      progress: 10,
      dueDate: '2025-06-25',
      assignee: {
        name: 'Emily Davis',
      },
      tags: ['Documentation'],
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Task Cards</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 mr-4">
            <button
              onClick={() => setLayout('grid')}
              className={cn(
                'p-1 rounded-md',
                layout === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setLayout('list')}
              className={cn(
                'p-1 rounded-md',
                layout === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" x2="21" y1="6" y2="6" />
                <line x1="8" x2="21" y1="12" y2="12" />
                <line x1="8" x2="21" y1="18" y2="18" />
                <line x1="3" x2="3.01" y1="6" y2="6" />
                <line x1="3" x2="3.01" y1="12" y2="12" />
                <line x1="3" x2="3.01" y1="18" y2="18" />
              </svg>
            </button>
          </div>
          {layout === 'grid' && (
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4].map((col) => (
                <button
                  key={col}
                  onClick={() => setColumns(col as 1 | 2 | 3 | 4)}
                  className={cn(
                    'px-2 py-1 rounded-md text-sm',
                    columns === col
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {col}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Task List</h3>
          <TaskList
            tasks={tasks}
            layout={layout}
            columns={columns}
            gap="md"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Task Card Variants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TaskCard
              title="Default Variant"
              description="Default styling"
              priority="medium"
              status="todo"
              progress={50}
              variant="default"
            />

            <TaskCard
              title="Primary Variant"
              description="Primary styling"
              priority="medium"
              status="in-progress"
              progress={50}
              variant="primary"
            />

            <TaskCard
              title="Accent Variant"
              description="Accent styling"
              priority="medium"
              status="review"
              progress={50}
              variant="accent"
            />

            <TaskCard
              title="Outline Variant"
              description="Outline styling"
              priority="medium"
              status="done"
              progress={50}
              variant="outline"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Task Card Sizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskCard
              title="Small Size"
              description="Compact layout"
              priority="medium"
              status="todo"
              size="sm"
            />

            <TaskCard
              title="Medium Size"
              description="Standard layout"
              priority="medium"
              status="in-progress"
              size="md"
            />

            <TaskCard
              title="Large Size"
              description="Spacious layout with more details and information"
              priority="medium"
              status="done"
              size="lg"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Interactive Task Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaskCard
              title="With Hover Effect"
              description="Hover over me to see the effect"
              priority="medium"
              status="todo"
              withHover
            />

            <TaskCard
              title="With Shadow"
              description="Card with shadow effect"
              priority="medium"
              status="todo"
              withShadow
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Task Card Components</h3>
          <div className="p-4 border border-border rounded-lg space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Priority Badges</h4>
              <div className="flex flex-wrap gap-2">
                <PriorityBadge priority="low" />
                <PriorityBadge priority="medium" />
                <PriorityBadge priority="high" />
                <PriorityBadge priority="urgent" />
                <PriorityBadge priority="custom" customColor="#9c27b0" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Status Badges</h4>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="todo" />
                <StatusBadge status="in-progress" />
                <StatusBadge status="review" />
                <StatusBadge status="done" />
                <StatusBadge status="blocked" />
                <StatusBadge status="custom" customColor="#ff9800" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Task Progress</h4>
              <div className="space-y-2 max-w-md">
                <TaskProgress value={25} showLabel />
                <TaskProgress value={50} showLabel />
                <TaskProgress value={75} showLabel />
                <TaskProgress value={100} showLabel />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Due Dates</h4>
              <div className="flex flex-wrap gap-4">
                <DueDate date="2025-06-30" />
                <DueDate date="2025-05-15" isPastDue />
                <DueDate date="2025-06-30" showIcon={false} />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Assignees</h4>
              <div className="flex flex-wrap gap-4">
                <Assignee name="John Doe" avatar="https://randomuser.me/api/portraits/men/44.jpg" />
                <Assignee name="Jane Smith" />
                <Assignee name="Michael Chen" size="sm" />
                <Assignee name="Sarah Johnson" size="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}