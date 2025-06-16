'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createRoute } from '@/lib/utils/routes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertTriangle, Calendar, Plus } from 'lucide-react';
import { api } from '@/lib/trpc/client';
import { TaskStatus, TaskPriority } from '@codexcrm/db/src/models/Task';

export function TasksWidgets() {
  const { data: taskStats, isLoading } = api.task.getStats.useQuery();
  
  // Default stats in case the query is loading or fails
  const stats = {
    total: taskStats?.total || 0,
    completed: taskStats?.completed || 0,
    overdue: taskStats?.overdue || 0,
    dueToday: taskStats?.dueToday || 0,
    highPriority: taskStats?.highPriority || 0
  };

  // Calculate completion percentage
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Task Completion Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionPercentage}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.completed} of {stats.total} tasks completed
          </p>
          <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Due Today Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Due Today</CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.dueToday}</div>
          <p className="text-xs text-muted-foreground">
            Tasks due today
          </p>
        </CardContent>
        <CardFooter>
          <Link href={createRoute("/tasks/today")} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              View Today's Tasks
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Overdue Tasks Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.overdue}</div>
          <p className="text-xs text-muted-foreground">
            Tasks past their due date
          </p>
        </CardContent>
        <CardFooter>
          <Link href={createRoute("/tasks/overdue")} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              View Overdue Tasks
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* High Priority Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.highPriority}</div>
          <p className="text-xs text-muted-foreground">
            Tasks marked as high priority
          </p>
        </CardContent>
        <CardFooter>
          <Link href={createRoute("/tasks/new")} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create New Task
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
