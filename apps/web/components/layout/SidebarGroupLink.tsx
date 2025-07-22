'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

import { Group } from '@codexcrm/db';

// Extended Group type with contact count for UI purposes
interface GroupWithContactCount extends Pick<Group, 'id' | 'name' | 'emoji' | 'color'> {
  contactCount?: number;
}

export function SidebarGroupLink({ group }: { group: GroupWithContactCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const isActive = params.get('group') === group.id && pathname === '/contacts';

  return (
    <button
      onClick={() => router.push(`/contacts?group=${group.id}`)}
      className={cn(
        'flex items-center justify-between ml-2 px-3 py-2 rounded-md cursor-pointer text-sm w-full text-left',
        isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
      )}
    >
      <div className='flex items-center'>
        {group.emoji && <span className='text-sm mr-2'>{group.emoji}</span>}
        <span className='text-sm font-medium truncate'>{group.name}</span>
      </div>
      {typeof group.contactCount === 'number' && (
        <span className='ml-auto px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium'>
          {group.contactCount}
        </span>
      )}
    </button>
  );
}
