'use client';

import Link from 'next/link';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Use from @codexcrm/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Use from @codexcrm/ui

interface DropdownMenuWithIconProps {
  user: SupabaseUser;
}

// Helper to get initials from name (or email)
const getInitials = (user: SupabaseUser | null) => {
  if (!user) return 'NN';
  const emailPrefix = user.email?.split('@')[0];
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    emailPrefix ||
    '';

  if (name.includes(' ')) {
    const parts = name.split(' ');
    return `${parts[0]?.[0] || ''}${parts[parts.length - 1]?.[0] || ''}`.toUpperCase();
  }
  return `${name?.[0] || ''}${name?.[1] || ''}`.toUpperCase() || 'NN';
};

export default function DropdownMenuWithIcon({ user }: DropdownMenuWithIconProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none focus:ring-[2px] focus:ring-offset-2 focus:ring-primary rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user.user_metadata?.avatar_url || undefined}
            alt={user.user_metadata?.name || user.email || 'User Avatar'}
          />
          <AvatarFallback>{getInitials(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split('@')[0]}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center w-full">
            <UserIcon className="mr-2 h-4 w-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/settings" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action="/api/auth/logout" method="POST">
          <DropdownMenuItem asChild>
            <button type="submit" className="text-destructive w-full flex items-center">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
