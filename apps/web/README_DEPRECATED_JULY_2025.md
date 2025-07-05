<!--
Last Updated: 
Version: 1.0.0
Status: Under Review
-->

# Web Application Architecture

This document outlines the architecture and component structure of the web application, providing guidance for developers working on the project.

## Overview

The application is built using Next.js 14 with App Router, React Server Components, and a modular component architecture. It follows a clean separation of concerns with dedicated components for layout, UI elements, and page content.

## Core Layout Components

### MainLayout

The `MainLayout` component is the root layout for the application. It provides the overall structure including the floating sidebar and main content area.

**Location:** `components/layout/MainLayout.tsx`

**Key Features:**

- Implements a floating UI pattern with subtle background and shadow effects
- Uses the SidebarProvider for managing sidebar state
- Provides a responsive layout that works on various screen sizes

### AppContent

The `AppContent` component renders the main content area of the application, including the header and the page content.

**Location:** `components/layout/AppContent.tsx`

**Key Features:**

- Handles authentication state
- Provides a consistent container for all page content
- Manages responsive behavior for different viewport sizes

### AppSidebarController
s
The `AppSidebarController` determines which sidebar to display based on the current route. It dynamically imports the appropriate sidebar component.

**Location:** `components/layout/AppSidebarController.tsx`

**Key Features:**

- Uses path-based routing to determine the active section
- Lazy-loads the appropriate sidebar component
- Provides a fallback UI during loading

### PageHeader

The `PageHeader` component displays the page title, breadcrumbs, and any page-specific actions.

**Location:** `components/layout/PageHeader.tsx`

**Key Features:**

- Consistent header across all pages
- Breadcrumb navigation
- Support for page-specific action buttons
- Responsive design that adapts to different screen sizes

### MainSectionNav

The `MainSectionNav` component provides the main navigation for the application.

**Location:** `components/layout/MainSectionNav.tsx`

**Key Features:**

- Responsive navigation that collapses to icons on smaller screens
- Active state highlighting for the current section
- Data-driven navigation items for easy maintenance

## UI Component System

The application uses a comprehensive UI component system based on shadcn/ui, which provides accessible, reusable components built on Radix UI primitives.

**Location:** `components/ui/`

**Key Components:**

- `Card` - For content containers
- `Button` - For interactive elements
- `Dialog` - For modal interactions
- `Form` - For user input
- `Sidebar` - For navigation and contextual actions

## File Structure

The application follows these conventions:

- Components use PascalCase for both filenames and component names
- Page components are defined in `page.tsx` files within their respective route directories
- Shared UI components are in `components/ui/`
- Layout components are in `components/layout/`
- Section-specific components are organized in directories under their respective route folders
- Sidebar components are in `components/layout/sidebars/`
- Dashboard widgets are in `components/dashboard/` with each widget in its own subdirectory

## Adding a New Section

To add a new section to the application:

1. Create a new directory for the section under `app/` (e.g., `app/new-section/`)
2. Create a `page.tsx` file in this directory
3. Create a sidebar component in `components/layout/sidebars/NewSectionSidebar.tsx`
4. Add the new section to the `AppSidebarController` component
5. Add the section to the navigation in `components/layout/MainSectionNav.tsx`

### Example:

```tsx
// 1. Add to MainSectionNav.tsx
import { NewIcon } from 'lucide-react';

const mainNavItems = [
  // ... existing items
  { title: 'New Section', href: '/new-section', icon: NewIcon },
];

// 2. Add to AppSidebarController.tsx
if (pathname.startsWith('/new-section')) {
  return <NewSectionSidebar />;
}
```

## Dashboard Widgets

The dashboard uses a modular widget system. Widgets are self-contained components that display specific information or functionality.

**Location:** `components/dashboard/` with each widget in its own subdirectory

**Available Widgets:**

- `AiClientInsights` - AI-generated insights about clients
- `AiTaskPanel` - AI-suggested tasks requiring approval
- `BusinessMetricsCard` - Key business metrics and visualizations
- `CalendarPreview` - Upcoming appointments and events
- `DailyInspirationCard` - Motivational quotes for practitioners
- `QuickActions` - Common tasks and shortcuts
- `TherapistCheckIn` - Daily mood and client connection tracking

To add a new widget:

1. Create a new component in the appropriate directory (e.g., `components/dashboard/new-widget/NewWidget.tsx`)
2. Import and add it to the grid in `app/dashboard/components/DashboardWidgets.tsx`

```tsx
import { NewWidget } from '@/components/dashboard/new-widget/NewWidget';

export function DashboardWidgets() {
  return (
    <div className='space-y-6'>
      {/* Existing widgets */}
      <NewWidget className='h-full' />
    </div>
  );
}
```

## State Management

The application uses a combination of:

- React Context for UI state (sidebar, theme, etc.)
- React Query (via tRPC) for server state
- React Hook Form for form state
- Local component state for UI interactions

## API Integration

The application uses tRPC for type-safe API calls. API endpoints are defined in the `packages/server/src/routers/` directory.

## Authentication

Authentication is handled via Supabase Auth, with middleware to protect routes and components.

## Styling

The application uses Tailwind CSS for styling with a consistent design system. Custom components extend the base Tailwind classes.

## Best Practices

1. Use Server Components by default, only use Client Components when necessary
2. Keep components focused on a single responsibility
3. Use TypeScript for type safety
4. Follow the established naming conventions and file structure
5. Leverage the existing UI component system instead of creating custom components
6. Use data-driven approaches for dynamic content
7. Write comprehensive tests for critical functionality

## Development Workflow

1. Run the development server with `npm run dev`
2. Make changes to the codebase
3. Test your changes locally
4. Submit a pull request for review

## Troubleshooting

If you encounter issues:

1. Check the console for errors
2. Verify that all dependencies are installed
3. Ensure that environment variables are properly configured
4. Check that the API endpoints are functioning correctly
5. Verify that the authentication is working as expected
