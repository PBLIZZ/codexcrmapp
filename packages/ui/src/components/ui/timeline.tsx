'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';

// Timeline container component
export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal';
  compact?: boolean;
  reverse?: boolean;
  children?: React.ReactNode;
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  (
    { className, orientation = 'vertical', compact = false, reverse = false, children, ...props },
    ref
  ) => {
    const orientationClasses = {
      vertical: 'flex flex-col',
      horizontal: 'flex flex-row',
    };

    const spacingClasses = compact ? 'space-y-2' : 'space-y-6';
    const horizontalSpacingClasses = compact ? 'space-x-4' : 'space-x-12';

    return (
      <div
        ref={ref}
        className={cn(
          orientationClasses[orientation],
          orientation === 'vertical' ? spacingClasses : horizontalSpacingClasses,
          reverse && orientation === 'vertical' && 'flex-col-reverse',
          reverse && orientation === 'horizontal' && 'flex-row-reverse',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';

// Timeline item component
export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  iconBackground?: string;
  connector?: boolean;
  connectorColor?: string;
  connectorStyle?: 'solid' | 'dashed' | 'dotted';
  active?: boolean;
  orientation?: 'vertical' | 'horizontal';
  position?: 'left' | 'right' | 'alternate';
  children?: React.ReactNode;
}

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      className,
      icon,
      iconBackground,
      connector = true,
      connectorColor,
      connectorStyle = 'solid',
      active = false,
      orientation = 'vertical',
      position = 'left',
      children,
      ...props
    },
    ref
  ) => {
    const { isDarkMode } = useTheme();

    // Default connector color based on theme
    const defaultConnectorColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    const activeConnectorColor = 'var(--primary)';

    // Connector style classes
    const connectorStyleClasses = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };

    // Vertical timeline item
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={cn('relative flex', className)}
          {...props}
        >
          {/* Icon and connector column */}
          <div className="flex flex-col items-center mr-4">
            {/* Icon */}
            <div
              className={cn(
                'z-10 flex items-center justify-center w-8 h-8 rounded-full',
                active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
              style={iconBackground ? { backgroundColor: iconBackground } : {}}
            >
              {icon || (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m12 8 4 4-4 4" />
                  <path d="m8 12h8" />
                </svg>
              )}
            </div>

            {/* Connector */}
            {connector && (
              <div
                className={cn(
                  'w-0 h-full border-l-2 mt-1',
                  connectorStyleClasses[connectorStyle]
                )}
                style={{
                  borderColor: active
                    ? connectorColor || activeConnectorColor
                    : connectorColor || defaultConnectorColor,
                }}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">{children}</div>
        </div>
      );
    }

    // Horizontal timeline item
    return (
      <div
        ref={ref}
        className={cn('relative flex flex-col', className)}
        {...props}
      >
        <div className="flex items-center mb-2">
          {/* Icon */}
          <div
            className={cn(
              'z-10 flex items-center justify-center w-8 h-8 rounded-full',
              active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
            style={iconBackground ? { backgroundColor: iconBackground } : {}}
          >
            {icon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m12 8 4 4-4 4" />
                <path d="m8 12h8" />
              </svg>
            )}
          </div>

          {/* Connector */}
          {connector && (
            <div
              className={cn(
                'h-0 flex-1 border-t-2 ml-1',
                connectorStyleClasses[connectorStyle]
              )}
              style={{
                borderColor: active
                  ? connectorColor || activeConnectorColor
                  : connectorColor || defaultConnectorColor,
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="ml-8">{children}</div>
      </div>
    );
  }
);

TimelineItem.displayName = 'TimelineItem';

// Timeline content component
export interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  date?: string;
  children?: React.ReactNode;
}

export const TimelineContent = forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, title, subtitle, date, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-1', className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          {title && <h4 className="font-medium">{title}</h4>}
          {date && <span className="text-sm text-muted-foreground">{date}</span>}
        </div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {children && <div className="mt-2">{children}</div>}
      </div>
    );
  }
);

TimelineContent.displayName = 'TimelineContent';

// Timeline separator component
export interface TimelineSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const TimelineSeparator = forwardRef<HTMLDivElement, TimelineSeparatorProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative flex items-center py-4', className)}
        {...props}
      >
        <div className="flex-grow border-t border-border"></div>
        {label && (
          <span className="flex-shrink mx-4 text-sm font-medium text-muted-foreground">
            {label}
          </span>
        )}
        <div className="flex-grow border-t border-border"></div>
      </div>
    );
  }
);

TimelineSeparator.displayName = 'TimelineSeparator';

// Timeline dot component (alternative to icon)
export interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  variant?: 'filled' | 'outlined';
  active?: boolean;
}

export const TimelineDot = forwardRef<HTMLDivElement, TimelineDotProps>(
  (
    { className, size = 'md', color, variant = 'filled', active = false, ...props },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-full',
          sizeClasses[size],
          variant === 'outlined' ? 'border-2' : '',
          active ? 'bg-primary border-primary' : 'bg-muted border-muted',
          className
        )}
        style={color ? { backgroundColor: variant === 'filled' ? color : 'transparent', borderColor: color } : {}}
        {...props}
      />
    );
  }
);

TimelineDot.displayName = 'TimelineDot';