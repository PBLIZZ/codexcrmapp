'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';
export const Timeline = forwardRef(({ className, orientation = 'vertical', compact = false, reverse = false, children, ...props }, ref) => {
    const orientationClasses = {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row',
    };
    const spacingClasses = compact ? 'space-y-2' : 'space-y-6';
    const horizontalSpacingClasses = compact ? 'space-x-4' : 'space-x-12';
    return (_jsx("div", { ref: ref, className: cn(orientationClasses[orientation], orientation === 'vertical'
            ? spacingClasses
            : horizontalSpacingClasses, reverse && orientation === 'vertical' && 'flex-col-reverse', reverse && orientation === 'horizontal' && 'flex-row-reverse', className), ...props, children: children }));
});
Timeline.displayName = 'Timeline';
export const TimelineItem = forwardRef(({ className, icon, iconBackground, connector = true, connectorColor, connectorStyle = 'solid', active = false, orientation = 'vertical', children, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    // Default connector color based on theme
    const defaultConnectorColor = isDarkMode
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.2)';
    const activeConnectorColor = 'var(--primary)';
    // Connector style classes
    const connectorStyleClasses = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
    };
    // Vertical timeline item
    if (orientation === 'vertical') {
        return (_jsxs("div", { ref: ref, className: cn('relative flex', className), ...props, children: [_jsxs("div", { className: "flex flex-col items-center mr-4", children: [_jsx("div", { className: cn('z-10 flex items-center justify-center w-8 h-8 rounded-full', active
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'), style: iconBackground ? { backgroundColor: iconBackground } : {}, children: icon || (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "m12 8 4 4-4 4" }), _jsx("path", { d: "m8 12h8" })] })) }), connector && (_jsx("div", { className: cn('w-0 h-full border-l-2 mt-1', connectorStyleClasses[connectorStyle]), style: {
                                borderColor: active
                                    ? connectorColor || activeConnectorColor
                                    : connectorColor || defaultConnectorColor,
                            } }))] }), _jsx("div", { className: "flex-1 pb-6", children: children })] }));
    }
    // Horizontal timeline item
    return (_jsxs("div", { ref: ref, className: cn('relative flex flex-col', className), ...props, children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("div", { className: cn('z-10 flex items-center justify-center w-8 h-8 rounded-full', active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'), style: iconBackground ? { backgroundColor: iconBackground } : {}, children: icon || (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "m12 8 4 4-4 4" }), _jsx("path", { d: "m8 12h8" })] })) }), connector && (_jsx("div", { className: cn('h-0 flex-1 border-t-2 ml-1', connectorStyleClasses[connectorStyle]), style: {
                            borderColor: active
                                ? connectorColor || activeConnectorColor
                                : connectorColor || defaultConnectorColor,
                        } }))] }), _jsx("div", { className: "ml-8", children: children })] }));
});
TimelineItem.displayName = 'TimelineItem';
export const TimelineContent = forwardRef(({ className, title, subtitle, date, children, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, className: cn('space-y-1', className), ...props, children: [_jsxs("div", { className: "flex items-start justify-between", children: [title && _jsx("h4", { className: "font-medium", children: title }), date && (_jsx("span", { className: "text-sm text-muted-foreground", children: date }))] }), subtitle && (_jsx("p", { className: "text-sm text-muted-foreground", children: subtitle })), children && _jsx("div", { className: "mt-2", children: children })] }));
});
TimelineContent.displayName = 'TimelineContent';
export const TimelineSeparator = forwardRef(({ className, label, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, className: cn('relative flex items-center py-4', className), ...props, children: [_jsx("div", { className: "flex-grow border-t border-border" }), label && (_jsx("span", { className: "flex-shrink mx-4 text-sm font-medium text-muted-foreground", children: label })), _jsx("div", { className: "flex-grow border-t border-border" })] }));
});
TimelineSeparator.displayName = 'TimelineSeparator';
export const TimelineDot = forwardRef(({ className, size = 'md', color, variant = 'filled', active = false, ...props }, ref) => {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };
    return (_jsx("div", { ref: ref, className: cn('rounded-full', sizeClasses[size], variant === 'outlined' ? 'border-2' : '', active ? 'bg-primary border-primary' : 'bg-muted border-muted', className), style: color
            ? {
                backgroundColor: variant === 'filled' ? color : 'transparent',
                borderColor: color,
            }
            : {}, ...props }));
});
TimelineDot.displayName = 'TimelineDot';
//# sourceMappingURL=timeline.js.map