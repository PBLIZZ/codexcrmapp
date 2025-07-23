'use client';

import { LogOut } from 'lucide-react';
import { ModeToggle } from '@codexcrm/ui';
import { Button } from '@codexcrm/ui';
import { supabase } from '@/lib/supabase/client';

export function SidebarFooterControls() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Force a full page redirect to ensure clean logout
    window.location.href = '/log-in';
  };

  return (
    <div className='sidebar-footer-controls flex items-center justify-between px-2 py-2'>
      <ModeToggle />
      <Button
        className='text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
        onClick={handleSignOut}
      >
        <LogOut />
        Log out
      </Button>
    </div>
  );
}
