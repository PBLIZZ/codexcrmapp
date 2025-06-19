export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
    padding?: boolean;
    centered?: boolean;
}
export declare const ResponsiveContainer: import("react").ForwardRefExoticComponent<ContainerProps & import("react").RefAttributes<HTMLDivElement>>;
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    columns?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        '2xl'?: number;
    };
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    columnGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    autoRows?: boolean;
    autoColumns?: boolean;
    flow?: 'row' | 'column' | 'row-dense' | 'column-dense';
}
export declare const ResponsiveGrid: import("react").ForwardRefExoticComponent<GridProps & import("react").RefAttributes<HTMLDivElement>>;
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
    colSpan?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        '2xl'?: number;
    };
    rowSpan?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        '2xl'?: number;
    };
    colStart?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        '2xl'?: number;
    };
    rowStart?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        '2xl'?: number;
    };
}
export declare const ResponsiveGridItem: import("react").ForwardRefExoticComponent<GridItemProps & import("react").RefAttributes<HTMLDivElement>>;
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    inline?: boolean;
    responsive?: {
        sm?: Partial<Omit<FlexProps, 'responsive' | 'className' | 'children'>>;
        md?: Partial<Omit<FlexProps, 'responsive' | 'className' | 'children'>>;
        lg?: Partial<Omit<FlexProps, 'responsive' | 'className' | 'children'>>;
        xl?: Partial<Omit<FlexProps, 'responsive' | 'className' | 'children'>>;
        '2xl'?: Partial<Omit<FlexProps, 'responsive' | 'className' | 'children'>>;
    };
}
export declare const ResponsiveFlex: import("react").ForwardRefExoticComponent<FlexProps & import("react").RefAttributes<HTMLDivElement>>;
export interface StackProps extends Omit<FlexProps, 'direction'> {
    spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    dividers?: boolean;
    dividerColor?: string;
}
export declare const ResponsiveStack: import("react").ForwardRefExoticComponent<StackProps & import("react").RefAttributes<HTMLDivElement>>;
export interface HStackProps extends Omit<FlexProps, 'direction'> {
    spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    dividers?: boolean;
    dividerColor?: string;
}
export declare const ResponsiveHStack: import("react").ForwardRefExoticComponent<HStackProps & import("react").RefAttributes<HTMLDivElement>>;
export interface ResponsiveProps extends React.HTMLAttributes<HTMLDivElement> {
    show?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')[];
    hide?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')[];
}
export declare const ResponsiveLayout: import("react").ForwardRefExoticComponent<ResponsiveProps & import("react").RefAttributes<HTMLDivElement>>;
export { ResponsiveContainer as Container, ResponsiveGrid as Grid, ResponsiveGridItem as GridItem, ResponsiveFlex as Flex, ResponsiveStack as Stack, ResponsiveHStack as HStack, ResponsiveLayout as Responsive, };
//# sourceMappingURL=responsive-layout.d.ts.map