import { useState, useCallback } from 'react';
import { api } from '@/lib/trpc';
import type { BulkOperationsHook, BulkOperationState } from '@/app/(authorisedRoute)/contacts/_components/table/types';

interface UseBulkOperationsProps {
  selectedContactIds: string[];
  onOperationComplete?: () => void;
  onSelectionClear?: () => void;
}

/**
 * Custom hook for managing bulk operations (delete, enrich, add to group)
 */
export function useBulkOperations({
  selectedContactIds,
  onOperationComplete,
  onSelectionClear,
}: UseBulkOperationsProps): BulkOperationsHook {
  
  const [bulkState, setBulkState] = useState<BulkOperationState>({
    selectedContactIds,
    isAllSelected: false,
    isBulkDeleteDialogOpen: false,
    isEnrichDialogOpen: false,
    isAddToGroupDialogOpen: false,
    selectedGroupId: '',
  });

  // tRPC mutations
  const utils = api.useUtils();
  const addToGroupMutation = api.groups.addContact.useMutation({
    onSuccess: async () => {
      await utils.groups.list.invalidate();
      await utils.contacts.list.invalidate();
    },
  });

  // Dialog state management
  const openBulkDeleteDialog = useCallback(() => {
    setBulkState(prev => ({ ...prev, isBulkDeleteDialogOpen: true }));
  }, []);

  const closeBulkDeleteDialog = useCallback(() => {
    setBulkState(prev => ({ ...prev, isBulkDeleteDialogOpen: false }));
  }, []);

  const openEnrichDialog = useCallback(() => {
    setBulkState(prev => ({ ...prev, isEnrichDialogOpen: true }));
  }, []);

  const closeEnrichDialog = useCallback(() => {
    setBulkState(prev => ({ ...prev, isEnrichDialogOpen: false }));
  }, []);

  const openAddToGroupDialog = useCallback(() => {
    setBulkState(prev => ({ ...prev, isAddToGroupDialogOpen: true }));
  }, []);

  const closeAddToGroupDialog = useCallback(() => {
    setBulkState(prev => ({ 
      ...prev, 
      isAddToGroupDialogOpen: false,
      selectedGroupId: '',
    }));
    // Reset mutation state when closing dialog
    addToGroupMutation.reset();
  }, [addToGroupMutation]);

  // Bulk operations
  const handleBulkDelete = useCallback(() => {
    // TODO: Implement actual bulk delete functionality
    console.warn('Bulk delete not yet implemented for:', selectedContactIds);
    
    closeBulkDeleteDialog();
    onSelectionClear?.();
    onOperationComplete?.();
  }, [selectedContactIds, closeBulkDeleteDialog, onSelectionClear, onOperationComplete]);

  const handleBulkEnrich = useCallback(() => {
    // TODO: Implement actual bulk enrich functionality
    console.warn('Bulk enrich not yet implemented for:', selectedContactIds);
    
    closeEnrichDialog();
    onOperationComplete?.();
  }, [selectedContactIds, closeEnrichDialog, onOperationComplete]);

  const handleAddToGroup = useCallback(async (groupId: string) => {
    if (!groupId || selectedContactIds.length === 0) {
      throw new Error('Group ID and contact selection required');
    }

    setBulkState(prev => ({ ...prev, selectedGroupId: groupId }));

    try {
      // Process contacts sequentially to avoid overwhelming the server
      for (const contactId of selectedContactIds) {
        await addToGroupMutation.mutateAsync({
          contactId,
          groupId,
        });
      }

      // Explicitly invalidate queries to refresh data
      await Promise.all([
        utils.groups.list.invalidate(),
        utils.contacts.list.invalidate(),
      ]);

      closeAddToGroupDialog();
      onSelectionClear?.();
      onOperationComplete?.();
    } catch (error) {
      console.error('Error adding contacts to group:', error);
      throw error; // Re-throw to allow component to handle error display
    }
  }, [
    selectedContactIds,
    addToGroupMutation,
    utils.groups.list,
    utils.contacts.list,
    closeAddToGroupDialog,
    onSelectionClear,
    onOperationComplete,
  ]);

  return {
    bulkState: {
      ...bulkState,
      selectedContactIds, // Always use the current selection
    },
    handleBulkDelete,
    handleBulkEnrich,
    handleAddToGroup,
    openBulkDeleteDialog,
    openEnrichDialog,
    openAddToGroupDialog,
    closeBulkDeleteDialog,
    closeEnrichDialog,
    closeAddToGroupDialog,
  };
}