# CodexCRM API Documentation

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints (tRPC)](#api-endpoints-trpc)
3. [UI Components](#ui-components)
4. [Database Schema](#database-schema)
5. [Authentication](#authentication)
6. [Utility Functions](#utility-functions)
7. [Configuration](#configuration)
8. [Examples](#examples)

---

## Overview

CodexCRM is a Customer Relationship Management application built with a modern full-stack TypeScript setup. The application uses tRPC for type-safe API communication, Supabase for database and authentication, and a collection of reusable UI components.

### Architecture

- **Frontend**: Next.js 15 with App Router
- **Backend**: tRPC for API layer
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI**: Shadcn UI components with Tailwind CSS
- **Validation**: Zod schemas throughout
- **Package Structure**: Monorepo with pnpm workspaces

---

## API Endpoints (tRPC)

All API endpoints are implemented using tRPC and are automatically type-safe. The API uses protected procedures that require authentication.

### Base URL

```typescript
// Client-side tRPC setup
import { api } from '@/lib/trpc';
```

### Contact Router

#### `contact.list`

**Description**: Retrieve all contacts for the authenticated user.

**Type**: `query`

**Authentication**: Required

**Parameters**: None

**Returns**: `Contact[]`

**Example**:
```typescript
const { data: contacts } = api.contact.list.useQuery();
```

**Response**:
```typescript
interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  profile_image_url?: string | null;
  notes?: string | null;
  source?: string | null;
  last_contacted_at?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}
```

#### `contact.getById`

**Description**: Retrieve a specific contact by ID.

**Type**: `query`

**Authentication**: Required

**Parameters**:
- `contactId` (string, UUID): The ID of the contact to retrieve

**Returns**: `Contact`

**Example**:
```typescript
const { data: contact } = api.contact.getById.useQuery({ 
  contactId: "550e8400-e29b-41d4-a716-446655440000" 
});
```

#### `contact.save`

**Description**: Create a new contact or update an existing one.

**Type**: `mutation`

**Authentication**: Required

**Parameters**:
```typescript
interface ContactInput {
  id?: string; // Optional for creation, required for updates
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  profile_image_url?: string | null;
  notes?: string | null;
  source?: string | null;
  last_contacted_at?: Date | null;
}
```

**Returns**: `Contact`

**Example**:
```typescript
const createContact = api.contact.save.useMutation();

// Create new contact
createContact.mutate({
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  company_name: "Acme Corp"
});

// Update existing contact
createContact.mutate({
  id: "550e8400-e29b-41d4-a716-446655440000",
  first_name: "John",
  last_name: "Smith",
  email: "john.smith@example.com"
});
```

#### `contact.delete`

**Description**: Delete a contact by ID.

**Type**: `mutation`

**Authentication**: Required

**Parameters**:
- `contactId` (string, UUID): The ID of the contact to delete

**Returns**: `{ success: boolean; deletedContactId: string }`

**Example**:
```typescript
const deleteContact = api.contact.delete.useMutation();

deleteContact.mutate({
  contactId: "550e8400-e29b-41d4-a716-446655440000"
});
```

### Group Router

#### `group.list`

**Description**: Retrieve all groups for the authenticated user with contact counts.

**Type**: `query`

**Authentication**: Required

**Parameters**: None

**Returns**: `GroupWithContactCount[]`

**Example**:
```typescript
const { data: groups } = api.group.list.useQuery();
```

**Response**:
```typescript
interface GroupWithContactCount {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  emoji?: string | null;
  contactCount: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}
```

#### `group.getById`

**Description**: Retrieve a specific group by ID.

**Type**: `query`

**Authentication**: Required

**Parameters**:
- `groupId` (string, UUID): The ID of the group to retrieve

**Returns**: `Group`

**Example**:
```typescript
const { data: group } = api.group.getById.useQuery({ 
  groupId: "550e8400-e29b-41d4-a716-446655440000" 
});
```

#### `group.save`

**Description**: Create a new group or update an existing one.

**Type**: `mutation`

**Authentication**: Required

**Parameters**:
```typescript
interface GroupInput {
  id?: string; // Optional for creation, required for updates
  name: string; // 1-100 characters
  description?: string | null; // Max 500 characters
  color?: string | null; // Valid hex color (e.g., #FF0000)
  emoji?: string | null; // 1-2 characters
}
```

**Returns**: `Group`

**Example**:
```typescript
const saveGroup = api.group.save.useMutation();

// Create new group
saveGroup.mutate({
  name: "VIP Clients",
  description: "Our most important clients",
  color: "#FF0000",
  emoji: "⭐"
});
```

#### `group.delete`

**Description**: Delete a group by ID (also removes all contact associations).

**Type**: `mutation`

**Authentication**: Required

**Parameters**:
- `groupId` (string, UUID): The ID of the group to delete

**Returns**: `{ success: boolean; deletedGroupId: string }`

**Example**:
```typescript
const deleteGroup = api.group.delete.useMutation();

deleteGroup.mutate({
  groupId: "550e8400-e29b-41d4-a716-446655440000"
});
```

#### `group.addContact`

**Description**: Add a contact to a group.

**Type**: `mutation`

**Authentication**: Required

**Parameters**:
- `groupId` (string, UUID): The ID of the group
- `contactId` (string, UUID): The ID of the contact to add

**Returns**: `GroupMember[]`

**Example**:
```typescript
const addContactToGroup = api.group.addContact.useMutation();

addContactToGroup.mutate({
  groupId: "550e8400-e29b-41d4-a716-446655440000",
  contactId: "660e8400-e29b-41d4-a716-446655440000"
});
```

#### `group.removeContact`

**Description**: Remove a contact from a group.

**Type**: `mutation`

**Authentication**: Required

**Parameters**:
- `groupId` (string, UUID): The ID of the group
- `contactId` (string, UUID): The ID of the contact to remove

**Returns**: `{ success: boolean }`

**Example**:
```typescript
const removeContactFromGroup = api.group.removeContact.useMutation();

removeContactFromGroup.mutate({
  groupId: "550e8400-e29b-41d4-a716-446655440000",
  contactId: "660e8400-e29b-41d4-a716-446655440000"
});
```

#### `group.getContacts`

**Description**: Get all contacts in a specific group.

**Type**: `query`

**Authentication**: Required

**Parameters**:
- `groupId` (string, UUID): The ID of the group

**Returns**: `Contact[]`

**Example**:
```typescript
const { data: contacts } = api.group.getContacts.useQuery({ 
  groupId: "550e8400-e29b-41d4-a716-446655440000" 
});
```

#### `group.getGroupsForContact`

**Description**: Get all groups that a specific contact belongs to.

**Type**: `query`

**Authentication**: Required

**Parameters**:
- `contactId` (string, UUID): The ID of the contact

**Returns**: `Group[]`

**Example**:
```typescript
const { data: groups } = api.group.getGroupsForContact.useQuery({ 
  contactId: "660e8400-e29b-41d4-a716-446655440000" 
});
```

### Storage Router

#### `storage.getUploadUrl`

**Description**: Get a presigned URL for uploading files to storage.

**Type**: `mutation`

**Authentication**: Required

**Parameters**:
- `fileName` (string): The name of the file to upload
- `fileType` (string): The MIME type of the file

**Returns**: `{ uploadUrl: string; publicUrl: string }`

**Example**:
```typescript
const getUploadUrl = api.storage.getUploadUrl.useMutation();

const { uploadUrl, publicUrl } = await getUploadUrl.mutateAsync({
  fileName: "profile-photo.jpg",
  fileType: "image/jpeg"
});
```

---

## UI Components

All UI components are built using Shadcn UI and are fully typed with TypeScript. They follow a consistent design system and are customizable via props.

### Button

**Location**: `apps/web/components/ui/button.tsx`

**Description**: A versatile button component with multiple variants and sizes.

**Props**:
```typescript
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

**Examples**:
```tsx
import { Button } from "@/components/ui/button";

// Default button
<Button>Click me</Button>

// Destructive button
<Button variant="destructive">Delete</Button>

// Small outline button
<Button variant="outline" size="sm">Cancel</Button>

// Icon button
<Button variant="ghost" size="icon">
  <TrashIcon className="h-4 w-4" />
</Button>

// As a link
<Button variant="link" asChild>
  <a href="/dashboard">Go to Dashboard</a>
</Button>
```

### Input

**Location**: `apps/web/components/ui/input.tsx`

**Description**: A styled input component for forms.

**Props**: Extends `React.ComponentProps<"input">`

**Examples**:
```tsx
import { Input } from "@/components/ui/input";

<Input placeholder="Enter your name" />
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" />
```

### Label

**Location**: `apps/web/components/ui/label.tsx`

**Description**: A label component for form fields.

**Props**: Extends `React.ComponentProps<"label">`

**Examples**:
```tsx
import { Label } from "@/components/ui/label";

<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

### Card

**Location**: `apps/web/components/ui/card.tsx`

**Description**: A flexible card component with header, content, and footer sections.

**Components**:
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title within header
- `CardDescription`: Description within header
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Examples**:
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Contact Details</CardTitle>
    <CardDescription>Manage your contact information</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Contact information goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
```

### Dialog

**Location**: `apps/web/components/ui/dialog.tsx`

**Description**: A modal dialog component for overlays and forms.

**Components**:
- `Dialog`: Root component
- `DialogTrigger`: Trigger button
- `DialogContent`: Content container
- `DialogHeader`: Header section
- `DialogTitle`: Dialog title
- `DialogDescription`: Dialog description
- `DialogFooter`: Footer section

**Examples**:
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Contact</DialogTitle>
      <DialogDescription>
        Make changes to your contact information here.
      </DialogDescription>
    </DialogHeader>
    <div>
      {/* Form content */}
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Select

**Location**: `apps/web/components/ui/select.tsx`

**Description**: A dropdown select component.

**Components**:
- `Select`: Root component
- `SelectTrigger`: Trigger button
- `SelectValue`: Selected value display
- `SelectContent`: Options container
- `SelectItem`: Individual option

**Examples**:
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a contact" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="john">John Doe</SelectItem>
    <SelectItem value="jane">Jane Smith</SelectItem>
    <SelectItem value="bob">Bob Johnson</SelectItem>
  </SelectContent>
</Select>
```

### Checkbox

**Location**: `apps/web/components/ui/checkbox.tsx`

**Description**: A checkbox component for boolean inputs.

**Props**: Extends Radix UI Checkbox props

**Examples**:
```tsx
import { Checkbox } from "@/components/ui/checkbox";

<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms and conditions</Label>
```

### Avatar

**Location**: `apps/web/components/ui/avatar.tsx`

**Description**: An avatar component for displaying user profile images.

**Components**:
- `Avatar`: Container
- `AvatarImage`: Image component
- `AvatarFallback`: Fallback when image fails to load

**Examples**:
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/profile.jpg" alt="Profile" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Badge

**Location**: `apps/web/components/ui/badge.tsx`

**Description**: A badge component for displaying tags or statuses.

**Props**:
```typescript
interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
}
```

**Examples**:
```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Tabs

**Location**: `apps/web/components/ui/tabs.tsx`

**Description**: A tabbed interface component.

**Components**:
- `Tabs`: Root component
- `TabsList`: Tab navigation
- `TabsTrigger`: Individual tab button
- `TabsContent`: Tab content panel

**Examples**:
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="contacts">
  <TabsList>
    <TabsTrigger value="contacts">Contacts</TabsTrigger>
    <TabsTrigger value="groups">Groups</TabsTrigger>
  </TabsList>
  <TabsContent value="contacts">
    <p>Contact management content</p>
  </TabsContent>
  <TabsContent value="groups">
    <p>Group management content</p>
  </TabsContent>
</Tabs>
```

### ImageUpload

**Location**: `apps/web/components/ui/image-upload.tsx`

**Description**: A specialized component for uploading and displaying images.

**Props**:
```typescript
interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}
```

**Examples**:
```tsx
import { ImageUpload } from "@/components/ui/image-upload";

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  disabled={isUploading}
/>
```

---

## Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

### Contacts Table

**Table**: `contacts`

**Description**: Stores contact information for users.

**Columns**:
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  job_title TEXT,
  profile_image_url TEXT,
  notes TEXT,
  source TEXT,
  last_contacted_at TIMESTAMPTZ,
  birthday TEXT,
  linkedin_profile TEXT,
  twitter_profile TEXT,
  website TEXT,
  tags TEXT,
  enriched_data JSONB,
  enrichment_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Row Level Security (RLS)**: Enabled - users can only access their own contacts.

### Groups Table

**Table**: `groups`

**Description**: Stores contact groups/tags for organizing contacts.

**Columns**:
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Row Level Security (RLS)**: Enabled - users can only access their own groups.

### Group Members Table

**Table**: `group_members`

**Description**: Junction table for many-to-many relationship between contacts and groups.

**Columns**:
```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, contact_id)
);
```

### Additional Tables

The schema includes several other tables for extended functionality:

- **`programs`**: Training programs or courses
- **`services`**: Professional services offered
- **`sessions`**: Individual sessions or meetings
- **`session_attendees`**: Attendee tracking for sessions
- **`program_enrollments`**: Program enrollment tracking
- **`payments`**: Payment tracking
- **`notes`**: Additional notes for contacts
- **`follow_ups`**: Follow-up task tracking

### TypeScript Types

All database types are automatically generated in `packages/db/src/types.ts`:

```typescript
// Main contact type
export type Contact = Database['public']['Tables']['contacts']['Row'];

// Insert type for creating contacts
export type ContactInsert = Database['public']['Tables']['contacts']['Insert'];

// Update type for updating contacts
export type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

// Group types
export type Group = Database['public']['Tables']['groups']['Row'];
export type GroupInsert = Database['public']['Tables']['groups']['Insert'];
export type GroupUpdate = Database['public']['Tables']['groups']['Update'];
```

---

## Authentication

The application uses Supabase Auth for authentication with email/password and magic link support.

### Auth Service

**Location**: `apps/web/lib/auth/service.ts`

#### `fetchCurrentUser()`

**Description**: Retrieves the currently authenticated user.

**Returns**: `Promise<{ user: User | null; error: any | null }>`

**Example**:
```typescript
import { fetchCurrentUser } from '@/lib/auth/service';

const { user, error } = await fetchCurrentUser();
if (user) {
  console.log('Logged in as:', user.email);
}
```

#### `updateUserPassword(password: string)`

**Description**: Updates the current user's password.

**Parameters**:
- `password` (string): The new password

**Returns**: `Promise<{ error: any | null }>`

**Example**:
```typescript
import { updateUserPassword } from '@/lib/auth/service';

const { error } = await updateUserPassword('newPassword123');
if (error) {
  console.error('Password update failed:', error);
}
```

#### `signOutUser()`

**Description**: Signs out the current user.

**Returns**: `Promise<{ error: any | null }>`

**Example**:
```typescript
import { signOutUser } from '@/lib/auth/service';

const { error } = await signOutUser();
if (error) {
  console.error('Sign out failed:', error);
}
```

#### `mapAuthErrorMessage(errorMessage: string)`

**Description**: Maps Supabase error messages to user-friendly messages.

**Parameters**:
- `errorMessage` (string): The original error message

**Returns**: `string` - User-friendly error message

**Example**:
```typescript
import { mapAuthErrorMessage } from '@/lib/auth/service';

const friendlyError = mapAuthErrorMessage('Password should be at least 6 characters');
// Returns: "Password must be at least 6 characters long."
```

### Auth Routes

#### Sign In/Sign Up

**Route**: `/auth/signin`

**Description**: Handles both sign in and sign up with email/password or magic link.

#### Auth Callback

**Route**: `/api/auth/callback`

**Description**: Handles authentication callbacks from Supabase.

#### Supabase Auth

**Route**: `/api/auth/[...supabase]`

**Description**: Dynamic route for Supabase authentication flows.

### Protected Routes

All routes under `/dashboard`, `/contacts`, and `/groups` require authentication. The authentication state is managed by:

- **Server-side**: Middleware checks for valid sessions
- **Client-side**: React context provides user state

---

## Utility Functions

### `cn()` - Class Name Utility

**Location**: `apps/web/lib/utils.ts`

**Description**: Combines and merges Tailwind CSS classes intelligently.

**Parameters**:
- `...inputs` (ClassValue[]): Class values to merge

**Returns**: `string` - Merged class names

**Example**:
```typescript
import { cn } from '@/lib/utils';

const buttonClass = cn(
  'px-4 py-2 rounded',
  'bg-blue-500 hover:bg-blue-600',
  isActive && 'bg-blue-700',
  isDisabled && 'opacity-50 cursor-not-allowed'
);
```

### tRPC Client Setup

**Location**: `apps/web/lib/trpc.ts`

**Description**: Configures the tRPC client for API communication.

**Usage**:
```typescript
import { api } from '@/lib/trpc';

// Use in React components
const contacts = api.contact.list.useQuery();
const createContact = api.contact.save.useMutation();
```

### Supabase Client

**Location**: `apps/web/lib/supabase/client.ts`

**Description**: Provides the Supabase client for browser-side operations.

**Usage**:
```typescript
import { supabase } from '@/lib/supabase/client';

// Direct Supabase operations (use sparingly - prefer tRPC)
const { data, error } = await supabase
  .from('contacts')
  .select('*')
  .eq('user_id', userId);
```

---

## Configuration

### Environment Variables

**Development**: Create `apps/web/.env.local`

**Production**: Set in deployment platform (e.g., Vercel)

**Required Variables**:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional
SUPABASE_JWT_SECRET=your_jwt_secret
```

### Next.js Configuration

**Location**: `apps/web/next.config.js`

**Key Settings**:
- Experimental features enabled
- Image optimization configured
- Bundle analyzer setup

### Tailwind Configuration

**Location**: `apps/web/tailwind.config.js`

**Features**:
- Design system colors
- Custom component styles
- Dark mode support
- Animation utilities

### TypeScript Configuration

**Location**: `tsconfig.json` (root) and `apps/web/tsconfig.json`

**Features**:
- Strict type checking
- Path aliases configured
- Modern ES features enabled

---

## Examples

### Creating a Contact Management Page

```tsx
'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ContactsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch contacts
  const { data: contacts, isLoading } = api.contact.list.useQuery();

  // Create contact mutation
  const createContact = api.contact.save.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      // Refetch contacts
      utils.contact.list.invalidate();
    },
  });

  // Delete contact mutation
  const deleteContact = api.contact.delete.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
    },
  });

  const utils = api.useUtils();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContact.mutate({
      first_name: firstName,
      last_name: lastName,
      email: email || null,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Contact</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={createContact.isLoading}>
                {createContact.isLoading ? 'Creating...' : 'Create Contact'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts?.map((contact) => (
          <Card key={contact.id}>
            <CardHeader>
              <CardTitle>
                {contact.first_name} {contact.last_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{contact.email}</p>
              <p className="text-sm text-gray-600">{contact.company_name}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Navigate to edit page
                    window.location.href = `/contacts/${contact.id}/edit`;
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this contact?')) {
                      deleteContact.mutate({ contactId: contact.id });
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Using Groups

```tsx
'use client';

import { api } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ContactGroupsExample() {
  const { data: groups } = api.group.list.useQuery();
  const addContactToGroup = api.group.addContact.useMutation();

  const handleAddToGroup = (groupId: string, contactId: string) => {
    addContactToGroup.mutate({
      groupId,
      contactId,
    });
  };

  return (
    <div>
      <h2>Available Groups</h2>
      <div className="flex flex-wrap gap-2">
        {groups?.map((group) => (
          <Badge
            key={group.id}
            variant="outline"
            className="cursor-pointer"
            onClick={() => handleAddToGroup(group.id, 'contact-id')}
          >
            {group.emoji} {group.name} ({group.contactCount})
          </Badge>
        ))}
      </div>
    </div>
  );
}
```

### File Upload Example

```tsx
'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

export default function FileUploadExample() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const getUploadUrl = api.storage.getUploadUrl.useMutation();

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // Get upload URL
      const { uploadUrl, publicUrl } = await getUploadUrl.mutateAsync({
        fileName: file.name,
        fileType: file.type,
      });

      // Upload file
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (response.ok) {
        console.log('File uploaded successfully:', publicUrl);
        // Use publicUrl to save to contact or wherever needed
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        accept="image/*"
      />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
}
```

---

## Error Handling

### tRPC Errors

All tRPC procedures can throw `TRPCError` with specific error codes:

```typescript
import { TRPCError } from '@trpc/server';

// Common error codes:
// - UNAUTHORIZED: User not authenticated
// - BAD_REQUEST: Invalid input data
// - NOT_FOUND: Resource not found
// - INTERNAL_SERVER_ERROR: Server error

// Client-side error handling
const { data, error } = api.contact.list.useQuery();

if (error) {
  switch (error.data?.code) {
    case 'UNAUTHORIZED':
      // Redirect to login
      break;
    case 'BAD_REQUEST':
      // Show validation errors
      break;
    default:
      // Show generic error
      break;
  }
}
```

### Mutation Error Handling

```typescript
const createContact = api.contact.save.useMutation({
  onError: (error) => {
    console.error('Failed to create contact:', error);
    // Show toast notification
  },
  onSuccess: (data) => {
    console.log('Contact created:', data);
    // Show success message
  },
});
```

---

## Best Practices

### API Usage

1. **Use tRPC instead of direct Supabase calls** for consistency and type safety
2. **Implement proper error handling** for all API calls
3. **Use React Query's caching** effectively with `invalidate()` and `refetch()`
4. **Batch mutations** when possible to reduce network requests

### Component Development

1. **Use TypeScript interfaces** for all component props
2. **Implement proper loading states** for async operations
3. **Follow the established design system** with consistent spacing and colors
4. **Use the `cn()` utility** for conditional classes
5. **Implement proper accessibility** with ARIA labels and keyboard navigation

### Database Operations

1. **Always use Row Level Security (RLS)** policies
2. **Validate all inputs** with Zod schemas
3. **Use transactions** for complex operations
4. **Implement proper indexing** for performance
5. **Use the generated TypeScript types** for type safety

---

This documentation covers all the public APIs, components, and utilities available in the CodexCRM application. For additional examples or specific use cases, refer to the existing code in the repository or contact the development team.