'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
export const ResponsiveContainer = forwardRef(({ className, maxWidth = 'lg', padding = true, centered = true, children, ...props }, ref) => {
    const maxWidthClasses = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        full: 'max-w-full',
        none: '',
    };
    return (_jsx("div", { ref: ref, className: cn(maxWidthClasses[maxWidth], padding && 'px-4 sm:px-6 md:px-8', centered && 'mx-auto', className), ...props, children: children }));
});
ResponsiveContainer.displayName = 'ResponsiveContainer';
export const ResponsiveGrid = forwardRef(({ className, columns = { xs: 1, sm: 2, md: 3, lg: 4 }, gap = 'md', rowGap, columnGap, autoRows = false, autoColumns = false, flow, children, ...props }, ref) => {
    // Generate grid-template-columns classes based on breakpoints
    const getColumnsClass = () => {
        const classes = [];
        if (columns.xs) {
            classes.push(`grid-cols-${columns.xs}`);
        }
        if (columns.sm) {
            classes.push(`sm:grid-cols-${columns.sm}`);
        }
        if (columns.md) {
            classes.push(`md:grid-cols-${columns.md}`);
        }
        if (columns.lg) {
            classes.push(`lg:grid-cols-${columns.lg}`);
        }
        if (columns.xl) {
            classes.push(`xl:grid-cols-${columns.xl}`);
        }
        if (columns['2xl']) {
            classes.push(`2xl:grid-cols-${columns['2xl']}`);
        }
        return classes.join(' ');
    };
    // Gap classes
    const gapClasses = {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
    };
    // Row gap classes
    const rowGapClasses = {
        none: 'gap-y-0',
        xs: 'gap-y-1',
        sm: 'gap-y-2',
        md: 'gap-y-4',
        lg: 'gap-y-6',
        xl: 'gap-y-8',
    };
    // Column gap classes
    const columnGapClasses = {
        none: 'gap-x-0',
        xs: 'gap-x-1',
        sm: 'gap-x-2',
        md: 'gap-x-4',
        lg: 'gap-x-6',
        xl: 'gap-x-8',
    };
    // Flow classes
    const flowClasses = {
        row: 'grid-flow-row',
        column: 'grid-flow-col',
        'row-dense': 'grid-flow-row-dense',
        'column-dense': 'grid-flow-col-dense',
    };
    return (_jsx("div", { ref: ref, className: cn('grid', getColumnsClass(), !rowGap && !columnGap && gapClasses[gap], rowGap && rowGapClasses[rowGap], columnGap && columnGapClasses[columnGap], autoRows && 'auto-rows-auto', autoColumns && 'auto-cols-auto', flow && flowClasses[flow], className), ...props, children: children }));
});
ResponsiveGrid.displayName = 'ResponsiveGrid';
export const ResponsiveGridItem = forwardRef(({ className, colSpan, rowSpan, colStart, rowStart, children, ...props }, ref) => {
    // Generate col-span classes
    const getColSpanClass = () => {
        const classes = [];
        if (colSpan?.xs) {
            classes.push(`col-span-${colSpan.xs}`);
        }
        if (colSpan?.sm) {
            classes.push(`sm:col-span-${colSpan.sm}`);
        }
        if (colSpan?.md) {
            classes.push(`md:col-span-${colSpan.md}`);
        }
        if (colSpan?.lg) {
            classes.push(`lg:col-span-${colSpan.lg}`);
        }
        if (colSpan?.xl) {
            classes.push(`xl:col-span-${colSpan.xl}`);
        }
        if (colSpan?.['2xl']) {
            classes.push(`2xl:col-span-${colSpan['2xl']}`);
        }
        return classes.join(' ');
    };
    // Generate row-span classes
    const getRowSpanClass = () => {
        const classes = [];
        if (rowSpan?.xs) {
            classes.push(`row-span-${rowSpan.xs}`);
        }
        if (rowSpan?.sm) {
            classes.push(`sm:row-span-${rowSpan.sm}`);
        }
        if (rowSpan?.md) {
            classes.push(`md:row-span-${rowSpan.md}`);
        }
        if (rowSpan?.lg) {
            classes.push(`lg:row-span-${rowSpan.lg}`);
        }
        if (rowSpan?.xl) {
            classes.push(`xl:row-span-${rowSpan.xl}`);
        }
        if (rowSpan?.['2xl']) {
            classes.push(`2xl:row-span-${rowSpan['2xl']}`);
        }
        return classes.join(' ');
    };
    // Generate col-start classes
    const getColStartClass = () => {
        const classes = [];
        if (colStart?.xs) {
            classes.push(`col-start-${colStart.xs}`);
        }
        if (colStart?.sm) {
            classes.push(`sm:col-start-${colStart.sm}`);
        }
        if (colStart?.md) {
            classes.push(`md:col-start-${colStart.md}`);
        }
        if (colStart?.lg) {
            classes.push(`lg:col-start-${colStart.lg}`);
        }
        if (colStart?.xl) {
            classes.push(`xl:col-start-${colStart.xl}`);
        }
        if (colStart?.['2xl']) {
            classes.push(`2xl:col-start-${colStart['2xl']}`);
        }
        return classes.join(' ');
    };
    // Generate row-start classes
    const getRowStartClass = () => {
        const classes = [];
        if (rowStart?.xs) {
            classes.push(`row-start-${rowStart.xs}`);
        }
        if (rowStart?.sm) {
            classes.push(`sm:row-start-${rowStart.sm}`);
        }
        if (rowStart?.md) {
            classes.push(`md:row-start-${rowStart.md}`);
        }
        if (rowStart?.lg) {
            classes.push(`lg:row-start-${rowStart.lg}`);
        }
        if (rowStart?.xl) {
            classes.push(`xl:row-start-${rowStart.xl}`);
        }
        if (rowStart?.['2xl']) {
            classes.push(`2xl:row-start-${rowStart['2xl']}`);
        }
        return classes.join(' ');
    };
    return (_jsx("div", { ref: ref, className: cn(colSpan && getColSpanClass(), rowSpan && getRowSpanClass(), colStart && getColStartClass(), rowStart && getRowStartClass(), className), ...props, children: children }));
});
ResponsiveGridItem.displayName = 'ResponsiveGridItem';
export const ResponsiveFlex = forwardRef(({ className, direction = 'row', wrap = 'nowrap', justify = 'start', align = 'start', gap = 'none', inline = false, responsive, children, ...props }, ref) => {
    // Direction classes
    const directionClasses = {
        row: 'flex-row',
        'row-reverse': 'flex-row-reverse',
        column: 'flex-col',
        'column-reverse': 'flex-col-reverse',
    };
    // Wrap classes
    const wrapClasses = {
        nowrap: 'flex-nowrap',
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
    };
    // Justify classes
    const justifyClasses = {
        start: 'justify-start',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
    };
    // Align classes
    const alignClasses = {
        start: 'items-start',
        end: 'items-end',
        center: 'items-center',
        baseline: 'items-baseline',
        stretch: 'items-stretch',
    };
    // Gap classes
    const gapClasses = {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
    };
    // Generate responsive classes
    const getResponsiveClasses = () => {
        const classes = [];
        if (responsive?.sm) {
            if (responsive.sm.direction) {
                classes.push(`sm:${directionClasses[responsive.sm.direction]}`);
            }
            if (responsive.sm.wrap) {
                classes.push(`sm:${wrapClasses[responsive.sm.wrap]}`);
            }
            if (responsive.sm.justify) {
                classes.push(`sm:${justifyClasses[responsive.sm.justify]}`);
            }
            if (responsive.sm.align) {
                classes.push(`sm:${alignClasses[responsive.sm.align]}`);
            }
            if (responsive.sm.gap) {
                classes.push(`sm:${gapClasses[responsive.sm.gap]}`);
            }
        }
        if (responsive?.md) {
            if (responsive.md.direction) {
                classes.push(`md:${directionClasses[responsive.md.direction]}`);
            }
            if (responsive.md.wrap) {
                classes.push(`md:${wrapClasses[responsive.md.wrap]}`);
            }
            if (responsive.md.justify) {
                classes.push(`md:${justifyClasses[responsive.md.justify]}`);
            }
            if (responsive.md.align) {
                classes.push(`md:${alignClasses[responsive.md.align]}`);
            }
            if (responsive.md.gap) {
                classes.push(`md:${gapClasses[responsive.md.gap]}`);
            }
        }
        if (responsive?.lg) {
            if (responsive.lg.direction) {
                classes.push(`lg:${directionClasses[responsive.lg.direction]}`);
            }
            if (responsive.lg.wrap) {
                classes.push(`lg:${wrapClasses[responsive.lg.wrap]}`);
            }
            if (responsive.lg.justify) {
                classes.push(`lg:${justifyClasses[responsive.lg.justify]}`);
            }
            if (responsive.lg.align) {
                classes.push(`lg:${alignClasses[responsive.lg.align]}`);
            }
            if (responsive.lg.gap) {
                classes.push(`lg:${gapClasses[responsive.lg.gap]}`);
            }
        }
        if (responsive?.xl) {
            if (responsive.xl.direction) {
                classes.push(`xl:${directionClasses[responsive.xl.direction]}`);
            }
            if (responsive.xl.wrap) {
                classes.push(`xl:${wrapClasses[responsive.xl.wrap]}`);
            }
            if (responsive.xl.justify) {
                classes.push(`xl:${justifyClasses[responsive.xl.justify]}`);
            }
            if (responsive.xl.align) {
                classes.push(`xl:${alignClasses[responsive.xl.align]}`);
            }
            if (responsive.xl.gap) {
                classes.push(`xl:${gapClasses[responsive.xl.gap]}`);
            }
        }
        if (responsive?.['2xl']) {
            if (responsive['2xl'].direction) {
                classes.push(`2xl:${directionClasses[responsive['2xl'].direction]}`);
            }
            if (responsive['2xl'].wrap) {
                classes.push(`2xl:${wrapClasses[responsive['2xl'].wrap]}`);
            }
            if (responsive['2xl'].justify) {
                classes.push(`2xl:${justifyClasses[responsive['2xl'].justify]}`);
            }
            if (responsive['2xl'].align) {
                classes.push(`2xl:${alignClasses[responsive['2xl'].align]}`);
            }
            if (responsive['2xl'].gap) {
                classes.push(`2xl:${gapClasses[responsive['2xl'].gap]}`);
            }
        }
        return classes.join(' ');
    };
    return (_jsx("div", { ref: ref, className: cn(inline ? 'inline-flex' : 'flex', directionClasses[direction], wrapClasses[wrap], justifyClasses[justify], alignClasses[align], gapClasses[gap], responsive && getResponsiveClasses(), className), ...props, children: children }));
});
ResponsiveFlex.displayName = 'ResponsiveFlex';
export const ResponsiveStack = forwardRef(({ className, spacing = 'md', dividers = false, dividerColor, children, ...props }, ref) => {
    // Convert spacing to gap
    const spacingToGap = {
        none: 'none',
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
    };
    return (_jsx(ResponsiveFlex, { ref: ref, direction: "column", gap: spacingToGap[spacing], className: cn(dividers && 'divide-y', dividerColor && `divide-${dividerColor}`, className), ...props, children: children }));
});
ResponsiveStack.displayName = 'ResponsiveStack';
export const ResponsiveHStack = forwardRef(({ className, spacing = 'md', dividers = false, dividerColor, children, ...props }, ref) => {
    // Convert spacing to gap
    const spacingToGap = {
        none: 'none',
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
    };
    return (_jsx(ResponsiveFlex, { ref: ref, direction: "row", gap: spacingToGap[spacing], className: cn(dividers && 'divide-x', dividerColor && `divide-${dividerColor}`, className), ...props, children: children }));
});
ResponsiveHStack.displayName = 'ResponsiveHStack';
export const ResponsiveLayout = forwardRef(({ className, show, hide, children, ...props }, ref) => {
    // Generate visibility classes
    const getVisibilityClasses = () => {
        const classes = [];
        if (show) {
            // Hide by default, then show at specified breakpoints
            classes.push('hidden');
            show.forEach((breakpoint) => {
                switch (breakpoint) {
                    case 'xs':
                        classes.push('xs:block');
                        break;
                    case 'sm':
                        classes.push('sm:block');
                        break;
                    case 'md':
                        classes.push('md:block');
                        break;
                    case 'lg':
                        classes.push('lg:block');
                        break;
                    case 'xl':
                        classes.push('xl:block');
                        break;
                    case '2xl':
                        classes.push('2xl:block');
                        break;
                }
            });
        }
        if (hide) {
            // Show by default, then hide at specified breakpoints
            if (!show) {
                classes.push('block');
            }
            hide.forEach((breakpoint) => {
                switch (breakpoint) {
                    case 'xs':
                        classes.push('xs:hidden');
                        break;
                    case 'sm':
                        classes.push('sm:hidden');
                        break;
                    case 'md':
                        classes.push('md:hidden');
                        break;
                    case 'lg':
                        classes.push('lg:hidden');
                        break;
                    case 'xl':
                        classes.push('xl:hidden');
                        break;
                    case '2xl':
                        classes.push('2xl:hidden');
                        break;
                }
            });
        }
        return classes.join(' ');
    };
    return (_jsx("div", { ref: ref, className: cn((show || hide) && getVisibilityClasses(), className), ...props, children: children }));
});
ResponsiveLayout.displayName = 'ResponsiveLayout';
// Export all components
export { ResponsiveContainer as Container, ResponsiveGrid as Grid, ResponsiveGridItem as GridItem, ResponsiveFlex as Flex, ResponsiveStack as Stack, ResponsiveHStack as HStack, ResponsiveLayout as Responsive, };
//# sourceMappingURL=responsive-layout.js.map