'use client';

import { Plus, Folder, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@codexcrm/ui';
import { cn } from '@/lib/utils';

import { Group } from '@codexcrm/db';

// Extended Group type with count for UI purposes
interface GroupWithCount extends Pick<Group, 'id' | 'name' | 'color'> {
  count?: number;
}

interface GroupsAdminSidebarProps {
  groups?: GroupWithCount[];
  selectedGroupId?: string;
  onGroupSelect?: (groupId: string) => void;
}

export function GroupsAdminSidebar({
  groups = [],
  selectedGroupId,
  onGroupSelect,
}: GroupsAdminSidebarProps) {
  return (
    <div className='h-full flex flex-col'>
      <div className='p-4 border-b'>
        <h2 className='font-semibold text-lg flex items-center'>
          <Folder className='w-5 h-5 mr-2' />
          Groups
        </h2>
      </div>

      <div className='p-3'>
        <Link href='/groups'>
          <Button variant='outline' size='sm' className='w-full justify-start'>
            <Plus className='mr-2 h-4 w-4' />
            <span>Manage Groups</span>
          </Button>
        </Link>
      </div>

      <div className='overflow-auto flex-1 py-2'>
        <div className='px-3 mb-2'>
          <div
            className={cn(
              'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer',
              selectedGroupId === '' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
            )}
            onClick={() => onGroupSelect?.('')}
          >
            <div className='flex items-center'>
              <Users className='w-4 h-4 mr-2' />
              <span>All Contacts</span>
            </div>
            <span className='text-xs font-medium text-muted-foreground'>
              {groups.reduce((sum, group) => sum + (group.count || 0), 0)}
            </span>
          </div>
        </div>

        <div className='space-y-1 px-3'>
          <p className='text-xs font-medium text-muted-foreground px-3 py-1'>Your Groups</p>
          {groups.map((group) => (
            <div
              key={group.id}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer',
                selectedGroupId === group.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted'
              )}
              onClick={() => onGroupSelect?.(group.id)}
            >
              <div className='flex items-center'>
                <div className={cn('w-3 h-3 rounded-full mr-2', group.color || 'bg-gray-400')} />
                <span>{group.name}</span>
              </div>
              <div className='flex items-center'>
                <span className='text-xs font-medium text-muted-foreground mr-1'>
                  {group.count || 0}
                </span>
                <ChevronRight className='w-3 h-3 text-muted-foreground' />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='p-3 border-t mt-auto'>
        <p className='text-xs text-muted-foreground text-center'>
          {groups.length} groups • {groups.reduce((sum, group) => sum + (group.count || 0), 0)}{' '}
          contacts
        </p>
      </div>
    </div>
  );
}
