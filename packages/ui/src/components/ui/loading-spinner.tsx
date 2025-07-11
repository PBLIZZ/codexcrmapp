import * as React from 'react';
import { cn } from '../../lib/utils'; // Assumes cn utility from shadcn/ui setup

/**
 * A reusable, centered loading spinner component.
 *
 * It is accessible via the `role="status"` attribute and a visually hidden
 * "Loading..." text for screen readers. It can be customized with a className.
 */
export const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      // ARIA role to indicate this is a live region presenting a status.
      role='status'
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <div className='h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' />
      {/* Visually hidden text for screen reader users. */}
      <span className='sr-only'>Loading...</span>
    </div>
  );
});
LoadingSpinner.displayName = 'LoadingSpinner';
