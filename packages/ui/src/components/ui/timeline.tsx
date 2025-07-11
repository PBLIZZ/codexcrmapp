import * as React from 'react';
import { cn } from '../../lib/utils';

// Basic Tailwind-styled vertical timeline components.
// These are intentionally lightweight so consuming apps can extend via className.

/**
 * Parent container – renders children in a flex column and adds a left border.
 */
export const Timeline = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  function Timeline({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn('relative flex flex-col gap-4 pl-4', className)} {...props}>
        {/* vertical line */}
        <span className='absolute left-0 top-0 h-full w-px bg-border' />
        {children}
      </div>
    );
  }
);

/**
 * Renders an item with optional icon slot on the left.
 */
export interface TimelineItemProps extends React.ComponentProps<'div'> {
  icon?: React.ReactNode;
}

export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  function TimelineItem({ className, icon, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn('relative flex items-start gap-3', className)} {...props}>
        <TimelineSeparator>{icon}</TimelineSeparator>
        <TimelineContent>{children}</TimelineContent>
      </div>
    );
  }
);

/**
 * Small circle/icon container.
 */
export const TimelineSeparator = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  function TimelineSeparator({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border text-foreground shrink-0',
          className
        )}
        {...props}
      >
        {children ?? <span className='h-1.5 w-1.5 rounded-full bg-primary' />}
      </div>
    );
  }
);

/**
 * Wrapper for item body so spacing aligns.
 */
export const TimelineContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  function TimelineContent({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
        {children}
      </div>
    );
  }
);
