# Groups Module

This module provides a flexible system for organizing contacts into customizable groups within the CodexCRM application.

## Purpose

The Groups functionality allows users to:
- Categorize contacts by various criteria (e.g., premium clients, leads, business contacts)
- Organize contacts into multiple groups simultaneously
- Filter and search contacts by group membership
- Apply group-specific actions or automations (future enhancement)

## Components

- `page.tsx` - Server component that renders the groups management page
- `GroupsContent.tsx` - Client component that handles the groups UI, including:
  - Listing all groups
  - Creating new groups
  - Editing existing groups
  - Deleting groups
  - Viewing contacts within groups

## Data Model

Groups are stored in two tables:

### `groups` Table
- `id` - Unique identifier (UUID)
- `name` - Group name (required)
- `description` - Description of the group (optional)
- `color` - Color for visual identification (optional)
- `user_id` - The owner of the group (UUID)
- `created_at` - When the group was created
- `updated_at` - When the group was last updated

### `contact_groups` Junction Table
- `id` - Unique identifier (UUID)
- `contact_id` - Reference to a contact (UUID)
- `group_id` - Reference to a group (UUID)
- `user_id` - The owner of the relationship (UUID)
- `created_at` - When the relationship was created

## API Integration

This module uses tRPC procedures defined in `packages/server/src/routers/group.ts`:

- `groups.list` - Get all groups
- `groups.getById` - Get a single group
- `groups.save` - Create or update a group
- `groups.delete` - Delete a group
- `groups.addContact` - Add a contact to a group
- `groups.removeContact` - Remove a contact from a group
- `groups.getContacts` - Get all contacts in a group
- `groups.getContactGroups` - Get all groups for a contact

## UI Features

- Color-coded group cards for visual organization
- Contact count indicators
- Group creation/editing form with color picker
- Responsive grid layout for group cards

## Integration with Contacts Module

The Groups module integrates with the Contacts module to provide:

- Group assignment from contact detail view
- Group filtering in contact lists
- Group-based contact management

## Security

Row Level Security (RLS) policies ensure that:

- Users can only see their own groups
- Users can only manage contact-group relationships for their own contacts and groups

## Future Enhancements

- Bulk operations (add/remove multiple contacts to/from groups)
- Smart groups based on contact attributes
- Group-based automation triggers
- Drag-and-drop interface for group management