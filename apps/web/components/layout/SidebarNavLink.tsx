'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { createRoute } from '@/lib/utils/routes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@codexcrm/ui';
import { cn } from '@/lib/utils';

interface SidebarNavLinkProps {
  href: string;
  isCollapsed: boolean;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  badgeContent?: string | number;
}

export function SidebarNavLink({ isCollapsed, href, title, icon, isActive, badgeContent }: SidebarNavLinkProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href as Route}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              isActive && 'bg-muted text-primary'
            )}
          >
            {icon}
            <span className={cn('overflow-hidden transition-all', isCollapsed ? 'w-0' : 'w-auto ml-1')}>
              {title}
            </span>
            {badgeContent && !isCollapsed && (
              <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {badgeContent}
              </span>
            )}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            {title}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
