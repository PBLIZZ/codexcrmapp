'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';

export interface ThemedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  withHover?: boolean;
  withShadow?: boolean;
}

const ThemedCard = forwardRef<HTMLDivElement, ThemedCardProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      withHover = false,
      withShadow = false,
      ...props
    },
    ref
  ) => {
    const { isDarkMode } = useTheme();

    // Size classes
    const sizeClasses = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    // Variant classes based on theme
    const variantClasses = {
      default: 'bg-card text-card-foreground',
      primary: 'bg-primary text-primary-foreground',
      accent: 'bg-accent text-accent-foreground',
      outline: 'border border-border bg-transparent',
    };

    // Shadow classes
    const shadowClass = withShadow
      ? isDarkMode
        ? 'shadow-md shadow-black/20'
        : 'shadow-md shadow-black/10'
      : '';

    // Hover effect classes
    const hoverClass = withHover
      ? variant === 'default'
        ? 'hover:bg-muted/50 transition-colors'
        : variant === 'primary'
        ? 'hover:bg-primary/90 transition-colors'
        : variant === 'accent'
        ? 'hover:bg-accent/90 transition-colors'
        : 'hover:bg-muted/10 transition-colors'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          variantClasses[variant],
          sizeClasses[size],
          shadowClass,
          hoverClass,
          className
        )}
        {...props}
      />
    );
  }
);

ThemedCard.displayName = 'ThemedCard';

export interface ThemedCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ThemedCardHeader = forwardRef<HTMLDivElement, ThemedCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', className)}
      {...props}
    />
  )
);

ThemedCardHeader.displayName = 'ThemedCardHeader';

export interface ThemedCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const ThemedCardTitle = forwardRef<HTMLHeadingElement, ThemedCardTitleProps>(
  ({ className, level = 3, ...props }, ref) => {
    const titleClasses = cn(
      'font-semibold leading-none tracking-tight',
      level === 1 && 'text-2xl',
      level === 2 && 'text-xl',
      level === 3 && 'text-lg',
      level === 4 && 'text-base',
      level === 5 && 'text-sm',
      level === 6 && 'text-xs',
      className
    );

    switch (level) {
      case 1:
        return <h1 ref={ref} className={titleClasses} {...props} />;
      case 2:
        return <h2 ref={ref} className={titleClasses} {...props} />;
      case 3:
        return <h3 ref={ref} className={titleClasses} {...props} />;
      case 4:
        return <h4 ref={ref} className={titleClasses} {...props} />;
      case 5:
        return <h5 ref={ref} className={titleClasses} {...props} />;
      case 6:
        return <h6 ref={ref} className={titleClasses} {...props} />;
      default:
        return <h3 ref={ref} className={titleClasses} {...props} />;
    }
  }
);

ThemedCardTitle.displayName = 'ThemedCardTitle';

export interface ThemedCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const ThemedCardDescription = forwardRef<
  HTMLParagraphElement,
  ThemedCardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

ThemedCardDescription.displayName = 'ThemedCardDescription';

export interface ThemedCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ThemedCardContent = forwardRef<HTMLDivElement, ThemedCardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);

ThemedCardContent.displayName = 'ThemedCardContent';

export interface ThemedCardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ThemedCardFooter = forwardRef<HTMLDivElement, ThemedCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    />
  )
);

ThemedCardFooter.displayName = 'ThemedCardFooter';

export {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
  ThemedCardFooter,
};
