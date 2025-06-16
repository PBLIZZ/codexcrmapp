'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/trpc';
import { GroupStylePicker, PRESET_COLORS, PRESET_EMOJIS } from '@/components/groups/GroupStylePicker';

// Zod Schema for Form Validation (consistent with backend expectations for group creation)
const groupFormSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .nullable(),
  color: z
    .string()
    .regex(/^#([0-9a-f]{3}){1,2}$/i, 'Invalid color format.')
    .optional()
    .nullable(),
  emoji: z
    .string()
    .min(1, 'An Emoji is required')
    .or(z.literal('')) // Allow empty string
    .nullable()
    .optional()
    .transform((val) => (val === '' ? null : val)), // Transform empty string to null for the database
});
type GroupFormData = z.infer<typeof groupFormSchema>;

// Interface for Group Data (matching what `api.groups.list` returns)
interface Group {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  emoji?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  contactCount?: number;
}

interface GroupCreateFormProps {
  onSuccess?: () => void; // Callback for successful group creation/update
  editingGroup?: Group | null; // Group data for editing mode
  isEditMode?: boolean; // Flag to indicate if we're in edit mode
  // source?: string; // Optional: for analytics or tracking where the form was initiated
}

export function GroupCreateForm({ onSuccess, editingGroup, isEditMode = false }: GroupCreateFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: editingGroup?.name || '',
      description: editingGroup?.description || '',
      color: editingGroup?.color || PRESET_COLORS[0],
      emoji: editingGroup?.emoji || PRESET_EMOJIS[0],
    },
  });

  // tRPC mutation for saving (creating or updating) a group
  const saveGroupMutation = api.groups.save.useMutation({
    onSuccess: (savedGroup) => {
      toast.success(isEditMode ? 'Group updated!' : 'Group created!', {
        description: `The group "${savedGroup.name}" has been successfully ${isEditMode ? 'updated' : 'created'}.`,
      });
      queryClient.invalidateQueries({ queryKey: [['groups', 'list']] });
      queryClient.invalidateQueries({ queryKey: [['groups', 'listWithCounts']] }); // Refetch group list

      if (!isEditMode) {
        reset({
          name: '',
          description: '',
          emoji: PRESET_EMOJIS[0],
          color: PRESET_COLORS[0],
        }); // Reset form fields to default values only for new groups
      }
      if (onSuccess) {
        onSuccess(); // Execute callback (e.g., close dialog, navigate)
      }
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} group`, {
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    },
  });

  // Form submission handler
  const onSubmit: SubmitHandler<GroupFormData> = (data) => {
    // Add the ID if we're editing an existing group
    const payload = {
      ...data,
      id: editingGroup?.id, // This will be undefined for new groups
    };
    saveGroupMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      {/* Form fields: Emoji, Group Name, Description */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="emoji" className="text-sm font-medium">
            Emoji
          </Label>
          <Controller
            name="emoji"
            control={control}
            render={({ field:emojiField}) => (
              <Controller
                name="color"
                control={control}
                render={({ field: colorField }) => (
                  <GroupStylePicker
                    selectedEmoji={emojiField.value || PRESET_EMOJIS[0]}
                    onEmojiSelect={emojiField.onChange}
                    selectedColor={colorField.value || PRESET_COLORS[0]}
                    onColorSelect={colorField.onChange}
                  />
                )}
              />
            )}
          />
            {errors.emoji && <p className="text-red-500 text-xs mt-1">{errors.emoji.message}</p>}
            {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>}
        </div>

        <div className="space-y-4">
        <div>
          <Label htmlFor="name">Group Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., VIP Clients"
            className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            autoFocus
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="A short description of this group"
            rows={3}
            className="mt-1 resize-none"
            maxLength={500}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}  
        </div>
      </div>

      {/* Submit Button: This form is self-contained with its own submit action */}
      {/* The parent component (Dialog, Sheet, Page) can decide how to lay this out */}
      {/* For a Dialog, the DialogFooter might contain this button */}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting || saveGroupMutation.isPending} className="bg-purple-500 hover:bg-purple-600 text-white">
          {isSubmitting || saveGroupMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isEditMode ? (
            'Save Changes'
          ) : (
            'Create Group'
          )}
        </Button>
      </div>
    </form>
  );
}

