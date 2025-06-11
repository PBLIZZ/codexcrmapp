'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Users,
  PlusCircle,
  Upload,
  Folder,
  ChevronRight
} from 'lucide-react';
import { api } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { AddContactModal } from '@/components/contacts/AddContactModal';
import { QuickCreateGroupButton } from '@/components/groups/QuickCreateGroupButton';

interface Group {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  contactCount?: number;
}

interface ContactsSidebarProps {
  selectedGroupId: string | null;
  onGroupSelect: (groupId: string | null) => void;
}

export function ContactsSidebar({
  selectedGroupId,
  onGroupSelect
}: ContactsSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const utils = api.useUtils();
  
  const [isGroupsOpen, setIsGroupsOpen] = useState(true);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  // Fetch contacts for count
  const { data: contacts = [] } = api.contacts.list.useQuery(
    {
      search: "",
      groupId: undefined,
    },
    {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    }
  );
  
  const totalContacts = contacts.length;

  // Fetch groups data with contact counts
  const { data: groupsData = [] } = api.groups.list.useQuery(undefined, {
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const groups: Group[] = groupsData as Group[];

  // Internal component for the "Add Contact" button and its modal logic
  function AddContactSidebarButton() {
    const handleModalCloseAndRefresh = () => {
      setIsAddContactModalOpen(false);
      // Invalidate contacts list to show the new contact
      utils.contacts.list.invalidate();

      // Optional: Clear ?new=true from URL if it was used to open this
      const currentParams = new URLSearchParams(
        Array.from(searchParams?.entries() || [])
      );
      if (currentParams.get('new') === 'true') {
        currentParams.delete('new');
        router.replace(`${pathname}?${currentParams.toString()}`, {
          scroll: false,
        });
      }
    };

    return (
      <>
        <Button
          onClick={() => setIsAddContactModalOpen(true)}
          className={cn(
            'w-full flex items-center gap-2 ml-2 px-3 py-2 rounded-md text-sm font-semibold shadow-md',
            'bg-gradient-to-r from-teal-400 to-orange-500 text-white border-0',
            'hover:from-teal-500 hover:to-orange-600',
            'focus:ring-2 focus:ring-orange-400 focus:outline-none',
            'justify-start'
          )}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
        <AddContactModal
          open={isAddContactModalOpen}
          onOpenChange={setIsAddContactModalOpen}
          onContactAdded={handleModalCloseAndRefresh}
          showTriggerButton={false}
        />
      </>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
      <div className="px-3 py-4 mt-2">
        <div className="flex items-center justify-between px-3 py-2 text-sm">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-3" />
            <span className="font-medium">Contacts</span>
          </div>
        </div>
        <div className="mt-1 space-y-1">
          <button
            className={cn(
              'flex items-center justify-between ml-2 px-3 py-2 rounded-md cursor-pointer text-sm w-full text-left',
              !selectedGroupId
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted text-muted-foreground'
            )}
            onClick={() => onGroupSelect(null)}
          >
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>All Contacts</span>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {totalContacts}
            </Badge>
          </button>

          {/* Add Contact Modal Button */}
          <AddContactSidebarButton />

          {/* Import Contacts Link */}
          <Link href="/contacts/import" className="block ml-2">
            <div className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted text-muted-foreground">
              <Upload className="w-4 h-4 mr-2" />
              <span>Import Contacts</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Groups Section */}
      <div className="px-3 py-2 border-t mt-4">
        {/* Manage Groups Link - Moved above the collapsible */}
        <Link href="/groups" className="block mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-muted-foreground"
          >
            <span>Manage Groups</span>
          </Button>
        </Link>
        
        <Collapsible open={isGroupsOpen} onOpenChange={setIsGroupsOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded-md w-full text-left">
              <div className="flex items-center">
                <Folder className="w-4 h-4 mr-3" />
                <span className="font-medium">Groups</span>
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
            <div className="mt-1 space-y-1">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => onGroupSelect(group.id)}
                    className={cn(
                      'flex items-center justify-between ml-2 px-3 py-2 rounded-md text-sm w-full text-left',
                      selectedGroupId === group.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted text-muted-foreground'
                    )}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{group.emoji || '📁'}</span>
                      <span>{group.name}</span>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {group.contactCount || 0}
                    </Badge>
                  </button>
                ))
              ) : (
                <div className="ml-2 px-3 py-2 text-sm text-muted-foreground">
                  No groups yet. Create your first group below.
                </div>
              )}

              <div className="ml-2 mb-1 mt-2">
                <QuickCreateGroupButton />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Footer spacer */}
      <div className="mt-auto"></div>
    </div>
  );
}