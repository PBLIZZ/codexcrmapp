/**
 * Tasks Layout - Classic Tasks View Container
 * 
 * This component serves as the layout wrapper for the classic tasks view in the CodexCRM app.
 * It manages the state for category selection and search functionality within the tasks section.
 * 
 * Key features:
 * - Maintains selected category state (inbox, today, upcoming, etc.)
 * - Handles search query state for filtering tasks
 * - Delegates content rendering to TasksMainContent
 * - Works alongside MainLayout which provides the sidebar navigation
 * 
 * This represents one of two task management interfaces in the app:
 * 1. This TasksLayout (classic view)
 * 2. ThingsTasksLayout (Things-style view with different UX)
 * 
 * Date: June 11, 2025
 */

'use client';

import { useState } from 'react';
import { TasksMainContent } from './TasksMainContent';

export function TasksLayout() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // The sidebar is handled by MainLayout.tsx
  return (
    <div className="flex h-full">
      {/* Main Content */}
      <TasksMainContent
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  );
}