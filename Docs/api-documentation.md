# CodexCRM API Documentation

## 🔗 tRPC API Overview

CodexCRM uses [tRPC v11.3.1](https://trpc.io/) to provide end-to-end type safety between the client and server. All API endpoints are automatically type-checked at compile time, eliminating runtime type errors.

## 🏗️ API Architecture

### Base Configuration

**Endpoint**: `/api/trpc/[trpc]`
**Protocol**: HTTP POST (tRPC uses POST for all operations)
**Authentication**: JWT tokens via HTTP-only cookies
**Validation**: Zod schemas for all inputs and outputs

### Router Structure

```typescript
// Main app router structure
export const appRouter = createTRPCRouter({
  contacts: contactRouter,
  tasks: taskRouter,
  groups: groupRouter,
  // Additional routers as needed
});

export type AppRouter = typeof appRouter;
```

## 📞 Contacts Router

### Endpoints Overview

All contact endpoints require authentication and operate on the authenticated user's data.

### `contacts.list`

**Purpose**: Retrieve paginated list of contacts with optional filtering

**Method**: `query`

**Input Schema**:
```typescript
{
  search?: string;          // Text search across name, email, company
  groupId?: string;         // Filter by contact group UUID
}
```

**Output Schema**:
```typescript
{
  data: Contact[];          // Array of contact objects
  pagination?: {            // Pagination metadata
    total: number;
    page: number;
    limit: number;
  };
}
```

**Usage Example**:
```typescript
// List all contacts
const contacts = await api.contacts.list.query({});

// Search contacts
const searchResults = await api.contacts.list.query({
  search: "john@example.com"
});

// Filter by group
const groupContacts = await api.contacts.list.query({
  groupId: "550e8400-e29b-41d4-a716-446655440000"
});
```

### `contacts.save`

**Purpose**: Create or update a contact (upsert operation)

**Method**: `mutation`

**Input Schema**:
```typescript
{
  id?: string;                        // UUID (omit for create, include for update)
  full_name: string;                  // Required: Contact's full name
  email?: string | null;              // Optional: Email address (validated)
  phone?: string | null;              // Optional: Phone number
  phone_country_code?: string | null; // Optional: Country code for phone
  company_name?: string | null;       // Optional: Company name
  job_title?: string | null;          // Optional: Job title
  address_street?: string | null;     // Optional: Street address
  address_city?: string | null;       // Optional: City
  address_postal_code?: string | null; // Optional: Postal code
  address_country?: string | null;    // Optional: Country
  website?: string | null;            // Optional: Website URL (validated)
  profile_image_url?: string | null;  // Optional: Profile image URL
  notes?: string | null;              // Optional: Notes about contact
  tags?: string[] | null;             // Optional: Array of tags
  social_handles?: string[] | null;   // Optional: Social media handles
  source?: string | null;             // Optional: Lead source
  last_contacted_at?: Date | null;    // Optional: Last contact date
  enriched_data?: any | null;         // Optional: Additional enrichment data
  enrichment_status?: string | null;  // Optional: Data enrichment status
}
```

**Output Schema**:
```typescript
{
  id: string;              // UUID of created/updated contact
  success: boolean;        // Operation success status
  contact: Contact;        // Complete contact object
}
```

**Usage Example**:
```typescript
// Create new contact
const newContact = await api.contacts.save.mutate({
  full_name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  company_name: "Example Corp",
  job_title: "Software Engineer"
});

// Update existing contact
const updatedContact = await api.contacts.save.mutate({
  id: "existing-uuid",
  full_name: "John Smith",
  job_title: "Senior Engineer"
});
```

### `contacts.delete`

**Purpose**: Delete a contact (soft delete with referential integrity)

**Method**: `mutation`

**Input Schema**:
```typescript
{
  id: string;              // UUID of contact to delete
}
```

**Output Schema**:
```typescript
{
  success: boolean;        // Deletion success status
  id: string;              // UUID of deleted contact
}
```

**Usage Example**:
```typescript
const result = await api.contacts.delete.mutate({
  id: "550e8400-e29b-41d4-a716-446655440000"
});
```

### `contacts.getById`

**Purpose**: Retrieve a specific contact by ID

**Method**: `query`

**Input Schema**:
```typescript
{
  id: string;              // UUID of contact to retrieve
}
```

**Output Schema**:
```typescript
Contact | null             // Contact object or null if not found
```

**Usage Example**:
```typescript
const contact = await api.contacts.getById.query({
  id: "550e8400-e29b-41d4-a716-446655440000"
});
```

## ✅ Tasks Router

### Endpoints Overview

Task management endpoints for creating and managing tasks, projects, and workflows.

### `tasks.list`

**Purpose**: Retrieve tasks with filtering options

**Method**: `query`

**Input Schema**:
```typescript
{
  view?: string;              // View type: "board", "list", "calendar"
  projectId?: string | null;  // Filter by project UUID
  contactId?: string | null;  // Filter by associated contact UUID
}
```

**Output Schema**:
```typescript
{
  tasks: Task[];              // Array of task objects
  metadata?: {                // Additional metadata
    totalCount: number;
    viewType: string;
  };
}
```

**Usage Example**:
```typescript
// List all tasks
const allTasks = await api.tasks.list.query({});

// Filter by project
const projectTasks = await api.tasks.list.query({
  projectId: "project-uuid"
});

// Filter by contact
const contactTasks = await api.tasks.list.query({
  contactId: "contact-uuid"
});
```

### `tasks.create`

**Purpose**: Create a new task

**Method**: `mutation`

**Input Schema**:
```typescript
{
  title: string;                    // Required: Task title
  notes?: string;                   // Optional: Task description/notes
  status?: TaskStatus;              // Optional: Task status enum
  priority?: TaskPriority;          // Optional: Priority level enum
  category?: TaskCategory;          // Optional: Task category enum
  dueDate?: string | null;          // Optional: Due date (ISO string)
  completionDate?: string | null;   // Optional: Completion date
  contactId?: string | null;        // Optional: Associated contact UUID
  projectId?: string | null;        // Optional: Associated project UUID
  headingId?: string | null;        // Optional: Task heading/section UUID
  position?: number;                // Optional: Position in list
  is_repeating?: boolean;           // Optional: Recurring task flag
}
```

**Output Schema**:
```typescript
{
  id: string;                       // UUID of created task
  task: Task;                       // Complete task object
  success: boolean;                 // Creation success status
}
```

**Usage Example**:
```typescript
const newTask = await api.tasks.create.mutate({
  title: "Follow up with client",
  notes: "Schedule a meeting to discuss project requirements",
  priority: TaskPriority.HIGH,
  status: TaskStatus.PENDING,
  dueDate: "2025-06-20T09:00:00Z",
  contactId: "contact-uuid"
});
```

### `tasks.getById`

**Purpose**: Retrieve a specific task by ID

**Method**: `query`

**Input Schema**:
```typescript
{
  id: string;                       // UUID of task to retrieve
}
```

**Output Schema**:
```typescript
Task | null                         // Task object or null if not found
```

**Usage Example**:
```typescript
const task = await api.tasks.getById.query({
  id: "task-uuid"
});
```

### `tasks.update`

**Purpose**: Update an existing task

**Method**: `mutation`

**Input Schema**:
```typescript
{
  id: string;                       // UUID of task to update
  // All fields from create schema are optional for updates
  title?: string;
  notes?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  // ... additional fields as needed
}
```

**Output Schema**:
```typescript
{
  id: string;                       // UUID of updated task
  task: Task;                       // Updated task object
  success: boolean;                 // Update success status
}
```

### Task Enums

```typescript
enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

enum TaskCategory {
  FOLLOW_UP = 'follow_up',
  MEETING = 'meeting',
  CALL = 'call',
  EMAIL = 'email',
  ADMINISTRATIVE = 'administrative',
  RESEARCH = 'research'
}
```

## 👥 Groups Router

### Endpoints Overview

Contact group management for organizing and segmenting contacts.

### `groups.list`

**Purpose**: Retrieve all contact groups

**Method**: `query`

**Input Schema**:
```typescript
{}                                  // No input parameters required
```

**Output Schema**:
```typescript
{
  groups: Group[];                  // Array of group objects
}
```

### `groups.create`

**Purpose**: Create a new contact group

**Method**: `mutation`

**Input Schema**:
```typescript
{
  name: string;                     // Required: Group name
  description?: string;             // Optional: Group description
  color?: string;                   // Optional: Display color
}
```

**Output Schema**:
```typescript
{
  id: string;                       // UUID of created group
  group: Group;                     // Complete group object
  success: boolean;                 // Creation success status
}
```

### `groups.addContacts`

**Purpose**: Add contacts to a group

**Method**: `mutation`

**Input Schema**:
```typescript
{
  groupId: string;                  // UUID of target group
  contactIds: string[];             // Array of contact UUIDs to add
}
```

**Output Schema**:
```typescript
{
  success: boolean;                 // Operation success status
  addedCount: number;               // Number of contacts added
}
```

**Usage Example**:
```typescript
// Create a new group
const newGroup = await api.groups.create.mutate({
  name: "VIP Clients",
  description: "High-value customers",
  color: "#FF6B6B"
});

// Add contacts to the group
const result = await api.groups.addContacts.mutate({
  groupId: newGroup.id,
  contactIds: ["contact-1-uuid", "contact-2-uuid"]
});
```

## 🔒 Authentication & Security

### Authentication Middleware

All protected procedures require authentication:

```typescript
const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'Authentication required' 
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Guaranteed to be non-null
    },
  });
});
```

### Authorization Patterns

- **User Isolation**: All data is scoped to the authenticated user
- **Row Level Security**: Database-level security via Supabase RLS
- **Input Validation**: All inputs validated with Zod schemas
- **Error Sanitization**: Sensitive information filtered from error messages

### Rate Limiting

```typescript
const rateLimitedProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const isAllowed = await checkRateLimit(ctx.user.id);
  if (!isAllowed) {
    throw new TRPCError({ 
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded' 
    });
  }
  return next();
});
```

## 🔄 Error Handling

### Error Types

```typescript
// Standard tRPC error codes used
type TRPCErrorCode = 
  | 'BAD_REQUEST'          // Invalid input data
  | 'UNAUTHORIZED'         // Authentication required
  | 'FORBIDDEN'            // Insufficient permissions
  | 'NOT_FOUND'            // Resource doesn't exist
  | 'INTERNAL_SERVER_ERROR' // Server-side error
  | 'TOO_MANY_REQUESTS';   // Rate limiting
```

### Error Response Format

```typescript
{
  error: {
    code: string;          // tRPC error code
    message: string;       // User-friendly error message
    data?: {               // Additional error context
      code: string;        // Internal error code
      httpStatus: number;  // HTTP status code
      path?: string;       // API path where error occurred
    };
  };
}
```

### Client-Side Error Handling

```typescript
try {
  const contact = await api.contacts.save.mutate(contactData);
} catch (error) {
  if (error.data?.code === 'BAD_REQUEST') {
    // Handle validation errors
    showValidationErrors(error.message);
  } else if (error.data?.code === 'UNAUTHORIZED') {
    // Handle authentication errors
    redirectToLogin();
  } else {
    // Handle unexpected errors
    showErrorToast('An unexpected error occurred');
  }
}
```

## 📊 Data Types

### Contact Type

```typescript
interface Contact {
  id: string;                        // UUID
  user_id: string;                   // Owner UUID
  full_name: string;                 // Contact name
  email?: string | null;             // Email address
  phone?: string | null;             // Phone number
  phone_country_code?: string | null; // Country code
  company_name?: string | null;      // Company
  job_title?: string | null;         // Job title
  address_street?: string | null;    // Street address
  address_city?: string | null;      // City
  address_postal_code?: string | null; // Postal code
  address_country?: string | null;   // Country
  website?: string | null;           // Website URL
  profile_image_url?: string | null; // Profile image
  notes?: string | null;             // Notes
  tags?: string[] | null;            // Tags array
  social_handles?: string[] | null;  // Social media
  source?: string | null;            // Lead source
  last_contacted_at?: Date | null;   // Last contact date
  enriched_data?: any | null;        // Enrichment data
  enrichment_status?: string | null; // Enrichment status
  created_at: Date;                  // Creation timestamp
  updated_at: Date;                  // Update timestamp
}
```

### Task Type

```typescript
interface Task {
  id: string;                        // UUID
  user_id: string;                   // Owner UUID
  title: string;                     // Task title
  notes?: string | null;             // Task description
  status: TaskStatus;                // Current status
  priority: TaskPriority;            // Priority level
  category: TaskCategory;            // Task category
  due_date?: Date | null;            // Due date
  completion_date?: Date | null;     // Completion date
  contact_id?: string | null;        // Associated contact
  project_id?: string | null;        // Associated project
  heading_id?: string | null;        // Task section
  position: number;                  // List position
  is_repeating: boolean;             // Recurring flag
  created_at: Date;                  // Creation timestamp
  updated_at: Date;                  // Update timestamp
}
```

### Group Type

```typescript
interface Group {
  id: string;                        // UUID
  user_id: string;                   // Owner UUID
  name: string;                      // Group name
  description?: string | null;       // Description
  color?: string | null;             // Display color
  contact_count: number;             // Number of contacts
  created_at: Date;                  // Creation timestamp
  updated_at: Date;                  // Update timestamp
}
```

## 🚀 Performance Optimizations

### Automatic Batching

tRPC automatically batches multiple requests made within the same tick:

```typescript
// These will be batched into a single HTTP request
const [contacts, tasks, groups] = await Promise.all([
  api.contacts.list.query({}),
  api.tasks.list.query({}),
  api.groups.list.query({})
]);
```

### Response Caching

Client-side caching with TanStack Query:

```typescript
// Cached for 5 minutes, stale data served while revalidating
const { data: contacts } = api.contacts.list.useQuery({}, {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});
```

### Optimistic Updates

Immediate UI updates with automatic rollback on error:

```typescript
const mutation = api.contacts.save.useMutation({
  onMutate: async (newContact) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['contacts', 'list']);
    
    // Snapshot current value
    const previousContacts = queryClient.getQueryData(['contacts', 'list']);
    
    // Optimistically update
    queryClient.setQueryData(['contacts', 'list'], (old) => ({
      ...old,
      data: [...old.data, { ...newContact, id: 'temp-id' }]
    }));
    
    return { previousContacts };
  },
  
  onError: (err, newContact, context) => {
    // Rollback on error
    queryClient.setQueryData(['contacts', 'list'], context.previousContacts);
  },
  
  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries(['contacts', 'list']);
  },
});
```

## 📈 Future API Enhancements

### Planned Endpoints

- **Analytics Router**: Business intelligence and reporting
- **Calendar Router**: Scheduling and appointment management
- **Messages Router**: Communication and messaging
- **Files Router**: Document and file management
- **Automation Router**: Workflow automation and triggers

### API Versioning Strategy

- Semantic versioning for breaking changes
- Backward compatibility maintained for minor updates
- Deprecation notices for removed endpoints
- Migration guides for major version updates

This API documentation provides comprehensive coverage of all available endpoints, authentication patterns, error handling, and usage examples for the CodexCRM tRPC API.