// apps/web/components/layout/SignOutButton.tsx
"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    // console.warn('SignOutButton: Attempting sign out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('SignOutButton: Error signing out:', error);
    } else {
      // console.warn('SignOutButton: Sign out successful.');
      queryClient.clear(); // Clear react-query cache
      router.push('/sign-in'); // Redirect to sign-in
      // router.refresh(); // Could be added if hard refresh is absolutely needed
    }
  };

  // Render as a DropdownMenuItem, for example
  return (
    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}