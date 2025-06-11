export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    trendLabel?: string;
    icon?: React.ReactNode;
    chart?: React.ReactNode;
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'primary' | 'accent' | 'outline';
    withHover?: boolean;
    withShadow?: boolean;
    footer?: React.ReactNode;
}
export declare const MetricCard: import("react").ForwardRefExoticComponent<MetricCardProps & import("react").RefAttributes<HTMLDivElement>>;
export interface SimpleLineChartProps {
    data: number[];
    height?: number;
    color?: string;
    className?: string;
}
export declare const SimpleLineChart: ({ data, height, color, className, }: SimpleLineChartProps) => import("react/jsx-runtime").JSX.Element;
export interface ProgressIndicatorProps {
    value: number;
    max?: number;
    color?: string;
    backgroundColor?: string;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    className?: string;
}
export declare const ProgressIndicator: ({ value, max, color, backgroundColor, size, showValue, className, }: ProgressIndicatorProps) => import("react/jsx-runtime").JSX.Element;
export interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    showValue?: boolean;
    className?: string;
}
export declare const CircularProgress: ({ value, max, size, strokeWidth, color, backgroundColor, showValue, className, }: CircularProgressProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=metric-card.d.ts.map