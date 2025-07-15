'use client';

import { useAuth } from '@/app/providers';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// UI and Icon Imports
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@codexcrm/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@codexcrm/ui';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@codexcrm/ui';

// Type for user metadata
interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  [key: string]: unknown;
}

export function UserNav() {
  // 1. Fetch user data internally using the useAuth hook
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Force a full page redirect to ensure clean logout
    window.location.href = '/log-in';
  };

  // 2. Handle the loading state gracefully
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className='flex items-center gap-3 p-2'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-3 w-3/4' />
              <Skeleton className='h-3 w-1/2' />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // If there's no user, don't render anything
  if (!user) {
    return null;
  }

  // 3. Derive user details from the fetched user object
  const userMetadata = user.user_metadata as UserMetadata;
  const userDetails = {
    name: userMetadata?.full_name || user.email || 'User',
    email: user.email || '',
    avatar: userMetadata?.avatar_url || '',
  };
  const userInitial = (userDetails.name[0] || 'U').toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
                <AvatarFallback className='rounded-lg'>{userInitial}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{userDetails.name}</span>
                <span className='truncate text-xs'>{userDetails.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
                  <AvatarFallback className='rounded-lg'>{userInitial}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{userDetails.name}</span>
                  <span className='truncate text-xs'>{userDetails.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/account')}>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/settings/account')}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings/billing')}>
                <CreditCard />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/settings/notifications')}>
                <Bell />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings/security')}>
                <ShieldCheck />
                Security
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
