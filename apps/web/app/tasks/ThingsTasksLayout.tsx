/**
 * ThingsTasksLayout - Modern Task Management Interface
 * 
 * This component implements a Things-inspired task management interface for CodexCRM.
 * It features a more visually rich and spatially organized task management experience
 * compared to the classic TasksLayout.
 * 
 * Key features:
 * - Rich sidebar navigation with icons and category-based organization
 * - View-based task management (inbox, today, upcoming, someday, etc.)
 * - Project-based task grouping and organization
 * - Integration with tRPC for data fetching (tasks, categories, projects)
 * 
 * This layout has a direct dependency on:
 * - ThingsMainContent: Handles the main content area with task lists and forms
 * - AppSidebar: Provides the navigation sidebar structure
 * 
 * Parent: Root layout → Dashboard layout → Tasks section
 * 
 * Date: June 11, 2025
 */

'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { 
  Inbox, 
  Calendar, 
  CalendarDays, 
  Infinity, 
  Archive, 
  CheckCircle2,
  FolderClosed
} from 'lucide-react';

import { AppSidebar } from '@/components/app-sidebar';
import { ThingsMainContent } from './ThingsMainContent';
import { api } from '@/lib/trpc';

export function ThingsTasksLayout() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchParams = useSearchParams();
  const currentView = searchParams?.get('view') || 'inbox';

  // Fetch projects to populate the sidebar
  const { data: projects = [], isLoading: projectsLoading } = api.tasks.getCategories.useQuery();

  // Define the main navigation items for the Tasks/Things section
  const thingsNavMain = [
    {
      title: 'Inbox',
      url: '/tasks?view=inbox',
      icon: Inbox,
      isActive: currentView === 'inbox',
    },
    {
      title: 'Today',
      url: '/tasks?view=today',
      icon: Calendar,
      isActive: currentView === 'today',
    },
    {
      title: 'Upcoming',
      url: '/tasks?view=upcoming',
      icon: CalendarDays,
      isActive: currentView === 'upcoming',
    },
    {
      title: 'Anytime',
      url: '/tasks?view=anytime',
      icon: Infinity,
      isActive: currentView === 'anytime',
    },
    {
      title: 'Someday',
      url: '/tasks?view=someday',
      icon: Archive,
      isActive: currentView === 'someday',
    },
    {
      title: 'Logbook',
      url: '/tasks?view=logbook',
      icon: CheckCircle2,
      isActive: currentView === 'logbook',
    },
  ];

  // Format the fetched projects for the AppSidebar
  const thingsProjects = projectsLoading 
    ? [] 
    : projects.map((project: string) => ({
        name: project,
        url: `/tasks?view=project&project=${encodeURIComponent(project)}`,
        icon: FolderClosed,
      }));

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar 
        navMainData={thingsNavMain}
        projectsData={thingsProjects}
        className="h-full"
      />
      <main className="flex-1 overflow-y-auto">
        <ThingsMainContent
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </main>
    </div>
  );
}