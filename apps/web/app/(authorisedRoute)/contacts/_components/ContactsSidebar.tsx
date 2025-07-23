'use client';

import {
  Users,
  UserPlus,
  Upload,
  ChevronRight,
  Folder,
  Plus,
  Loader2,
  AlertCircle,
  Hash,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { api } from '@/lib/trpc';
import {
  Badge,
  CollapsibleTrigger,
  Button,
  Skeleton,
  Alert,
  AlertDescription,
  CollapsibleContent,
  Collapsible,
} from '@codexcrm/ui';
import { cn } from '@/lib/utils';
import { GroupModal } from './GroupModal';
import { useState } from 'react';
import { type Group } from '@codexcrm/db';

type GroupWithContactCount = Group & { contactCount?: number };

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SidebarGroupLink } from '@/components/layout/SidebarGroupLink';

export function ContactsSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedGroupId = searchParams.get('group') || '';
  const [isGroupsOpen, setIsGroupsOpen] = useState(true);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | undefined>();

  // Fetch real data using tRPC hooks
  const { data: contacts, isLoading: contactsLoading } = api.contacts.list.useQuery();
  const {
    data: groups = [],
    isLoading: groupsLoading,
    error: groupsError,
  } = api.groups.list.useQuery();

  // Handler for selecting "All Contacts"
  const handleAllContactsSelect = () => {
    router.push('/contacts');
  };

  // Handler for group selection
  const handleGroupSelect = (groupId: string) => {
    router.push(`/contacts?group=${groupId}`);
  };

  return (
    <SidebarContent>
      {/* Contacts Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>Contacts</SidebarGroupLabel>
        <SidebarMenu>
          {/* All Contacts link */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleAllContactsSelect}
              isActive={pathname === '/contacts'}
              tooltip='All Contacts'
              className='justify-between w-full'
            >
              <div className='flex items-center gap-3'>
                <Users className='w-4 h-4' />
                <span>All Contacts</span>
              </div>
              {!contactsLoading && (
                <Badge
                  variant='outline'
                  className='ml-auto bg-teal-50 border-teal-200 text-teal-700 text-xs'
                >
                  {contacts?.length || 0}
                </Badge>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Add Contact */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/contacts/new' className='flex items-center w-full'>
                <UserPlus className='w-4 h-4 mr-2' />
                <span className='font-medium'>Add Contact</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Import link */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/contacts/import' className='flex items-center w-full'>
                <Upload className='w-4 h-4 mr-2' />
                <span className='font-medium'>Import Contacts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Groups List */}
      <SidebarGroup>
        <div className='flex items-center justify-between'>
          <SidebarGroupLabel>Groups</SidebarGroupLabel>
          <Button
            variant='ghost'
            size='sm'
            className='h-6 w-6 p-0 hover:bg-teal-100'
            onClick={() => {
              setEditingGroupId(undefined);
              setIsGroupModalOpen(true);
            }}
            title='Create new group'
          >
            <Plus className='h-3 w-3' />
          </Button>
        </div>
        <SidebarMenu>
          {groupsLoading ? (
            // Loading state for groups
            <>
              <SidebarMenuItem>
                <div className='flex items-center gap-2 px-2 py-1'>
                  <Skeleton className='h-4 w-4 rounded' />
                  <Skeleton className='h-4 flex-1' />
                  <Skeleton className='h-4 w-6' />
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className='flex items-center gap-2 px-2 py-1'>
                  <Skeleton className='h-4 w-4 rounded' />
                  <Skeleton className='h-4 flex-1' />
                  <Skeleton className='h-4 w-6' />
                </div>
              </SidebarMenuItem>
            </>
          ) : groupsError ? (
            // Error state for groups
            <SidebarMenuItem>
              <Alert variant='destructive' className='mx-2 my-1'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription className='text-xs'>Failed to load groups</AlertDescription>
              </Alert>
            </SidebarMenuItem>
          ) : groups && groups.length > 0 ? (
            // Render groups with real data
            groups.map((group: GroupWithContactCount) => (
              <SidebarMenuItem key={group.id}>
                <SidebarMenuButton
                  onClick={() => handleGroupSelect(group.id)}
                  className={`justify-between w-full ${
                    selectedGroupId === group.id ? 'bg-primary/10 text-primary' : ''
                  }`}
                  title={group.description || group.name}
                >
                  <div className='flex items-center gap-2'>
                    {group.emoji ? (
                      <span className='text-sm'>{group.emoji}</span>
                    ) : (
                      <Hash className='w-3 h-3 text-slate-500' />
                    )}
                    <span className='truncate text-sm'>{group.name}</span>
                  </div>
                  <Badge
                    variant='outline'
                    className='ml-auto bg-slate-50 border-slate-200 text-slate-600 text-xs'
                    style={group.color ? { borderColor: group.color, color: group.color } : {}}
                  >
                    {group.contactCount || 0}
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : (
            // Empty state for groups
            <SidebarMenuItem>
              <div className='px-2 py-3 text-center'>
                <div className='text-xs text-slate-500 mb-2'>No groups yet</div>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-7 text-xs'
                  onClick={() => {
                    setEditingGroupId(undefined);
                    setIsGroupModalOpen(true);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' />
                  Create Group
                </Button>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

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
                groups.map((group: GroupWithContactCount) => (
                  <SidebarGroupLink key={group.id} group={group} />
                ))
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

      {/* Quick Stats */}
      <SidebarGroup>
        <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className='px-2 py-2 space-y-2'>
              <div className='flex justify-between text-xs'>
                <span className='text-slate-600'>Total Contacts:</span>
                <span className='font-medium text-teal-700'>
                  {contactsLoading ? (
                    <Loader2 className='h-3 w-3 animate-spin' />
                  ) : (
                    contacts?.length || 0
                  )}
                </span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='text-slate-600'>Groups:</span>
                <span className='font-medium text-teal-700'>
                  {groupsLoading ? (
                    <Loader2 className='h-3 w-3 animate-spin' />
                  ) : (
                    groups?.length || 0
                  )}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Group Modal */}
      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setEditingGroupId(undefined);
        }}
        groupId={editingGroupId}
        mode={editingGroupId ? 'edit' : 'create'}
      />
    </SidebarContent>
  );
}
