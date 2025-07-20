'use client';

import { ChevronRight, Folder, Settings, Users, Upload } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';

import { SidebarGroupLink } from '../../../../components/layout/SidebarGroupLink';
import { Badge, Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@codexcrm/ui';
import { api } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface Group {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  contactCount?: number;
}

interface ContactsSidebarProps {
  totalContacts?: number;
}

export function ContactsSidebar({ totalContacts = 0 }: ContactsSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  // const utils = api.useUtils(); // Get tRPC utils - unused for now

  const [isGroupsOpen, setIsGroupsOpen] = useState(true);
  const selectedGroupId = searchParams.get('group') || '';

  const { data: groupsData = [] } = api.groups.list.useQuery(undefined, {
    // isLoadingGroups removed as not used
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const groups: Group[] = groupsData as Group[]; // Assert type if API returns it correctly

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const secondaryNavItems = [{ href: '/settings', label: 'Settings', icon: Settings }];

  return (
    <div className='h-full flex flex-col'>
      {/* Contacts Section */}
      <div className='px-3 py-4 mt-2'>
        <div className='flex items-center justify-between px-3 py-2 text-sm'>
          <div className='flex items-center'>
            <Users className='w-4 h-4 mr-3' />
            <span className='font-medium'>Contacts</span>
          </div>
        </div>
        <div className='mt-1 space-y-1'>
          <button
            className={cn(
              'flex items-center justify-between ml-2 px-3 py-2 rounded-md cursor-pointer text-sm w-full text-left', // Added text-left
              !selectedGroupId
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted text-muted-foreground'
            )}
            onClick={() => {
              router.push('/contacts');
            }}
          >
            <div className='flex items-center'>
              <Users className='w-4 h-4 mr-2' />
              <span>All Contacts</span>
            </div>
            <Badge variant='secondary' className='ml-auto'>
              {totalContacts}
            </Badge>
          </button>

          {/* Import Contacts Link */}
          <Link href='/contacts/import' className='block ml-2'>
            <div className='flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted text-muted-foreground'>
              <Upload className='w-4 h-4 mr-2' />
              <span>Import Contacts</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Groups Section */}
      <div className='px-3 py-2 border-t mt-4'>
        <Collapsible open={isGroupsOpen} onOpenChange={setIsGroupsOpen}>
          <CollapsibleTrigger asChild>
            <button className='flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded-md w-full text-left'>
              {' '}
              {/* Changed to button */}
              <div className='flex items-center'>
                <Folder className='w-4 h-4 mr-3' />
                <span className='font-medium'>Groups</span>
              </div>
              <ChevronRight
                className={cn(
                  'w-4 h-4 transition-transform',
                  isGroupsOpen && 'transform rotate-90'
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='mt-1 space-y-1'>
              {groups.length > 0 ? (
                groups.map(
                  (
                    group // Removed : Group type hint here as it's inferred
                  ) => <SidebarGroupLink key={group.id} group={group} />
                )
              ) : (
                <div className='ml-2 px-3 py-2 text-sm text-muted-foreground'>
                  No groups yet. Create your first group below.
                </div>
              )}

              <Link href='/groups' className='block ml-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='w-full justify-start text-xs text-muted-foreground pl-0'
                >
                  {' '}
                  {/* Adjusted padding */}
                  <span className='ml-2'>Manage Groups</span>
                </Button>
              </Link>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Secondary Navigation (Settings) - Placed at the very bottom for common sidebar patterns */}
      <div className='mt-auto px-3 py-2 border-t'>
        {' '}
        {/* mt-auto pushes it to the bottom */}
        <nav className='space-y-1'>
          {secondaryNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center px-3 py-2 rounded-md text-sm transition-colors',
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {item.icon && <item.icon className='w-4 h-4 mr-3' />} {/* Ensure icon exists */}
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
