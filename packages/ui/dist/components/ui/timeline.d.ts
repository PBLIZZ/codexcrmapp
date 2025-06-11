export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: 'vertical' | 'horizontal';
    compact?: boolean;
    reverse?: boolean;
    children?: React.ReactNode;
}
export declare const Timeline: import("react").ForwardRefExoticComponent<TimelineProps & import("react").RefAttributes<HTMLDivElement>>;
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
export declare const TimelineItem: import("react").ForwardRefExoticComponent<TimelineItemProps & import("react").RefAttributes<HTMLDivElement>>;
export interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    date?: string;
    children?: React.ReactNode;
}
export declare const TimelineContent: import("react").ForwardRefExoticComponent<TimelineContentProps & import("react").RefAttributes<HTMLDivElement>>;
export interface TimelineSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: string;
}
export declare const TimelineSeparator: import("react").ForwardRefExoticComponent<TimelineSeparatorProps & import("react").RefAttributes<HTMLDivElement>>;
export interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    variant?: 'filled' | 'outlined';
    active?: boolean;
}
export declare const TimelineDot: import("react").ForwardRefExoticComponent<TimelineDotProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=timeline.d.ts.map