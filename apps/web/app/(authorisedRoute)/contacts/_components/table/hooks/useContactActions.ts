import { useCallback } from 'react';
import type { Contact, ContactActionsHook } from '@/app/(authorisedRoute)/contacts/_components/table/types';

interface UseContactActionsProps {
  onEditContact: (contactId: string) => void;
  onDeleteContact: (contactId: string) => void;
}

/**
 * Custom hook for managing individual contact actions
 * Handles edit, delete, email, and phone actions with proper error handling
 */
export function useContactActions({ 
  onEditContact, 
  onDeleteContact 
}: UseContactActionsProps): ContactActionsHook {

  const handleEmailAction = useCallback((contact: Contact) => {
    if (!contact.email) {
      alert(`No email address available for ${contact.full_name}`);
      return;
    }

    // TODO: Replace with actual email integration
    // For now, open default email client
    const mailtoUrl = `mailto:${contact.email}?subject=Hello ${contact.full_name}`;
    window.open(mailtoUrl, '_blank');
  }, []);

  const handlePhoneAction = useCallback((contact: Contact) => {
    if (!contact.phone) {
      alert(`No phone number available for ${contact.full_name}`);
      return;
    }

    // TODO: Replace with actual phone integration
    // For now, open tel: link
    const telUrl = `tel:${contact.phone}`;
    window.open(telUrl, '_self');
  }, []);

  const handleEditContact = useCallback((contactId: string) => {
    onEditContact(contactId);
  }, [onEditContact]);

  const handleDeleteContact = useCallback((contactId: string) => {
    // Show confirmation dialog before deleting
    if (window.confirm('Are you sure you want to delete this contact?')) {
      onDeleteContact(contactId);
    }
  }, [onDeleteContact]);

  return {
    handleEmailAction,
    handlePhoneAction,
    handleEditContact,
    handleDeleteContact,
  };
}