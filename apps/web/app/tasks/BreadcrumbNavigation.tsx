'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  active: boolean;
}

export function BreadcrumbNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get current view and project from URL
  const currentView = searchParams?.get('view') || 'inbox';
  const currentProject = searchParams?.get('project') || null;
  
  // Build breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Tasks',
      href: '/tasks',
      active: !currentView || currentView === 'inbox'
    }
  ];
  
  // Add view-specific breadcrumb
  if (currentView && currentView !== 'inbox') {
    const viewLabel = (() => {
      switch(currentView) {
        case 'today': return 'Today';
        case 'upcoming': return 'Upcoming';
        case 'anytime': return 'Anytime';
        case 'someday': return 'Someday';
        case 'logbook': return 'Logbook';
        case 'project': return 'Projects';
        default: return currentView.charAt(0).toUpperCase() + currentView.slice(1);
      }
    })();
    
    breadcrumbs.push({
      label: viewLabel,
      href: `/tasks?view=${currentView}`,
      active: currentView !== 'project' || !currentProject
    });
  }
  
  // Add project-specific breadcrumb
  if (currentView === 'project' && currentProject) {
    breadcrumbs.push({
      label: currentProject,
      href: `/tasks?view=project&project=${encodeURIComponent(currentProject)}`,
      active: true
    });
  }
  
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        <li>
          <Link 
            href="/dashboard" 
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-gray-400" aria-hidden="true" />
            <Link
              href={item.href}
              className={`
                ${item.active ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}
                ${index === breadcrumbs.length - 1 ? 'pointer-events-none' : ''}
              `}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}