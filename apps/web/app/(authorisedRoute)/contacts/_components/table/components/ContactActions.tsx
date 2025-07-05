'use client';

import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  Phone 
} from 'lucide-react';
import { Button } from '@codexcrm/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@codexcrm/ui';
import type { Contact, ContactActionProps } from '@/app/(authorisedRoute)/contacts/_components/table/types';

interface ContactActionsProps extends ContactActionProps {
  contact: Contact;
  showEmailAction?: boolean;
  showPhoneAction?: boolean;
  size?: 'sm' | 'md';
}

/**
 * ContactActions component that provides action buttons for individual contacts
 * Includes edit, delete, email, and phone actions in a dropdown menu
 */
export function ContactActions({
  contact,
  onEdit,
  onDelete,
  showEmailAction = true,
  showPhoneAction = true,
  size = 'sm',
}: ContactActionsProps) {

  const handleEmailAction = () => {
    if (!contact.email) {
      alert(`No email address available for ${contact.full_name}`);
      return;
    }

    // Open default email client
    const mailtoUrl = `mailto:${contact.email}?subject=Hello ${contact.full_name}`;
    window.open(mailtoUrl, '_blank');
  };

  const handlePhoneAction = () => {
    if (!contact.phone) {
      alert(`No phone number available for ${contact.full_name}`);
      return;
    }

    // Open tel: link
    const telUrl = `tel:${contact.phone}`;
    window.open(telUrl, '_self');
  };

  const handleEdit = () => {
    onEdit(contact.id);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${contact.full_name}?`)) {
      onDelete(contact.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={size}
          className="h-8 w-8 p-0"
          aria-label={`Actions for ${contact.full_name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {/* Communication Actions */}
        {showEmailAction && contact.email && (
          <DropdownMenuItem onClick={handleEmailAction}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </DropdownMenuItem>
        )}
        
        {showPhoneAction && contact.phone && (
          <DropdownMenuItem onClick={handlePhoneAction}>
            <Phone className="h-4 w-4 mr-2" />
            Call
          </DropdownMenuItem>
        )}
        
        {/* Separator if we have communication actions */}
        {((showEmailAction && contact.email) || (showPhoneAction && contact.phone)) && (
          <DropdownMenuSeparator />
        )}
        
        {/* Management Actions */}
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Contact
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Contact
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}