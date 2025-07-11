'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Route } from 'next';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@codexcrm/ui';

// Define the structure for navigation items
export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup className='mt-2'>
      <SidebarGroupLabel className='text-sm font-semibold text-sidebar-foreground'>
        Quick Links
      </SidebarGroupLabel>
      <SidebarMenu className='mt-2'>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className='group/collapsible'
          >
            <SidebarMenuItem className='mt-2'>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} className='text-sidebar-foreground/70'>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className='mt-2'>
                <SidebarMenuSub className='mt-2'>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title} className='mt-2'>
                      <SidebarMenuSubButton
                        tooltip={subItem.title}
                        className='text-sidebar-foreground/70'
                        asChild
                      >
                        <Link href={subItem.url as Route<string>}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
