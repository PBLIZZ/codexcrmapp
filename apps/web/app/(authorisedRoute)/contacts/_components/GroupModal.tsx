'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/trpc';
import { Button } from '@codexcrm/ui';
import { Input } from '@codexcrm/ui';
import { Textarea } from '@codexcrm/ui';
import { Label } from '@codexcrm/ui';
import { toast } from '@codexcrm/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@codexcrm/ui';
import { Loader2, Palette } from 'lucide-react';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId?: string; // For editing existing groups
  mode?: 'create' | 'edit';
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#64748b', // slate
  '#78716c', // stone
];

const PRESET_EMOJIS = [
  '👥',
  '🏢',
  '⭐',
  '🎯',
  '📈',
  '💼',
  '🔥',
  '✨',
  '🚀',
  '💎',
  '🏆',
  '🎨',
  '📊',
  '🌟',
  '💡',
  '🔔',
  '📝',
  '🎪',
  '🌈',
  '🎭',
];

export function GroupModal({ isOpen, onClose, groupId, mode = 'create' }: GroupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '',
    emoji: '',
  });

  const utils = api.useUtils();

  // Fetch existing group data for edit mode
  const { data: existingGroup, isLoading: isLoadingGroup } = api.groups.getById.useQuery(
    { groupId: groupId! },
    {
      enabled: mode === 'edit' && !!groupId,
    }
  );

  // Update form data when existing group data is loaded
  useEffect(() => {
    if (existingGroup && mode === 'edit') {
      setFormData({
        name: existingGroup.name,
        description: existingGroup.description || '',
        color: existingGroup.color || '',
        emoji: existingGroup.emoji || '',
      });
    }
  }, [existingGroup, mode]);

  const saveGroupMutation = api.groups.save.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description:
          mode === 'create' ? 'Group created successfully!' : 'Group updated successfully!',
        variant: 'default',
      });
      utils.groups.list.invalidate();
      utils.contacts.list.invalidate();
      handleClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to ${mode} group: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteGroupMutation = api.groups.delete.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Group deleted successfully!',
        variant: 'default',
      });
      utils.groups.list.invalidate();
      utils.contacts.list.invalidate();
      handleClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete group: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleClose = () => {
    setFormData({ name: '', description: '', color: '', emoji: '' });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Group name is required',
        variant: 'destructive',
      });
      return;
    }

    const submitData = {
      ...(mode === 'edit' && groupId ? { id: groupId } : {}),
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      color: formData.color || null,
      emoji: formData.emoji || null,
    };

    saveGroupMutation.mutate(submitData);
  };

  const handleDelete = () => {
    if (!groupId) return;

    if (
      window.confirm('Are you sure you want to delete this group? This action cannot be undone.')
    ) {
      deleteGroupMutation.mutate({ groupId });
    }
  };

  const isLoading = saveGroupMutation.isPending || deleteGroupMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Group' : 'Edit Group'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a new group to organize your contacts.'
              : 'Update the group details below.'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingGroup && mode === 'edit' ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin' />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Group Name *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder='Enter group name'
                className='mt-1'
                required
              />
            </div>

            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder='Optional description for this group'
                className='mt-1'
                rows={3}
              />
            </div>

            <div>
              <Label>Emoji</Label>
              <div className='mt-2'>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {PRESET_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type='button'
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center hover:bg-slate-50 ${
                        formData.emoji === emoji ? 'border-teal-500 bg-teal-50' : 'border-slate-200'
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          emoji: prev.emoji === emoji ? '' : emoji,
                        }))
                      }
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <Input
                  value={formData.emoji}
                  onChange={(e) => setFormData((prev) => ({ ...prev, emoji: e.target.value }))}
                  placeholder='Or enter custom emoji'
                  className='text-center'
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <Label className='flex items-center gap-2'>
                <Palette className='h-4 w-4' />
                Color
              </Label>
              <div className='mt-2'>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type='button'
                      className={`w-8 h-8 rounded border-2 ${
                        formData.color === color ? 'border-slate-800' : 'border-slate-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          color: prev.color === color ? '' : color,
                        }))
                      }
                      title={color}
                    />
                  ))}
                </div>
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                  placeholder='Or enter hex color (e.g., #3b82f6)'
                  className='font-mono text-sm'
                />
              </div>
            </div>

            <DialogFooter className='flex justify-between'>
              <div>
                {mode === 'edit' && (
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    {deleteGroupMutation.isPending && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Delete Group
                  </Button>
                )}
              </div>
              <div className='flex gap-2'>
                <Button type='button' variant='outline' onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type='submit' disabled={!formData.name.trim() || isLoading}>
                  {saveGroupMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  {mode === 'create' ? 'Create Group' : 'Update Group'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
