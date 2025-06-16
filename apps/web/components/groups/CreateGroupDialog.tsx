'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/trpc';

// Common emojis for group selection
const POPULAR_EMOJIS = ['👥', '👨‍👩‍👧‍👦', '🫂', '🤝', '🏢', '🏫', '🏭', '🏠', '📱', '💻', '💰', '📊', '📈', '🔍', '🎯', '🚀', '⭐', '🌟', '💡', '📝', '📚', '🎓', '🏆', '🎮', '🎨', '🎬', '🎵'];

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('👥');
  
  // Get the tRPC utils for cache invalidation
  const utils = api.useUtils();
  
  // Get the create group mutation
  const createGroupMutation = api.groups.save.useMutation({
    onSuccess: (data) => {
      // Invalidate the groups query to refetch the list
      utils.groups.list.invalidate();
      
      // Show success toast
      toast.success('Group Created', {
        description: `"${newGroupName}" has been created successfully.`,
      });
      
      // Reset form and close dialog
      setNewGroupName('');
      setSelectedEmoji('👥');
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      toast.error('Failed to Create Group', {
        description: error.message || 'An unexpected error occurred',
      });
    }
  });
  
  // Handle group creation
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast.error('Group name is required');
      return;
    }
    
    // Call the API to create the group
    createGroupMutation.mutate({
      name: newGroupName.trim(),
      emoji: selectedEmoji
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new group to organize your contacts. Choose an emoji and enter a name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {POPULAR_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant={selectedEmoji === emoji ? "default" : "outline"}
                className="w-10 h-10 p-0 text-lg"
                onClick={() => setSelectedEmoji(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <Input
              id="name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="col-span-3"
              placeholder="Enter group name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={createGroupMutation.isPending || !newGroupName.trim()}
          >
            {createGroupMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Group'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
