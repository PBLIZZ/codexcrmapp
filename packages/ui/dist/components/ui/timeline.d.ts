import * as React from 'react';
/**
 * Parent container – renders children in a flex column and adds a left border.
 */
export declare const Timeline: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * Renders an item with optional icon slot on the left.
 */
export interface TimelineItemProps extends React.ComponentProps<'div'> {
    icon?: React.ReactNode;
}
export declare const TimelineItem: React.ForwardRefExoticComponent<Omit<TimelineItemProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * Small circle/icon container.
 */
export declare const TimelineSeparator: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * Wrapper for item body so spacing aligns.
 */
export declare const TimelineContent: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=timeline.d.ts.map