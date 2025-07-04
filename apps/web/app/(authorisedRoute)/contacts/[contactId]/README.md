# Contact Detail Module

This module provides the detailed view for individual contacts within the CodexCRM application.

## Components

- `page.tsx` - Server component that renders the contact detail page
- `ContactDetailView.tsx` - Client component that displays contact information and provides options to edit/delete the contact
- `ContactGroupsSection.tsx` - Client component for managing contact group memberships
- `edit/page.tsx` - Redirects to the contact detail view with edit mode activated

## Features

- View detailed contact information
- Edit contact details
- Delete contact
- Manage contact group memberships
- View contact history and notes
- Supports enriched data from external sources

## Data Flow

1. `page.tsx` renders the `ContactDetailView` component with the contact ID from the URL params
2. `ContactDetailView` uses tRPC to fetch the contact data from the API
3. User can view, edit, or delete the contact

## API Integration

This module uses tRPC procedures defined in:

### `packages/server/src/routers/client.ts`:
- `getById` - Fetch a single contact by ID
- `save` - Update contact information
- `delete` - Delete a contact

### `packages/server/src/routers/groups.ts`:
- `list` - Fetch all available groups
- `getContactGroups` - Fetch groups that a contact belongs to
- `addContact` - Add a contact to a group
- `removeContact` - Remove a contact from a group

## UI Elements

- Profile card with avatar and basic information
- Tabs for different categories of information
- Group management section with color-coded badges
- Add to group dialog with group selection
- Edit dialog for updating contact details
- Delete confirmation dialog

## Future Enhancements

- Activity timeline
- Document attachments
- Contact-specific task management
- Integration with external systems for data enrichment
