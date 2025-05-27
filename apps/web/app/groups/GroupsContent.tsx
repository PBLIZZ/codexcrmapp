"use client";

import type { AppRouter } from '@codexcrm/server/src/root';
import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCClientError } from '@trpc/client';
import { AlertCircle, Edit, Trash2, Plus, Users, Tag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from 'zod';

import { GroupContactsList } from './GroupContactsList';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabase/client';
import { api } from '@/lib/trpc';


// Zod schema for validation
const groupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  emoji: z.string().optional().nullable(),
});

type GroupFormData = z.infer<typeof groupSchema>;

// Group interface
interface Group {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  emoji?: string | null;
  user_id: string;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
  contactCount?: number;
  _count?: { contacts: number };
}

export function GroupsContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string>("👍");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Check URL parameters for 'new=true' to automatically open the form
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Effect to open form dialog when ?new=true is in URL
  useEffect(() => {
    const shouldOpenForm = searchParams.get('new') === 'true';
    if (shouldOpenForm) {
      setIsFormOpen(true);
      setEditingGroupId(null);
      reset();
      
      // Remove the 'new' parameter from URL to prevent reopening on refresh
      // but only after the dialog is opened
      const cleanupUrl = () => {
        // Remove the 'new' parameter and navigate to the base groups page
        router.replace('/groups');
      };
      
      // Small delay to ensure the dialog is opened before changing URL
      setTimeout(cleanupUrl, 100);
    }
  }, [searchParams, router]);
  
  const utils = api.useUtils(); // tRPC context for cache invalidation

  // --- Queries & Mutations ---
  const { data: groups = [], isLoading, error: queryError } = api.groups.list.useQuery(undefined, {
    onSuccess: (data) => {
      console.warn('Groups data loaded successfully:', data);
    },
    onError: (error) => {
      console.error('Error loading groups:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    }
  });
  
  // Ensure groups is an array and add debugging
  const groupsList = Array.isArray(groups) ? groups : [];
  console.warn('Processed groups list:', groupsList);

  const saveMutation = api.groups.save.useMutation({
    onSuccess: (data) => {
      console.warn('Group saved successfully:', data);
      utils.groups.list.invalidate();
      setIsFormOpen(false);
      reset();
      setEditingGroupId(null);
    },
    onError: (error) => {
      setFormError(`Error saving group: ${error.message}`);
    },
  });

  const deleteMutation = api.groups.delete.useMutation({
    onSuccess: () => {
      utils.groups.list.invalidate();
      setIsDeleteDialogOpen(false);
      setGroupToDelete(null);
    },
    onError: (error) => {
      setDeleteError(`Failed to delete group: ${error.message}`);
    },
  });

  // --- Form Handling ---
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      id: undefined,
      name: "",
      description: "",
      color: "#c084fc", // Default purple-400 color
      emoji: "👍",
    },
  });

  // Update form values when editingGroupId changes
  const handleEditClick = (group: Group) => {
    setEditingGroupId(group.id);
    setValue("id", group.id);
    setValue("name", group.name);
    setValue("description", group.description || "");
    setValue("color", group.color || "#c084fc");
    setValue("emoji", group.emoji || "👍");
    setEmoji(group.emoji || "👍");
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setGroupToDelete(id);
    setIsDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = () => {
    if (!groupToDelete) return;

    deleteMutation.mutate({
      groupId: groupToDelete,
    });
  };

  const onSubmit: SubmitHandler<GroupFormData> = async (data) => {
    try {
      setFormError(null);
      setFormSubmitting(true);
      
      // Get the current user
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      
      if (!user) {
        console.error('No authenticated user');
        setFormError('Authentication error. Please sign in again.');
        return;
      }
      
      // Create the simplified group object - exactly like the working QuickCreateGroupButton
      const groupData = {
        // Only include ID if we're editing
        ...(editingGroupId ? { id: editingGroupId } : {}),
        name: data.name.trim(),
        color: data.color || "#c084fc",
        emoji: emoji || "👍",
        description: data.description?.trim() || null,
        user_id: user.id,
        updated_at: new Date().toISOString(),
        ...(editingGroupId ? {} : { created_at: new Date().toISOString() })
      };

      console.log('Inserting group with data:', JSON.stringify(groupData, null, 2));
      
      // Simple direct insertion - just like in QuickCreateGroupButton
      const { data: result, error } = await supabase
        .from('groups')
        .upsert(groupData)
        .select()
        .single();
        
      if (error) {
        console.error('Supabase error:', error);
        setFormError(`Error: ${error.message}`);
        return;
      }
      
      console.log('Group saved successfully:', result);
      
      // Force refresh data
      await utils.groups.list.invalidate();
      const refreshResult = await utils.groups.list.refetch();
      console.log('Refetch result:', refreshResult);
      
      // Reset UI state
      setIsFormOpen(false);
      reset();
      setEditingGroupId(null);
      setEmoji("👍");
    } catch (error) {
      console.error('Unexpected error in form submission:', error);
      setFormError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-purple-400">Groups</h1>
        <Button 
          onClick={() => {
            setIsFormOpen(true);
            setEditingGroupId(null);
            reset();
          }}
          className="bg-purple-400 hover:bg-purple-300 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
          <DialogTitle className="text-purple-400">
              {editingGroupId ? "Edit Group" : "Create Group"}
            </DialogTitle>
          </DialogHeader>

          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("id")} />

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                    className="p-2 rounded-md border border-purple-200 hover:bg-purple-50 transition-colors"
                  >
                    {emoji} <span className="ml-1 text-xs text-purple-600">Select</span>
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute z-50 mt-1 bg-white shadow-lg rounded-md p-2 border border-purple-100 grid grid-cols-8 gap-1 w-[320px]">
                      {[
                        "👍", "👋", "👏", "🙌", "👆", "👇", "👈", "👉",
                        "🎯", "✅", "⭐", "🔥", "💯", "💪", "🚀", "💡",
                        "📊", "📈", "📝", "📌", "🔍", "🔔", "🔒", "🔓",
                        "📱", "💻", "📧", "📞", "🏢", "🏆", "💰", "💎",
                        "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍",
                        "😀", "😊", "🙂", "😎", "🤔", "😍", "🥳", "😇"
                      ].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            setEmoji(em);
                            setValue("emoji", em);
                            setShowEmojiPicker(false);
                          }}
                          className="text-2xl p-1 hover:bg-purple-50 rounded cursor-pointer"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Input
                  id="name"
                  {...register("name")}
                  className="border-purple-200 focus:border-purple-400 flex-1"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                {...register("description")}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                {...register("color")}
                className="h-10 px-2"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="text-purple-600 hover:text-purple-700 border-purple-200 hover:bg-purple-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-400 hover:bg-purple-300 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            <div className="h-32 bg-purple-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-purple-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-purple-100 rounded-lg animate-pulse" />
          </div>
        ) : queryError ? (
          // Error state
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {"Failed to load groups"}
            </AlertDescription>
          </Alert>
        ) : groupsList.length === 0 ? (
          // Empty state
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-purple-400 mb-4" />
          <h3 className="text-lg font-medium text-purple-400 mb-2">
              No groups yet
            </h3>
            <p className="text-purple-600 mb-4">
              Create your first group to start organizing contacts
            </p>
            <Button 
              onClick={() => {
                setIsFormOpen(true);
                setEditingGroupId(null);
                reset();
              }}
              className="bg-purple-400 hover:bg-purple-300 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        ) : (
          // Groups grid
          groupsList.map((group: Group) => (
            <Card key={group.id} className="relative overflow-hidden bg-purple-50 border-purple-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Badge
                      variant="secondary"
                      className="h-6 px-2 text-xs font-normal truncate text-purple-50"
                      style={{ backgroundColor: group.color || '#c084fc' }}
                    >
                      <span className="mr-1">{group.emoji || '👍'}</span>
                      {group.name}
                    </Badge>
                    <Badge variant="outline" className="ml-2 bg-white">
                      {group.contactCount || 0} contacts
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                      onClick={() => handleEditClick(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                      onClick={() => handleDeleteClick(group.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {group.description && (
                  <p className="text-sm text-purple-600 mt-2">{group.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="border-t border-purple-100 pt-3 mt-2">
                  <GroupContactsList groupId={group.id} groupName={group.name} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-purple-400">Delete Group</DialogTitle>
            <DialogDescription className="text-purple-600">
              Are you sure you want to delete this group? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isLoading}
              className="text-purple-600 hover:text-purple-700 border-purple-200 hover:bg-purple-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {deleteMutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
