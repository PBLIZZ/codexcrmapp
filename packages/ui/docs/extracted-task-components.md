# Extracted Task Management Components Documentation

This document contains the extracted task-related code from the CodexCRM application that can be referenced when building the new tasks and calendar modules.

## Overview

The previous task management system included a comprehensive set of components with the following features:

### Key Components

#### 1. TaskBoard.tsx - Drag & Drop Kanban Board
- **Technology Stack**: @dnd-kit/core for drag and drop functionality
- **Features**:
  - Three-column layout (To Do, In Progress, Done)
  - Drag and drop between columns with position tracking
  - Real-time task status updates via tRPC
  - Category filtering support
  - Optimistic updates for better UX

**Key Technical Implementation**:
```typescript
// Drag and drop sensors with activation constraints
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
);

// Status-based task filtering
const todoTasks = tasks.filter(task => task.status === 'todo').sort((a, b) => a.position - b.position);
```

#### 2. TaskCard.tsx - Individual Task Display Component
- **Features**:
  - Sortable card with drag handle
  - Priority indicators with color coding
  - Expandable descriptions for long text
  - Action dropdown menu (edit, delete, status change)
  - Badge system for categories, due dates, contacts, AI generation
  - Business impact scoring (1-10 scale)

**Priority System**:
```typescript
const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: 'bg-red-500 hover:bg-red-600',
  [TaskPriority.MEDIUM]: 'bg-yellow-500 hover:bg-yellow-600',
  [TaskPriority.LOW]: 'bg-blue-500 hover:bg-blue-600',
  [TaskPriority.NONE]: 'bg-gray-500 hover:bg-gray-600',
};
```

#### 3. TaskForm.tsx - Comprehensive Task Creation/Editing
- **Form Technology**: react-hook-form + Zod validation
- **Features**:
  - All task properties (title, description, status, priority, category)
  - Date picker for due dates
  - Color selection system
  - Business impact rating (1-10)
  - Contact assignment capability
  - AI generation flag

**Form Schema Structure**:
```typescript
const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: z.nativeEnum(TaskCategory).optional(),
  color: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  contactId: z.string().optional().nullable(),
  business_impact: z.number().optional().nullable(),
  ai_generated: z.boolean().optional(),
});
```

### Data Models

#### Task Interface
```typescript
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string | null;
  color: string | null;
  due_date: string | null;
  contact_id: string | null;
  business_impact: number | null;
  position: number;
  ai_generated: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}
```

#### Enums Used
```typescript
enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  CANCELED = 'canceled'
}

enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none'
}

enum TaskCategory {
  INBOX = 'inbox',
  TODAY = 'today',
  UPCOMING = 'upcoming',
  ANYTIME = 'anytime',
  SOMEDAY = 'someday'
}
```

### Other Notable Components Found

1. **TaskColumn.tsx** - Column wrapper for Kanban board
2. **TaskDetailView.tsx** - Full task view with all details
3. **VirtualizedTaskList.tsx** - Performance optimized list for large datasets
4. **DraggableTaskList.tsx** - Alternative list view with drag/drop
5. **CategoryViews.tsx** - Category-based task filtering
6. **KeyboardShortcuts.tsx** - Keyboard navigation support
7. **BreadcrumbNavigation.tsx** - Task navigation breadcrumbs
8. **TasksWidgets.tsx** - Dashboard integration components
9. **AiTaskPanel.tsx** - AI-powered task suggestions

### Integration Points

#### tRPC API Integration
The components heavily used tRPC for:
- `api.tasks.list` - Fetching tasks
- `api.tasks.update` - Updating task properties
- `api.tasks.updatePositions` - Bulk position updates
- `api.tasks.delete` - Task deletion

#### Contact System Integration
Tasks were integrated with the contact system:
- Contact assignment to tasks
- Contact-specific task filtering
- Task display in contact detail views

### Technical Considerations for New Implementation

1. **Performance**: The previous system used virtualization for large task lists
2. **Real-time Updates**: Optimistic updates were used for immediate feedback
3. **Accessibility**: Keyboard navigation and ARIA labels were implemented
4. **Mobile Support**: Responsive design with touch-friendly interactions
5. **State Management**: Local state with server synchronization via tRPC

### Recommendations for New Build

**Keep These Concepts**:
- Drag & drop functionality for intuitive task management
- Priority and category systems for organization
- Contact integration for CRM functionality
- Color coding for visual organization
- Business impact scoring for prioritization

**Consider Improvements**:
- Calendar integration for better date management
- Advanced filtering and search capabilities
- Team collaboration features
- Time tracking integration
- Template system for recurring tasks

### Dependencies Used
- `@dnd-kit/core` - Drag and drop functionality
- `react-hook-form` - Form management
- `@hookform/resolvers/zod` - Form validation
- `date-fns` - Date formatting
- `lucide-react` - Icons
- Custom UI components from the design system

This extraction serves as a reference for understanding the previous implementation's scope and complexity while building the new task and calendar modules.