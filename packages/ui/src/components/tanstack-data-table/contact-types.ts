// types/contact.ts

export interface ContactLogEntry {
  date: string;
  type: 'email' | 'phone' | 'text' | 'in-person';
  notes: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  membershipType: 'basic' | 'premium' | 'unlimited' | 'trial';
  membershipStatus: 'active' | 'expired' | 'suspended' | 'pending';
  membershipStart: string;
  membershipExpiry: string;
  lastSession: string;
  nextSession: string;
  sessionsAttended: number;
  sessionsCancelled: number;
  preferredTimes: string[];
  programs: string[];
  tags: string[];
  sessionNotes: string;
  contactLog: ContactLogEntry[];
  totalSpent: number;
  status: 'active' | 'inactive' | 'prospect' | 'churned';
}

export type ContactColumnId = keyof Contact;

// Additional types for table functionality
export interface TableState {
  sorting: any[];
  columnFilters: any[];
  columnVisibility: Record<string, boolean>;
  rowSelection: Record<string, boolean>;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  globalFilter: string;
  grouping: string[];
  columnOrder: string[];
  columnPinning: {
    left: string[];
    right: string[];
  };
}

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: (selectedRows: Contact[]) => void;
  variant?: 'default' | 'destructive';
}

export interface RowAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: (contact: Contact) => void;
  variant?: 'default' | 'destructive';
}