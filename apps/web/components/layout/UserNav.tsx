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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from '@codexcrm/ui';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

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
  const { isMobile } = useSidebar(); // Move hook call to top

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Force a full page redirect to ensure clean logout
    window.location.href = '/log-in';
  };

  // 2. Handle the loading state gracefully
  if (isLoading) {
    return (
      <SidebarMenu className='w-full h-full'>
        <SidebarMenuItem className='w-full h-full'>
          <div className='flex items-center gap-3 p-2 w-full'>
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
    <SidebarMenu className='w-full h-full'>
      <SidebarMenuItem className='w-full h-full'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={userDetails.name}
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage
                  className='rounded-lg'
                  src={userDetails.avatar}
                  alt={userDetails.name}
                />
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
            className='w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal' inset={false}>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage
                    className='rounded-lg'
                    src={userDetails.avatar}
                    alt={userDetails.name}
                  />
                  <AvatarFallback className='rounded-lg'>{userInitial}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{userDetails.name}</span>
                  <span className='truncate text-xs'>{userDetails.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='' />
            <DropdownMenuGroup className=''>
              <DropdownMenuItem className='' inset={false} onClick={() => router.push('/account')}>
                <Sparkles className='mr-2 h-4 w-4' />
                <span>Upgrade to Pro</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className='' />
            <DropdownMenuGroup className=''>
              <DropdownMenuItem className='' inset={false} onClick={() => router.push('/account')}>
                <BadgeCheck className='mr-2 h-4 w-4' />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='' inset={false} onClick={() => router.push('/account')}>
                <CreditCard className='mr-2 h-4 w-4' />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='' inset={false} onClick={() => router.push('/account')}>
                <Bell className='mr-2 h-4 w-4' />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='' inset={false} onClick={() => router.push('/account')}>
                <ShieldCheck className='mr-2 h-4 w-4' />
                <span>Security</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className='' />
            <DropdownMenuItem className='' inset={false} onClick={handleSignOut}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
