# Groups Management System

## Overview

The Groups Management System is a core component of CodexCRM that enables users to organize contacts into logical groups for better relationship management and targeted communication. The system provides comprehensive CRUD operations, bulk contact management, and seamless integration with the contacts system.

## Directory Structure

```
/app/contacts/groups/
├── page.tsx                 # Main groups listing page (Server Component)
├── GroupsContent.tsx        # Primary groups management component (Client Component)
├── [groupId]/
│   └── page.tsx            # Individual group detail page
├── create/
│   └── page.tsx            # Group creation page
└── README.md               # This documentation
```

## Component Architecture

### 1. Page Components (Server Components)

#### `/groups/page.tsx`
- **Type**: Server Component
- **Purpose**: Main entry point for groups management
- **Responsibilities**:
  - Renders the page layout
  - Provides metadata and SEO optimization
  - Wraps the client-side GroupsContent component

```typescript
export default function GroupsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            Organize your contacts into groups for better management
          </p>
        </div>
      </div>
      <GroupsContent />
    </div>
  );
}
```

#### `/groups/[groupId]/page.tsx`
- **Type**: Server Component
- **Purpose**: Individual group detail view
- **Features**:
  - Group information display
  - Contact list within the group
  - Group editing capabilities
  - Contact management (add/remove)

#### `/groups/create/page.tsx`
- **Type**: Server Component
- **Purpose**: Dedicated group creation page
- **Features**:
  - Group creation form
  - Validation and error handling
  - Redirect to groups list on success

### 2. Client Components

#### GroupsContent (`GroupsContent.tsx`)
- **Type**: Client Component (`'use client'`)
- **Purpose**: Main interactive component for groups management
- **State Management**:
  ```typescript
  const [isContactSelectorOpen, setIsContactSelectorOpen] = useState(false);
  const [selectedGroupForContacts, setSelectedGroupForContacts] = useState<{
    id: string;
    name: string;
  } | null>(null);
  ```

##### Key Features:
1. **Group Display Grid**
   - Responsive card layout
   - Group metadata (name, description, emoji, contact count)
   - Action buttons (edit, delete, manage contacts)

2. **Group Creation/Editing**
   - Integrated with `GroupCreateDialog` component
   - Form validation with Zod schemas
   - Real-time feedback with toast notifications

3. **Contact Management**
   - Bulk contact selector integration
   - Add/remove contacts from groups
   - Real-time contact count updates

4. **Navigation Integration**
   - Click-to-filter functionality
   - Seamless navigation to contact filtering
   - URL state management

##### Data Fetching:
```typescript
// Groups list with contact counts
const { data: groups = [], isLoading, error } = api.groups.list.useQuery();

// Group deletion mutation
const deleteGroupMutation = api.groups.delete.useMutation({
  onSuccess: () => {
    toast.success('Group deleted successfully');
    utils.groups.list.invalidate();
  },
  onError: (error) => {
    toast.error(`Failed to delete group: ${error.message}`);
  },
});
```

## Supporting Components

### 1. GroupCreateDialog (`/components/groups/GroupCreateDialog.tsx`)
- **Purpose**: Modal dialog for creating and editing groups
- **Features**:
  - Form validation with Zod
  - Emoji picker integration
  - Color selection for group theming
  - Error handling and success feedback
  - Flexible trigger button configuration

#### Props Interface:
```typescript
interface GroupCreateDialogProps {
  triggerButtonLabel?: string;
  triggerButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerButtonClassName?: string;
  editingGroup?: Group | null;
  onSuccess?: () => void;
}
```

#### Form Schema:
```typescript
const groupFormSchema = z.object({
  name: z.string()
    .min(1, 'Group name is required')
    .max(100, 'Group name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .nullable()
    .optional(),
  emoji: z.string()
    .max(2, 'Emoji must be 2 characters or less')
    .nullable()
    .optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF0000)')
    .or(z.literal(''))
    .nullable()
    .optional()
    .transform(val => val === '' ? null : val),
});
```

### 2. BulkContactSelector (`/components/groups/BulkContactSelector.tsx`)
- **Purpose**: Modal for selecting multiple contacts to add to a group
- **Features**:
  - Contact search and filtering
  - Multi-select functionality
  - Current group membership display
  - Bulk add/remove operations

#### Props Interface:
```typescript
interface BulkContactSelectorProps {
  groupId: string;
  groupName: string;
  isOpen: boolean;
  onClose: () => void;
}
```

### 3. GroupContactsList (`/components/groups/GroupContactsList.tsx`)
- **Purpose**: Display and manage contacts within a specific group
- **Features**:
  - Contact avatars and information display
  - Individual contact removal
  - "Show more/less" functionality for large groups
  - Empty state handling

## Data Flow & API Integration

### 1. tRPC Router Integration

The groups system integrates with the groups router in `packages/server/src/routers/group.ts`:

#### Available Procedures:
```typescript
// Query procedures
- list: Fetch all groups with contact counts
- getById: Fetch individual group details
- getContacts: Fetch contacts within a specific group

// Mutation procedures
- save: Create or update a group
- delete: Remove a group
- addContact: Add a contact to a group
- removeContact: Remove a contact from a group
- addContacts: Bulk add contacts to a group
- removeContacts: Bulk remove contacts from a group
```

### 2. Database Schema

#### Groups Table:
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  emoji VARCHAR(2),
  color VARCHAR(7), -- Hex color format #RRGGBB
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Group Members Junction Table:
```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, contact_id)
);
```

### 3. Row Level Security (RLS)

All group operations are secured with RLS policies:

```sql
-- Groups table RLS
CREATE POLICY "groups_owner_policy" ON groups
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Group members table RLS
CREATE POLICY "group_members_owner_policy" ON group_members
FOR ALL TO authenticated
USING (
  group_id IN (
    SELECT id FROM groups WHERE user_id = auth.uid()
  )
);
```

## State Management Patterns

### 1. Local Component State
```typescript
// Modal visibility state
const [isContactSelectorOpen, setIsContactSelectorOpen] = useState(false);

// Selected group for contact management
const [selectedGroupForContacts, setSelectedGroupForContacts] = useState<{
  id: string;
  name: string;
} | null>(null);
```

### 2. Server State with tRPC
```typescript
// Query with automatic caching and revalidation
const { data: groups = [], isLoading, error } = api.groups.list.useQuery(
  undefined,
  { staleTime: 60000 } // Cache for 1 minute
);

// Mutations with optimistic updates
const deleteGroupMutation = api.groups.delete.useMutation({
  onSuccess: () => {
    // Invalidate and refetch groups list
    utils.groups.list.invalidate();
    // Update contacts list if group filter was active
    utils.contacts.list.invalidate();
  },
});
```

### 3. URL State Integration
```typescript
// Navigate to contacts with group filter
const handleGroupClick = (groupId: string) => {
  router.push(`/contacts?group=${groupId}`);
};
```

## User Experience Features

### 1. Visual Design
- **Card-based Layout**: Groups displayed in responsive grid cards
- **Visual Hierarchy**: Clear typography and spacing
- **Color Theming**: Custom colors for group identification
- **Emoji Support**: Visual group identification with emojis
- **Contact Count Badges**: Real-time member count display

### 2. Interaction Patterns
- **Click-to-Filter**: Groups are clickable for immediate contact filtering
- **Hover Effects**: Visual feedback for interactive elements
- **Loading States**: Skeleton loaders and button spinners
- **Error Handling**: Toast notifications for user feedback

### 3. Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: WCAG compliant color combinations

## Performance Optimizations

### 1. Data Fetching
- **Stale-While-Revalidate**: Cached data with background updates
- **Selective Invalidation**: Targeted cache updates
- **Optimistic Updates**: Immediate UI feedback for mutations

### 2. Rendering Optimizations
- **Component Memoization**: React.memo for expensive components
- **Lazy Loading**: Dynamic imports for heavy components
- **Virtual Scrolling**: For large group lists (future enhancement)

### 3. Bundle Optimization
- **Code Splitting**: Route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Compression**: Gzip/Brotli compression

## Error Handling & Validation

### 1. Form Validation
```typescript
// Client-side validation with Zod
const formSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  // ... other fields
});

// Server-side validation
export const groupInputSchema = z.object({
  name: z.string().min(1).max(100),
  // ... matching client schema
});
```

### 2. Error Boundaries
- **Component-level**: Error boundaries for graceful failure
- **Global Error Handling**: Application-wide error capture
- **User-friendly Messages**: Clear error communication

### 3. Validation Feedback
- **Inline Validation**: Real-time form validation
- **Toast Notifications**: Success/error feedback
- **Form State Management**: Proper loading and error states

## Testing Strategy

### 1. Unit Testing
- **Component Testing**: Individual component behavior
- **Hook Testing**: Custom hooks functionality
- **Utility Testing**: Helper function validation

### 2. Integration Testing
- **API Integration**: tRPC procedure testing
- **Database Operations**: CRUD operation validation
- **User Workflows**: End-to-end user scenarios

### 3. Accessibility Testing
- **Screen Reader Testing**: NVDA/JAWS compatibility
- **Keyboard Navigation**: Tab order and shortcuts
- **Color Contrast**: WCAG compliance validation

## Future Enhancements

### Planned Features
- [ ] **Group Hierarchies**: Nested group support
- [ ] **Smart Groups**: Dynamic groups based on criteria
- [ ] **Group Templates**: Predefined group configurations
- [ ] **Bulk Operations**: Mass group management
- [ ] **Group Analytics**: Usage and engagement metrics
- [ ] **Export/Import**: Group data portability
- [ ] **Group Sharing**: Collaborative group management
- [ ] **Advanced Permissions**: Role-based group access

### Technical Improvements
- [ ] **Real-time Updates**: WebSocket integration for live updates
- [ ] **Offline Support**: PWA capabilities for offline access
- [ ] **Performance Monitoring**: Real-time performance metrics
- [ ] **A/B Testing**: Feature flag integration
- [ ] **Advanced Caching**: Redis integration for improved performance
- [ ] **API Rate Limiting**: Request throttling and optimization

## Development Guidelines

### 1. Code Organization
- **Component Colocation**: Keep related files together
- **Clear Naming**: Descriptive component and function names
- **Consistent Patterns**: Follow established architectural patterns
- **Documentation**: Inline comments for complex logic

### 2. State Management
- **Minimal State**: Keep component state minimal and focused
- **Server State**: Use tRPC for all server-side data
- **URL State**: Use URL params for shareable application state
- **Form State**: Use React Hook Form for complex forms

### 3. Performance Considerations
- **Lazy Loading**: Dynamic imports for non-critical components
- **Memoization**: React.memo and useMemo for expensive operations
- **Debouncing**: Rate limiting for search and API calls
- **Caching**: Appropriate cache strategies for different data types

---

This documentation provides a comprehensive overview of the Groups Management System. For implementation details and code examples, refer to the individual component files and their inline documentation.