"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { api } from "@/lib/trpc";

export function QuickCreateGroupButton() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();

  const handleCreateGroup = async () => {
    try {
      setIsCreating(true);
      
      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user found");
        toast.error("Authentication Error", {
          description: "You must be logged in to create a group."
        });
        return;
      }
      
      // Generate a default group name with timestamp to ensure uniqueness
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      const defaultName = `New Group ${timestamp}`;
      
      // Direct insertion to the groups table
      const { data, error } = await supabase
        .from("groups")
        .insert({
          name: defaultName,
          color: "#c084fc", // Default purple color
          emoji: "👍",
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating group:", error);
        toast.error("Failed to Create Group", {
          description: error.message || "An unexpected error occurred"
        });
        return;
      }
      
      console.log("Group created successfully:", data);
      
      // Show success toast
      toast.success("Group Created", {
        description: `"${defaultName}" has been created successfully.`
      });
      
      // Invalidate groups cache to refresh the list
      utils.groups.list.invalidate();
      utils.groups.list.refetch();
      
      // Navigate to the groups page to see the new group
      router.push("/groups");
      
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error("Error", {
        description: "Failed to create group. Please try again."
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      onClick={handleCreateGroup} 
      disabled={isCreating}
      className="bg-purple-400 hover:bg-purple-300 text-white"
      size="sm"
    >
      {isCreating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          Quick Create Group
        </>
      )}
    </Button>
  );
}
