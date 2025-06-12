'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';
// Icons for trend indicators
const TrendUpIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-green-500", children: _jsx("path", { d: "m18 15-6-6-6 6" }) }));
const TrendDownIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-red-500", children: _jsx("path", { d: "m6 9 6 6 6-6" }) }));
const TrendNeutralIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-gray-500", children: _jsx("path", { d: "M5 12h14" }) }));
// Loading skeleton component
const MetricCardSkeleton = ({ className }) => (_jsxs("div", { className: cn('animate-pulse space-y-3', className), children: [_jsx("div", { className: "h-4 w-1/3 rounded bg-muted" }), _jsx("div", { className: "h-8 w-2/3 rounded bg-muted" }), _jsx("div", { className: "h-4 w-1/4 rounded bg-muted" })] }));
export const MetricCard = forwardRef(({ className, title, value, trend = 'neutral', trendValue, trendLabel, icon, chart, loading = false, size = 'md', variant = 'default', withHover = false, withShadow = false, footer, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    // Size classes
    const sizeClasses = {
        sm: 'p-3 space-y-1',
        md: 'p-4 space-y-2',
        lg: 'p-6 space-y-3',
    };
    // Variant classes based on theme
    const variantClasses = {
        default: 'bg-card text-card-foreground',
        primary: 'bg-primary text-primary-foreground',
        accent: 'bg-accent text-accent-foreground',
        outline: 'border border-border bg-transparent',
    };
    // Shadow classes
    const shadowClass = withShadow ? (isDarkMode ? 'shadow-md shadow-black/20' : 'shadow-md shadow-black/10') : '';
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
    // Value size classes
    const valueSize = {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-3xl',
    };
    // Trend icon
    const trendIcon = trend === 'up' ? _jsx(TrendUpIcon, {}) : trend === 'down' ? _jsx(TrendDownIcon, {}) : _jsx(TrendNeutralIcon, {});
    // Trend color
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
    return (_jsx("div", { ref: ref, className: cn('rounded-lg', variantClasses[variant], sizeClasses[size], shadowClass, hoverClass, className), ...props, children: loading ? (_jsx(MetricCardSkeleton, {})) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: title }), icon && _jsx("div", { className: "h-5 w-5", children: icon })] }), _jsxs("div", { className: "flex items-end justify-between", children: [_jsx("div", { className: cn('font-bold', valueSize[size]), children: value }), trend && (_jsxs("div", { className: "flex items-center space-x-1", children: [trendIcon, trendValue && _jsx("span", { className: cn('text-sm font-medium', trendColor), children: trendValue })] }))] }), trendLabel && _jsx("p", { className: "text-xs text-muted-foreground", children: trendLabel }), chart && _jsx("div", { className: "mt-2", children: chart }), footer && _jsx("div", { className: "mt-2 pt-2 border-t border-border/50", children: footer })] })) }));
});
MetricCard.displayName = 'MetricCard';
export const SimpleLineChart = ({ data, height = 40, color = 'var(--primary)', className, }) => {
    // Find min and max values for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // Avoid division by zero
    // Calculate points for the SVG path
    const points = data
        .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
    })
        .join(' ');
    return (_jsx("div", { className: cn('w-full', className), style: { height }, children: _jsx("svg", { width: "100%", height: "100%", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: _jsx("polyline", { points: points, fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }));
};
export const ProgressIndicator = ({ value, max = 100, color = 'var(--primary)', backgroundColor = 'var(--muted)', size = 'md', showValue = false, className, }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };
    return (_jsxs("div", { className: cn('w-full space-y-1', className), children: [_jsx("div", { className: cn('w-full rounded-full overflow-hidden', sizeClasses[size]), style: { backgroundColor }, children: _jsx("div", { className: "h-full rounded-full transition-all duration-300 ease-in-out", style: { width: `${percentage}%`, backgroundColor: color } }) }), showValue && (_jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [_jsx("span", { children: value }), _jsx("span", { children: max })] }))] }));
};
export const CircularProgress = ({ value, max = 100, size = 40, strokeWidth = 4, color = 'var(--primary)', backgroundColor = 'var(--muted)', showValue = false, className, }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const dash = (percentage * circumference) / 100;
    return (_jsxs("div", { className: cn('relative inline-flex items-center justify-center', className), children: [_jsxs("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: backgroundColor, strokeWidth: strokeWidth }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: color, strokeWidth: strokeWidth, strokeDasharray: circumference, strokeDashoffset: circumference - dash, transform: `rotate(-90 ${size / 2} ${size / 2})`, strokeLinecap: "round", style: { transition: 'stroke-dashoffset 0.5s ease-in-out' } })] }), showValue && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("span", { className: "text-xs font-medium", children: [Math.round(percentage), "%"] }) }))] }));
};
//# sourceMappingURL=metric-card.js.map