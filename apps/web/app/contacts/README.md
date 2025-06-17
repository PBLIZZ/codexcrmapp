# Contacts & Groups Management System

## Overview

The CodexCRM contacts and groups management system provides a comprehensive solution for managing customer relationships with advanced filtering, grouping, and organization capabilities. The system is built using Next.js App Router with tRPC for type-safe API communication and Supabase for backend data management.

## Architecture Overview

```
/app/contacts/
├── page.tsx                    # Main contacts listing page
├── ContactsView.tsx           # Primary contacts view component (Client Component)
├── ContactsTable.tsx          # Data table with sorting/filtering
├── ContactForm.tsx            # Create/edit contact form
├── ContactGroupManager.tsx    # Inline group management for contacts
├── ContactGroupTags.tsx       # Group badge display component
├── ColumnSelector.tsx         # Table column visibility controls
├── FormComponents.tsx         # Reusable form field components
├── form-config.ts            # Form validation schemas and configuration
├── [contactId]/              # Dynamic contact detail routes
│   ├── page.tsx              # Contact detail view page
│   ├── ContactDetailView.tsx # Contact detail component
│   ├── ContactGroupsSection.tsx # Group management in detail view
│   ├── ContactTimeline.tsx   # Activity timeline component
│   └── edit/
│       └── page.tsx          # Contact edit page
├── groups/                   # Groups management section
│   ├── page.tsx              # Groups listing page
│   ├── GroupsContent.tsx     # Groups management component
│   ├── [groupId]/
│   │   └── page.tsx          # Individual group detail page
│   └── create/
│       └── page.tsx          # Group creation page
├── new/
│   └── page.tsx              # New contact creation page
└── import/
    └── page.tsx              # CSV import functionality
```

## Component Hierarchy & Responsibilities

### 1. Layout Components

#### ContactsSidebar (`/components/layout/sidebars/ContactsSidebar.tsx`)
- **Purpose**: Navigation sidebar for contacts section
- **Features**:
  - Total contacts count display
  - Group filtering with contact counts
  - Quick actions (Create Group, Manage Groups)
  - Active state management for selected groups
- **State Management**: Uses URL search params for group filtering
- **Data Fetching**: 
  - `api.contacts.getTotalContactsCount.useQuery()`
  - `api.groups.list.useQuery()`

### 2. Main View Components

#### ContactsView (`/app/contacts/ContactsView.tsx`)
- **Type**: Client Component (`'use client'`)
- **Purpose**: Primary container for contacts listing and management
- **Features**:
  - Search functionality with debounced queries
  - Column visibility controls
  - Sorting and filtering
  - Contact creation/editing modal
  - Group-based filtering via URL params
- **State Management**:
  ```typescript
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('full_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  ```
- **Data Fetching**: `api.contacts.list.useQuery({ search, groupId })`

#### ContactsTable (`/app/contacts/ContactsTable.tsx`)
- **Purpose**: Data table component with advanced features
- **Features**:
  - Sortable columns
  - Responsive design
  - Action buttons (edit, delete)
  - Group management integration
  - Avatar display with fallbacks
- **Props Interface**:
  ```typescript
  interface ContactsTableProps {
    contacts: Contact[];
    visibleColumns: string[];
    sortField: string;
    sortDirection: 'asc' | 'desc';
    onSort: (field: string) => void;
    onEdit: (contact: Contact) => void;
    onDelete: (contactId: string) => void;
    isLoading?: boolean;
  }
  ```

### 3. Form Components

#### ContactForm (`/app/contacts/ContactForm.tsx`)
- **Type**: Client Component
- **Purpose**: Comprehensive contact creation/editing form
- **Features**:
  - Multi-step form layout
  - Image upload with Supabase Storage
  - Real-time validation with Zod
  - Auto-save functionality
  - Social media profile management
- **Validation Schema**: Defined in `form-config.ts`
- **Form Sections**:
  - Basic Information (name, email, phone)
  - Company Details (company, job title, website)
  - Address Information
  - Social Profiles
  - Notes and Tags

#### FormComponents (`/app/contacts/FormComponents.tsx`)
- **Purpose**: Reusable form field components
- **Components**:
  - `FormInput`: Standard text input with validation
  - `FormTextarea`: Multi-line text input
  - `FormSelect`: Dropdown selection
  - `FormImageUpload`: Image upload with preview
- **Features**: Consistent styling, error handling, accessibility

### 4. Group Management Components

#### GroupsContent (`/app/contacts/groups/GroupsContent.tsx`)
- **Type**: Client Component
- **Purpose**: Main groups management interface
- **Features**:
  - Group creation/editing/deletion
  - Contact count display
  - Bulk contact assignment
  - Group filtering navigation
- **State Management**:
  ```typescript
  const [isContactSelectorOpen, setIsContactSelectorOpen] = useState(false);
  const [selectedGroupForContacts, setSelectedGroupForContacts] = useState<{
    id: string;
    name: string;
  } | null>(null);
  ```

#### ContactGroupManager (`/app/contacts/ContactGroupManager.tsx`)
- **Purpose**: Inline group management within contacts table
- **Features**:
  - Add/remove contacts from groups
  - Group badge display
  - Dropdown group selection
  - Real-time updates with cache invalidation

#### GroupCreateDialog (`/components/groups/GroupCreateDialog.tsx`)
- **Purpose**: Modal dialog for creating/editing groups
- **Features**:
  - Form validation with Zod
  - Emoji picker integration
  - Color selection
  - Error handling and success feedback

### 5. Detail View Components

#### ContactDetailView (`/app/contacts/[contactId]/ContactDetailView.tsx`)
- **Purpose**: Comprehensive contact detail and editing interface
- **Features**:
  - In-place editing (following user preferences)
  - Save/Discard buttons
  - Unsaved changes warning
  - Group management section
  - Activity timeline
- **User Experience**: Direct editing without separate modal/page

#### ContactGroupsSection (`/app/contacts/[contactId]/ContactGroupsSection.tsx`)
- **Purpose**: Group management within contact detail view
- **Features**:
  - Current group memberships display
  - Add/remove from groups
  - Group creation from contact view

## Data Flow & State Management

### 1. tRPC Integration

The system uses tRPC for type-safe API communication with the following main routers:

#### Contacts Router (`packages/server/src/routers/contact.ts`)
```typescript
// Main procedures
- list: Query contacts with search and group filtering
- getById: Fetch individual contact details
- getTotalContactsCount: Get total contacts count for sidebar
- save: Create or update contact
- delete: Remove contact
```

#### Groups Router (`packages/server/src/routers/group.ts`)
```typescript
// Main procedures
- list: Query all groups with contact counts
- getById: Fetch individual group details
- save: Create or update group
- delete: Remove group
- addContact: Add contact to group
- removeContact: Remove contact from group
```

### 2. Cache Management

The system uses TanStack Query v4 integrated with tRPC for efficient cache management:

```typescript
// Cache invalidation patterns
await utils.contacts.list.invalidate();
await utils.groups.list.invalidate();
await utils.contacts.getTotalContactsCount.invalidate();
```

### 3. URL State Management

Group filtering is managed through URL search parameters:
```typescript
// Reading current group filter
const currentGroupId = searchParams.get('group');

// Setting group filter
router.push(`/contacts?group=${groupId}`);

// Clearing group filter
router.push('/contacts');
```

## Form Validation & Schemas

### Contact Form Schema (`form-config.ts`)
```typescript
export const contactFormSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  job_title: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  // ... additional fields
});
```

### Group Form Schema
```typescript
export const groupFormSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  description: z.string().max(500).optional(),
  emoji: z.string().max(2).optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color')
    .or(z.literal(''))
    .optional()
    .transform(val => val === '' ? null : val),
});
```

## UI/UX Patterns

### 1. Design System
- **Framework**: Tailwind CSS for styling
- **Components**: Shadcn UI component library
- **Icons**: Lucide React icons
- **Notifications**: Sonner toast system

### 2. Responsive Design
- Mobile-first approach
- Collapsible sidebar on smaller screens
- Responsive table with horizontal scrolling
- Touch-friendly button sizes

### 3. Loading States
- Skeleton loaders for data fetching
- Button loading states with spinners
- Progressive loading for large datasets

### 4. Error Handling
- Form validation with inline error messages
- Toast notifications for success/error feedback
- Graceful error boundaries
- Retry mechanisms for failed requests

## Key Features

### 1. Contact Management
- ✅ Create, read, update, delete contacts
- ✅ Advanced search and filtering
- ✅ Photo upload with Supabase Storage
- ✅ Group assignment and management
- ✅ CSV import functionality
- ✅ In-place editing in detail view
- ✅ Activity timeline tracking

### 2. Group Management
- ✅ Create, edit, delete groups
- ✅ Bulk contact assignment
- ✅ Group-based filtering
- ✅ Contact count tracking
- ✅ Emoji and color customization
- ✅ Hierarchical navigation

### 3. User Experience
- ✅ Real-time search with debouncing
- ✅ Optimistic updates
- ✅ Keyboard navigation support
- ✅ Consistent loading states
- ✅ Mobile-responsive design
- ✅ Accessibility compliance

## Security & Performance

### 1. Row Level Security (RLS)
- All data is user-scoped through Supabase RLS policies
- Contact and group access restricted to authenticated users
- File uploads isolated by user ID

### 2. Performance Optimizations
- Debounced search queries (300ms)
- Efficient pagination for large datasets
- Optimized database queries with proper indexing
- Image optimization and lazy loading
- Cache invalidation strategies

### 3. Type Safety
- End-to-end type safety with tRPC
- Zod validation on both client and server
- TypeScript strict mode enabled
- Comprehensive error handling

## Development Guidelines

### 1. Component Structure
- Use PascalCase for component files and functions
- Prefer named exports over default exports
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks

### 2. State Management
- Use React hooks for local component state
- Leverage tRPC/TanStack Query for server state
- Minimize prop drilling with proper component composition
- Use URL state for shareable application state

### 3. Error Handling
- Implement proper error boundaries
- Provide meaningful error messages to users
- Log errors appropriately for debugging
- Graceful degradation for non-critical features

### 4. Testing Considerations
- Components are designed for testability
- Clear separation of concerns
- Mockable API layer through tRPC
- Accessible DOM structure for testing

## Future Enhancements

### Planned Features
- [ ] Advanced contact filtering (tags, date ranges, custom fields)
- [ ] Contact merge functionality for duplicates
- [ ] Email integration and tracking
- [ ] Contact scoring and lead management
- [ ] Advanced analytics and reporting
- [ ] Integration with external CRM systems
- [ ] Mobile app support
- [ ] Offline functionality

### Technical Improvements
- [ ] Implement virtual scrolling for large datasets
- [ ] Add comprehensive test coverage
- [ ] Implement advanced caching strategies
- [ ] Add real-time collaboration features
- [ ] Performance monitoring and optimization
- [ ] Enhanced accessibility features

---

This documentation serves as a comprehensive guide to the contacts and groups management system. For specific implementation details, refer to the individual component files and their inline documentation.