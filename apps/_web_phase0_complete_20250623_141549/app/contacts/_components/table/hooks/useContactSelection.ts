import { useState, useEffect, useCallback } from 'react';
import type { Contact, ContactSelectionHook } from '../types';

interface UseContactSelectionProps {
  contacts: Contact[];
}

/**
 * Custom hook for managing contact selection state
 * Handles individual selection, bulk selection, and selection state consistency
 */
export function useContactSelection({ contacts }: UseContactSelectionProps): ContactSelectionHook {
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Update isAllSelected when selectedContactIds or contacts change
  const updateIsAllSelected = useCallback(() => {
    const hasContacts = contacts.length > 0;
    const allSelected = hasContacts && selectedContactIds.length === contacts.length;
    setIsAllSelected(allSelected);
  }, [selectedContactIds.length, contacts.length]);

  useEffect(() => {
    updateIsAllSelected();
  }, [updateIsAllSelected]);

  // Clear selection when contacts list changes (e.g., after delete)
  useEffect(() => {
    setSelectedContactIds(prev => 
      prev.filter(id => contacts.some(contact => contact.id === id))
    );
  }, [contacts]);

  const handleSelectAll = useCallback(() => {
    if (isAllSelected || selectedContactIds.length === contacts.length) {
      // Deselect all
      setSelectedContactIds([]);
      setIsAllSelected(false);
    } else {
      // Select all
      const allIds = contacts.map(contact => contact.id);
      setSelectedContactIds(allIds);
      setIsAllSelected(true);
    }
  }, [isAllSelected, selectedContactIds.length, contacts]);

  const handleSelectContact = useCallback((contactId: string, isSelected: boolean) => {
    setSelectedContactIds(prev => {
      if (isSelected) {
        // Add to selection if not already selected
        return prev.includes(contactId) ? prev : [...prev, contactId];
      } else {
        // Remove from selection
        return prev.filter(id => id !== contactId);
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedContactIds([]);
    setIsAllSelected(false);
  }, []);

  const selectMultiple = useCallback((contactIds: string[]) => {
    // Validate that all provided IDs exist in current contacts
    const validIds = contactIds.filter(id => 
      contacts.some(contact => contact.id === id)
    );
    setSelectedContactIds(validIds);
  }, [contacts]);

  return {
    selectedContactIds,
    isAllSelected,
    handleSelectAll,
    handleSelectContact,
    clearSelection,
    selectMultiple,
  };
}