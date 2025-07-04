'use client';

import { ContactTableHeader } from '@/app/(authorisedRoute)/contacts/_components/table/components/ContactTableHeader';
import { ContactTableBody } from '@/app/(authorisedRoute)/contacts/_components/table/components/ContactTableBody';
import { BulkActionToolbar } from '@/app/(authorisedRoute)/contacts/_components/table/components/BulkActionToolbar';
import { 
  useContactSelection, 
  useContactActions, 
  useColumnManagement,
  useBulkOperations 
} from '@/app/(authorisedRoute)/contacts/_components/table/hooks';
import type { ContactsTableProps } from '@/app/(authorisedRoute)/contacts/_components/table/types';

/**
 * Main ContactsTable component that orchestrates all table functionality
 * This is the main container that brings together all the hooks and components
 */
export function ContactsTable({
  contacts,
  isLoading,
  visibleColumns,
  sortField,
  sortDirection,
  onSortChange,
  onEditContact,
  onDeleteContact,
}: ContactsTableProps) {

  // Initialize hooks
  const selection = useContactSelection({ contacts });
  const actions = useContactActions({ onEditContact, onDeleteContact });
  const columnManagement = useColumnManagement({
    initialVisibleColumns: visibleColumns,
    initialSortField: sortField,
    initialSortDirection: sortDirection,
    onSortChange,
  });
  const bulkOps = useBulkOperations({
    selectedContactIds: selection.selectedContactIds,
    onOperationComplete: () => {
      // Refresh the contacts list after bulk operations
      // This will be handled by the parent component's query invalidation
    },
    onSelectionClear: selection.clearSelection,
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Main Table Container */}
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-auto border border-gray-200 rounded-lg bg-white">
          <div className="min-w-full">
            <table className="w-full divide-y divide-gray-200">
              <ContactTableHeader
                contacts={contacts}
                visibleColumns={visibleColumns}
                columnOrder={columnManagement.tableState.columnOrder}
                sortField={columnManagement.tableState.sortField}
                sortDirection={columnManagement.tableState.sortDirection}
                isAllSelected={selection.isAllSelected}
                draggedColumn={columnManagement.tableState.draggedColumn}
                onSortChange={columnManagement.handleSortChange}
                onSelectAll={selection.handleSelectAll}
                onDragStart={columnManagement.handleDragStart}
                onDragOver={columnManagement.handleDragOver}
                onDragLeave={() => {}} // Handled in useColumnManagement
                onDrop={columnManagement.handleDrop}
                onDragEnd={columnManagement.handleDragEnd}
              />
              
              <ContactTableBody
                contacts={contacts}
                visibleColumns={visibleColumns}
                columnOrder={columnManagement.tableState.columnOrder}
                selectedContactIds={selection.selectedContactIds}
                onSelectContact={selection.handleSelectContact}
                onEditContact={actions.handleEditContact}
                onDeleteContact={actions.handleDeleteContact}
              />
            </table>
          </div>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selection.selectedContactIds.length}
        onBulkDelete={bulkOps.openBulkDeleteDialog}
        onBulkEnrich={bulkOps.openEnrichDialog}
        onAddToGroup={bulkOps.openAddToGroupDialog}
        onClearSelection={selection.clearSelection}
        isVisible={selection.selectedContactIds.length > 0}
      />

      {/* TODO: Add dialog components here when they're created */}
      {/* <BulkDeleteDialog ... />
          <EnrichDialog ... />
          <AddToGroupDialog ... /> */}
    </>
  );
}