'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Loader2 } from 'lucide-react';

import { Button } from '@codexcrm/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@codexcrm/ui';
import { GroupCreateForm } from './GroupCreateForm';

// Interface for Group Data (matching what `api.groups.list` returns)
interface Group {
  id: string;
  name: string;
  description?: string | null;
  emoji?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  contactCount?: number;
}

interface GroupCreateDialogProps {
  triggerButtonLabel?: string;
  triggerButtonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  triggerButtonClassName?: string;
  group?: Group | null; // Optional group for editing mode
  isEditMode?: boolean; // Flag to indicate if we're in edit mode
  customTrigger?: React.ReactNode; // Custom trigger element
}

export function GroupCreateDialog({
  triggerButtonLabel = 'Create New Group',
  triggerButtonVariant = 'default',
  triggerButtonClassName = '',
  group = null,
  isEditMode = false,
  customTrigger,
}: GroupCreateDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(group);

  // Update editingGroup if the group prop changes
  useEffect(() => {
    setEditingGroup(group);
  }, [group]);

  const handleSuccess = () => {
    setIsDialogOpen(false); // Close the dialog on successful form submission
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button variant={triggerButtonVariant} className={triggerButtonClassName}>
            {isEditMode ? (
              <>
                <Edit className="mr-2 h-4 w-4" /> {triggerButtonLabel || 'Edit Group'}
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> {triggerButtonLabel}
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Group' : 'Create New Group'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? `Update the details for the group: ${editingGroup?.name}`
              : 'Fill in the details below to create a new contact group.'}
          </DialogDescription>
        </DialogHeader>
        {/* The form itself, with the onSuccess callback to close the dialog */}
        <GroupCreateForm 
          onSuccess={handleSuccess} 
          editingGroup={editingGroup} 
          isEditMode={isEditMode} 
        />
      </DialogContent>
    </Dialog>
  );
}
