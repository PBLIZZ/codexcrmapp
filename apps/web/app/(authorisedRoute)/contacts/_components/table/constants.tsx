import { formatDistance } from 'date-fns';
import { Badge } from '@codexcrm/ui';
import type { Contact, ColumnDefinition } from './types';

// Default visible columns configuration
export const DEFAULT_VISIBLE_COLUMNS = [
  'name',
  'email',
  'phone',
  'company_name',
  'last_contacted_at',
  'source',
];

// Default column order for drag & drop functionality
export const DEFAULT_COLUMN_ORDER = [
  'email',
  'phone',
  'company_name',
  'job_title',
  'address_city',
  'address_country',
  'address_postal_code',
  'address_street',
  'client_since',
  'last_contacted_at',
  'notes',
  'referral_source',
  'relationship_status',
  'source',
  'tags',
  'website',
  'wellness_status',
];

// Centralized column definitions with render functions
export const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  {
    id: 'email',
    label: 'Email',
    field: 'email',
    sortable: true,
    render: (contact: Contact) => contact.email ?? '-',
  },
  {
    id: 'phone',
    label: 'Phone',
    field: 'phone',
    sortable: true,
    render: (contact: Contact) => contact.phone ?? '-',
  },
  {
    id: 'company_name',
    label: 'Company',
    field: 'company_name',
    sortable: true,
    render: (contact: Contact) => contact.company_name ?? '-',
  },
  {
    id: 'job_title',
    label: 'Job Title',
    field: 'job_title',
    sortable: true,
    render: (contact: Contact) => contact.job_title ?? '-',
  },
  {
    id: 'address_city',
    label: 'City',
    field: 'address_city',
    sortable: true,
    render: (contact: Contact) => contact.address_city ?? '-',
  },
  {
    id: 'address_country',
    label: 'Country',
    field: 'address_country',
    sortable: true,
    render: (contact: Contact) => contact.address_country ?? '-',
  },
  {
    id: 'address_postal_code',
    label: 'Postal Code',
    field: 'address_postal_code',
    sortable: true,
    render: (contact: Contact) => contact.address_postal_code ?? '-',
  },
  {
    id: 'address_street',
    label: 'Street Address',
    field: 'address_street',
    sortable: true,
    render: (contact: Contact) => contact.address_street ?? '-',
  },
  {
    id: 'client_since',
    label: 'Client Since',
    field: 'client_since',
    sortable: true,
    render: (contact: Contact) => {
      if (!contact.client_since) return '-';
      try {
        return new Date(contact.client_since).toLocaleDateString();
      } catch {
        return '-';
      }
    },
  },
  {
    id: 'last_contacted_at',
    label: 'Last Contacted',
    field: 'last_contacted_at',
    sortable: true,
    render: (contact: Contact) => {
      if (!contact.last_contacted_at) return '-';
      try {
        const date = new Date(contact.last_contacted_at);
        return (
          <div className="flex flex-col">
            <span>{date.toLocaleDateString()}</span>
            <span className="text-xs text-gray-400">
              {formatDistance(date, new Date(), { addSuffix: true })}
            </span>
          </div>
        );
      } catch {
        return '-';
      }
    },
  },
  {
    id: 'notes',
    label: 'Notes',
    field: 'notes',
    sortable: false,
    render: (contact: Contact) => 
      contact.notes ? (
        <div className="max-w-xs truncate" title={contact.notes}>
          {contact.notes}
        </div>
      ) : (
        '-'
      ),
  },
  {
    id: 'referral_source',
    label: 'Referral Source',
    field: 'referral_source',
    sortable: true,
    render: (contact: Contact) => contact.referral_source ?? '-',
  },
  {
    id: 'relationship_status',
    label: 'Relationship Status',
    field: 'relationship_status',
    sortable: true,
    render: (contact: Contact) => contact.relationship_status ?? '-',
  },
  {
    id: 'source',
    label: 'Source',
    field: 'source',
    sortable: true,
    render: (contact: Contact) =>
      contact.source ? (
        <Badge variant="secondary" className="capitalize">
          {contact.source.replace('_', ' ')}
        </Badge>
      ) : (
        '-'
      ),
  },
  {
    id: 'tags',
    label: 'Tags',
    field: 'tags',
    sortable: false,
    render: (contact: Contact) =>
      contact.tags && contact.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {contact.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      ) : (
        '-'
      ),
  },
  {
    id: 'website',
    label: 'Website',
    field: 'website',
    sortable: true,
    render: (contact: Contact) => 
      contact.website ? (
        <a 
          href={contact.website} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline"
        >
          {contact.website}
        </a>
      ) : (
        '-'
      ),
  },
  {
    id: 'wellness_status',
    label: 'Wellness Status',
    field: 'wellness_status',
    sortable: true,
    render: (contact: Contact) => contact.wellness_status ?? '-',
  },
];

// Helper function to get column definition by ID
export const getColumnDefinition = (columnId: string): ColumnDefinition | undefined => {
  return COLUMN_DEFINITIONS.find(col => col.id === columnId);
};

// Helper function to get all available columns for column selector
export const getAllAvailableColumns = (): Array<{ id: string; label: string }> => {
  return COLUMN_DEFINITIONS.map(col => ({ id: col.id, label: col.label }));
};

// Table configuration constants
export const TABLE_CONFIG = {
  ROW_HEIGHT: 'auto',
  HEADER_HEIGHT: '3rem',
  MIN_COLUMN_WIDTH: '120px',
  MAX_COLUMN_WIDTH: '300px',
  STICKY_COLUMNS: ['name'], // Columns that should always be visible
  DRAG_THRESHOLD: 5, // Pixels to move before drag starts
  SELECTION_DEBOUNCE: 150, // Milliseconds to debounce selection changes
} as const;

// Error messages
export const ERROR_MESSAGES = {
  FETCH_CONTACTS_ERROR: 'Failed to load contacts. Please try again.',
  DELETE_CONTACT_ERROR: 'Failed to delete contact. Please try again.',
  BULK_DELETE_ERROR: 'Failed to delete selected contacts. Please try again.',
  ADD_TO_GROUP_ERROR: 'Failed to add contacts to group. Please try again.',
  ENRICH_CONTACTS_ERROR: 'Failed to enrich contacts. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CONTACT_DELETED: 'Contact deleted successfully.',
  CONTACTS_DELETED: 'Selected contacts deleted successfully.',
  CONTACTS_ADDED_TO_GROUP: 'Contacts added to group successfully.',
  CONTACTS_ENRICHED: 'Contacts enriched successfully.',
} as const;