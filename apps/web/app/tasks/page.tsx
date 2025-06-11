'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { ThingsTasksLayout } from './ThingsTasksLayout';

export default function TasksPage() {
  return (
    <SidebarProvider>
      <ThingsTasksLayout />
    </SidebarProvider>
  );
}