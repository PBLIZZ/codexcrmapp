'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';
const ThemedCard = forwardRef(({ className, variant = 'default', size = 'md', withHover = false, withShadow = false, ...props }, ref) => {
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
    return (_jsx("div", { ref: ref, className: cn('rounded-lg', variantClasses[variant], sizeClasses[size], shadowClass, hoverClass, className), ...props }));
});
ThemedCard.displayName = 'ThemedCard';
const ThemedCardHeader = forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('flex flex-col space-y-1.5', className), ...props })));
ThemedCardHeader.displayName = 'ThemedCardHeader';
const ThemedCardTitle = forwardRef(({ className, level = 3, ...props }, ref) => {
    const titleClasses = cn('font-semibold leading-none tracking-tight', level === 1 && 'text-2xl', level === 2 && 'text-xl', level === 3 && 'text-lg', level === 4 && 'text-base', level === 5 && 'text-sm', level === 6 && 'text-xs', className);
    switch (level) {
        case 1:
            return _jsx("h1", { ref: ref, className: titleClasses, ...props });
        case 2:
            return _jsx("h2", { ref: ref, className: titleClasses, ...props });
        case 3:
            return _jsx("h3", { ref: ref, className: titleClasses, ...props });
        case 4:
            return _jsx("h4", { ref: ref, className: titleClasses, ...props });
        case 5:
            return _jsx("h5", { ref: ref, className: titleClasses, ...props });
        case 6:
            return _jsx("h6", { ref: ref, className: titleClasses, ...props });
        default:
            return _jsx("h3", { ref: ref, className: titleClasses, ...props });
    }
});
ThemedCardTitle.displayName = 'ThemedCardTitle';
const ThemedCardDescription = forwardRef(({ className, ...props }, ref) => (_jsx("p", { ref: ref, className: cn('text-sm text-muted-foreground', className), ...props })));
ThemedCardDescription.displayName = 'ThemedCardDescription';
const ThemedCardContent = forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('pt-0', className), ...props })));
ThemedCardContent.displayName = 'ThemedCardContent';
const ThemedCardFooter = forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('flex items-center pt-4', className), ...props })));
ThemedCardFooter.displayName = 'ThemedCardFooter';
export { ThemedCard, ThemedCardHeader, ThemedCardTitle, ThemedCardDescription, ThemedCardContent, ThemedCardFooter, };
//# sourceMappingURL=themed-card.js.map