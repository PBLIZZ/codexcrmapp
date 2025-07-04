// Core TypeScript interfaces for ContactsTable components

export interface Contact {
  id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  profile_image_url?: string | null;
  source?: string | null;
  notes?: string | null;
  last_contacted_at?: string | null;
  enrichment_status?: string | null;
  enriched_data?: unknown;
  created_at?: string | null;
  updated_at?: string | null;
  tags?: string[] | null;
  social_handles?: string[] | null | undefined;
  address_city?: string | null;
  address_country?: string | null;
  address_postal_code?: string | null;
  address_street?: string | null;
  client_since?: string | null;
  referral_source?: string | null;
  relationship_status?: string | null;
  website?: string | null;
  wellness_status?: string | null;
}

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

export interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  visibleColumns: string[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onEditContact: (contactId: string) => void;
  onDeleteContact: (contactId: string) => void;
}

export interface ColumnDefinition {
  id: string;
  label: string;
  field: keyof Contact;
  sortable?: boolean;
  render?: (contact: Contact) => React.ReactNode;
  width?: string;
  isSticky?: boolean;
}

export interface ContactActionProps {
  contact: Contact;
  onEdit: (contactId: string) => void;
  onDelete: (contactId: string) => void;
}

export interface BulkOperationState {
  selectedContactIds: string[];
  isAllSelected: boolean;
  isBulkDeleteDialogOpen: boolean;
  isEnrichDialogOpen: boolean;
  isAddToGroupDialogOpen: boolean;
  selectedGroupId: string;
}

export interface TableState {
  sortField: string;
  sortDirection: 'asc' | 'desc';
  visibleColumns: string[];
  columnOrder: string[];
  draggedColumn: string | null;
  isDragging: boolean;
}

export interface ContactSelectionHook {
  selectedContactIds: string[];
  isAllSelected: boolean;
  handleSelectAll: () => void;
  handleSelectContact: (contactId: string, isSelected: boolean) => void;
  clearSelection: () => void;
  selectMultiple: (contactIds: string[]) => void;
}

export interface ContactActionsHook {
  handleEmailAction: (contact: Contact) => void;
  handlePhoneAction: (contact: Contact) => void;
  handleEditContact: (contactId: string) => void;
  handleDeleteContact: (contactId: string) => void;
}

export interface BulkOperationsHook {
  bulkState: BulkOperationState;
  handleBulkDelete: () => void;
  handleBulkEnrich: () => void;
  handleAddToGroup: (groupId: string) => Promise<void>;
  openBulkDeleteDialog: () => void;
  openEnrichDialog: () => void;
  openAddToGroupDialog: () => void;
  closeBulkDeleteDialog: () => void;
  closeEnrichDialog: () => void;
  closeAddToGroupDialog: () => void;
}

export interface ColumnManagementHook {
  tableState: TableState;
  handleSortChange: (field: string) => void;
  handleColumnToggle: (columnId: string) => void;
  handleColumnReorder: (fromIndex: number, toIndex: number) => void;
  handleDragStart: (e: React.DragEvent, columnId: string) => void;
  handleDragOver: (e: React.DragEvent, columnId: string) => void;
  handleDrop: (e: React.DragEvent, targetColumnId: string) => void;
  handleDragEnd: () => void;
}

// API Response types
export interface ContactListResponse {
  contacts: Contact[];
  total: number;
  hasNextPage: boolean;
}

export interface GroupListResponse {
  groups: Group[];
  total: number;
}

// Error types
export interface ContactsTableError {
  type: 'FETCH_ERROR' | 'MUTATION_ERROR' | 'VALIDATION_ERROR';
  message: string;
  details?: unknown;
}