# Contacts Module

This module manages all contact-related functionality within the CodexCRM application.

## Components

### Main Components
- `page.tsx` - Server component that renders the contacts page
- `ContactsContent.tsx` - Client component that provides the contacts list, search, filtering, and form for adding/editing contacts
- `ContactList.tsx` - Component for displaying the list of contacts with sorting and filtering
- `ContactForm.tsx` - Form component for adding and editing contacts

### Group Management Components
- `ContactGroupManager.tsx` - Component for managing contact group assignments
- `ContactGroupTags.tsx` - Component for displaying contact group tags/badges

### Contact Detail Page
- `[contactId]/page.tsx` - Server component for the contact detail page

### Alternative Views
- `pattern1/` - Kanban board view for contacts
- `pattern2/` - Alternative view for contacts

## Features

### Contact Management
- List all contacts
- Add new contacts
- Edit existing contacts
- Delete contacts
- View contact details
- Filter and search contacts

### Group Management
- Assign contacts to groups
- Remove contacts from groups
- View contacts by group
- Filter contacts by group membership
- Display group assignments as badges/tags

### View Options
- Standard list view
- Kanban board view (pattern1)
- Alternative view (pattern2)

## Data Model

### Contacts
Contacts are stored in the `clients` database table (for backward compatibility) with the following fields:

- `id` - Unique identifier (UUID)
- `user_id` - The owner of the contact (UUID)
- `first_name` - First name (required)
- `last_name` - Last name (required)
- `email` - Email address (required)
- `phone` - Phone number (optional)
- `company_name` - Company name (optional)
- `job_title` - Job title (optional)
- `profile_image_url` - URL to profile image (optional)
- `source` - Where the contact came from (optional)
- `notes` - Additional notes (optional)
- `last_contacted_at` - When the contact was last contacted (optional)
- `created_at` - When the contact was created
- `updated_at` - When the contact was last updated
- `enriched_data` - Additional data from enrichment services (optional JSON)

### Contact-Group Relationships
The relationship between contacts and groups is managed through a junction table that links contacts to their respective groups. This enables:

- Many-to-many relationship between contacts and groups
- Filtering contacts by group membership
- Displaying group assignments as badges/tags in the contact list

## API Integration

This module uses tRPC procedures defined in `packages/server/src/routers/contact.ts` to interact with the database.

## Related Modules

- `/contacts/[contactId]` - Contact detail view
- Groups (future) - For organizing contacts into categories
